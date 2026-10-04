import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Lock, Mail, Shield, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { getPublicStoreUrl } from '@/lib/siteUrl';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdmin();
  const { setCurrentPage } = useShop();
  const [email, setEmail] = useState('admin@maharajjewellery.com');
  const [password, setPassword] = useState('maharaj123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter valid email and password credentials.');
      return;
    }
    const success = login(email, password);
    if (success) {
      setCurrentPage('admin');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      setErrorMsg('Invalid login credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex flex-col justify-center items-center p-4 font-sans text-[#30372F]">
      <div className="max-w-md w-full bg-[#FFFDF8] border border-[#30372F]/15 p-8 shadow-2xl relative overflow-hidden animate-fadeIn">
        {/* TOP GOLD ACCENT BAR */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#C5A15A]" />

        {/* LOGO */}
        <div className="text-center mb-8">
          <span className="font-serif text-2xl tracking-[0.25em] text-[#30372F] font-light block">
            MAHARAJ
          </span>
          <span className="text-[10px] tracking-[0.35em] text-[#C5A15A] uppercase font-bold block mt-1">
            JEWELLERY
          </span>
          <div className="w-12 h-0.5 bg-[#C5A15A]/50 mx-auto my-3" />
          <p className="text-xs text-[#30372F]/60 uppercase tracking-widest font-medium">
            Protected Admin Portal
          </p>
        </div>

        {/* ERROR ALERT */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[#30372F] font-semibold uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#30372F]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@maharajjewellery.com"
                className="w-full bg-[#F5F1EB] border border-[#30372F]/20 pl-9 pr-3 py-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#30372F] font-semibold uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-[#30372F]/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F5F1EB] border border-[#30372F]/20 pl-9 pr-3 py-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                required
              />
            </div>
          </div>

          {/* QUICK DEMO CREDENTIALS HINT */}
          <div className="p-3 bg-[#F5F1EB] border border-[#30372F]/10 text-[11px] text-[#30372F]/80 space-y-1">
            <span className="font-semibold text-[#30372F] flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#C5A15A]" /> Authorized Executive Credentials
            </span>
            <p className="text-[10px] text-[#30372F]/60">
              Email: <code className="text-[#30372F] font-mono">admin@maharajjewellery.com</code>
              <br />
              Password: <code className="text-[#30372F] font-mono">maharaj123</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#30372F] text-[#F7F3EC] uppercase tracking-[0.2em] font-semibold text-xs hover:bg-[#C5A15A] hover:text-[#30372F] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>ACCESS ADMIN PANEL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* FOOTER LINK BACK TO STORE */}
        <div className="mt-6 pt-4 border-t border-[#30372F]/10 text-center">
          <a
            href={getPublicStoreUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#30372F]/60 hover:text-[#C5A15A] uppercase tracking-wider transition-colors inline-flex items-center gap-1"
          >
            ← Return to Customer Storefront
          </a>
        </div>
      </div>
    </div>
  );
};
