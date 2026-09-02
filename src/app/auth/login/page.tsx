"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2, Dumbbell } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post("/auth/login", data);

      const token =
        res.data.token || res.data.accessToken || res.data.data?.token;
      let user = res.data.user || res.data.data?.user || res.data.data;

      if (!token) {
        throw new Error("Authentication token missing from response.");
      }

      // Fallback: If user or role is missing from response, decode it from the JWT token
      let role = user?.role;
      if (!role && token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));
          role = payload.role;
          if (!user && payload) {
            user = {
              id: payload.id || payload.userId,
              email: payload.email,
              role: payload.role,
              name: payload.name || "User",
            };
          }
        } catch (e) {
          console.error("Failed to parse JWT payload", e);
        }
      }

      // Save token to localStorage and set cookie for Next.js middleware
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

      if (user && typeof user === "object") {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Dispatch custom event to notify Navbar immediately without refresh
      window.dispatchEvent(new Event('auth-change'));

      toast.success("Login successful! Welcome back.");

      // Normalize role comparison to uppercase string
      const normalizedRole = String(role || "").toUpperCase();

      if (normalizedRole === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (normalizedRole === "PROVIDER") {
        router.push("/dashboard/provider");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check credentials.";
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
            backgroundImage: `url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop')`,
          }}
        >
          {/* Subtle dark gradient overlay for mobile view */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent lg:hidden"></div>
        </div>
      </div>

      {/* Right Half: Pure White Background with Login Form */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center bg-white px-6 lg:px-16 py-12 lg:py-0 text-slate-900">
        <div className="max-w-md w-full space-y-6">
          {/* Header Icon & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-600 mb-1">
              <Dumbbell className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back 🏋️
            </h2>
            <p className="text-slate-600 text-sm">
              Sign in to manage your gear rentals and dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
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
                  Logging in...
                </>
              ) : (
                <>
                  Login <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}