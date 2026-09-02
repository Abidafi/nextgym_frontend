'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { XCircle, ArrowRight, ShieldAlert, ShoppingBag, LayoutDashboard } from 'lucide-react';

export default function PaymentCancelPage() {
  useEffect(() => {
    toast.error('Payment was cancelled. No charges were made.');
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row w-full overflow-hidden">
      {/* Left Half: Full-Height Covered Image (Decathlon Style matching Login and Success) */}
      <div className="relative lg:w-1/2 h-[40vh] lg:h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop')`,
          }}
        >
          {/* Subtle dark gradient overlay for mobile view */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent lg:hidden"></div>
        </div>
      </div>

      {/* Right Half: Pure White Background with Cancel Feedback */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center bg-white px-6 lg:px-16 py-12 lg:py-0 text-slate-900">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="inline-flex bg-red-50 border border-red-200 p-4 rounded-2xl text-red-600 mb-1">
            <XCircle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Payment Cancelled ⚠️
            </h2>
            <p className="text-slate-600 text-sm">
              Your payment session was aborted. No charges were made to your account.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link 
              href="/dashboard/customer" 
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm"
            >
              <LayoutDashboard className="h-4 w-4" /> Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>

            <Link 
              href="/gear" 
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-red-600/30 transition-all text-sm"
            >
              <ShoppingBag className="h-4 w-4" /> Return to Gear Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <span>Safe Session Aborted — Zero Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}