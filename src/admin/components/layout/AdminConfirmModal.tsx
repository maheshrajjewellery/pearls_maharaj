import React from "react";
import { useAdmin } from "../../context/AdminContext";
import { AlertTriangle, X } from "lucide-react";

export const AdminConfirmModal: React.FC = () => {
  const { confirmModalConfig, closeConfirmation } = useAdmin();

  if (!confirmModalConfig.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29231F]/40 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDF8] border border-[#29231F]/15 max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={closeConfirmation}
          className="absolute top-4 right-4 text-[#29231F]/50 hover:text-[#29231F] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#E8DED0] flex items-center justify-center shrink-0 text-[#C8A96B]">
            <AlertTriangle className="w-5 h-5 text-[#29231F]" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#29231F] font-semibold">
              {confirmModalConfig.title}
            </h3>
            <p className="text-sm text-[#29231F]/70 mt-1 leading-relaxed">
              {confirmModalConfig.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#29231F]/10">
          <button
            type="button"
            onClick={closeConfirmation}
            className="px-4 py-2 text-xs uppercase tracking-widest text-[#29231F]/80 hover:text-[#29231F] bg-[#F5F1EB] hover:bg-[#E8DED0] transition-colors"
          >
            {confirmModalConfig.cancelText || "Cancel"}
          </button>
          <button
            type="button"
            onClick={() => {
              confirmModalConfig.onConfirm();
              closeConfirmation();
            }}
            className={`px-5 py-2 text-xs uppercase tracking-widest text-white transition-colors ${
              confirmModalConfig.isDanger
                ? "bg-red-800 hover:bg-red-900"
                : "bg-[#29231F] hover:bg-[#C8A96B]"
            }`}
          >
            {confirmModalConfig.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
