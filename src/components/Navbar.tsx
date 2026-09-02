'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Dumbbell, User, LogOut, Shield, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user from localStorage');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for custom auth changes across the app
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    setUser(null);
    window.dispatchEvent(new Event('auth-change')); // Notify Navbar instantly
    router.push('/auth/login');
  };

  if (!mounted) return null;

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    if (user.role === 'PROVIDER') return '/dashboard/provider';
    return '/dashboard/customer';
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-500 transition-colors">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-wide">Gear<span className="text-blue-500">Up</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/gear" className="text-slate-300 hover:text-white transition-colors font-medium">
              Browse Gear
            </Link>
            {user && (
              <Link href={getDashboardLink()} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium">
                <LayoutDashboard className="h-4 w-4 text-blue-400" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full uppercase font-semibold">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-900/50 transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 text-sm transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800 border border-slate-700"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <Link
            href="/gear"
            onClick={() => setIsOpen(false)}
            className="block text-slate-300 hover:text-white font-medium py-2 border-b border-slate-800"
          >
            Browse Gear
          </Link>
          {user && (
            <Link
              href={getDashboardLink()}
              onClick={() => setIsOpen(false)}
              className="block text-slate-300 hover:text-white font-medium py-2 border-b border-slate-800"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full uppercase font-semibold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="w-full flex items-center justify-center gap-2 text-red-400 bg-red-950/30 py-2 rounded-lg border border-red-900/50 font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="text-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg border border-slate-700"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsOpen(false)}
                className="text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}