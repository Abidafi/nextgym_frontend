'use client';

import { useState, use, useEffect } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Star, Calendar } from 'lucide-react';

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerId: string;
  customer?: {
    name?: string;
  };
  gearItem?: {
    title?: string;
    name?: string;
    images?: string[];
    imageUrl?: string;
    image?: string;
    pricePerDay?: number;
    price?: number;
    category?: any;
  };
}

export default function ReviewDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (orderId) {
      api.get(`/reviews/order/${orderId}`)
        .then((res) => {
          setReview(res.data?.data || res.data);
          setLoading(false);
        })
        .catch((err: any) => {
          toast.error(err.response?.data?.message || 'Failed to load review details.');
          setLoading(false);
        });
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="font-medium">Loading review details...</span>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-400">Review not found or not yet submitted.</p>
      </div>
    );
  }

  const gear = review.gearItem || {};
  const gearTitle = gear.title || gear.name || 'Rental Item';
  const gearImage = gear.images?.[0] || gear.imageUrl || gear.image || '/placeholder.png';
  const pricePerDay = gear.pricePerDay || gear.price || 55;
  const customerName = review.customer?.name ;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">  
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-6">
            <div className="relative h-120 w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <Image src={gearImage} alt={gearTitle} fill className="object-cover" priority />
            </div>
          </div>

          <div className="space-y-6">
            
            <div>
              <div className="text-3xl font-black text-white flex items-baseline gap-2">
                ${pricePerDay} <span className="text-sm font-normal text-slate-400">/ day</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {gearTitle}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-medium text-slate-400">CUSTOMER NAME</span>
              <p className="text-sm font-bold text-white">{customerName}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Rating (1 to 5 Stars)</label>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700 fill-slate-800'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-white">
                    ({review.rating} - {review.rating === 5 ? 'Excellent' : review.rating >= 4 ? 'Good' : 'Average'})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Customer Feedback</label>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-27.5 text-slate-300 text-sm whitespace-pre-line">
                {review.comment}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}