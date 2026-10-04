import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminSettings } from '@/types/admin';
import { Save, ShieldCheck, Store, CreditCard, Truck, Globe, Mail } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, adminUser } = useAdmin();
  const [formData, setFormData] = useState<AdminSettings>(settings);

  const handleSave = () => {
    updateSettings(formData);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">Store Settings & Administration</h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Configure brand metadata, shipping thresholds, tax rules, concierge channels, and SEO defaults
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> SAVE ALL SETTINGS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* 1. STORE INFORMATION */}
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#30372F] pb-2 border-b border-[#30372F]/10 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#C5A15A]" /> Store Information
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-medium mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Concierge Support Email</label>
              <input
                type="email"
                value={formData.storeEmail}
                onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Store Phone Number</label>
              <input
                type="text"
                value={formData.storePhone}
                onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Atelier Address</label>
              <textarea
                rows={2}
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>
          </div>
        </div>

        {/* 2. SHIPPING & TAX SETTINGS */}
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#30372F] pb-2 border-b border-[#30372F]/10 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C5A15A]" /> Shipping & Tax Thresholds
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-medium mb-1">Jewellery Tax GST Rate (%)</label>
              <input
                type="number"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Complimentary Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Standard Secure Delivery Fee (₹)</label>
              <input
                type="number"
                value={formData.standardShippingFee}
                onChange={(e) => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>
          </div>
        </div>

        {/* 3. SEO DEFAULTS */}
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#30372F] pb-2 border-b border-[#30372F]/10 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C5A15A]" /> Storefront SEO Defaults
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-medium mb-1">Global Page Title</label>
              <input
                type="text"
                value={formData.seoDefaultTitle}
                onChange={(e) => setFormData({ ...formData, seoDefaultTitle: e.target.value })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Global Meta Description</label>
              <textarea
                rows={3}
                value={formData.seoDefaultDescription}
                onChange={(e) => setFormData({ ...formData, seoDefaultDescription: e.target.value })}
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
              />
            </div>
          </div>
        </div>

        {/* 4. ADMIN PROFILE & SECURITY */}
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#30372F] pb-2 border-b border-[#30372F]/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A15A]" /> Executive Admin Profile & Security
          </h3>

          <div className="p-3 bg-[#F5F1EB] border border-[#30372F]/10 space-y-1">
            <p className="font-bold text-[#30372F]">{adminUser?.name}</p>
            <p className="text-[#30372F]/70">{adminUser?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-[#C5A15A] text-[#30372F] font-bold text-[9px] uppercase tracking-wider">
              {adminUser?.role}
            </span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
            <strong>Security Notice:</strong> Database operations and protected /admin routes are protected by session tokens. Sensitive payment secrets are stored on server-side environment variables.
          </div>
        </div>
      </div>
    </div>
  );
};
