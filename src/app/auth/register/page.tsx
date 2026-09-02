'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Lock, Mail, User, ShieldCheck, ArrowRight, Loader2, Dumbbell } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post('/auth/register', data);
      
      if (res.data?.token) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        
        if (res.data?.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          const role = res.data.user.role;
          toast.success('Registration successful! Welcome.');
          
          if (role === 'ADMIN') router.push('/dashboard/admin');
          else if (role === 'PROVIDER') router.push('/dashboard/provider');
          else router.push('/dashboard/customer');
          return;
        }
      }

      toast.success('Registration successful! Please login to continue.');
      router.push('/auth/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row w-full overflow-hidden">
      {/* Left Half: Full-Height Covered Image (Decathlon Style) */}
      <div className="relative lg:w-1/2 h-[40vh] lg:h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop')`
          }}
        >
          {/* Subtle dark gradient overlay for mobile view */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent lg:hidden"></div>
        </div>
      </div>

      {/* Right Half: Pure White Background with Registration Form */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center bg-white px-6 lg:px-16 py-12 lg:py-0 text-slate-900">
        <div className="max-w-md w-full space-y-6">
          
          {/* Header Icon & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-600 mb-1">
              <Dumbbell className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create an Account 🏋️
            </h2>
            <p className="text-slate-600 text-sm">
              Join GearUp to rent or provide sports & outdoor equipment
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input 
                  {...register('name')} 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 transition-colors" 
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input 
                  {...register('email')} 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 transition-colors" 
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input 
                  {...register('password')} 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 transition-colors" 
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Account Role
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <select 
                  {...register('role')} 
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-11 text-slate-900 text-sm focus:outline-none focus:border-blue-600 transition-colors appearance-none"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="PROVIDER">Provider</option>
                </select>
              </div>
              {errors.role && <p className="text-xs text-red-500 font-medium">{errors.role.message}</p>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}