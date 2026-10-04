import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Download, Mail } from 'lucide-react';

export const NewsletterView: React.FC = () => {
  const { newsletterSubscribers, exportNewsletterCSV } = useAdmin();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">
            Newsletter Subscribers ({newsletterSubscribers.length})
          </h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Manage inner circle email subscriptions for VIP launches and announcements
          </p>
        </div>

        <button
          onClick={exportNewsletterCSV}
          className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4" /> EXPORT TO CSV
        </button>
      </div>

      {/* SUBSCRIBERS TABLE */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                <th className="p-3">Subscriber Email</th>
                <th className="p-3">Date Subscribed</th>
                <th className="p-3">Subscription Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30372F]/5">
              {newsletterSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#F5F1EB]/40 transition-colors">
                  <td className="p-3 font-medium text-[#30372F] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#C5A15A]" /> {sub.email}
                  </td>
                  <td className="p-3 text-[#30372F]/70">{sub.dateJoined}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
