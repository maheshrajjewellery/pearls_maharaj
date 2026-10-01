import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { HomepageCMS } from "@/types/admin";
import { Layout, Image as ImageIcon, Save, Eye, Sparkles } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export const HomepageCMSView: React.FC = () => {
  const { homepageCMS, updateHomepageCMS } = useAdmin();
  const { setCurrentPage } = useShop();
  const [formData, setFormData] = useState<HomepageCMS>(homepageCMS);

  const handleHeroChange = (key: keyof HomepageCMS["hero"], val: any) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: val },
    }));
  };

  const handlePearlStoryChange = (
    key: keyof HomepageCMS["pearlStory"],
    val: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      pearlStory: { ...prev.pearlStory, [key]: val },
    }));
  };

  const handleSave = () => {
    updateHomepageCMS(formData);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Visual Homepage CMS
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Manage public homepage hero banner, brand narratives, background
            media, and section visibility
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="border border-[#29231F]/20 text-[#29231F] hover:bg-[#E8DED0] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#C8A96B]" /> PREVIEW LIVE PAGE
          </button>
          <button
            onClick={handleSave}
            className="bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> SAVE CHANGES
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO BANNER MANAGEMENT */}
      <div className="bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#29231F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#29231F]">
              1. Cinematic Hero Section
            </h3>
            <p className="text-xs text-[#29231F]/60">
              Primary banner displayed at the top of the store
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#29231F]/70 font-medium">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.hero.active}
              onChange={(e) => handleHeroChange("active", e.target.checked)}
              className="w-4 h-4 accent-[#C8A96B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#29231F] mb-1">
              Main Heading Title
            </label>
            <input
              type="text"
              value={formData.hero.heading}
              onChange={(e) => handleHeroChange("heading", e.target.value)}
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#29231F] mb-1">
              Subtitle Brand Tagline
            </label>
            <input
              type="text"
              value={formData.hero.subtitle}
              onChange={(e) => handleHeroChange("subtitle", e.target.value)}
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#29231F] mb-1">
              Hero Story Description
            </label>
            <textarea
              rows={2}
              value={formData.hero.description}
              onChange={(e) => handleHeroChange("description", e.target.value)}
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#29231F] mb-1">
              Background Image URL
            </label>
            <input
              type="text"
              value={formData.hero.bgImage}
              onChange={(e) => handleHeroChange("bgImage", e.target.value)}
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#29231F] mb-1">
              CTA Button Text
            </label>
            <input
              type="text"
              value={formData.hero.ctaText}
              onChange={(e) => handleHeroChange("ctaText", e.target.value)}
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        {/* LIVE HERO CARD PREVIEW */}
        <div className="relative h-48 border border-[#29231F]/15 overflow-hidden mt-4">
          <img
            src={formData.hero.bgImage}
            alt="Hero Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-center text-white">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96B] font-semibold">
              {formData.hero.subtitle}
            </span>
            <h4 className="font-serif text-2xl font-light mt-1">
              {formData.hero.heading}
            </h4>
            <p className="text-xs text-white/80 mt-1 max-w-md line-clamp-2">
              {formData.hero.description}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: BRAND PEARL STORY */}
      <div className="bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#29231F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#29231F]">
              2. Pearl Story Narrative Section
            </h3>
            <p className="text-xs text-[#29231F]/60">
              Brand intro block featuring history and craftsmanship
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#29231F] mb-1">
              Heading Title
            </label>
            <input
              type="text"
              value={formData.pearlStory.heading}
              onChange={(e) =>
                handlePearlStoryChange("heading", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#29231F] mb-1">
              Featured Image URL
            </label>
            <input
              type="text"
              value={formData.pearlStory.image}
              onChange={(e) => handlePearlStoryChange("image", e.target.value)}
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#29231F] mb-1">
              Content Body
            </label>
            <textarea
              rows={3}
              value={formData.pearlStory.content}
              onChange={(e) =>
                handlePearlStoryChange("content", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
