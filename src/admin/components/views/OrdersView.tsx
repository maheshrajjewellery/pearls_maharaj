import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminOrder, OrderStatus, PaymentStatus } from '@/types/admin';
import {
  fetchOrdersFromDb,
  isValidStatusTransition,
} from '@/services/orderService';
import { OrderDetailsModal } from './OrderDetailsModal';
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
  Download,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShoppingBag,
  DollarSign,
  Calendar,
  Layers,
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const {
    orders: globalOrders,
    updateOrderStatus,
    cancelOrder,
    refundOrder,
    refreshOrders,
    isAuthenticated,
    addToast,
  } = useAdmin();

  // State management for database loading, errors & pagination
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Sorting & Pagination State
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'highest_amount' | 'lowest_amount' | 'customer_name' | 'status'
  >('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Status Update Controls in Modal
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Modals for Confirmation
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  // Local state for fetched DB query result
  const [dbOrders, setDbOrders] = useState<AdminOrder[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
  });

  // Fetch real orders from database service with filters & pagination
  const loadDatabaseOrders = async () => {
    setIsLoadingOrders(true);
    setDbError(null);
    try {
      const res = await fetchOrdersFromDb({
        orderStatus: statusFilter,
        paymentStatus: paymentStatusFilter,
        paymentMethod: paymentMethodFilter,
        dateFilter,
        startDate: dateFilter === 'Custom' ? startDate : undefined,
        endDate: dateFilter === 'Custom' ? endDate : undefined,
        searchTerm,
        sortBy,
        page: currentPage,
        pageSize,
      });

      setDbOrders(res.orders);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
      setDashboardStats(res.dashboardStats);
    } catch (err: any) {
      console.error('Error in loadDatabaseOrders:', err);
      setDbError(err.message || 'Unable to load orders from database. Please try again.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Reload when filters, search, pagination, or global context orders change
  useEffect(() => {
    loadDatabaseOrders();
  }, [
    statusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    dateFilter,
    startDate,
    endDate,
    searchTerm,
    sortBy,
    currentPage,
    pageSize,
    globalOrders,
  ]);

  // Reset pagination to page 1 when search or filters change
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleClearSearchAndFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPaymentStatusFilter('All');
    setPaymentMethodFilter('All');
    setDateFilter('All');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Export filtered orders as CSV
  const handleExportCSV = () => {
    if (dbOrders.length === 0) {
      addToast('No order records available to export.', 'warning');
      return;
    }

    const headers = [
      'Order ID',
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Order Date',
      'Items Count',
      'Subtotal (INR)',
      'Shipping Fee (INR)',
      'Discount (INR)',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
    ];

    const rows = dbOrders.map((o) => [
      `"${o.id}"`,
      `"${o.orderNumber}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerEmail}"`,
      `"${o.customerPhone}"`,
      `"${new Date(o.createdAt).toLocaleString('en-IN')}"`,
      o.items ? o.items.length : 0,
      o.subtotal,
      o.shippingFee,
      o.discount,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      `"${o.orderStatus}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Maharaj_Orders_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Exported ${dbOrders.length} order records to CSV.`, 'success');
  };

  // Status Badge Component
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-1 text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-xs uppercase tracking-wider inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" /> Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 text-[10px] bg-blue-100 text-blue-900 font-bold border border-blue-300 rounded-xs uppercase tracking-wider inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-700" /> Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2.5 py-1 text-[10px] bg-purple-100 text-purple-900 font-bold border border-purple-300 rounded-xs uppercase tracking-wider inline-flex items-center gap-1">
            <PackageCheck className="w-3 h-3 text-purple-700" /> Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="px-2.5 py-1 text-[10px] bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 rounded-xs uppercase tracking-wider inline-flex items-center gap-1">
            <Truck className="w-3 h-3 text-emerald-700" /> Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="px-2.5 py-1 text-[10px] bg-emerald-200 text-emerald-950 font-bold border border-emerald-400 rounded-xs uppercase tracking-wider inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-800" /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 text-[10px] bg-red-100 text-red-900 font-bold border border-red-300 rounded-xs uppercase tracking-wider inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-700" /> Cancelled
          </span>
        );
      default:
        return <span className="px-2.5 py-1 text-[10px] bg-gray-100 text-gray-800 font-bold rounded-xs">{status}</span>;
    }
  };

  // Payment Status Badge Component
  const getPaymentStatusBadge = (pStatus: PaymentStatus) => {
    switch (pStatus) {
      case 'Paid':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 rounded-xs">
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-800 font-semibold border border-amber-200 rounded-xs">
            Payment Pending
          </span>
        );
      case 'Refunded':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-purple-50 text-purple-800 font-semibold border border-purple-200 rounded-xs">
            Refunded
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-red-50 text-red-800 font-semibold border border-red-200 rounded-xs">
            Failed
          </span>
        );
      default:
        return <span className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-800 font-semibold">{pStatus}</span>;
    }
  };

  // Handle Order Status Update
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    // Check transition rules
    const check = isValidStatusTransition(selectedOrder.orderStatus, newStatus);
    if (!check.allowed) {
      addToast(check.reason || 'Invalid status transition.', 'error');
      return;
    }

    setIsUpdatingStatus(true);
    const success = await updateOrderStatus(selectedOrder.id, newStatus, statusNote);
    setIsUpdatingStatus(false);

    if (success) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: newStatus,
              timeline: [
                ...prev.timeline,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  note: statusNote || `Status updated to ${newStatus}`,
                },
              ],
            }
          : null
      );
      setStatusNote('');
      loadDatabaseOrders();
    }
  };

  // Handle Cancel Order Confirmation
  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;
    setIsCancelling(true);
    const success = await cancelOrder(selectedOrder.id, cancelReason);
    setIsCancelling(false);

    if (success) {
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: 'Cancelled' } : null));
      loadDatabaseOrders();
    }
  };

  // Handle Refund Payment Confirmation
  const handleConfirmRefund = async () => {
    if (!selectedOrder) return;
    setIsRefunding(true);
    const success = await refundOrder(selectedOrder.id, refundReason);
    setIsRefunding(false);

    if (success) {
      setShowRefundModal(false);
      setRefundReason('');
      setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: 'Refunded' } : null));
      loadDatabaseOrders();
    }
  };

  const timelineSteps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  // Admin Access Guard
  if (!isAuthenticated) {
    return (
      <div className="bg-[#FFFDF8] p-8 border border-red-200 text-center max-w-lg mx-auto my-12 shadow-md">
        <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h3 className="font-serif text-xl font-bold text-[#30372F] mb-1">Access Restricted</h3>
        <p className="text-xs text-[#30372F]/70 mb-4">
          You must be an authorized admin user to view or manage backend customer orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. HEADER & REAL-TIME REFRESH BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A15A] font-bold">
            ADMINISTRATION PANEL
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#30372F]">Orders</h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Production Database Order Management • Live Order Tracking • Status Fulfillment & Refunds
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDatabaseOrders}
            disabled={isLoadingOrders}
            className="px-3.5 py-2 bg-[#F5F1EB] text-[#30372F] hover:bg-[#30372F] hover:text-[#F7F3EC] border border-[#30372F]/15 font-semibold uppercase tracking-wider text-[11px] transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
            Sync DB Data
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] font-semibold uppercase tracking-wider text-[11px] transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export Orders
          </button>
        </div>
      </div>

      {/* 2. DASHBOARD STATS CARDS (DYNAMIC DB COMPUTED) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-3.5 shadow-2xs">
          <p className="text-[10px] uppercase tracking-wider text-[#30372F]/60 font-medium">Total Orders</p>
          <p className="font-serif text-xl font-bold text-[#30372F] mt-1">{dashboardStats.totalOrders}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-amber-200 p-3.5 shadow-2xs">
          <p className="text-[10px] uppercase tracking-wider text-amber-800 font-medium">Pending</p>
          <p className="font-serif text-xl font-bold text-amber-900 mt-1">{dashboardStats.pendingOrders}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-purple-200 p-3.5 shadow-2xs">
          <p className="text-[10px] uppercase tracking-wider text-purple-800 font-medium">Processing</p>
          <p className="font-serif text-xl font-bold text-purple-900 mt-1">{dashboardStats.processingOrders}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-blue-200 p-3.5 shadow-2xs">
          <p className="text-[10px] uppercase tracking-wider text-blue-800 font-medium">Shipped</p>
          <p className="font-serif text-xl font-bold text-blue-900 mt-1">{dashboardStats.shippedOrders}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-emerald-200 p-3.5 shadow-2xs">
          <p className="text-[10px] uppercase tracking-wider text-emerald-800 font-medium">Delivered</p>
          <p className="font-serif text-xl font-bold text-emerald-950 mt-1">{dashboardStats.deliveredOrders}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-red-200 p-3.5 shadow-2xs">
          <p className="text-[10px] uppercase tracking-wider text-red-800 font-medium">Cancelled</p>
          <p className="font-serif text-xl font-bold text-red-900 mt-1">{dashboardStats.cancelledOrders}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#C5A15A]/40 p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-[10px] uppercase tracking-wider text-[#C5A15A] font-bold">Total Revenue</p>
          <p className="font-serif text-lg font-bold text-[#30372F] mt-1">
            ₹ {dashboardStats.totalRevenue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10 space-y-4">
        {/* ORDER STATUS TABS */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
          <span className="text-[11px] text-[#30372F]/50 mr-1 font-serif font-bold">Status:</span>
          {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleStatusFilterChange(tab)}
              className={`px-3 py-1.5 transition-colors border text-[11px] ${
                statusFilter === tab
                  ? 'bg-[#30372F] text-[#F7F3EC] border-[#30372F] font-semibold shadow-2xs'
                  : 'bg-[#FFFDF8] text-[#30372F]/70 border-[#30372F]/15 hover:text-[#30372F]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH & DETAILED FILTERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* SEARCH BOX WITH CLEAR BUTTON */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#30372F]/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search orders..."
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 pl-9 pr-8 py-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-2.5 text-[#30372F]/40 hover:text-[#30372F]"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* PAYMENT STATUS FILTER */}
          <div>
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Payment Status: All</option>
              <option value="Paid">Payment Status: Paid</option>
              <option value="Pending">Payment Status: Pending</option>
              <option value="Failed">Payment Status: Failed</option>
              <option value="Refunded">Payment Status: Refunded</option>
            </select>
          </div>

          {/* PAYMENT METHOD FILTER */}
          <div>
            <select
              value={paymentMethodFilter}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Payment Method: All</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Cash on Delivery">Cash on Delivery (COD)</option>
              <option value="Direct Order Confirmation">Direct Order Confirmation</option>
              <option value="Bank Transfer (NEFT)">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {/* DATE RANGE FILTER */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Date: All Time</option>
              <option value="Today">Date: Today</option>
              <option value="Yesterday">Date: Yesterday</option>
              <option value="Last 7 days">Date: Last 7 Days</option>
              <option value="Last 30 days">Date: Last 30 Days</option>
              <option value="Custom">Date: Custom Range</option>
            </select>
          </div>
        </div>

        {/* CUSTOM DATE RANGE PICKER (WHEN CUSTOM IS SELECTED) */}
        {dateFilter === 'Custom' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#30372F]/10 text-xs">
            <span className="font-semibold text-[#30372F]">Custom Range:</span>
            <div className="flex items-center gap-2">
              <label className="text-[#30372F]/70">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#FFFDF8] border border-[#30372F]/15 p-1.5 text-xs text-[#30372F]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[#30372F]/70">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#FFFDF8] border border-[#30372F]/15 p-1.5 text-xs text-[#30372F]"
              />
            </div>
          </div>
        )}

        {/* SORTING & TOOLBAR ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#30372F]/10">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#30372F]/60 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FFFDF8] border border-[#30372F]/15 px-2.5 py-1 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_amount">Highest Amount</option>
              <option value="lowest_amount">Lowest Amount</option>
              <option value="customer_name">Customer Name (A-Z)</option>
              <option value="status">Order Status</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {(searchTerm || statusFilter !== 'All' || paymentStatusFilter !== 'All' || paymentMethodFilter !== 'All' || dateFilter !== 'All') && (
              <button
                onClick={handleClearSearchAndFilters}
                className="text-xs text-red-700 hover:text-red-900 font-semibold underline underline-offset-2 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <span className="text-[#30372F]/60">Page Size:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#FFFDF8] border border-[#30372F]/15 px-2 py-1 text-xs text-[#30372F]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ORDERS TABLE & STATES */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden">
        {/* LOADING STATE */}
        {isLoadingOrders ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#C5A15A] animate-spin mx-auto" />
            <p className="font-serif text-base font-semibold text-[#30372F]">Loading orders...</p>
            <p className="text-xs text-[#30372F]/60">Retrieving real-time order records from backend database...</p>
          </div>
        ) : dbError ? (
          /* ERROR STATE */
          <div className="p-12 text-center space-y-3 bg-red-50/50">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-red-900">Unable to load orders. Please try again.</h3>
            <p className="text-xs text-red-700 max-w-md mx-auto">{dbError}</p>
            <button
              onClick={loadDatabaseOrders}
              className="mt-2 px-5 py-2 bg-red-800 text-white font-semibold text-xs uppercase tracking-wider hover:bg-red-900 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : dbOrders.length === 0 ? (
          /* EMPTY STATE */
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-[#30372F]/30 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#30372F]">No orders found</h3>
            <p className="text-xs text-[#30372F]/60 max-w-md mx-auto">
              No order records matched your selected search query or active filters.
            </p>
            <button
              onClick={handleClearSearchAndFilters}
              className="mt-2 px-4 py-2 bg-[#30372F] text-[#F7F3EC] font-semibold text-xs uppercase tracking-wider hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          /* REAL ORDERS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Email / Contact</th>
                  <th className="p-3.5">Order Date</th>
                  <th className="p-3.5 text-center">Items</th>
                  <th className="p-3.5 text-right">Total Amount</th>
                  <th className="p-3.5">Payment Status</th>
                  <th className="p-3.5">Order Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30372F]/5">
                {dbOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F5F1EB]/40 transition-colors">
                    <td className="p-3.5 font-semibold text-[#30372F] font-mono text-xs">
                      #{ord.orderNumber}
                    </td>

                    <td className="p-3.5 font-medium text-[#30372F]">
                      <p className="font-semibold text-[#30372F]">{ord.customerName}</p>
                      <p className="text-[10px] text-[#30372F]/60 font-normal">
                        {ord.shippingAddress ? `${ord.shippingAddress.city}, ${ord.shippingAddress.state}` : ''}
                      </p>
                    </td>

                    <td className="p-3.5 text-[#30372F]/80">
                      <p>{ord.customerEmail}</p>
                      <p className="text-[10px] text-[#30372F]/60">{ord.customerPhone}</p>
                    </td>

                    <td className="p-3.5 text-[#30372F]/70 whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      <p className="text-[10px] text-[#30372F]/50">
                        {new Date(ord.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>

                    <td className="p-3.5 text-center font-semibold text-[#30372F]">
                      {ord.items && ord.items.length > 0 ? `${ord.items.length} Item(s)` : '1 Item'}
                    </td>

                    <td className="p-3.5 text-right font-semibold text-[#30372F] font-serif text-sm">
                      ₹ {ord.totalAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3.5">
                      {getPaymentStatusBadge(ord.paymentStatus)}
                      <p className="text-[9px] text-[#30372F]/50 mt-0.5">{ord.paymentMethod}</p>
                    </td>

                    <td className="p-3.5">{getStatusBadge(ord.orderStatus)}</td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setNewStatus(ord.orderStatus);
                        }}
                        className="px-3.5 py-1.5 bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] font-semibold uppercase tracking-widest text-[10px] transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. SERVER & CLIENT PAGINATION FOOTER */}
        {!isLoadingOrders && !dbError && totalCount > 0 && (
          <div className="bg-[#F5F1EB] p-4 border-t border-[#30372F]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-[#30372F]/70">
              Showing <span className="font-semibold text-[#30372F]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-[#30372F]">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
              <span className="font-semibold text-[#30372F]">{totalCount}</span> orders
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#FFFDF8] border border-[#30372F]/15 text-[#30372F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#30372F] hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <span className="px-3 py-1 font-semibold text-[#30372F]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-[#FFFDF8] border border-[#30372F]/15 text-[#30372F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#30372F] hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. DEDICATED ORDER DETAILS MODAL / DRAWER */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={loadDatabaseOrders}
        />
      )}
    </div>
  );
};
