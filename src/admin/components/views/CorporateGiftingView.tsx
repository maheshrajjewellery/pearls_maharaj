import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CorporateEnquiry, CorporateEnquiryStatus } from '@/types/admin';
import { Briefcase, Mail, Phone, Building, Calendar, Edit, Trash2, Eye, X, CheckCircle2 } from 'lucide-react';

export const CorporateGiftingView: React.FC = () => {
  const { corporateEnquiries, updateCorporateEnquiryStatus, deleteCorporateEnquiry, requestConfirmation } = useAdmin();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'orders'>('enquiries');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CorporateEnquiry | null>(null);

  // Note & Status state for detail view
  const [internalNoteInput, setInternalNoteInput] = useState('');

  const filteredEnquiries = useMemo(() => {
    return corporateEnquiries.filter((e) => {
      if (statusFilter === 'All') return true;
      return e.status === statusFilter;
    });
  }, [corporateEnquiries, statusFilter]);

  const handleUpdateStatus = (id: string, status: CorporateEnquiryStatus) => {
    updateCorporateEnquiryStatus(id, status, internalNoteInput || undefined);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status, internalNotes: internalNoteInput || prev.internalNotes } : null));
    }
  };

  const handleDelete = (id: string) => {
    requestConfirmation({
      title: 'Archive Corporate Enquiry',
      message: 'Are you sure you want to delete or archive this corporate enquiry?',
      confirmText: 'Delete Enquiry',
      isDanger: true,
      onConfirm: () => deleteCorporateEnquiry(id),
    });
  };

  const getStatusBadge = (status: CorporateEnquiryStatus) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-1 text-[10px] bg-red-100 text-red-800 font-bold border border-red-300">New Request</span>;
      case 'Contacted':
        return <span className="px-2.5 py-1 text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-300">Contacted</span>;
      case 'In Discussion':
        return <span className="px-2.5 py-1 text-[10px] bg-purple-100 text-purple-900 font-bold border border-purple-300">In Discussion</span>;
      case 'Quoted':
        return <span className="px-2.5 py-1 text-[10px] bg-blue-100 text-blue-900 font-bold border border-blue-300">Quote Sent</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-1 text-[10px] bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">Confirmed Order</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 text-[10px] bg-emerald-200 text-emerald-950 font-bold border border-emerald-400">Completed</span>;
      case 'Closed':
        return <span className="px-2.5 py-1 text-[10px] bg-gray-200 text-gray-800 font-bold">Closed</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] bg-gray-100 text-gray-800 font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Corporate Gifting Management
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Institutional inquiries, custom corporate packaging, high-volume procurement
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F5F1EB] p-1 border border-[#29231F]/10 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-1.5 transition-colors ${
              activeTab === 'enquiries' ? 'bg-[#29231F] text-[#F7F3EC]' : 'text-[#29231F]/70 hover:text-[#29231F]'
            }`}
          >
            Enquiries ({corporateEnquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 transition-colors ${
              activeTab === 'orders' ? 'bg-[#29231F] text-[#F7F3EC]' : 'text-[#29231F]/70 hover:text-[#29231F]'
            }`}
          >
            Corporate Orders
          </button>
        </div>
      </div>

      {activeTab === 'enquiries' ? (
        <>
          {/* STATUS FILTERS */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F5F1EB] p-3 border border-[#29231F]/10 text-xs uppercase tracking-wider font-medium">
            {['All', 'New', 'Contacted', 'In Discussion', 'Quoted', 'Confirmed', 'Completed', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 transition-colors border ${
                  statusFilter === st
                    ? 'bg-[#29231F] text-[#F7F3EC] border-[#29231F] font-bold'
                    : 'bg-[#FFFDF8] text-[#29231F]/70 border-[#29231F]/15 hover:text-[#29231F]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <div className="bg-[#FFFDF8] border border-[#29231F]/10 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#29231F]/10 text-[#29231F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Client / Company</th>
                    <th className="p-3">Gifts Qty</th>
                    <th className="p-3">Occasion</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Submitted Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#29231F]/5">
                  {filteredEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#F5F1EB]/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#29231F]">{enq.enquiryNumber}</td>
                      <td className="p-3">
                        <p className="font-semibold text-[#29231F]">{enq.name}</p>
                        <p className="text-[10px] text-[#29231F]/60">{enq.company}</p>
                      </td>
                      <td className="p-3 font-bold text-[#C8A96B]">{enq.numberOfGifts} Units</td>
                      <td className="p-3 text-[#29231F]/80">{enq.occasion}</td>
                      <td className="p-3 text-[#29231F]/80">{enq.budget}</td>
                      <td className="p-3 text-[#29231F]/60">{enq.date.split('T')[0]}</td>
                      <td className="p-3">{getStatusBadge(enq.status)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setInternalNoteInput(enq.internalNotes || '');
                            }}
                            className="p-1.5 text-[#29231F]/60 hover:text-[#C8A96B] transition-colors"
                            title="View Full Form"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(enq.id)}
                            className="p-1.5 text-[#29231F]/60 hover:text-red-700 transition-colors"
                            title="Delete / Archive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* CORPORATE ORDERS TAB */
        <div className="bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs text-xs space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#29231F]">Confirmed Corporate Orders</h3>
          <p className="text-[#29231F]/70 leading-relaxed">
            Corporate accounts with signed procurement contracts and active bulk packaging.
          </p>

          <div className="border border-[#29231F]/15 p-4 bg-[#F5F1EB]">
            <div className="flex items-center justify-between pb-2 border-b border-[#29231F]/10">
              <span className="font-bold text-[#29231F]">Apex Capital Advisors (Diwali Procurement)</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold">In Production</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 text-[11px] text-[#29231F]/80">
              <div>Quantity: 100 Pearl Necklaces</div>
              <div>Contract Value: ₹ 12,50,000</div>
              <div>Delivery Target: October 15, 2026</div>
            </div>
          </div>
        </div>
      )}

      {/* FULL FORM DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29231F]/40 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#29231F]/20 max-w-2xl w-full my-8 p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-[#29231F]/50 hover:text-[#29231F]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className="pb-4 border-b border-[#29231F]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C8A96B] font-bold">
                  CORPORATE GIFTING ENQUIRY #{selectedEnquiry.enquiryNumber}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#29231F] mt-0.5">
                  {selectedEnquiry.company}
                </h3>
              </div>
              <div>{getStatusBadge(selectedEnquiry.status)}</div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4 text-xs pr-1">
              <div className="grid grid-cols-2 gap-4 bg-[#F5F1EB] p-4 border border-[#29231F]/10">
                <div>
                  <p className="text-[10px] text-[#29231F]/50 uppercase font-medium">Contact Person</p>
                  <p className="font-bold text-[#29231F] text-sm">{selectedEnquiry.name}</p>
                  <p className="text-[#29231F]/80">{selectedEnquiry.email}</p>
                  <p className="text-[#29231F]/80">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#29231F]/50 uppercase font-medium">Occasion & Gifts</p>
                  <p className="font-bold text-[#29231F] text-sm">{selectedEnquiry.numberOfGifts} Units Required</p>
                  <p className="text-[#29231F]/80">Occasion: {selectedEnquiry.occasion}</p>
                  <p className="text-[#C8A96B] font-semibold">Budget: {selectedEnquiry.budget}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-[#29231F] mb-1">Preferred Jewellery Type</p>
                <p className="p-3 bg-[#F5F1EB] border border-[#29231F]/10 text-[#29231F]/90">
                  {selectedEnquiry.preferredJewellery}
                </p>
              </div>

              {selectedEnquiry.message && (
                <div>
                  <p className="font-semibold text-[#29231F] mb-1">Submitted Client Request / Notes</p>
                  <p className="p-3 bg-[#F5F1EB] border border-[#29231F]/10 text-[#29231F]/80 leading-relaxed italic">
                    "{selectedEnquiry.message}"
                  </p>
                </div>
              )}

              {/* STATUS CHANGE & INTERNAL NOTES */}
              <div className="bg-[#FFFDF8] border border-[#29231F]/15 p-4 space-y-3 pt-4">
                <p className="font-serif text-sm font-semibold text-[#29231F]">Update Enquiry Status & Internal Notes</p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(['New', 'Contacted', 'In Discussion', 'Quoted', 'Confirmed', 'Completed', 'Closed'] as CorporateEnquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, st)}
                      className={`px-3 py-1 text-[11px] font-semibold transition-colors border ${
                        selectedEnquiry.status === st
                          ? 'bg-[#29231F] text-[#F7F3EC] border-[#29231F]'
                          : 'bg-[#F5F1EB] text-[#29231F]/70 border-[#29231F]/15 hover:text-[#29231F]'
                      }`}
                    >
                      Set to {st}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#29231F] mb-1">Internal Executive Notes</label>
                  <textarea
                    rows={3}
                    value={internalNoteInput}
                    onChange={(e) => setInternalNoteInput(e.target.value)}
                    placeholder="Add internal notes about quote amounts, discussion updates..."
                    className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
