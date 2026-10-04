import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminCustomer, AdminOrder } from '@/types/admin';
import { fetchCustomersFromDb, CustomerFilterParams } from '@/services/customerService';
import { OrderDetailsModal } from './OrderDetailsModal';
import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  ShoppingBag,
  DollarSign,
  X,
  MapPin,
  Clock,
  Eye,
  Download,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  MoreVertical,
  Ban,
  CheckCircle,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const {
    customers: globalCustomers,
    orders: globalOrders,
    updateCustomerStatus,
    refreshCustomers,
    addToast,
  } = useAdmin();

  // State management for database loading & errors
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<'All' | 'New' | 'Returning'>('All');
  const [orderActivityFilter, setOrderActivityFilter] = useState<'All' | 'Never Ordered' | 'Has Orders'>('All');
  const [dateJoinedFilter, setDateJoinedFilter] = useState<
    'All' | 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'Custom Range'
  >('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting & Pagination State
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'name' | 'most_orders' | 'highest_spending' | 'most_recent_order'
  >('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Selected Customer & Modals State
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [selectedCustomerTab, setSelectedCustomerTab] = useState<'info' | 'addresses' | 'orders'>('info');

  // Selected Order for Order Details Modal (reusing OrderDetailsModal)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Deactivation / Reactivation Confirmation Modals
  const [deactivateTarget, setDeactivateTarget] = useState<AdminCustomer | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [reactivateTarget, setReactivateTarget] = useState<AdminCustomer | null>(null);
  const [isReactivating, setIsReactivating] = useState(false);

  // Query Result State
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    activeCustomers: 0,
    customersWithOrders: 0,
    totalCustomerRevenue: 0,
  });

  // Load Database Customers with filters & pagination
  const loadCustomers = async () => {
    setIsLoading(true);
    setDbError(null);
    try {
      const res = await fetchCustomersFromDb({
        searchTerm,
        statusFilter,
        customerTypeFilter,
        orderActivityFilter,
        dateJoinedFilter,
        startDate,
        endDate,
        sortBy,
        page: currentPage,
        pageSize,
      });

      setCustomers(res.customers);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
      setDashboardStats(res.dashboardStats);
    } catch (err: any) {
      console.error('Error loading database customers:', err);
      setDbError(err.message || 'Unable to load customer directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [
    searchTerm,
    statusFilter,
    customerTypeFilter,
    orderActivityFilter,
    dateJoinedFilter,
    startDate,
    endDate,
    sortBy,
    currentPage,
    pageSize,
    globalCustomers,
    globalOrders,
  ]);

  // Orders placed by selected customer
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return globalOrders.filter(
      (o) => o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase()
    );
  }, [selectedCustomer, globalOrders]);

  // Export Customers CSV (respects active filters & search)
  const handleExportCSV = async () => {
    try {
      const fullRes = await fetchCustomersFromDb({
        searchTerm,
        statusFilter,
        customerTypeFilter,
        orderActivityFilter,
        dateJoinedFilter,
        startDate,
        endDate,
        sortBy,
        page: 1,
        pageSize: 10000,
      });

      const headers = [
        'Customer ID',
        'Full Name',
        'Email',
        'Phone',
        'Auth Provider',
        'Joined Date',
        'Total Orders',
        'Total Spent (INR)',
        'Average Order Value',
        'Account Status',
      ];

      const rows = fullRes.customers.map((c) => [
        `"${c.id}"`,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.email}"`,
        `"${c.phone || ''}"`,
        `"${c.provider || 'email'}"`,
        `"${c.joinedDate ? c.joinedDate.split('T')[0] : ''}"`,
        c.totalOrders,
        c.totalSpent,
        c.avgOrderValue,
        `"${c.status}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `maharaj_customers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Customer list exported as CSV.', 'success');
    } catch (err: any) {
      addToast('Failed to export customers CSV.', 'error');
    }
  };

  // Confirm Account Deactivation
  const handleConfirmDeactivate = async () => {
    if (!deactivateTarget) return;
    setIsDeactivating(true);
    try {
      const success = await updateCustomerStatus(deactivateTarget.email, 'Inactive');
      if (success) {
        setDeactivateTarget(null);
        if (selectedCustomer && selectedCustomer.email === deactivateTarget.email) {
          setSelectedCustomer((prev) => (prev ? { ...prev, status: 'Inactive' } : null));
        }
        await loadCustomers();
      }
    } finally {
      setIsDeactivating(false);
    }
  };

  // Confirm Account Reactivation
  const handleConfirmReactivate = async () => {
    if (!reactivateTarget) return;
    setIsReactivating(true);
    try {
      const success = await updateCustomerStatus(reactivateTarget.email, 'Active');
      if (success) {
        setReactivateTarget(null);
        if (selectedCustomer && selectedCustomer.email === reactivateTarget.email) {
          setSelectedCustomer((prev) => (prev ? { ...prev, status: 'Active' } : null));
        }
        await loadCustomers();
      }
    } finally {
      setIsReactivating(false);
    }
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'All' ||
    customerTypeFilter !== 'All' ||
    orderActivityFilter !== 'All' ||
    dateJoinedFilter !== 'All' ||
    startDate !== '' ||
    endDate !== '';

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCustomerTypeFilter('All');
    setOrderActivityFilter('All');
    setDateJoinedFilter('All');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-semibold text-[#30372F]">
              Customer Management
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] bg-[#30372F] text-[#F7F3EC] font-bold rounded-full">
              {dashboardStats.totalCustomers} Clients
            </span>
          </div>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Database-driven client profiles, order statistics, addresses, and authentication controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              refreshCustomers();
              loadCustomers();
            }}
            disabled={isLoading}
            className="px-3 py-2 bg-[#F5F1EB] border border-[#30372F]/15 text-[#30372F] hover:bg-[#30372F] hover:text-[#F7F3EC] text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Refresh database customer records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] font-semibold uppercase tracking-wider text-[11px] transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export Customers
          </button>
        </div>
      </div>

      {/* 2. REALTIME DASHBOARD STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* TOTAL CUSTOMERS */}
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#30372F]/60">
            <span className="text-[10px] uppercase tracking-wider font-medium">Total Customers</span>
            <Users className="w-4 h-4 text-[#30372F]/40" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#30372F] mt-1">
            {dashboardStats.totalCustomers}
          </p>
        </div>

        {/* NEW CUSTOMERS */}
        <div className="bg-[#FFFDF8] border border-blue-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-blue-800">
            <span className="text-[10px] uppercase tracking-wider font-medium">New (Last 30 Days)</span>
            <UserPlus className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-blue-950 mt-1">
            {dashboardStats.newCustomers}
          </p>
        </div>

        {/* ACTIVE CUSTOMERS */}
        <div className="bg-[#FFFDF8] border border-emerald-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[10px] uppercase tracking-wider font-medium">Active Accounts</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-950 mt-1">
            {dashboardStats.activeCustomers}
          </p>
        </div>

        {/* CUSTOMERS WITH ORDERS */}
        <div className="bg-[#FFFDF8] border border-purple-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-purple-800">
            <span className="text-[10px] uppercase tracking-wider font-medium">With Orders</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-purple-950 mt-1">
            {dashboardStats.customersWithOrders}
          </p>
        </div>

        {/* TOTAL CUSTOMER REVENUE */}
        <div className="bg-[#FFFDF8] border border-[#C5A15A]/40 p-4 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#C5A15A]">
            <span className="text-[10px] uppercase tracking-wider font-bold">Total Customer Revenue</span>
            <DollarSign className="w-4 h-4 text-[#C5A15A]" />
          </div>
          <p className="font-serif text-xl font-bold text-[#30372F] mt-1">
            ₹ {dashboardStats.totalCustomerRevenue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10 space-y-4">
        {/* SEARCH & FILTERS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* SEARCH BOX WITH CLEAR BUTTON */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#30372F]/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search customers..."
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 pl-9 pr-8 py-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-2.5 text-[#30372F]/40 hover:text-[#30372F]"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ACCOUNT STATUS FILTER */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Account Status: All</option>
              <option value="Active">Account Status: Active</option>
              <option value="Inactive">Account Status: Inactive</option>
            </select>
          </div>

          {/* CUSTOMER TYPE FILTER */}
          <div>
            <select
              value={customerTypeFilter}
              onChange={(e) => {
                setCustomerTypeFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Customer Type: All</option>
              <option value="New">Customer Type: New (Last 30 days)</option>
              <option value="Returning">Customer Type: Returning (&gt; 1 order)</option>
            </select>
          </div>

          {/* ORDER ACTIVITY FILTER */}
          <div>
            <select
              value={orderActivityFilter}
              onChange={(e) => {
                setOrderActivityFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Order Activity: All</option>
              <option value="Never Ordered">Order Activity: Never Ordered</option>
              <option value="Has Orders">Order Activity: Has Orders</option>
            </select>
          </div>

          {/* DATE JOINED FILTER */}
          <div>
            <select
              value={dateJoinedFilter}
              onChange={(e) => {
                setDateJoinedFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Date Joined: All Time</option>
              <option value="Today">Date Joined: Today</option>
              <option value="Last 7 Days">Date Joined: Last 7 Days</option>
              <option value="Last 30 Days">Date Joined: Last 30 Days</option>
              <option value="Custom Range">Date Joined: Custom Range</option>
            </select>
          </div>
        </div>

        {/* CUSTOM DATE RANGE PICKER */}
        {dateJoinedFilter === 'Custom Range' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#30372F]/10 text-xs">
            <span className="font-semibold text-[#30372F]">Custom Date Joined Range:</span>
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

        {/* SORTING & CLEAR FILTERS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#30372F]/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#30372F]/60 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-[#FFFDF8] border border-[#30372F]/15 px-2.5 py-1 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="newest">Newest Customer</option>
              <option value="oldest">Oldest Customer</option>
              <option value="name">Customer Name (A-Z)</option>
              <option value="most_orders">Most Orders</option>
              <option value="highest_spending">Highest Spending</option>
              <option value="most_recent_order">Most Recent Order</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-700 hover:text-red-900 font-semibold underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <span className="text-[#30372F]/60">Per Page:</span>
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

      {/* 4. ERROR & LOADING STATES */}
      {dbError && (
        <div className="bg-rose-50 border border-rose-200 p-4 text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Unable to load customers. {dbError}</span>
          </div>
          <button
            onClick={loadCustomers}
            className="px-3 py-1 bg-rose-800 text-white font-semibold uppercase tracking-wider text-[10px]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 5. CUSTOMERS TABLE / CARDS */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C5A15A] mx-auto" />
            <p className="text-xs text-[#30372F]/60 font-serif">Loading customers...</p>
            {/* Skeleton loader */}
            <div className="space-y-2 max-w-xl mx-auto pt-2">
              <div className="h-8 bg-[#F5F1EB] animate-pulse" />
              <div className="h-8 bg-[#F5F1EB] animate-pulse" />
              <div className="h-8 bg-[#F5F1EB] animate-pulse" />
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-[#30372F]/30 mx-auto" />
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">No customers found</h3>
            <p className="text-xs text-[#30372F]/60 max-w-sm mx-auto">
              Try changing your search terms or resetting active status and date filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-2 px-4 py-2 bg-[#30372F] text-[#F7F3EC] text-xs uppercase tracking-wider font-semibold hover:bg-[#C5A15A] transition-colors"
              >
                Clear Search &amp; Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3">Total Orders</th>
                  <th className="p-3">Total Spent</th>
                  <th className="p-3">Last Order</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30372F]/5">
                {customers.map((cust) => (
                  <tr key={cust.email} className="hover:bg-[#F5F1EB]/40 transition-colors">
                    {/* CUSTOMER NAME + AVATAR + ID */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        {cust.avatarUrl ? (
                          <img
                            src={cust.avatarUrl}
                            alt={cust.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#C5A15A]/50 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#30372F] text-[#F7F3EC] flex items-center justify-center font-bold text-xs shrink-0">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#30372F] flex items-center gap-1.5">
                            <span>{cust.name}</span>
                            {cust.provider === 'google' && (
                              <span
                                className="px-1.5 py-0.2 text-[9px] bg-blue-50 text-blue-700 font-bold border border-blue-200 rounded-2xs"
                                title="Signed up via Google OAuth"
                              >
                                Google
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-[#30372F]/50 font-mono">
                            {cust.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="p-3 text-[#30372F]/90 font-medium">{cust.email}</td>

                    {/* PHONE */}
                    <td className="p-3 text-[#30372F]/80 font-mono text-[11px]">
                      {cust.phone || '—'}
                    </td>

                    {/* JOINED DATE */}
                    <td className="p-3 text-[#30372F]/70 font-mono text-[11px]">
                      {cust.joinedDate ? cust.joinedDate.split('T')[0] : '—'}
                    </td>

                    {/* TOTAL ORDERS */}
                    <td className="p-3 font-semibold text-[#30372F]">
                      {cust.totalOrders} {cust.totalOrders === 1 ? 'Order' : 'Orders'}
                    </td>

                    {/* TOTAL SPENT */}
                    <td className="p-3 font-semibold text-[#C5A15A]">
                      ₹ {cust.totalSpent.toLocaleString('en-IN')}
                    </td>

                    {/* LAST ORDER */}
                    <td className="p-3 text-[#30372F]/70 font-mono text-[11px]">
                      {cust.lastOrderDate ? cust.lastOrderDate.split('T')[0] : 'Never'}
                    </td>

                    {/* ACCOUNT STATUS */}
                    <td className="p-3">
                      {cust.status === 'Active' ? (
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] bg-rose-50 text-rose-800 font-semibold border border-rose-200">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setSelectedCustomerTab('info');
                          }}
                          className="px-2.5 py-1 bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] font-semibold uppercase tracking-widest text-[10px] transition-colors"
                          title="View customer dossier"
                        >
                          View Customer
                        </button>

                        {cust.status === 'Active' ? (
                          <button
                            onClick={() => setDeactivateTarget(cust)}
                            className="p-1 text-rose-700 hover:text-rose-900 border border-rose-200 hover:bg-rose-50 transition-colors"
                            title="Deactivate Customer Account"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setReactivateTarget(cust)}
                            className="p-1 text-emerald-700 hover:text-emerald-900 border border-emerald-200 hover:bg-emerald-50 transition-colors"
                            title="Reactivate Customer Account"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. PAGINATION CONTROLS */}
        {!isLoading && customers.length > 0 && (
          <div className="bg-[#F5F1EB] p-4 border-t border-[#30372F]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-[#30372F]/70">
              Showing <span className="font-semibold text-[#30372F]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-[#30372F]">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
              <span className="font-semibold text-[#30372F]">{totalCount}</span> customers
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

      {/* 7. CUSTOMER DETAILS DRAWER / MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30372F]/50 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#30372F]/20 max-w-3xl w-full my-6 p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-[#30372F]/50 hover:text-[#30372F] p-1 border border-transparent hover:border-[#30372F]/20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className="pb-4 border-b border-[#30372F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {selectedCustomer.avatarUrl ? (
                  <img
                    src={selectedCustomer.avatarUrl}
                    alt={selectedCustomer.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#C5A15A]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#30372F] text-[#F7F3EC] flex items-center justify-center font-serif text-xl font-bold">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A15A] font-bold">
                      CLIENT DOSSIER &amp; PROFILE
                    </span>
                    {selectedCustomer.status === 'Active' ? (
                      <span className="px-2 py-0.5 text-[9px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] bg-rose-50 text-rose-800 font-semibold border border-rose-200">
                        Inactive
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#30372F] mt-0.5">
                    {selectedCustomer.name}
                  </h3>
                </div>
              </div>

              {/* ACTION CONTROL BUTTONS */}
              <div className="flex items-center gap-2">
                {selectedCustomer.status === 'Active' ? (
                  <button
                    onClick={() => setDeactivateTarget(selectedCustomer)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-800 hover:text-white border border-rose-300 font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Deactivate Account
                  </button>
                ) : (
                  <button
                    onClick={() => setReactivateTarget(selectedCustomer)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-800 hover:text-white border border-emerald-300 font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Reactivate Account
                  </button>
                )}
              </div>
            </div>

            {/* TAB NAVIGATION IN DRAWER */}
            <div className="flex border-b border-[#30372F]/10 text-xs font-semibold uppercase tracking-wider mt-3">
              <button
                onClick={() => setSelectedCustomerTab('info')}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  selectedCustomerTab === 'info'
                    ? 'border-[#C5A15A] text-[#30372F]'
                    : 'border-transparent text-[#30372F]/50 hover:text-[#30372F]'
                }`}
              >
                Customer Info &amp; Stats
              </button>
              <button
                onClick={() => setSelectedCustomerTab('addresses')}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  selectedCustomerTab === 'addresses'
                    ? 'border-[#C5A15A] text-[#30372F]'
                    : 'border-transparent text-[#30372F]/50 hover:text-[#30372F]'
                }`}
              >
                Saved Addresses ({selectedCustomer.addresses.length})
              </button>
              <button
                onClick={() => setSelectedCustomerTab('orders')}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  selectedCustomerTab === 'orders'
                    ? 'border-[#C5A15A] text-[#30372F]'
                    : 'border-transparent text-[#30372F]/50 hover:text-[#30372F]'
                }`}
              >
                Order History ({customerOrders.length})
              </button>
            </div>

            {/* DRAWER CONTENT */}
            <div className="flex-1 overflow-y-auto space-y-6 py-4 text-xs pr-1">
              {selectedCustomerTab === 'info' && (
                <div className="space-y-6">
                  {/* REQUIREMENT 8: CALCULATED CUSTOMER STATISTICS */}
                  <div>
                    <p className="font-serif text-sm font-semibold text-[#30372F] mb-2">
                      Calculated Order Metrics
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F1EB] p-4 border border-[#30372F]/10">
                      <div>
                        <p className="text-[10px] text-[#30372F]/60 uppercase font-medium">Total Orders</p>
                        <p className="font-serif text-xl font-bold text-[#30372F] mt-0.5">
                          {selectedCustomer.totalOrders}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#30372F]/60 uppercase font-medium">Total Spent</p>
                        <p className="font-serif text-xl font-bold text-[#C5A15A] mt-0.5">
                          ₹ {selectedCustomer.totalSpent.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#30372F]/60 uppercase font-medium">Average Order</p>
                        <p className="font-serif text-xl font-bold text-[#30372F] mt-0.5">
                          ₹ {selectedCustomer.avgOrderValue.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#30372F]/60 uppercase font-medium">Delivered / Cancelled</p>
                        <p className="font-serif text-base font-bold text-[#30372F] mt-0.5">
                          <span className="text-emerald-800">{selectedCustomer.deliveredOrdersCount}</span> /{' '}
                          <span className="text-red-700">{selectedCustomer.cancelledOrdersCount}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* REQUIREMENT 6: CUSTOMER INFORMATION */}
                  <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-4 space-y-3">
                    <p className="font-serif text-base font-semibold text-[#30372F] border-b border-[#30372F]/10 pb-2">
                      Customer Information
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#30372F]/60 block text-[10px] uppercase">Full Name</span>
                        <span className="font-semibold text-[#30372F]">{selectedCustomer.name}</span>
                      </div>

                      <div>
                        <span className="text-[#30372F]/60 block text-[10px] uppercase">Email Address</span>
                        <span className="font-semibold text-[#30372F]">{selectedCustomer.email}</span>
                      </div>

                      <div>
                        <span className="text-[#30372F]/60 block text-[10px] uppercase">Phone Number</span>
                        <span className="font-semibold text-[#30372F]">{selectedCustomer.phone || 'Not provided'}</span>
                      </div>

                      <div>
                        <span className="text-[#30372F]/60 block text-[10px] uppercase">Customer ID</span>
                        <span className="font-mono text-[#30372F]">{selectedCustomer.id}</span>
                      </div>

                      <div>
                        <span className="text-[#30372F]/60 block text-[10px] uppercase">Account Joined Date</span>
                        <span className="font-mono text-[#30372F]">
                          {selectedCustomer.joinedDate ? selectedCustomer.joinedDate.split('T')[0] : '—'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#30372F]/60 block text-[10px] uppercase">Auth Provider</span>
                        <span className="font-semibold capitalize text-[#30372F]">
                          {selectedCustomer.provider || 'email'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#30372F]/60 block text-[10px] uppercase">First Order Date</span>
                        <span className="font-mono text-[#30372F]">
                          {selectedCustomer.firstOrderDate ? selectedCustomer.firstOrderDate.split('T')[0] : 'Never'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#30372F]/60 block text-[10px] uppercase">Most Recent Order</span>
                        <span className="font-mono text-[#30372F]">
                          {selectedCustomer.lastOrderDate ? selectedCustomer.lastOrderDate.split('T')[0] : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REQUIREMENT 6: SAVED ADDRESSES TAB */}
              {selectedCustomerTab === 'addresses' && (
                <div className="space-y-4">
                  <p className="font-serif text-base font-semibold text-[#30372F]">Saved Delivery Addresses</p>

                  {selectedCustomer.addresses.length === 0 ? (
                    <div className="p-8 text-center bg-[#F5F1EB] border border-[#30372F]/10 text-[#30372F]/60 italic">
                      No addresses saved yet for this customer profile.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCustomer.addresses.map((addr, idx) => (
                        <div key={idx} className="bg-[#FFFDF8] border border-[#30372F]/15 p-4 space-y-1.5 relative">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#30372F] flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#C5A15A]" />
                              {addr.fullName || selectedCustomer.name}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 text-[9px] bg-[#C5A15A]/20 text-[#30372F] font-bold border border-[#C5A15A]/40 uppercase">
                                Default Address
                              </span>
                            )}
                          </div>
                          <p className="text-[#30372F]/80 text-xs leading-relaxed">
                            {addr.address}
                          </p>
                          {addr.phone && (
                            <p className="text-[11px] text-[#30372F]/60">Phone: {addr.phone}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* REQUIREMENT 7: ORDER HISTORY TAB */}
              {selectedCustomerTab === 'orders' && (
                <div className="space-y-4">
                  <p className="font-serif text-base font-semibold text-[#30372F]">Customer Order History</p>

                  {customerOrders.length === 0 ? (
                    <div className="p-8 text-center bg-[#F5F1EB] border border-[#30372F]/10 text-[#30372F]/60 italic">
                      No orders yet
                    </div>
                  ) : (
                    <div className="border border-[#30372F]/15 overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F5F1EB] border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px]">
                            <th className="p-2.5">Order ID</th>
                            <th className="p-2.5">Date</th>
                            <th className="p-2.5">Items</th>
                            <th className="p-2.5">Amount</th>
                            <th className="p-2.5">Payment</th>
                            <th className="p-2.5">Order Status</th>
                            <th className="p-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30372F]/5">
                          {customerOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-[#F5F1EB]/30">
                              <td className="p-2.5 font-semibold font-mono text-[#30372F]">
                                #{ord.orderNumber}
                              </td>
                              <td className="p-2.5 text-[#30372F]/70 font-mono text-[11px]">
                                {ord.createdAt.split('T')[0]}
                              </td>
                              <td className="p-2.5 text-[#30372F]/80">
                                {ord.items ? ord.items.length : 1} {ord.items?.length === 1 ? 'Item' : 'Items'}
                              </td>
                              <td className="p-2.5 font-bold text-[#C5A15A]">
                                ₹ {ord.totalAmount.toLocaleString('en-IN')}
                              </td>
                              <td className="p-2.5">
                                <span
                                  className={`px-1.5 py-0.5 text-[9px] font-semibold border ${
                                    ord.paymentStatus === 'Paid'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  {ord.paymentStatus}
                                </span>
                              </td>
                              <td className="p-2.5 font-medium text-[#30372F]">
                                {ord.orderStatus}
                              </td>
                              <td className="p-2.5 text-right">
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="px-2.5 py-1 bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] font-semibold uppercase tracking-widest text-[9px] transition-colors"
                                >
                                  View Order
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENT 11: DEACTIVATE CUSTOMER CONFIRMATION MODAL */}
      {deactivateTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#30372F]/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-rose-300 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              <h3 className="font-serif text-lg font-bold text-[#30372F]">Deactivate Customer?</h3>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-3 text-xs text-rose-950 space-y-1 font-mono">
              <p>
                <span className="font-bold">Customer:</span> {deactivateTarget.name}
              </p>
              <p>
                <span className="font-bold">Email:</span> {deactivateTarget.email}
              </p>
            </div>

            <p className="text-xs text-[#30372F]/80 leading-relaxed font-medium">
              This will prevent the customer from using their account.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeactivateTarget(null)}
                className="px-4 py-2 bg-gray-100 text-[#30372F] font-semibold text-xs uppercase tracking-wider hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivate}
                disabled={isDeactivating}
                className="px-5 py-2 bg-rose-800 text-white font-semibold text-xs uppercase tracking-wider hover:bg-rose-900 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeactivating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REACTIVATE CUSTOMER CONFIRMATION MODAL */}
      {reactivateTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#30372F]/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-emerald-300 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="font-serif text-lg font-bold text-[#30372F]">Reactivate Customer Account?</h3>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-950 space-y-1 font-mono">
              <p>
                <span className="font-bold">Customer:</span> {reactivateTarget.name}
              </p>
              <p>
                <span className="font-bold">Email:</span> {reactivateTarget.email}
              </p>
            </div>

            <p className="text-xs text-[#30372F]/80 leading-relaxed font-medium">
              This will restore full access for the customer to log in and place orders.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReactivateTarget(null)}
                className="px-4 py-2 bg-gray-100 text-[#30372F] font-semibold text-xs uppercase tracking-wider hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReactivate}
                disabled={isReactivating}
                className="px-5 py-2 bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isReactivating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                Reactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENT 7: ORDER DETAILS MODAL REUSE */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={() => {
            refreshCustomers();
            loadCustomers();
          }}
        />
      )}
    </div>
  );
};
