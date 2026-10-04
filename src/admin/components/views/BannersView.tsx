import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Banner } from '@/types/admin';
import { Plus, Edit, Trash2, Megaphone, X } from 'lucide-react';

export const BannersView: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, requestConfirmation } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('EXPLORE COLLECTION');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [type, setType] = useState<Banner['type']>('Homepage');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [status, setStatus] = useState<Banner['status']>('Active');

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImageUrl('https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1920');
    setCtaText('EXPLORE COLLECTION');
    setCtaLink('/shop');
    setType('Homepage');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setImageUrl(b.imageUrl);
    setCtaText(b.ctaText);
    setCtaLink(b.ctaLink);
    setType(b.type);
    setStartDate(b.startDate);
    setEndDate(b.endDate);
    setStatus(b.status);
    setIsModalOpen(true);
  };

  const handleDelete = (b: Banner) => {
    requestConfirmation({
      title: 'Delete Banner',
      message: `Are you sure you want to remove banner "${b.title}"?`,
      confirmText: 'Delete Banner',
      isDanger: true,
      onConfirm: () => deleteBanner(b.id),
    });
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const id = editingBanner ? editingBanner.id : `ban-${Date.now().toString().slice(-4)}`;

    const payload: Banner = {
      id,
      title,
      subtitle,
      imageUrl,
      ctaText,
      ctaLink,
      type,
      startDate,
      endDate,
      status,
    };

    if (editingBanner) {
      updateBanner(payload);
    } else {
      addBanner(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">Banners & Marketing</h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Manage store marketing hero sliders, promotional campaign banners, and timing
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> CREATE BANNER
        </button>
      </div>

      {/* BANNERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#C5A15A] transition-all"
          >
            <div className="relative h-44 overflow-hidden group">
              <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] bg-[#C5A15A] text-[#30372F] font-bold px-2 py-0.5 w-max uppercase tracking-wider mb-1">
                  {b.type} Banner
                </span>
                <h3 className="font-serif text-xl font-semibold">{b.title}</h3>
                <p className="text-xs text-white/80 line-clamp-1">{b.subtitle}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#30372F]/50 uppercase block font-mono">
                  Active: {b.startDate} to {b.endDate}
                </span>
                <span className="text-[#C5A15A] font-semibold mt-0.5 block">CTA: {b.ctaText} → {b.ctaLink}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-[#30372F]/60 hover:text-[#C5A15A]">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(b)} className="p-1.5 text-[#30372F]/60 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30372F]/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#30372F]/20 max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#30372F]/50 hover:text-[#30372F]">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-semibold text-[#30372F] mb-4">
              {editingBanner ? 'Edit Banner' : 'Create New Banner'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Banner Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Autumn Pearl Collection"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Unrivaled South Sea Luster"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Target Link URL</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Banner Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
                  >
                    <option value="Homepage">Homepage</option>
                    <option value="Collection">Collection</option>
                    <option value="Promotional">Promotional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs focus:outline-none focus:border-[#C5A15A]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-[#30372F]/10">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 uppercase tracking-widest text-[#30372F]/70">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 bg-[#30372F] text-[#F7F3EC] uppercase tracking-widest font-semibold hover:bg-[#C5A15A]">Save Banner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
