import Link from 'next/link';
import { ArrowRight, Dumbbell } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row w-full overflow-hidden">
      {/* Left Half: Full-Height Covered Image (Decathlon Style) */}
      <div className="relative lg:w-1/2 h-[50vh] lg:h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop')`
          }}
        >
          {/* Subtle dark gradient overlay for aesthetic balance */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent lg:hidden"></div>
        </div>
      </div>

      {/* Right Half: Pure White Background */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center bg-white px-6 lg:px-16 py-12 lg:py-0 text-center text-slate-900">
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-inner">
            <Dumbbell className="h-4 w-4" /> Premium Fitness & Outdoor Rentals
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Rent Sports & Outdoor Gear <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Instantly 🏋️</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Explore high-quality gear from trusted local providers. Book securely, track your rentals, and start your fitness adventure today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/gear"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 text-sm"
            >
              Browse Gear Catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/register"
              className="w-full flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3.5 font-bold text-slate-800 border border-slate-300 transition-all text-sm"
            >
              Join Us 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}