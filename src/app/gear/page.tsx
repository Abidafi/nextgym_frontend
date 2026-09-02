'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { GearItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { SkeletonLoader } from '@/components/SkeletonLoader'; 
import { toast } from 'sonner'; 
import { Search, Dumbbell, Tag, ArrowRight } from 'lucide-react';

export default function GearCatalogPage() {
  const [gearList, setGearList] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    api.get('/gear').then((res) => {
      setGearList(res.data.data || res.data || []);
      setLoading(false);
    }).catch((err: any) => {
      setLoading(false);
      setGearList([]);
      const errorMessage = err.response?.data?.message || 'Failed to fetch available gear items.';
      toast.error(errorMessage); 
    });
  }, []);

  // Helper to safely resolve category whether it's a string or an object with a name
  const getCategoryName = (gear: any) => {
    const cat = gear.category;
    if (!cat) return 'EQUIPMENT';
    if (typeof cat === 'object') return cat.name || cat.title || 'EQUIPMENT';
    return String(cat);
  };

  // Filter items safely
  const filteredGear = gearList.filter((gear: any) => {
    const title = gear.title || gear.name || '';
    const description = gear.description || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const catName = getCategoryName(gear).toUpperCase();
    const matchesCategory = selectedCategory === 'ALL' || catName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 w-72 bg-slate-800 rounded-xl animate-pulse"></div>
          <SkeletonLoader /> 
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-16">
      
      {/* Marketplace Banner Header */}
      <div className="bg-slate-950 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 text-blue-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-inner">
            <Dumbbell className="h-4 w-4" /> Equipment Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Available Sports & Outdoor Gear 🚴
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Discover top-tier resistance bands, treadmills, road bikes, and camping equipment from verified local providers.
          </p>

          {/* Search Bar & Filters */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 pt-4">
            <div className="relative grow">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search gear by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-600 transition-colors shadow-inner"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['ALL', 'FITNESS', 'CAMPING', 'CYCLING', 'WATER SPORTS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {filteredGear.length === 0 ? (
          <div className="text-center py-20 bg-slate-950 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto space-y-4 shadow-xl">
            <div className="bg-blue-600/10 text-blue-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
              <Dumbbell className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No Gear Found</h3>
            <p className="text-slate-400 text-sm">
              No gear items are currently available matching your search. Please check back later or verify your items in Prisma Studio!
            </p>
            {(searchQuery || selectedCategory !== 'ALL') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGear.map((gear: any) => {
              const gearTitle = gear.title || gear.name || 'Unnamed Gear';
              const gearImage = gear.images?.[0] || gear.imageUrl || '/placeholder.png';
              const categoryLabel = getCategoryName(gear);

              return (
                <div 
                  key={gear.id} 
                  className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-600/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Hover Zoom */}
                    <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
                      <Image 
                        src={gearImage} 
                        alt={gearTitle} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-blue-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Tag className="h-3 w-3" /> {categoryLabel}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {gearTitle}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {gear.description || 'High-performance equipment maintained and verified for safe rentals.'}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Button Footer */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-900 mt-4">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold">Rental Rate</span>
                      <div className="text-lg font-extrabold text-white">
                        ${gear.pricePerDay} <span className="text-xs font-normal text-slate-400">/ day</span>
                      </div>
                    </div>
                    <Link 
                      href={`/gear/${gear.id}`} 
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                    >
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}