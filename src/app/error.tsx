'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Optional: Log error or fire a Sonner toast notification on boundary trigger
    console.error('Captured error boundary exception:', error);
    toast.error('An unexpected error occurred.');
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center text-black">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border space-y-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 text-sm mb-4">{error.message || 'An unexpected error occurred.'}</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => reset()} 
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try again
          </button>
          <a 
            href="/" 
            className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition text-center block"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}