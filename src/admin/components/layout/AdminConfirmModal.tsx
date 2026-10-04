import React from "react";
import { useAdmin } from "../../context/AdminContext";
import { AlertTriangle, X } from "lucide-react";

export const AdminConfirmModal: React.FC = () => {
  const { confirmModalConfig, closeConfirmation } = useAdmin();

  if (!confirmModalConfig.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30372F]/40 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDF8] border border-[#30372F]/15 max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={closeConfirmation}
          className="absolute top-4 right-4 text-[#30372F]/50 hover:text-[#30372F] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-10 h-10 rounded-full bg-[#F5EBDD] flex items-center justify-center shrink-0 text-[#C5A15A]"
          >
            <AlertTriangle className="w-5 h-5 text-[#30372F]" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#30372F] font-semibold">
              {confirmModalConfig.title}
            </h3>
            <p className="text-sm text-[#30372F]/70 mt-1 leading-relaxed">
              {confirmModalConfig.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#30372F]/10">
          <button
            type="button"
            onClick={closeConfirmation}
            className="px-4 py-2 text-xs uppercase tracking-widest text-[#30372F]/80 hover:text-[#30372F] bg-[#F5F1EB] hover:bg-[#F5EBDD] transition-colors"
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
                : "bg-[#30372F] hover:bg-[#C5A15A]"
            }`}
          >
            {confirmModalConfig.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
