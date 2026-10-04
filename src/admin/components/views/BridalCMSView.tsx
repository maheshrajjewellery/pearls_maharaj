import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { BridalCMS } from "@/types/admin";
import { Save, Eye } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getPublicStoreUrl } from "@/lib/siteUrl";

export const BridalCMSView: React.FC = () => {
  const { bridalCMS, updateBridalCMS } = useAdmin();
  const { setCurrentPage } = useShop();
  const [formData, setFormData] = useState<BridalCMS>(bridalCMS);

  const handleSave = () => {
    updateBridalCMS(formData);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">
            Bridal Content CMS
          </h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Manage sacred wedding campaign banners, featured bridal sets, and
            consultation bookings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(getPublicStoreUrl("/bridal"), "_blank")}
            className="border border-[#30372F]/20 text-[#30372F] hover:bg-[#F5EBDD] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#C5A15A]" /> PREVIEW BRIDAL PAGE
          </button>
          <button
            onClick={handleSave}
            className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> SAVE CHANGES
          </button>
        </div>
      </div>

      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4 text-xs">
        <h3 className="font-serif text-lg font-semibold text-[#30372F] pb-2 border-b border-[#30372F]/10">
          Bridal Hero & Styling Session Banner
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Bridal Campaign Heading
            </label>
            <input
              type="text"
              value={formData.heroHeading}
              onChange={(e) =>
                setFormData({ ...formData, heroHeading: e.target.value })
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Campaign Image URL
            </label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) =>
                setFormData({ ...formData, heroImage: e.target.value })
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#30372F] mb-1">
              Subheading Description
            </label>
            <textarea
              rows={2}
              value={formData.heroSubheading}
              onChange={(e) =>
                setFormData({ ...formData, heroSubheading: e.target.value })
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
