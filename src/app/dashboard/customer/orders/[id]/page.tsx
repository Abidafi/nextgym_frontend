'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import Image from 'next/image';
import { toast } from 'sonner';
import { Calendar, Tag, ArrowLeft, Loader2, ShieldCheck, Hash, CreditCard, RotateCcw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface RentalDetail {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  quantity?: number;
  numStocks?: number;
  stocks?: number;
  status: 'PLACED' | 'CONFIRMED' | 'PAID' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';
  gearItem?: {
    id?: string;
    title?: string;
    name?: string;
    images?: string[];
    imageUrl?: string;
    image?: string;
    pricePerDay?: number;
    price?: number;
    description?: string;
    category?: any;
  };
  gearName?: string;
}

export default function RentalOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<RentalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/rentals/${id}`)
        .then((res) => {
          const responseData = res.data?.data || res.data?.rental || res.data;
          setOrder(responseData);
          setLoading(false);
        })
        .catch((err: any) => {
          toast.error(err.response?.data?.message || 'Failed to load rental order details.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleReturnGear = async () => {
    try {
      setIsReturning(true);
      await api.patch(`/rentals/${id}`, { status: 'RETURNED' });
      toast.success('Gear returned successfully!');
      
      // Refresh order details to reflect 'RETURNED' state instantly without redirecting
      const res = await api.get(`/rentals/${id}`);
      const responseData = res.data?.data || res.data?.rental || res.data;
      setOrder(responseData);
      setIsReturning(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to return the gear.');
      setIsReturning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="font-medium">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">Rental order not found.</h2>
        <Link href="/dashboard/customer" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const gear = order.gearItem || {};
  const gearTitle = gear.title || gear.name || order.gearName || 'Unnamed Gear';
  const gearImage = gear.images?.[0] || gear.imageUrl || gear.image || '/placeholder.png';
  const description = gear.description || 'High-performance equipment maintained and verified for safe rentals.';
  const pricePerDay = gear.pricePerDay || gear.price || 0;
  
  const quantity = order.quantity ?? order.numStocks ?? order.stocks ?? 1;
  
  const startDateStr = order.startDate ? order.startDate.split('T')[0] : '';
  const endDateStr = order.endDate ? order.endDate.split('T')[0] : '';

  const calculateDays = () => {
    if (!order.startDate || !order.endDate) return 0;
    const start = new Date(order.startDate);
    const end = new Date(order.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const rentalDays = calculateDays();
  const cat = gear.category;
  const categoryLabel = !cat ? 'EQUIPMENT' : typeof cat === 'object' ? cat.name || cat.title || 'EQUIPMENT' : String(cat);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link href="/dashboard/customer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Order #{order.id.slice(-6)}</span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'PLACED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    order.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    order.status === 'PAID' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    order.status === 'PICKED_UP' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    order.status === 'RETURNED' ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{gearTitle}</h1>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-blue-400">${pricePerDay}</span>
                <span className="text-sm font-medium text-slate-400">/ day</span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            <div className="border-t border-slate-900 pt-6 space-y-4">
              
              {/* Display Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" /> Start Date
                  </span>
                  <p className="text-sm font-semibold text-white">{startDateStr}</p>
                </div>
                <div className="space-y-1 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" /> End Date
                  </span>
                  <p className="text-sm font-semibold text-white">{endDateStr}</p>
                </div>
              </div>

              {/* Number of Items Display */}
              <div className="space-y-1 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-blue-500" /> Number of Stocks / Items
                </span>
                <p className="text-sm font-semibold text-white">{quantity} {quantity === 1 ? 'Item' : 'Items'}</p>
              </div>

              {/* Price Calculation Summary Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
                <span>Total Calculation (${pricePerDay}/day × {rentalDays} {rentalDays === 1 ? 'day' : 'days'} × {quantity} {quantity === 1 ? 'item' : 'items'})</span>
                <span className="font-bold text-blue-400 text-sm">${order.totalPrice}</span>
              </div>

              {/* Conditional Action Buttons */}
              {order.status === 'CONFIRMED' && (
                <Link
                  href={`/dashboard/customer/orders/${order.id}/pay`}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold shadow-lg transition-all text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                >
                  <CreditCard className="h-4 w-4" /> Proceed to Payment
                </Link>
              )}

              {(order.status === 'PAID' || order.status === 'PICKED_UP') && (
                <button
                  onClick={handleReturnGear}
                  disabled={order.status === 'PAID' || isReturning}
                  className={`w-full mt-2 py-3.5 px-4 rounded-xl font-semibold shadow-lg transition-all text-sm flex items-center justify-center gap-2 ${
                    order.status === 'PAID'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  } disabled:opacity-50`}
                >
                  {isReturning ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing Return...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Return the Gear
                    </>
                  )}
                </button>
              )}

              {order.status === 'RETURNED' && (
                <button
                  disabled
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold shadow-lg text-sm flex items-center justify-center gap-2 bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-80"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Gear Returned
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified Rental Record
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}