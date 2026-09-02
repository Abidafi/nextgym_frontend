'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { GearItem as Gear } from '@/types';
import Image from 'next/image';
import { toast } from 'sonner';
import { Calendar, Tag, ArrowLeft, Loader2, ShieldCheck, Package, Hash } from 'lucide-react';
import Link from 'next/link';

export default function GearDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [gear, setGear] = useState<Gear | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (id) {
      api.get(`/gear/${id}`)
        .then((res) => {
          const responseData = res.data?.data || res.data?.gear || res.data?.item || res.data;
          setGear(responseData);
          setLoading(false);
        })
        .catch((err: any) => {
          toast.error('Failed to load gear details.');
          setLoading(false);
        });
    }
  }, [id]);

  const getCategoryName = (gearItem: any) => {
    const cat = gearItem?.category;
    if (!cat) return 'EQUIPMENT';
    if (typeof cat === 'object') return cat.name || cat.title || 'EQUIPMENT';
    return String(cat);
  };

  const pricePerDay = gear ? ((gear as any).pricePerDay || (gear as any).price || 0) : 0;
  const availableStock = gear ? Number((gear as any).stock ?? 0) : 0;

  // Calculate number of days dynamically
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const rentalDays = calculateDays();
  const calculatedTotalPrice = rentalDays > 0 ? rentalDays * pricePerDay * quantity : 0;

  const handleRentNow = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      toast.error('End date must be after the start date.');
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Requested quantity exceeds available stock (${availableStock}).`);
      return;
    }

    try {
      setSubmitting(true);
      
      const formattedStartDate = start.toISOString();
      const formattedEndDate = end.toISOString();

      const res = await api.post('/rentals', {
        gearItemId: id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        totalPrice: calculatedTotalPrice,
        quantity: quantity,
      });
      
      const rentalId = res.data?.rental?.id || res.data?.data?.id || res.data?.id;
      
      if (!rentalId) {
        throw new Error('Rental ID was not returned by the server.');
      }

      toast.success('Rental order created successfully!');
      router.push(`/dashboard/customer/orders/${rentalId}/pay`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to place rental order. Please ensure dates are valid and you are logged in.';
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="font-medium">Loading gear details...</span>
        </div>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">Gear equipment not found.</h2>
        <Link href="/gear" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-all">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const gearTitle = (gear as any).title || (gear as any).name || 'Unnamed Gear';
  const gearImage = 
    (gear as any).images?.[0] || 
    (gear as any).imageUrl || 
    (gear as any).image || 
    '/placeholder.png';
  const description = (gear as any).description || 'High-performance equipment maintained and verified for safe rentals.';
  const categoryLabel = getCategoryName(gear);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link href="/gear" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Browse Gear
        </Link>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          
          <div className="relative h-80 lg:h-full w-full bg-slate-900">
            <Image 
              src={gearImage} 
              alt={gearTitle} 
              fill 
              className="object-cover" 
              priority
            />
            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <Tag className="h-3.5 w-3.5" /> {categoryLabel}
            </div>
          </div>

          <div className="p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{gearTitle}</h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-400">${pricePerDay}</span>
                  <span className="text-sm font-medium text-slate-400">/ day</span>
                </div>
                <div className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${availableStock > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  <Package className="h-3.5 w-3.5" /> {availableStock > 0 ? `${availableStock} in Stock` : 'Out of Stock'}
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            <div className="border-t border-slate-900 pt-6 space-y-4">
              
              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" /> Start Date
                  </label>
                  <input 
                    type="date" 
                    min={todayStr}
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full bg-slate-400 border border-slate-300 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-600 transition-colors" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" /> End Date
                  </label>
                  <input 
                    type="date" 
                    min={startDate || todayStr}
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="w-full bg-slate-400 border border-slate-300 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-600 transition-colors" 
                  />
                </div>
              </div>

              {/* Number of Items Dropdown */}
              {availableStock > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-blue-500" /> Number of Items
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    {Array.from({ length: Math.min(availableStock, 15) }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num} className="bg-slate-950 text-white">
                        {num} {num === 1 ? 'Item' : 'Items'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Calculation Summary Box */}
              {rentalDays > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
                  <span>Calculation: (${pricePerDay}/day × {rentalDays} {rentalDays === 1 ? 'day' : 'days'} × {quantity} {quantity === 1 ? 'item' : 'items'})</span>
                  <span className="font-bold text-blue-400 text-sm">${calculatedTotalPrice}</span>
                </div>
              )}

              <button 
                onClick={handleRentNow} 
                disabled={submitting || availableStock === 0}
                className={`w-full mt-2 py-3.5 px-4 rounded-xl font-semibold shadow-lg transition-all text-sm flex items-center justify-center gap-2 ${
                  availableStock === 0 
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                } disabled:opacity-50`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Rental...
                  </>
                ) : availableStock === 0 ? (
                  'Item Unavailable Now'
                ) : (
                  'Rent Now & Proceed'
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified Equipment & Secure Checkout
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}