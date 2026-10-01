import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { PearlEducationCMS } from "@/types/admin";
import { Save, Eye, Plus, Trash2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export const PearlEducationCMSView: React.FC = () => {
  const { educationCMS, updateEducationCMS } = useAdmin();
  const { setCurrentPage } = useShop();
  const [formData, setFormData] = useState<PearlEducationCMS>(educationCMS);

  const handleSave = () => {
    updateEducationCMS(formData);
  };

  const handleSectionChange = (idx: number, field: string, val: string) => {
    const updated = [...formData.sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({ ...formData, sections: updated });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Pearl Education CMS
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Manage educational guide sections, pearl grading criteria, and care
            masterclass
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage("education")}
            className="border border-[#29231F]/20 text-[#29231F] hover:bg-[#E8DED0] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#C8A96B]" /> PREVIEW EDUCATION PAGE
          </button>
          <button
            onClick={handleSave}
            className="bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> SAVE CHANGES
          </button>
        </div>
      </div>

      <div className="bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs space-y-6 text-xs">
        <h3 className="font-serif text-lg font-semibold text-[#29231F] pb-2 border-b border-[#29231F]/10">
          Educational Guide Modules
        </h3>

        {formData.sections.map((sec, idx) => (
          <div
            key={sec.id}
            className="p-4 bg-[#F5F1EB] border border-[#29231F]/10 space-y-3"
          >
            <p className="font-serif font-bold text-[#29231F] text-sm">
              {sec.title}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  Module Title
                </label>
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) =>
                    handleSectionChange(idx, "title", e.target.value)
                  }
                  className="w-full bg-[#FFFDF8] border border-[#29231F]/15 p-2 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={sec.image}
                  onChange={(e) =>
                    handleSectionChange(idx, "image", e.target.value)
                  }
                  className="w-full bg-[#FFFDF8] border border-[#29231F]/15 p-2 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-[#29231F] mb-1">
                  Educational Content
                </label>
                <textarea
                  rows={3}
                  value={sec.content || sec.description}
                  onChange={(e) =>
                    handleSectionChange(idx, "content", e.target.value)
                  }
                  className="w-full bg-[#FFFDF8] border border-[#29231F]/15 p-2 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
