'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AddGearPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const rawData = res.data.categories || res.data.data || res.data;
        setCategories(Array.isArray(rawData) ? rawData : []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const imageList = typeof data.images === 'string' 
        ? [data.images] 
        : Array.isArray(data.images) ? data.images : [data.imageUrl].filter(Boolean);

      const payload = {
        title: data.title,
        description: data.description,
        brand: data.brand,
        pricePerDay: Number(data.pricePerDay),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        images: imageList,
      };

      await api.post('/provider/gear', payload);
      toast.success('Gear listing added successfully!');
      router.push('/dashboard/provider');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add gear listing. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex bg-white">
      {/* Left Half: Full-Height Image Container matching the homepage structure */}
      <div className="relative hidden lg:block w-1/2 min-h-[calc(100vh-80px)] bg-gray-900">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
          <span className="text-blue-400 font-semibold uppercase tracking-wider text-xs mb-2">Premium Fitness & Outdoor Rentals</span>
          <h2 className="text-4xl font-bold mb-3">Rent Sports & Outdoor Gear Instantly</h2>
          <p className="text-gray-200 text-sm leading-relaxed max-w-lg">
            Explore high-quality gear from trusted local providers. Book securely, track your rentals, and start your fitness adventure today.
          </p>
        </div>
      </div>

      {/* Right Half: Clean Form Functionality */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white overflow-y-auto">
        <div className="max-w-xl w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black">Add New Gear Listing</h1>
            <p className="text-sm text-gray-500 mt-1">Fill out the specifications below to list your item.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Title</label>
              <input {...register('title')} required placeholder="e.g., Inflatable Stand-Up Paddleboard" className="w-full border border-gray-300 p-2.5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <select {...register('categoryId')} required className="w-full border border-gray-300 p-2.5 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a category</option>
                {Array.isArray(categories) && categories.map((cat) => (
                  <option key={cat.id || cat} value={cat.id || cat}>
                    {cat.name || cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Price Per Day ($)</label>
                <input {...register('pricePerDay')} type="number" step="0.01" required placeholder="30" className="w-full border border-gray-300 p-2.5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Stock</label>
                <input {...register('stock')} type="number" defaultValue={1} required className="w-full border border-gray-300 p-2.5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Brand</label>
              <input {...register('brand')} required placeholder="e.g., iRocker" className="w-full border border-gray-300 p-2.5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Description</label>
              <textarea {...register('description')} rows={3} required placeholder="Wide-stance stable SUP kit..." className="w-full border border-gray-300 p-2.5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Image URL</label>
              <input {...register('images')} required placeholder="https://images.unsplash.com/photo-..." className="w-full border border-gray-300 p-2.5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-md mt-2"
            >
              {isSubmitting ? 'Submitting listing...' : 'Submit Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}