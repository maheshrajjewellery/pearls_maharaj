import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Star, Check, EyeOff, Trash2 } from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview, requestConfirmation } = useAdmin();

  const handleDelete = (id: string) => {
    requestConfirmation({
      title: 'Delete Customer Review',
      message: 'Are you sure you want to delete this customer review?',
      confirmText: 'Delete Review',
      isDanger: true,
      onConfirm: () => deleteReview(id),
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Product Reviews & Moderation ({reviews.length})
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Moderate submitted client reviews. Only approved reviews display publicly on product pages.
          </p>
        </div>
      </div>

      {/* REVIEWS TABLE */}
      <div className="bg-[#FFFDF8] border border-[#29231F]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#29231F]/10 text-[#29231F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                <th className="p-3">Customer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Title & Comment</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29231F]/5">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#F5F1EB]/40 transition-colors">
                  <td className="p-3">
                    <p className="font-semibold text-[#29231F]">{rev.customerName}</p>
                    <p className="text-[10px] text-[#29231F]/60">{rev.customerEmail}</p>
                  </td>
                  <td className="p-3 font-medium text-[#29231F]">{rev.productName}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-0.5 text-[#C8A96B]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-[#C8A96B]' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-[#29231F]">{rev.title}</p>
                    <p className="text-[#29231F]/70 text-[11px] line-clamp-2 mt-0.5">"{rev.comment}"</p>
                  </td>
                  <td className="p-3 text-[#29231F]/60">{rev.date.split('T')[0]}</td>
                  <td className="p-3">
                    {rev.status === 'Approved' ? (
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">Approved</span>
                    ) : rev.status === 'Hidden' ? (
                      <span className="px-2 py-0.5 text-[10px] bg-gray-200 text-gray-800 font-bold">Hidden</span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-900 font-bold">Pending</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {rev.status !== 'Approved' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'Approved')}
                          className="px-2.5 py-1 bg-emerald-800 text-white font-semibold text-[10px] uppercase tracking-wider hover:bg-emerald-900"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status === 'Approved' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'Hidden')}
                          className="px-2 py-1 bg-gray-200 text-gray-800 font-semibold text-[10px] uppercase tracking-wider hover:bg-gray-300"
                        >
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-[#29231F]/60 hover:text-red-700"
                        title="Delete review"
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
    </div>
  );
};
