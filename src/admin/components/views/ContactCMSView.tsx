import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ContactEnquiry, ContactEnquiryStatus } from '@/types/admin';
import { Mail, Phone, Calendar, Eye, X, CheckCircle2 } from 'lucide-react';

export const ContactCMSView: React.FC = () => {
  const { contactEnquiries, updateContactEnquiryStatus } = useAdmin();
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);

  const getStatusBadge = (status: ContactEnquiryStatus) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-1 text-[10px] bg-red-100 text-red-900 font-bold border border-red-300">New Message</span>;
      case 'Read':
        return <span className="px-2.5 py-1 text-[10px] bg-blue-100 text-blue-900 font-bold border border-blue-300">Read</span>;
      case 'Replied':
        return <span className="px-2.5 py-1 text-[10px] bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">Replied</span>;
      case 'Closed':
        return <span className="px-2.5 py-1 text-[10px] bg-gray-200 text-gray-800 font-bold">Closed</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Contact & Consultation Messages ({contactEnquiries.length})
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Client consultation submissions, custom gemstone requests, and concierge messages
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#FFFDF8] border border-[#29231F]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#29231F]/10 text-[#29231F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                <th className="p-3">Client</th>
                <th className="p-3">Category</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29231F]/5">
              {contactEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-[#F5F1EB]/40 transition-colors">
                  <td className="p-3">
                    <p className="font-semibold text-[#29231F]">{enq.name}</p>
                    <p className="text-[10px] text-[#29231F]/60">{enq.email}</p>
                  </td>
                  <td className="p-3 font-semibold text-[#C8A96B]">{enq.category}</td>
                  <td className="p-3 text-[#29231F]/90 font-medium">{enq.subject}</td>
                  <td className="p-3 text-[#29231F]/60">{enq.date.split('T')[0]}</td>
                  <td className="p-3">{getStatusBadge(enq.status)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedEnquiry(enq);
                        if (enq.status === 'New') updateContactEnquiryStatus(enq.id, 'Read');
                      }}
                      className="px-3 py-1 bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] font-semibold uppercase tracking-widest text-[10px] transition-colors"
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

      {/* DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29231F]/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#29231F]/20 max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-[#29231F]/50 hover:text-[#29231F]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-[#29231F]/10 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#C8A96B] font-bold">
                {selectedEnquiry.category} CONSULTATION MESSAGE
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#29231F] mt-0.5">
                {selectedEnquiry.subject}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F5F1EB] p-3 border border-[#29231F]/10">
                <p className="font-bold text-[#29231F]">{selectedEnquiry.name}</p>
                <p className="text-[#29231F]/70">{selectedEnquiry.email} • {selectedEnquiry.phone}</p>
                <p className="text-[10px] text-[#29231F]/50 mt-1">{new Date(selectedEnquiry.date).toLocaleString('en-IN')}</p>
              </div>

              <div>
                <p className="font-semibold text-[#29231F] mb-1">Client Message</p>
                <p className="p-3 bg-[#F5F1EB] border border-[#29231F]/10 text-[#29231F]/90 leading-relaxed italic">
                  "{selectedEnquiry.message}"
                </p>
              </div>

              {/* STATUS UPDATER */}
              <div className="pt-3 border-t border-[#29231F]/10 flex items-center justify-between">
                <span className="font-semibold text-[#29231F]">Mark Status:</span>
                <div className="flex gap-1.5">
                  {(['Read', 'Replied', 'Closed'] as ContactEnquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateContactEnquiryStatus(selectedEnquiry.id, st);
                        setSelectedEnquiry((prev) => (prev ? { ...prev, status: st } : null));
                      }}
                      className={`px-3 py-1 text-[10px] font-semibold border ${
                        selectedEnquiry.status === st
                          ? 'bg-[#29231F] text-[#F7F3EC] border-[#29231F]'
                          : 'bg-[#F5F1EB] text-[#29231F]/70 border-[#29231F]/15 hover:text-[#29231F]'
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
