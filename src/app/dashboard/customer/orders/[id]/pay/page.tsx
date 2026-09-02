'use client';

import { useState, use, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

const CheckoutWrapper = dynamic(() => import('@/components/CheckoutWrapper'), {
  ssr: false,
  loading: () => <div className="text-center py-8 text-gray-500">Loading secure payment gateway...</div>,
});

export default function PaymentInitiationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('/payments/create', { rentalOrderId: orderId })
      .then((res) => {
        const secret = res.data?.data?.clientSecret || res.data?.clientSecret;
        if (secret) {
          setClientSecret(secret);
        } else {
          toast.error('Client secret not received.');
        }
        setLoading(false);
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.message || 'Failed to initialize payment intent.');
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Complete Your Payment 💳</h1>
          <p className="text-gray-500 text-sm mt-1">Secure checkout via Stripe for Order #{orderId.slice(-6)}</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Initializing secure payment...</div>
        ) : clientSecret ? (
          <CheckoutWrapper clientSecret={clientSecret} orderId={orderId} />
        ) : (
          <div className="text-center py-8 text-red-500">Could not load payment gateway.</div>
        )}
      </div>
    </div>
  );
}