'use client';

import { useState } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Safe singleton initialization outside component to prevent re-instantiation loops
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
      },
    });

    if (result.error) {
      toast.error(result.error.message || 'Payment failed.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Processing Payment...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function CheckoutWrapper({ clientSecret, orderId }: { clientSecret: string; orderId: string }) {
  if (!stripePromise) {
    return <div className="text-red-500 text-center">Stripe Publishable Key is missing or invalid.</div>;
  }

  if (!clientSecret || typeof clientSecret !== 'string' || !clientSecret.startsWith('pi_')) {
    return <div className="text-red-500 text-center">Invalid Payment Intent client secret received from server.</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm orderId={orderId} />
    </Elements>
  );
}