import Link from 'next/link';
import { Dumbbell, Globe, Shield, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand description */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">Gear<span className="text-blue-500">Up</span></span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Your trusted platform for renting top-tier sports and fitness equipment instantly from certified local providers. Book securely, train hard, and explore outdoor adventures.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/gear" className="hover:text-white transition-colors">Browse Gear Catalog</Link></li>
            <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
            <li><Link href="/auth/register" className="hover:text-white transition-colors">Create Account</Link></li>
          </ul>
        </div>

        {/* Legal / Assignment info */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Assignment Info</h4>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-blue-400 shrink-0" />
            Full-Stack Web Development Assignment. Built with Next.js & Tailwind.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} GearUp. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}