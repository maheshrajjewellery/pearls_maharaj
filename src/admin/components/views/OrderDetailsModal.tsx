import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminOrder, OrderStatus } from '@/types/admin';
import {
  X,
  CreditCard,
  MapPin,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: AdminOrder;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onStatusUpdated,
}) => {
  const { updateOrderStatus, cancelOrder, refundOrder, addToast } = useAdmin();

  // Status Update State
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.orderStatus);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Cancellation & Refund Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  const timelineSteps: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
  ];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200">
            Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-purple-50 text-purple-800 font-semibold border border-purple-200">
            Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-800 font-semibold border border-blue-200">
            Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-950 font-bold border border-emerald-300">
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-red-50 text-red-800 font-semibold border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] bg-gray-50 text-gray-800 font-semibold border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (payStatus: string) => {
    switch (payStatus) {
      case 'Paid':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            Pending
          </span>
        );
      case 'Refunded':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-purple-50 text-purple-800 font-semibold border border-purple-200">
            Refunded
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-red-50 text-red-800 font-semibold border border-red-200">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] bg-gray-50 text-gray-800 font-semibold border border-gray-200">
            {payStatus}
          </span>
        );
    }
  };

  const handleUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      const success = await updateOrderStatus(order.id, newStatus, statusNote);
      if (success) {
        setStatusNote('');
        if (onStatusUpdated) onStatusUpdated();
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      const success = await cancelOrder(order.id, cancelReason);
      if (success) {
        setShowCancelModal(false);
        setCancelReason('');
        if (onStatusUpdated) onStatusUpdated();
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handleConfirmRefund = async () => {
    setIsRefunding(true);
    try {
      const success = await refundOrder(order.id, refundReason);
      if (success) {
        setShowRefundModal(false);
        setRefundReason('');
        if (onStatusUpdated) onStatusUpdated();
      }
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#30372F]/50 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FFFDF8] border border-[#30372F]/20 max-w-4xl w-full my-8 p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#30372F]/50 hover:text-[#30372F] p-1 border border-transparent hover:border-[#30372F]/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="pb-4 border-b border-[#30372F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A15A] font-bold">
                IMMUTABLE ORDER RECORD
              </span>
              {getStatusBadge(order.orderStatus)}
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#30372F] mt-1 font-mono">
              #{order.orderNumber}
            </h3>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold text-[#30372F]">
              Total: ₹ {order.totalAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-[#30372F]/60 font-mono mt-0.5">
              Placed: {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto space-y-6 py-4 text-xs pr-1">
          {/* ORDER STATUS TIMELINE BAR */}
          <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10">
            <p className="font-serif text-sm font-semibold text-[#30372F] mb-3">Order Status Progression</p>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-3 left-0 right-0 h-0.5 bg-[#30372F]/15 -translate-y-1/2 z-0" />
              {timelineSteps.map((step, idx) => {
                const currentIdx = timelineSteps.indexOf(order.orderStatus);
                const isCompleted = order.orderStatus === 'Cancelled' ? false : idx <= currentIdx;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                        isCompleted
                          ? 'bg-[#30372F] text-[#F7F3EC] border-[#30372F]'
                          : order.orderStatus === 'Cancelled' && step === 'Pending'
                          ? 'bg-red-700 text-white border-red-700'
                          : 'bg-[#FFFDF8] text-[#30372F]/40 border-[#30372F]/20'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold mt-1 ${
                        isCompleted ? 'text-[#30372F]' : 'text-[#30372F]/40'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* TIMELINE HISTORY AUDIT TRAIL */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#30372F]/10 space-y-1.5 text-[11px]">
                <p className="font-semibold text-[#30372F]/80">Status Audit Trail:</p>
                {order.timeline.map((item, tIdx) => (
                  <div key={tIdx} className="flex flex-col sm:flex-row sm:items-center justify-between text-[#30372F]/70 bg-[#FFFDF8] p-2 border border-[#30372F]/5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#30372F]">{item.status}</span>
                      {item.note && <span>• {item.note}</span>}
                    </div>
                    <span className="text-[10px] font-mono text-[#30372F]/50">
                      {new Date(item.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GRID: CUSTOMER INFO, SHIPPING INFO & PAYMENT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CUSTOMER INFO */}
            <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10 space-y-1">
              <p className="font-semibold text-[#30372F] mb-2 flex items-center gap-1.5 border-b border-[#30372F]/10 pb-1">
                <CreditCard className="w-4 h-4 text-[#C5A15A]" /> Customer Information
              </p>
              <p className="font-semibold text-[#30372F]">{order.customerName}</p>
              <p className="text-[#30372F]/80">{order.customerEmail}</p>
              <p className="text-[#30372F]/80">{order.customerPhone}</p>
              <p className="text-[10px] text-[#30372F]/50 font-mono pt-1">
                ID: {order.id}
              </p>
            </div>

            {/* SHIPPING INFO */}
            <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10 space-y-1">
              <p className="font-semibold text-[#30372F] mb-2 flex items-center gap-1.5 border-b border-[#30372F]/10 pb-1">
                <MapPin className="w-4 h-4 text-[#C5A15A]" /> Shipping Information
              </p>
              <p className="font-semibold text-[#30372F]">{order.customerName}</p>
              <p className="text-[#30372F]/80 leading-relaxed">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                {order.shippingAddress.country}
              </p>
            </div>

            {/* PAYMENT INFO */}
            <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10 space-y-1">
              <p className="font-semibold text-[#30372F] mb-2 flex items-center gap-1.5 border-b border-[#30372F]/10 pb-1">
                <DollarSign className="w-4 h-4 text-[#C5A15A]" /> Payment Details
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[#30372F]/70">Status:</span>
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
              <p className="text-[#30372F]/80">Method: {order.paymentMethod}</p>
              {order.razorpayPaymentId && (
                <p className="text-[10px] font-mono text-[#30372F]/60">
                  Razorpay Payment ID: {order.razorpayPaymentId}
                </p>
              )}
              {order.razorpayOrderId && (
                <p className="text-[10px] font-mono text-[#30372F]/60">
                  Razorpay Order ID: {order.razorpayOrderId}
                </p>
              )}
            </div>
          </div>

          {/* PRODUCTS ORDERED TABLE */}
          <div>
            <p className="font-serif text-base font-semibold text-[#30372F] mb-2">Purchased Products Snapshot</p>
            <div className="border border-[#30372F]/15 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F1EB] border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px]">
                    <th className="p-2.5">Product</th>
                    <th className="p-2.5">Variant / Size</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Final Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30372F]/5">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="p-2.5 flex items-center gap-3">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-9 h-9 object-cover border border-[#30372F]/10"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-[#30372F]">{item.product?.name || 'Maharaj Jewellery Item'}</p>
                            <p className="text-[10px] text-[#30372F]/50 font-mono">
                              ID/SKU: {item.product?.id?.slice(0, 8) || 'MJ-ITEM'}
                            </p>
                          </div>
                        </td>
                        <td className="p-2.5 text-[#30372F]/70">{item.selectedSize || 'Standard'}</td>
                        <td className="p-2.5 text-center font-semibold">{item.quantity}</td>
                        <td className="p-2.5 text-right font-medium">₹ {item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-semibold text-[#30372F]">
                          ₹ {(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-[#30372F]/50 italic">
                        Order snapshot details recorded at checkout.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* FINANCIAL BREAKDOWN */}
            <div className="bg-[#F5F1EB] p-4 mt-3 border border-[#30372F]/10 space-y-1.5 max-w-xs ml-auto text-xs">
              <div className="flex justify-between text-[#30372F]/70">
                <span>Subtotal:</span>
                <span>₹ {order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#30372F]/70">
                <span>Shipping Fee:</span>
                <span>
                  {order.shippingFee === 0
                    ? 'Complimentary'
                    : `₹ ${order.shippingFee.toLocaleString('en-IN')}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Discount Applied:</span>
                  <span>- ₹ {order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-serif text-sm font-bold text-[#30372F] pt-2 border-t border-[#30372F]/10">
                <span>Grand Total:</span>
                <span className="text-[#C5A15A]">₹ {order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* ADMIN ACTIONS SECTION (UPDATE STATUS, CANCEL, REFUND) */}
          <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#30372F]/10 pb-2">
              <h4 className="font-serif text-base font-semibold text-[#30372F]">Admin Order Actions</h4>
              <span className="text-[10px] text-[#30372F]/60">Updates save directly to Database</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* STATUS UPDATE CONTROLS */}
              <div>
                <label className="block text-[11px] font-medium text-[#30372F] mb-1">Update Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  disabled={order.orderStatus === 'Delivered'}
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A] disabled:opacity-50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* STATUS NOTE / AWB TRACKING */}
              <div>
                <label className="block text-[11px] font-medium text-[#30372F] mb-1">Fulfillment Note / Tracking AWB</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Shipped via BlueDart AWB #BD992831"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#30372F]/10">
              <div className="flex items-center gap-2">
                {/* CANCEL ORDER ACTION */}
                {order.orderStatus !== 'Cancelled' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 bg-red-50 text-red-800 hover:bg-red-800 hover:text-white border border-red-300 uppercase tracking-widest text-[11px] font-semibold transition-colors"
                  >
                    Cancel Order
                  </button>
                )}

                {/* REFUND ORDER ACTION */}
                {order.paymentStatus === 'Paid' && (
                  <button
                    onClick={() => setShowRefundModal(true)}
                    className="px-4 py-2 bg-purple-50 text-purple-800 hover:bg-purple-800 hover:text-white border border-purple-300 uppercase tracking-widest text-[11px] font-semibold transition-colors"
                  >
                    Refund Payment
                  </button>
                )}
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus || order.orderStatus === 'Delivered'}
                className="px-6 py-2 bg-[#30372F] text-[#F7F3EC] uppercase tracking-widest text-xs font-semibold hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isUpdatingStatus ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                Save Status Change
              </button>
            </div>
          </div>
        </div>

        {/* CANCEL ORDER CONFIRMATION MODAL */}
        {showCancelModal && (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-[#30372F]/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-[#FFFDF8] border border-red-300 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="font-serif text-lg font-bold text-[#30372F]">Confirm Order Cancellation</h3>
              </div>

              <p className="text-xs text-[#30372F]/80 leading-relaxed">
                Are you sure you want to cancel order <span className="font-bold text-[#30372F]">#{order.orderNumber}</span> for customer <span className="font-bold text-[#30372F]">{order.customerName}</span> (₹ {order.totalAmount.toLocaleString('en-IN')})?
              </p>

              <div className="bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold">Inventory & Business Rules:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Order status will be set to Cancelled in the database.</li>
                  <li>Product stock inventory will be restored to prevent duplicate deduction.</li>
                </ul>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#30372F] mb-1">Cancellation Reason (Optional)</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Customer requested cancellation / Stock unavailable"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-gray-100 text-[#30372F] font-semibold text-xs uppercase tracking-wider hover:bg-gray-200"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-5 py-2 bg-red-800 text-white font-semibold text-xs uppercase tracking-wider hover:bg-red-900 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isCancelling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REFUND PAYMENT CONFIRMATION MODAL */}
        {showRefundModal && (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-[#30372F]/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-[#FFFDF8] border border-purple-300 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-purple-900">
                <RotateCcw className="w-6 h-6 text-purple-700" />
                <h3 className="font-serif text-lg font-bold text-[#30372F]">Confirm Payment Refund</h3>
              </div>

              <p className="text-xs text-[#30372F]/80 leading-relaxed">
                Are you sure you want to process a refund for order <span className="font-bold text-[#30372F]">#{order.orderNumber}</span>?
              </p>

              <div className="bg-purple-50 border border-purple-200 p-3 text-xs text-purple-950 space-y-1 font-mono">
                <p>Customer: {order.customerName}</p>
                <p>Refund Amount: ₹ {order.totalAmount.toLocaleString('en-IN')}</p>
                <p>Payment Method: {order.paymentMethod}</p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#30372F] mb-1">Refund Reason / Audit Reference</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Order cancelled upon customer request"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 bg-gray-100 text-[#30372F] font-semibold text-xs uppercase tracking-wider hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmRefund}
                  disabled={isRefunding}
                  className="px-5 py-2 bg-purple-800 text-white font-semibold text-xs uppercase tracking-wider hover:bg-purple-900 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isRefunding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  Execute Refund
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
