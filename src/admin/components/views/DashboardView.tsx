import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import {
  Package,
  ShoppingBag,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  AlertTriangle,
  Mail,
  ArrowUpRight,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const DashboardView: React.FC = () => {
  const {
    products,
    orders,
    customers,
    corporateEnquiries,
    setActiveTab,
    activityLogs,
    adminUser,
  } = useAdmin();
  const [chartTimeframe, setChartTimeframe] = useState<
    "7d" | "30d" | "3m" | "12m"
  >("30d");

  // Top Statistics calculations
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalCustomersCount = customers.length;
  const corporateEnquiriesCount = corporateEnquiries.length;

  // Additional Statistics calculations
  const totalSalesRevenue = useMemo(
    () =>
      orders.reduce(
        (sum, o) => (o.paymentStatus === "Paid" ? sum + o.totalAmount : sum),
        0,
      ),
    [orders],
  );
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === "Pending",
  ).length;
  const lowStockCount = products.filter(
    (p) => !p.inStock || p.price > 200000,
  ).length; // demo threshold
  const newEnquiriesCount = corporateEnquiries.filter(
    (e) => e.status === "New",
  ).length;

  // Chart dataset generation based on brand palette (#C8A96B and #29231F)
  const salesChartData = useMemo(() => {
    if (chartTimeframe === "7d") {
      return [
        { name: "Mon", revenue: 125000, orders: 2 },
        { name: "Tue", revenue: 210000, orders: 3 },
        { name: "Wed", revenue: 95000, orders: 1 },
        { name: "Thu", revenue: 325000, orders: 4 },
        { name: "Fri", revenue: 185000, orders: 2 },
        { name: "Sat", revenue: 410000, orders: 5 },
        { name: "Sun", revenue: 290000, orders: 3 },
      ];
    } else if (chartTimeframe === "3m") {
      return [
        { name: "Jul", revenue: 1420000, orders: 18 },
        { name: "Aug", revenue: 1890000, orders: 24 },
        { name: "Sep", revenue: 2450000, orders: 31 },
      ];
    } else if (chartTimeframe === "12m") {
      return [
        { name: "Oct", revenue: 1200000, orders: 15 },
        { name: "Nov", revenue: 2800000, orders: 35 },
        { name: "Dec", revenue: 3900000, orders: 48 },
        { name: "Jan", revenue: 1800000, orders: 22 },
        { name: "Feb", revenue: 1600000, orders: 19 },
        { name: "Mar", revenue: 2100000, orders: 26 },
        { name: "Apr", revenue: 1950000, orders: 24 },
        { name: "May", revenue: 2300000, orders: 29 },
        { name: "Jun", revenue: 1750000, orders: 21 },
        { name: "Jul", revenue: 2100000, orders: 25 },
        { name: "Aug", revenue: 2400000, orders: 28 },
        { name: "Sep", revenue: 2650000, orders: 33 },
      ];
    }
    // Default 30d
    return [
      { name: "Week 1", revenue: 450000, orders: 6 },
      { name: "Week 2", revenue: 680000, orders: 9 },
      { name: "Week 3", revenue: 520000, orders: 7 },
      { name: "Week 4", revenue: 980000, orders: 12 },
    ];
  }, [chartTimeframe]);

  // Recent 5 orders for table
  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-800 font-semibold border border-amber-200">
            Pending
          </span>
        );
      case "Confirmed":
        return (
          <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-800 font-semibold border border-blue-200">
            Confirmed
          </span>
        );
      case "Processing":
        return (
          <span className="px-2 py-0.5 text-[10px] bg-purple-50 text-purple-800 font-semibold border border-purple-200">
            Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
            Delivered
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-800 font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* WELCOME BANNER */}
      <div className="bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#E8DED0]/40 to-transparent pointer-events-none hidden md:block" />
        <h2 className="font-serif text-2xl md:text-3xl text-[#29231F] font-semibold">
          Good Morning, {adminUser?.name || "Admin"}
        </h2>
        <p className="text-xs text-[#29231F]/70 mt-1">
          Here's what's happening with Maharaj Jewellery today.
        </p>
      </div>

      {/* TOP STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL PRODUCTS */}
        <div
          onClick={() => setActiveTab("products")}
          className="bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs hover:border-[#C8A96B] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#29231F]/60 font-semibold">
              TOTAL PRODUCTS
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F5F1EB] text-[#C8A96B] flex items-center justify-center group-hover:bg-[#C8A96B] group-hover:text-[#FFFDF8] transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-semibold text-[#29231F] mt-3">
            {totalProductsCount}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#C8A96B] font-medium mt-2">
            <span>Live catalog items</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div
          onClick={() => setActiveTab("orders")}
          className="bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs hover:border-[#C8A96B] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#29231F]/60 font-semibold">
              TOTAL ORDERS
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F5F1EB] text-[#29231F] flex items-center justify-center group-hover:bg-[#29231F] group-hover:text-[#FFFDF8] transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-semibold text-[#29231F] mt-3">
            {totalOrdersCount}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#29231F]/70 font-medium mt-2">
            <span>+12% vs last month</span>
          </div>
        </div>

        {/* TOTAL CUSTOMERS */}
        <div
          onClick={() => setActiveTab("customers")}
          className="bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs hover:border-[#C8A96B] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#29231F]/60 font-semibold">
              TOTAL CUSTOMERS
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F5F1EB] text-[#C8A96B] flex items-center justify-center group-hover:bg-[#C8A96B] group-hover:text-[#FFFDF8] transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-semibold text-[#29231F] mt-3">
            {totalCustomersCount}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#C8A96B] font-medium mt-2">
            <span>Registered VIP & Clients</span>
          </div>
        </div>

        {/* CORPORATE ENQUIRIES */}
        <div
          onClick={() => setActiveTab("corporate-enquiries")}
          className="bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs hover:border-[#C8A96B] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#29231F]/60 font-semibold">
              CORPORATE ENQUIRIES
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F5F1EB] text-[#29231F] flex items-center justify-center group-hover:bg-[#29231F] group-hover:text-[#FFFDF8] transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-semibold text-[#29231F] mt-3">
            {corporateEnquiriesCount}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium mt-2">
            <span>{newEnquiriesCount} New pending review</span>
          </div>
        </div>
      </div>

      {/* SECONDARY STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F1EB] border border-[#29231F]/10 p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#C8A96B]" />
          <div>
            <p className="text-[10px] text-[#29231F]/60 uppercase font-medium">
              TOTAL SALES
            </p>
            <p className="text-sm font-semibold text-[#29231F]">
              ₹ {totalSalesRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-[#29231F]/10 pl-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-[10px] text-[#29231F]/60 uppercase font-medium">
              PENDING ORDERS
            </p>
            <p className="text-sm font-semibold text-[#29231F]">
              {pendingOrdersCount} Orders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-[#29231F]/10 pl-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-[10px] text-[#29231F]/60 uppercase font-medium">
              LOW STOCK
            </p>
            <p className="text-sm font-semibold text-[#29231F]">
              {lowStockCount} Items
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-[#29231F]/10 pl-3">
          <Mail className="w-5 h-5 text-[#C8A96B]" />
          <div>
            <p className="text-[10px] text-[#29231F]/60 uppercase font-medium">
              NEW ENQUIRIES
            </p>
            <p className="text-sm font-semibold text-[#29231F]">
              {newEnquiriesCount} Active
            </p>
          </div>
        </div>
      </div>

      {/* SALES ANALYTICS CHART */}
      <div className="bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#29231F]">
              Sales & Revenue Overview
            </h3>
            <p className="text-xs text-[#29231F]/60 mt-0.5">
              Historical revenue breakdown using brand palette (#C8A96B and
              #29231F)
            </p>
          </div>

          {/* Timeframe Filters */}
          <div className="flex items-center bg-[#F5F1EB] p-1 border border-[#29231F]/10 text-xs font-medium">
            <button
              onClick={() => setChartTimeframe("7d")}
              className={`px-3 py-1 transition-colors ${
                chartTimeframe === "7d"
                  ? "bg-[#29231F] text-[#F7F3EC]"
                  : "text-[#29231F]/70 hover:text-[#29231F]"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartTimeframe("30d")}
              className={`px-3 py-1 transition-colors ${
                chartTimeframe === "30d"
                  ? "bg-[#29231F] text-[#F7F3EC]"
                  : "text-[#29231F]/70 hover:text-[#29231F]"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setChartTimeframe("3m")}
              className={`px-3 py-1 transition-colors ${
                chartTimeframe === "3m"
                  ? "bg-[#29231F] text-[#F7F3EC]"
                  : "text-[#29231F]/70 hover:text-[#29231F]"
              }`}
            >
              3 Months
            </button>
            <button
              onClick={() => setChartTimeframe("12m")}
              className={`px-3 py-1 transition-colors ${
                chartTimeframe === "12m"
                  ? "bg-[#29231F] text-[#F7F3EC]"
                  : "text-[#29231F]/70 hover:text-[#29231F]"
              }`}
            >
              12 Months
            </button>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8A96B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C8A96B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(41,35,31,0.08)"
              />
              <XAxis
                dataKey="name"
                stroke="#29231F"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#29231F"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFDF8",
                  borderColor: "rgba(41,35,31,0.2)",
                  color: "#29231F",
                  borderRadius: "0px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
                formatter={(value: any) => [
                  `₹ ${Number(value || 0).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C8A96B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#goldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM GRID: RECENT ORDERS TABLE + RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS TABLE (2 COLS) */}
        <div className="lg:col-span-2 bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#29231F]/10">
            <h3 className="font-serif text-lg font-semibold text-[#29231F]">
              Recent Orders
            </h3>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-xs uppercase tracking-wider text-[#C8A96B] hover:underline font-semibold flex items-center gap-1"
            >
              View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#29231F]/10 text-[#29231F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]/50">
                  <th className="p-2.5">Order ID</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Payment</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29231F]/5">
                {recentOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-[#F5F1EB]/40 transition-colors"
                  >
                    <td className="p-2.5 font-medium text-[#29231F]">
                      {ord.orderNumber}
                    </td>
                    <td className="p-2.5 text-[#29231F]/90 font-medium">
                      {ord.customerName}
                    </td>
                    <td className="p-2.5 text-[#29231F]/60">
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-2.5 font-semibold text-[#29231F]">
                      ₹ {ord.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-2.5 text-[#29231F]/70">
                      {ord.paymentStatus}
                    </td>
                    <td className="p-2.5">{getStatusBadge(ord.orderStatus)}</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="p-1 text-[#29231F]/60 hover:text-[#C8A96B] transition-colors"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT ACTIVITY FEED (1 COL) */}
        <div className="bg-[#FFFDF8] border border-[#29231F]/10 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#29231F]/10">
            <h3 className="font-serif text-lg font-semibold text-[#29231F]">
              Recent Activity
            </h3>
            <span className="text-[10px] text-[#29231F]/50 uppercase tracking-wider font-mono">
              LIVE FEED
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 pb-3 border-b border-[#29231F]/5 last:border-0 last:pb-0"
              >
                <div className="w-6 h-6 rounded-full bg-[#F5F1EB] text-[#C8A96B] flex items-center justify-center shrink-0 mt-0.5 border border-[#29231F]/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#29231F]" />
                </div>
                <div>
                  <p className="font-medium text-[#29231F] leading-tight">
                    {log.title}
                  </p>
                  <p className="text-[#29231F]/70 text-[11px] mt-0.5 leading-snug">
                    {log.description}
                  </p>
                  <span className="text-[9px] text-[#29231F]/40 font-mono mt-1 block">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
