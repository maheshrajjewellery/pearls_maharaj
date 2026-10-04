import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Layers,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const AnalyticsView: React.FC = () => {
  const { products, orders, customers, corporateEnquiries } = useAdmin();
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "1y">("30d");

  // Key metrics
  const totalRevenue = useMemo(
    () =>
      orders.reduce(
        (sum, o) => (o.paymentStatus === "Paid" ? sum + o.totalAmount : sum),
        0,
      ),
    [orders],
  );
  const totalOrdersCount = orders.length;
  const avgOrderValue =
    totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const corporateConversionRate = "33.3%";

  // Category Revenue Split Data
  const categorySplitData = [
    { name: "Necklaces", value: 485000 },
    { name: "Pearl Sets", value: 325000 },
    { name: "Earrings", value: 191000 },
    { name: "Rings", value: 135000 },
  ];

  const BRAND_COLORS = ["#30372F", "#C5A15A", "#B8A99A", "#F5EBDD"];

  // Monthly Revenue Chart Data
  const monthlyRevenueData = [
    { month: "Apr", revenue: 1450000, orders: 12 },
    { month: "May", revenue: 1890000, orders: 16 },
    { month: "Jun", revenue: 1620000, orders: 14 },
    { month: "Jul", revenue: 2150000, orders: 19 },
    { month: "Aug", revenue: 2480000, orders: 22 },
    { month: "Sep", revenue: 2890000, orders: 26 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">
            Analytics & Business Performance
          </h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Revenue trends, product category sales, average order value, and
            conversion insights
          </p>
        </div>

        <div className="flex items-center bg-[#F5F1EB] p-1 border border-[#30372F]/10 text-xs font-semibold">
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 transition-colors ${timeRange === "30d" ? "bg-[#30372F] text-[#F7F3EC]" : "text-[#30372F]/70"}`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`px-3 py-1 transition-colors ${timeRange === "90d" ? "bg-[#30372F] text-[#F7F3EC]" : "text-[#30372F]/70"}`}
          >
            90 Days
          </button>
          <button
            onClick={() => setTimeRange("1y")}
            className={`px-3 py-1 transition-colors ${timeRange === "1y" ? "bg-[#30372F] text-[#F7F3EC]" : "text-[#30372F]/70"}`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
          <p className="text-[10px] text-[#30372F]/60 uppercase font-semibold">
            PAID REVENUE
          </p>
          <p className="font-serif text-2xl font-bold text-[#30372F] mt-2">
            ₹ {totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
            +18.5% YoY Growth
          </span>
        </div>

        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
          <p className="text-[10px] text-[#30372F]/60 uppercase font-semibold">
            AVERAGE ORDER VALUE (AOV)
          </p>
          <p className="font-serif text-2xl font-bold text-[#C5A15A] mt-2">
            ₹ {avgOrderValue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#30372F]/60 mt-1 block">
            High luxury basket
          </span>
        </div>

        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
          <p className="text-[10px] text-[#30372F]/60 uppercase font-semibold">
            TOTAL COMPLETED ORDERS
          </p>
          <p className="font-serif text-2xl font-bold text-[#30372F] mt-2">
            {totalOrdersCount} Orders
          </p>
          <span className="text-[11px] text-[#30372F]/60 mt-1 block">
            100% Inspected
          </span>
        </div>

        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
          <p className="text-[10px] text-[#30372F]/60 uppercase font-semibold">
            CORPORATE CONVERSION
          </p>
          <p className="font-serif text-2xl font-bold text-[#30372F] mt-2">
            {corporateConversionRate}
          </p>
          <span className="text-[11px] text-[#30372F]/60 mt-1 block">
            Institutional deal close rate
          </span>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REVENUE BAR CHART (2 COLS) */}
        <div className="lg:col-span-2 bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs">
          <h3 className="font-serif text-lg font-semibold text-[#30372F] mb-1">
            Monthly Revenue Comparison
          </h3>
          <p className="text-xs text-[#30372F]/60 mb-6">
            Revenue in INR over recent months
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(41,35,31,0.08)"
                />
                <XAxis
                  dataKey="month"
                  stroke="#30372F"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#30372F"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFDF8",
                    borderColor: "#30372F",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [
                    `₹ ${Number(val || 0).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#C5A15A" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY BREAKDOWN PIE CHART (1 COL) */}
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F] mb-1">
              Category Revenue Split
            </h3>
            <p className="text-xs text-[#30372F]/60 mb-4">
              Share of total store sales
            </p>

            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySplitData}
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {categorySplitData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) =>
                      `₹ ${Number(val || 0).toLocaleString("en-IN")}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-[#30372F]/10 text-xs">
            {categorySplitData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3"
                    style={{ backgroundColor: BRAND_COLORS[i] }}
                  />
                  <span className="text-[#30372F]">{c.name}</span>
                </div>
                <span className="font-semibold text-[#30372F]">
                  ₹ {c.value.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
