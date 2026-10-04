import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { ContactEnquiry, ContactEnquiryStatus } from "@/types/admin";
import { ContactCMS } from "@/services/cmsService";
import { Mail, Phone, MapPin, Clock, Save, Eye, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getPublicStoreUrl } from "@/lib/siteUrl";

export const ContactCMSView: React.FC = () => {
  const {
    contactEnquiries,
    updateContactEnquiryStatus,
    contactCMS,
    updateContactCMS,
  } = useAdmin();
  const { setCurrentPage } = useShop();

  const [activeTab, setActiveTab] = useState<"messages" | "page_cms">(
    "messages",
  );
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(
    null,
  );
  const [formData, setFormData] = useState<ContactCMS>(contactCMS);

  const handleSaveCMS = () => {
    updateContactCMS(formData);
  };

  const getStatusBadge = (status: ContactEnquiryStatus) => {
    switch (status) {
      case "New":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-red-100 text-red-900 font-bold border border-red-300">
            New Message
          </span>
        );
      case "Read":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-blue-100 text-blue-900 font-bold border border-blue-300">
            Read
          </span>
        );
      case "Replied":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
            Replied
          </span>
        );
      case "Closed":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-gray-200 text-gray-800 font-bold">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER WITH TABS */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">
            Contact & Consultation CMS
          </h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Manage client concierge messages, contact page details, studio
            address, and operating hours
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(getPublicStoreUrl("/contact"), "_blank")}
            className="border border-[#30372F]/20 text-[#30372F] hover:bg-[#F5EBDD] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#C5A15A]" /> PREVIEW CONTACT PAGE
          </button>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-[#30372F]/15">
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "messages"
              ? "border-[#C5A15A] text-[#30372F] bg-[#FFFDF8]"
              : "border-transparent text-[#30372F]/60 hover:text-[#30372F]"
          }`}
        >
          Client Messages ({contactEnquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("page_cms")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "page_cms"
              ? "border-[#C5A15A] text-[#30372F] bg-[#FFFDF8]"
              : "border-transparent text-[#30372F]/60 hover:text-[#30372F]"
          }`}
        >
          Contact Page Content CMS
        </button>
      </div>

      {activeTab === "messages" ? (
        /* TABLE OF MESSAGES */
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                  <th className="p-3">Client</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30372F]/5">
                {contactEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    className="hover:bg-[#F5F1EB]/40 transition-colors"
                  >
                    <td className="p-3">
                      <p className="font-semibold text-[#30372F]">{enq.name}</p>
                      <p className="text-[10px] text-[#30372F]/60">
                        {enq.email}
                      </p>
                    </td>
                    <td className="p-3 font-semibold text-[#C5A15A]">
                      {enq.category}
                    </td>
                    <td className="p-3 text-[#30372F]/90 font-medium">
                      {enq.subject}
                    </td>
                    <td className="p-3 text-[#30372F]/60">
                      {enq.date.split("T")[0]}
                    </td>
                    <td className="p-3">{getStatusBadge(enq.status)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          if (enq.status === "New")
                            updateContactEnquiryStatus(enq.id, "Read");
                        }}
                        className="px-3 py-1 bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] font-semibold uppercase tracking-widest text-[10px] transition-colors"
                      >
                        READ MESSAGE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* PAGE CONTENT EDIT FORM */
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#30372F]">
                Contact Page Hero & Studio Details
              </h3>
              <p className="text-xs text-[#30372F]/60">
                Manage contact page headings, studio phone, concierge email, and
                physical palace address
              </p>
            </div>
            <button
              onClick={handleSaveCMS}
              className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> SAVE CHANGES
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-medium text-[#30372F] mb-1">
                Hero Heading Title
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

            <div className="md:col-span-2">
              <label className="block font-medium text-[#30372F] mb-1">
                Hero Subheading Description
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

            <div>
              <label className="block font-medium text-[#30372F] mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C5A15A]" /> Concierge Phone
                Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#30372F] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C5A15A]" /> Concierge Email
                Address
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-[#30372F] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A15A]" /> Heritage
                Studio Address
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#30372F] mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A15A]" /> Consultation
                Working Hours
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) =>
                  setFormData({ ...formData, workingHours: e.target.value })
                }
                className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
              />
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR MESSAGES */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30372F]/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#30372F]/20 max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-[#30372F]/50 hover:text-[#30372F]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-[#30372F]/10 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A15A] font-bold">
                {selectedEnquiry.category} CONSULTATION MESSAGE
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#30372F] mt-0.5">
                {selectedEnquiry.subject}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F5F1EB] p-3 border border-[#30372F]/10">
                <p className="font-bold text-[#30372F]">
                  {selectedEnquiry.name}
                </p>
                <p className="text-[#30372F]/70">
                  {selectedEnquiry.email} • {selectedEnquiry.phone}
                </p>
                <p className="text-[10px] text-[#30372F]/50 mt-1">
                  {new Date(selectedEnquiry.date).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#30372F] mb-1">
                  Client Message
                </p>
                <p className="p-3 bg-[#F5F1EB] border border-[#30372F]/10 text-[#30372F]/90 leading-relaxed italic">
                  "{selectedEnquiry.message}"
                </p>
              </div>

              {/* STATUS UPDATER */}
              <div className="pt-3 border-t border-[#30372F]/10 flex items-center justify-between">
                <span className="font-semibold text-[#30372F]">
                  Mark Status:
                </span>
                <div className="flex gap-1.5">
                  {(
                    ["Read", "Replied", "Closed"] as ContactEnquiryStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateContactEnquiryStatus(selectedEnquiry.id, st);
                        setSelectedEnquiry((prev) =>
                          prev ? { ...prev, status: st } : null,
                        );
                      }}
                      className={`px-3 py-1 text-[10px] font-semibold border ${
                        selectedEnquiry.status === st
                          ? "bg-[#30372F] text-[#F7F3EC] border-[#30372F]"
                          : "bg-[#F5F1EB] text-[#30372F]/70 border-[#30372F]/15 hover:text-[#30372F]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
