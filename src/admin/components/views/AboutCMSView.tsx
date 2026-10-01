import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { AboutCMS } from "@/types/admin";
import { Save, Eye } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export const AboutCMSView: React.FC = () => {
  const { aboutCMS, updateAboutCMS } = useAdmin();
  const { setCurrentPage } = useShop();
  const [formData, setFormData] = useState<AboutCMS>(aboutCMS);

  const handleSave = () => {
    updateAboutCMS(formData);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            About Us Content CMS
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Manage heritage history, court goldsmith legacy, and brand
            philosophy
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage("about")}
            className="border border-[#29231F]/20 text-[#29231F] hover:bg-[#E8DED0] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#C8A96B]" /> PREVIEW ABOUT PAGE
          </button>
          <button
            onClick={handleSave}
            className="bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> SAVE CHANGES
          </button>
        </div>
      </div>

      <div className="bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs space-y-4 text-xs">
        <h3 className="font-serif text-lg font-semibold text-[#29231F] pb-2 border-b border-[#29231F]/10">
          Hero & Philosophy Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[#29231F] mb-1">
              Hero Heading
            </label>
            <input
              type="text"
              value={formData.heroHeading}
              onChange={(e) =>
                setFormData({ ...formData, heroHeading: e.target.value })
              }
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#29231F] mb-1">
              Hero Background Image
            </label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) =>
                setFormData({ ...formData, heroImage: e.target.value })
              }
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#29231F] mb-1">
              Brand Philosophy Statement
            </label>
            <textarea
              rows={3}
              value={formData.philosophyText}
              onChange={(e) =>
                setFormData({ ...formData, philosophyText: e.target.value })
              }
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#29231F] mb-1">
              The Maharaj Pearl Story
            </label>
            <textarea
              rows={4}
              value={formData.storyText}
              onChange={(e) =>
                setFormData({ ...formData, storyText: e.target.value })
              }
              className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
