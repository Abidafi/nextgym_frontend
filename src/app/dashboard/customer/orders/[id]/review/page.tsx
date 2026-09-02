'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Tag, ArrowLeft, Loader2, ShieldCheck, Hash, Star, CheckCircle2 } from 'lucide-react';

interface RentalDetail {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  quantity?: number;
  numStocks?: number;
  stocks?: number;
  status: string;
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

export default function LeaveReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [order, setOrder] = useState<RentalDetail | null>(null);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (orderId) {
      api.get(`/rentals/${orderId}`)
        .then((res) => {
          const responseData = res.data?.data || res.data?.rental || res.data;
          setOrder(responseData);
          setLoadingOrder(false);
        })
        .catch((err: any) => {
          toast.error(err.response?.data?.message || 'Failed to load rental details.');
          setLoadingOrder(false);
        });
    }
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/reviews', {
        orderId,
        rating: Number(rating),
        comment,
      });
      setIsSubmitted(true);
      toast.success('Thank you! Your review has been submitted successfully.');
      setTimeout(() => {
        router.push(`/dashboard/customer/orders/${orderId}/review-details`);
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
      setSubmitting(false);
    }
  };

  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="font-medium">Loading review interface...</span>
        </div>
      </div>
    );
  }

  const gear = order?.gearItem || {};
  const gearTitle = gear.title || gear.name || order?.gearName || 'Unnamed Gear';
  const gearImage = gear.images?.[0] || gear.imageUrl || gear.image || '/placeholder.png';
  const description = gear.description || 'High-performance equipment maintained and verified for safe rentals.';
  const pricePerDay = gear.pricePerDay || gear.price || 0;
  
  const quantity = order?.quantity ?? order?.numStocks ?? order?.stocks ?? 1;
  const startDateStr = order?.startDate ? order.startDate.split('T')[0] : '';
  const endDateStr = order?.endDate ? order.endDate.split('T')[0] : '';

  const calculateDays = () => {
    if (!order?.startDate || !order?.endDate) return 0;
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
        
        <Link href={`/dashboard/customer/orders/${orderId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Order Details
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
                <span className="text-xs font-semibold text-slate-400">Order #{orderId.slice(-6)}</span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {order?.status || 'RETURNED'}
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

              <div className="space-y-1 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-blue-500" /> Number of Stocks / Items
                </span>
                <p className="text-sm font-semibold text-white">{quantity} {quantity === 1 ? 'Item' : 'Items'}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
                <span>Total Calculation (${pricePerDay}/day × {rentalDays} {rentalDays === 1 ? 'day' : 'days'} × {quantity} {quantity === 1 ? 'item' : 'items'})</span>
                <span className="font-bold text-blue-400 text-sm">${order?.totalPrice || 0}</span>
              </div>

              {/* Review Input Section matching the layout styling */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-400">Rating (1 to 5 Stars)</label>
                  <select
                    value={rating}
                    disabled={isSubmitted}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Poor)</option>
                    <option value={1}>⭐ (1 - Terrible)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-400">Your Feedback</label>
                  <textarea
                    rows={3}
                    required
                    disabled={isSubmitted}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the gear condition, pickup, and overall rental process?"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || isSubmitted}
                  className={`w-full mt-2 py-3.5 px-4 rounded-xl font-semibold shadow-lg transition-all text-sm flex items-center justify-center gap-2 ${
                    isSubmitted 
                      ? 'bg-emerald-600 text-white cursor-not-allowed shadow-emerald-600/20' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  } disabled:opacity-70`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Review...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Review Submitted
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 fill-current" />
                      Submit Review
                    </>
                  )}
                </button>
              </form>

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