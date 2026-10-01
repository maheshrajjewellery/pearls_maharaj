import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminCustomer } from '@/types/admin';
import { Search, UserCheck, ShieldCheck, Heart, MapPin, ShoppingBag, X } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, orders } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  // Orders placed by selected customer
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter((o) => o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase());
  }, [selectedCustomer, orders]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Customer Directory ({filteredCustomers.length})
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Client profiles, lifetime order history, saved addresses, and VIP tier tracking
          </p>
        </div>
      </div>

      {/* SEARCH TOOLBAR */}
      <div className="bg-[#F5F1EB] p-4 border border-[#29231F]/10">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#29231F]/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, or phone number..."
            className="w-full bg-[#FFFDF8] border border-[#29231F]/15 pl-9 pr-3 py-2 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
          />
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-[#FFFDF8] border border-[#29231F]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#29231F]/10 text-[#29231F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                <th className="p-3">Client Name</th>
                <th className="p-3">Email & Phone</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Total Spent</th>
                <th className="p-3">Tier Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29231F]/5">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#F5F1EB]/40 transition-colors">
                  <td className="p-3">
                    <p className="font-semibold text-[#29231F] flex items-center gap-1.5">
                      {cust.name}
                      {cust.status === 'VIP' && (
                        <span title="VIP Client">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96B]" />
                        </span>
                      )}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-[#29231F]/90 font-medium">{cust.email}</p>
                    <p className="text-[10px] text-[#29231F]/60">{cust.phone}</p>
                  </td>
                  <td className="p-3 text-[#29231F]/70">{cust.joinedDate}</td>
                  <td className="p-3 font-semibold text-[#29231F]">{cust.totalOrders} Orders</td>
                  <td className="p-3 font-semibold text-[#C8A96B]">
                    ₹ {cust.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    {cust.status === 'VIP' ? (
                      <span className="px-2 py-0.5 text-[10px] bg-[#C8A96B]/20 text-[#29231F] font-bold border border-[#C8A96B]/40 uppercase tracking-wider">
                        VIP Tier
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1 bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] font-semibold uppercase tracking-widest text-[10px] transition-colors"
                    >
                      VIEW PROFILE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE MODAL / DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29231F]/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#29231F]/20 max-w-2xl w-full my-8 p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-[#29231F]/50 hover:text-[#29231F]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className="pb-4 border-b border-[#29231F]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C8A96B] font-bold">
                  CLIENT PROFILE & DOSSIER
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#29231F] mt-0.5">
                  {selectedCustomer.name}
                </h3>
              </div>
              <div>
                <span className="px-3 py-1 bg-[#29231F] text-[#F7F3EC] text-xs font-semibold uppercase tracking-widest">
                  {selectedCustomer.status} Client
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto space-y-6 py-4 text-xs pr-1">
              {/* KEY STATS */}
              <div className="grid grid-cols-3 gap-3 bg-[#F5F1EB] p-4 border border-[#29231F]/10 text-center">
                <div>
                  <p className="text-[10px] text-[#29231F]/60 uppercase font-medium">Total Orders</p>
                  <p className="font-serif text-xl font-bold text-[#29231F]">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="border-l border-[#29231F]/10">
                  <p className="text-[10px] text-[#29231F]/60 uppercase font-medium">Lifetime Spent</p>
                  <p className="font-serif text-xl font-bold text-[#C8A96B]">₹ {selectedCustomer.totalSpent.toLocaleString('en-IN')}</p>
                </div>
                <div className="border-l border-[#29231F]/10">
                  <p className="text-[10px] text-[#29231F]/60 uppercase font-medium">Wishlist Saved</p>
                  <p className="font-serif text-xl font-bold text-[#29231F] flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-red-600 fill-red-600" /> {selectedCustomer.wishlistCount}
                  </p>
                </div>
              </div>

              {/* CONTACT & SAVED ADDRESSES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FFFDF8] border border-[#29231F]/15 p-4">
                  <p className="font-semibold text-[#29231F] mb-2">Contact Details</p>
                  <p className="text-[#29231F]/80">Email: {selectedCustomer.email}</p>
                  <p className="text-[#29231F]/80">Phone: {selectedCustomer.phone}</p>
                  <p className="text-[#29231F]/60 mt-1">Client since: {selectedCustomer.joinedDate}</p>
                </div>

                <div className="bg-[#FFFDF8] border border-[#29231F]/15 p-4">
                  <p className="font-semibold text-[#29231F] mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C8A96B]" /> Saved Delivery Addresses
                  </p>
                  {selectedCustomer.addresses.map((addr, idx) => (
                    <div key={idx} className="text-[#29231F]/80 leading-relaxed">
                      <span className="font-bold text-[11px] text-[#29231F]">{addr.label}: </span>
                      {addr.address}
                    </div>
                  ))}
                </div>
              </div>

              {/* ORDER HISTORY FOR THIS CUSTOMER */}
              <div>
                <p className="font-serif text-base font-semibold text-[#29231F] mb-2">Order History</p>
                {customerOrders.length === 0 ? (
                  <p className="text-[#29231F]/50 italic">No recent order records found.</p>
                ) : (
                  <div className="border border-[#29231F]/15 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#F5F1EB] border-b border-[#29231F]/10 text-[#29231F]/60 uppercase text-[10px]">
                          <th className="p-2">Order ID</th>
                          <th className="p-2">Date</th>
                          <th className="p-2">Total</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#29231F]/5">
                        {customerOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="p-2 font-semibold">{ord.orderNumber}</td>
                            <td className="p-2 text-[#29231F]/70">{ord.createdAt.split('T')[0]}</td>
                            <td className="p-2 font-bold text-[#C8A96B]">₹ {ord.totalAmount.toLocaleString('en-IN')}</td>
                            <td className="p-2 font-medium">{ord.orderStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
