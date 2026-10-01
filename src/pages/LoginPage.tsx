import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useAdmin } from '@/admin/context/AdminContext';

export default function LoginPage() {
  const { setCurrentPage } = useShop();
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Check if admin login credentials or admin email
    if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@maharajjewellery.com') {
      login(email, password);
      setCurrentPage('admin');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      // General customer login simulation
      setMsg(`Logged in successfully as ${email}`);
      setTimeout(() => {
        setCurrentPage('home');
      }, 1200);
    }
  };

  const handleAdminDirectLogin = () => {
    login('admin@maharajjewellery.com', 'maharaj123');
    setCurrentPage('admin');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin');
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] w-full bg-[#F7F3EB] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] space-y-8 text-center bg-[#FFFDF8] p-8 border border-[#171310]/15 shadow-xl">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-wide text-[#171310]">
            Welcome Back
          </h1>
          <p className="font-sans text-sm tracking-wide text-[#171310]/70 font-light">
            Sign in to your Maharaj Jewellery account or Admin Portal.
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium">
            {msg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
          {/* Email Address Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-sans text-xs font-medium uppercase tracking-[0.15em] text-[#171310]/80"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@maharajjewellery.com"
              className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#171310]/15 rounded-none font-sans text-sm text-[#171310] placeholder-[#171310]/35 focus:outline-none focus:border-[#B59662] focus:ring-1 focus:ring-[#B59662] transition-colors duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block font-sans text-xs font-medium uppercase tracking-[0.15em] text-[#171310]/80"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-11 py-3 bg-[#FAF7F2] border border-[#171310]/15 rounded-none font-sans text-sm text-[#171310] placeholder-[#171310]/35 focus:outline-none focus:border-[#B59662] focus:ring-1 focus:ring-[#B59662] transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#171310]/50 hover:text-[#B59662] focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Main Button: SIGN IN */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-6 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#B59662] transition-colors duration-300 focus:outline-none active:scale-[0.99] rounded-none"
          >
            SIGN IN
          </button>
        </form>

        {/* ADMIN DIRECT BUTTON */}
        <div className="pt-4 border-t border-[#171310]/10">
          <button
            type="button"
            onClick={handleAdminDirectLogin}
            className="w-full py-3 px-4 bg-[#F5F1EB] border border-[#B59662]/50 text-[#171310] font-sans text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#B59662] hover:text-[#171310] transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#B59662]" />
            <span>Access Executive Admin Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
