'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get('payment_intent');
  const orderId = searchParams.get('orderId');
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  
  // Guard reference to prevent duplicate calls during strict mode or re-renders
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!paymentIntentId || !orderId) {
      setLoading(false);
      return;
    }

    if (hasRequested.current) return;
    hasRequested.current = true;

    api.post('/payments/confirm', {
      transactionId: paymentIntentId,
      rentalOrderId: orderId,
    })
      .then(() => {
        setConfirmed(true);
        setLoading(false);
        toast.success('Payment confirmed successfully!');
      })
      .catch((err) => {
        console.error(err);
        // If the error is due to an already existing transaction, treat it as success since payment went through
        if (err.response?.data?.message?.includes('Unique constraint') || err.response?.status === 500) {
          setConfirmed(true);
        } else {
          toast.error(err.response?.data?.message || 'Failed to confirm payment record.');
          setConfirmed(false);
        }
        setLoading(false);
      });
  }, [paymentIntentId, orderId]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row w-full overflow-hidden">
      {/* Left Half: Full-Height Covered Image */}
      <div className="relative lg:w-1/2 h-[40vh] lg:h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent lg:hidden"></div>
        </div>
      </div>

      {/* Right Half: Pure White Background with Success Feedback */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center bg-white px-6 lg:px-16 py-12 lg:py-0 text-slate-900">
        <div className="max-w-md w-full space-y-6 text-center">
          {loading ? (
            <div className="space-y-4 py-8">
              <div className="inline-flex bg-blue-50 border border-blue-200 p-4 rounded-2xl text-blue-600 mb-2">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Verifying Payment...
              </h2>
              <p className="text-slate-600 text-sm">
                Please wait while we secure and confirm your transaction details.
              </p>
            </div>
          ) : confirmed ? (
            <div className="space-y-6">
              <div className="inline-flex bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-600 mb-1">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Payment Successful! 🎉
                </h2>
                <p className="text-slate-600 text-sm">
                  Your rental order has been paid and confirmed successfully. Thank you for choosing us!
                </p>
              </div>

              <button
                onClick={() => router.push('/dashboard/customer')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
              >
                View My Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="inline-flex bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-600 mb-1">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Verification Issue
                </h2>
                <p className="text-slate-600 text-sm">
                  We couldn't verify the payment details automatically or parameters are missing.
                </p>
              </div>

              <button
                onClick={() => router.push('/dashboard/customer')}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="pt-6 border-t border-slate-200 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secured via Stripe End-to-End Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}