import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminOrder, OrderStatus } from '@/types/admin';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  X,
  MapPin,
  CreditCard,
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Status update note input
  const [statusNote, setStatusNote] = useState('');
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = activeFilter === 'All' || o.orderStatus === activeFilter;
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [orders, activeFilter, searchTerm]);

  const handleUpdateStatus = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus, statusNote);
      setSelectedOrder((prev) =>
        prev ? { ...prev, orderStatus: newStatus } : null
      );
      setStatusNote('');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-300">Pending</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-1 text-[10px] bg-blue-100 text-blue-900 font-bold border border-blue-300">Confirmed</span>;
      case 'Processing':
        return <span className="px-2.5 py-1 text-[10px] bg-purple-100 text-purple-900 font-bold border border-purple-300">Processing</span>;
      case 'Shipped':
        return <span className="px-2.5 py-1 text-[10px] bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">Shipped</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 text-[10px] bg-emerald-200 text-emerald-950 font-bold border border-emerald-400">Delivered</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 text-[10px] bg-red-100 text-red-900 font-bold border border-red-300">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] bg-gray-100 text-gray-800 font-bold">{status}</span>;
    }
  };

  const timelineSteps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Order Management ({filteredOrders.length})
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Process client orders, inspect payment status, update logistics timeline
          </p>
        </div>
      </div>

      {/* FILTER TABS & SEARCH TOOLBAR */}
      <div className="bg-[#F5F1EB] p-4 border border-[#29231F]/10 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
          {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 transition-colors border ${
                activeFilter === tab
                  ? 'bg-[#29231F] text-[#F7F3EC] border-[#29231F] font-semibold'
                  : 'bg-[#FFFDF8] text-[#29231F]/70 border-[#29231F]/15 hover:text-[#29231F]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#29231F]/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer name, email..."
            className="w-full bg-[#FFFDF8] border border-[#29231F]/15 pl-9 pr-3 py-2 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
          />
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-[#FFFDF8] border border-[#29231F]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#29231F]/10 text-[#29231F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Order Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29231F]/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#29231F]/50 italic">
                    No orders found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F5F1EB]/40 transition-colors">
                    <td className="p-3 font-semibold text-[#29231F]">{ord.orderNumber}</td>
                    <td className="p-3">
                      <p className="font-semibold text-[#29231F]">{ord.customerName}</p>
                      <p className="text-[10px] text-[#29231F]/60">{ord.customerEmail}</p>
                    </td>
                    <td className="p-3 text-[#29231F]/70">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-3 font-semibold text-[#29231F]">
                      ₹ {ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-medium text-[#29231F]/80">{ord.paymentStatus}</td>
                    <td className="p-3">{getStatusBadge(ord.orderStatus)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setNewStatus(ord.orderStatus);
                        }}
                        className="px-3 py-1 bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] font-semibold uppercase tracking-widest text-[10px] transition-colors"
                      >
                        VIEW DETAILS
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29231F]/40 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#29231F]/20 max-w-3xl w-full my-8 p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-[#29231F]/50 hover:text-[#29231F]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL HEADER */}
            <div className="pb-4 border-b border-[#29231F]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C8A96B] font-bold">
                  OFFICIAL ORDER RECORD
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#29231F] mt-0.5">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <div className="text-right">
                {getStatusBadge(selectedOrder.orderStatus)}
                <p className="text-[10px] text-[#29231F]/50 mt-1 font-mono">
                  Placed: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="flex-1 overflow-y-auto space-y-6 py-4 text-xs pr-1">
              {/* TIMELINE PROGRESS BAR */}
              <div className="bg-[#F5F1EB] p-4 border border-[#29231F]/10">
                <p className="font-serif text-sm font-semibold text-[#29231F] mb-3">Order Status Timeline</p>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#29231F]/15 -translate-y-1/2 z-0" />
                  {timelineSteps.map((step, idx) => {
                    const currentIdx = timelineSteps.indexOf(selectedOrder.orderStatus);
                    const isCompleted = idx <= currentIdx;

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                            isCompleted
                              ? 'bg-[#29231F] text-[#F7F3EC] border-[#29231F]'
                              : 'bg-[#FFFDF8] text-[#29231F]/40 border-[#29231F]/20'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold mt-1 ${
                            isCompleted ? 'text-[#29231F]' : 'text-[#29231F]/40'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GRID: CUSTOMER & ADDRESS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F5F1EB] p-4 border border-[#29231F]/10">
                  <p className="font-semibold text-[#29231F] mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#C8A96B]" /> Customer Information
                  </p>
                  <p className="font-medium text-[#29231F]">{selectedOrder.customerName}</p>
                  <p className="text-[#29231F]/70">{selectedOrder.customerEmail}</p>
                  <p className="text-[#29231F]/70">{selectedOrder.customerPhone}</p>
                  <p className="text-[11px] text-[#C8A96B] font-semibold mt-2">
                    Payment Method: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                  </p>
                </div>

                <div className="bg-[#F5F1EB] p-4 border border-[#29231F]/10">
                  <p className="font-semibold text-[#29231F] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C8A96B]" /> Delivery Shipping Address
                  </p>
                  <p className="text-[#29231F]/90 leading-relaxed">
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* PRODUCTS ORDERED TABLE */}
              <div>
                <p className="font-serif text-base font-semibold text-[#29231F] mb-2">Order Items</p>
                <div className="border border-[#29231F]/15 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5F1EB] border-b border-[#29231F]/10 text-[#29231F]/60 uppercase tracking-widest text-[10px]">
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5">Size / Option</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#29231F]/5">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2.5 flex items-center gap-2">
                            <img src={item.product.image} alt={item.product.name} className="w-8 h-8 object-cover border border-[#29231F]/10" />
                            <span className="font-medium text-[#29231F]">{item.product.name}</span>
                          </td>
                          <td className="p-2.5 text-[#29231F]/70">{item.selectedSize || 'Standard'}</td>
                          <td className="p-2.5 text-center font-semibold">{item.quantity}</td>
                          <td className="p-2.5 text-right font-medium">₹ {item.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="p-2.5 text-right font-semibold text-[#29231F]">
                            ₹ {(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TOTAL BREAKDOWN */}
                <div className="bg-[#F5F1EB] p-4 mt-3 border border-[#29231F]/10 space-y-1.5 max-w-xs ml-auto text-xs">
                  <div className="flex justify-between text-[#29231F]/70">
                    <span>Subtotal:</span>
                    <span>₹ {selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#29231F]/70">
                    <span>Shipping Fee:</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'Complimentary' : `₹ ${selectedOrder.shippingFee.toLocaleString('en-IN')}`}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount:</span>
                      <span>- ₹ {selectedOrder.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-serif text-sm font-bold text-[#29231F] pt-2 border-t border-[#29231F]/10">
                    <span>Grand Total:</span>
                    <span className="text-[#C8A96B]">₹ {selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* ADMIN UPDATE ORDER STATUS CONTROL */}
              <div className="bg-[#FFFDF8] border border-[#29231F]/15 p-4 space-y-3">
                <p className="font-serif text-sm font-semibold text-[#29231F]">Update Order Status</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#29231F] mb-1">Set New Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#29231F] mb-1">Status Note / Tracking AWB</label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Shipped via BlueDart AWB #BD99283"
                      className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={handleUpdateStatus}
                    className="px-5 py-2 bg-[#29231F] text-[#F7F3EC] uppercase tracking-widest text-xs font-semibold hover:bg-[#C8A96B] hover:text-[#29231F] transition-colors"
                  >
                    UPDATE STATUS NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
