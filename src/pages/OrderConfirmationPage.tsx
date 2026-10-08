import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  FileText,
  Sparkles,
  Truck,
  Printer,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function OrderConfirmationPage() {
  const { activeOrder, setCurrentPage, setActiveDashboardTab } = useShop();

  const handleContinueShopping = () => {
    setCurrentPage('shop');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/shop');
  };

  const handleViewOrders = () => {
    setActiveDashboardTab('orders');
    setCurrentPage('dashboard');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/customer/dashboard/orders');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!activeOrder) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#FAF7F2] text-[#30372F] px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-[#C5A059]/15 flex items-center justify-center mb-5 border border-[#C5A059]/30">
          <Package size={36} strokeWidth={1.2} className="text-[#C5A059]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#30372F] mb-3 text-center">
          No Recent Order Found
        </h1>
        <p className="text-sm font-sans text-[#30372F]/70 mb-8 text-center font-light max-w-md">
          It looks like you haven't placed an order during this session yet.
        </p>
        <button
          onClick={handleContinueShopping}
          className="px-8 py-4 bg-[#30372F] text-[#FAF7F2] text-xs font-sans tracking-[0.25em] uppercase font-medium hover:bg-[#C5A059] hover:text-[#30372F] transition-all shadow-md"
        >
          EXPLORE COLLECTIONS
        </button>
      </div>
    );
  }

  const formattedDate = new Date(activeOrder.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#30372F] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#C5A059] selection:text-[#30372F]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* SUCCESS HERO HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-[#C5A059]/40 p-8 sm:p-12 text-center shadow-[0_15px_40px_rgba(41,35,31,0.06)] rounded-sm relative overflow-hidden"
        >
          <div className="w-20 h-20 rounded-full bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center mx-auto mb-5 border border-[#C5A059]/40 shadow-inner">
            <CheckCircle2 size={44} strokeWidth={1.5} />
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] font-sans tracking-[0.3em] uppercase text-[#C5A059] font-bold mb-2">
            <Sparkles size={14} />
            <span>PAYMENT & DISPATCH CONFIRMED</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#30372F] font-normal tracking-wide mb-3">
            Order Placed Successfully 🎉
          </h1>
          <p className="text-sm font-sans text-[#30372F]/75 max-w-xl mx-auto font-light leading-relaxed mb-8">
            Thank you for shopping with Mahesh Raj Jewellers. Your order is registered in our vault ledger and being prepared for insured white-glove dispatch.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-sans bg-[#FAF7F2] px-6 py-3.5 border border-[#30372F]/15 rounded-xs shadow-xs">
            <div>
              <span className="text-[#30372F]/60">Order Reference: </span>
              <strong className="text-[#30372F] font-mono font-bold">{activeOrder.orderNumber}</strong>
            </div>
            <span className="text-[#30372F]/20">•</span>
            <div>
              <span className="text-[#30372F]/60">Date: </span>
              <span className="text-[#30372F] font-medium">{formattedDate}</span>
            </div>
            <span className="text-[#30372F]/20">•</span>
            <div>
              <span className="text-[#30372F]/60">Payment Status: </span>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-xs">
                {activeOrder.paymentStatus}
              </span>
            </div>
          </div>
        </motion.div>

        {/* TRACKING TIMELINE VISUALIZER */}
        <div className="bg-white border border-[#30372F]/15 p-6 sm:p-8 rounded-sm shadow-sm space-y-4">
          <h3 className="font-serif text-xl text-[#30372F] font-normal tracking-wide pb-3 border-b border-[#30372F]/10 flex items-center justify-between">
            <span>Fulfillment Timeline ({activeOrder.orderStatus})</span>
            <span className="text-xs font-sans text-[#C5A059] font-medium flex items-center gap-1">
              <Clock size={13} /> Est. Delivery: 3-5 Business Days
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {[
              { title: 'Order Confirmed', desc: 'Verified & Registered', statusKey: 'Confirmed', icon: CheckCircle2 },
              { title: 'Vault Processing', desc: 'Velvet Box & BIS Cert', statusKey: 'Processing', icon: Package },
              { title: 'Insured Transit', desc: 'White-Glove Courier', statusKey: 'Shipped', icon: Truck },
              { title: 'Delivered', desc: 'Signature Handover', statusKey: 'Delivered', icon: MapPin },
            ].map((step, idx) => {
              const Icon = step.icon;
              const statusRanks: Record<string, number> = {
                Pending: 0,
                Confirmed: 1,
                Processing: 2,
                Shipped: 3,
                Delivered: 4,
                Cancelled: -1,
              };
              const currentRank = statusRanks[activeOrder.orderStatus] ?? 1;
              const stepRank = statusRanks[step.statusKey] ?? 1;
              const isActive = activeOrder.orderStatus !== 'Cancelled' && stepRank <= currentRank;

              return (
                <div
                  key={idx}
                  className={`p-4 border rounded-xs text-center transition-all ${
                    isActive
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#30372F]'
                      : 'border-[#30372F]/10 bg-[#FAF7F2] opacity-60'
                  }`}
                >
                  <Icon size={20} className={`mx-auto mb-2 ${isActive ? 'text-[#C5A059]' : 'text-[#30372F]/40'}`} />
                  <p className="font-sans text-xs font-semibold">{step.title}</p>
                  <p className="text-[10px] font-sans text-[#30372F]/60 mt-0.5">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SHIPPING ADDRESS CARD */}
          <div className="bg-white border border-[#30372F]/15 p-6 rounded-sm shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-[#30372F]/10 pb-3">
              <MapPin size={18} className="text-[#C5A059]" />
              <h3 className="font-serif text-lg text-[#30372F] font-normal">
                Delivery Destination
              </h3>
            </div>
            <div className="text-xs font-sans text-[#30372F]/80 space-y-1">
              <p className="font-semibold text-[#30372F] text-sm">{activeOrder.customerName}</p>
              <p>{activeOrder.shippingAddress.street}</p>
              <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}</p>
              <p>{activeOrder.shippingAddress.country}</p>
              <p className="text-[#30372F]/60 pt-1">Phone: {activeOrder.customerPhone}</p>
              <p className="text-[#30372F]/60">Email: {activeOrder.customerEmail}</p>
            </div>
          </div>

          {/* PAYMENT & CERTIFICATE CARD */}
          <div className="bg-white border border-[#30372F]/15 p-6 rounded-sm shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-[#30372F]/10 pb-3">
              <CreditCard size={18} className="text-[#C5A059]" />
              <h3 className="font-serif text-lg text-[#30372F] font-normal">
                Payment & Authenticity
              </h3>
            </div>
            <div className="text-xs font-sans text-[#30372F]/80 space-y-2">
              <div>
                <span className="text-[#30372F]/60">Payment Method:</span>
                <p className="font-semibold text-[#30372F]">{activeOrder.paymentMethod}</p>
              </div>
              <div>
                <span className="text-[#30372F]/60">Authentication:</span>
                <p className="font-medium text-[#C5A059] flex items-center gap-1">
                  <ShieldCheck size={14} /> 100% BIS Hallmarked & Certified Genuine
                </p>
              </div>
              <div className="pt-2 border-t border-[#30372F]/10 text-[11px] text-[#30372F]/60 flex items-center justify-between">
                <span>Printable Receipt Available</span>
                <button
                  onClick={handlePrint}
                  className="text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
                >
                  <Printer size={12} /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PURCHASED ITEMS BREAKDOWN */}
        <div className="bg-white border border-[#30372F]/15 p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
          <h3 className="font-serif text-xl text-[#30372F] font-normal tracking-wide pb-4 border-b border-[#30372F]/15">
            Purchased Pearl Masterpieces
          </h3>

          <div className="space-y-4">
            {activeOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 pb-4 border-b border-[#30372F]/10 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover bg-[#FAF7F2] border border-[#30372F]/10 rounded-xs"
                  />
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-[#30372F]">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-sans text-[#C5A059] font-medium mt-0.5">
                      {item.product.descriptor}
                    </p>
                    <p className="text-xs font-sans text-[#30372F]/60 mt-0.5">
                      {item.selectedSize ? `Size: ${item.selectedSize} • ` : ''}Qty: {item.quantity} × ₹ {item.unitPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <span className="font-sans text-sm font-semibold text-[#30372F]">
                  ₹ {(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* FINANCIAL TOTALS */}
          <div className="pt-6 border-t border-[#30372F]/15 space-y-2.5 text-xs font-sans max-w-xs ml-auto">
            <div className="flex justify-between text-[#30372F]/80">
              <span>Subtotal</span>
              <span className="font-semibold text-[#30372F]">
                ₹ {activeOrder.subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-[#C5A059] font-semibold">
                <span>Discount</span>
                <span>- ₹ {activeOrder.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-[#30372F]/80">
              <span>Insured Transit</span>
              <span className="font-semibold text-[#30372F]">
                {activeOrder.shippingFee === 0 ? (
                  <span className="text-[#C5A059] font-bold">COMPLIMENTARY</span>
                ) : (
                  `₹ ${activeOrder.shippingFee.toLocaleString('en-IN')}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#30372F]/15 flex items-baseline justify-between text-sm">
              <span className="font-serif text-lg text-[#30372F]">Total Amount Paid</span>
              <span className="font-sans text-xl font-bold text-[#30372F]">
                ₹ {activeOrder.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* CTA ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleContinueShopping}
            className="w-full sm:w-auto px-9 py-4 bg-[#30372F] hover:bg-[#C5A059] hover:text-[#30372F] text-[#FAF7F2] text-xs font-sans tracking-[0.25em] uppercase font-semibold transition-all duration-300 shadow-md text-center rounded-xs"
          >
            CONTINUE SHOPPING
          </button>

          <button
            onClick={handleViewOrders}
            className="w-full sm:w-auto px-9 py-4 bg-white border border-[#30372F] text-[#30372F] hover:bg-[#30372F] hover:text-[#FAF7F2] text-xs font-sans tracking-[0.25em] uppercase font-semibold transition-all duration-300 text-center flex items-center justify-center gap-2 rounded-xs shadow-xs"
          >
            <span>VIEW MY ORDERS</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
