import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Heart,
  User as UserIcon,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertCircle,
  X,
  ChevronRight,
  Sparkles,
  Lock,
  Bell,
  Eye,
  Check,
} from "lucide-react";

import { useShop } from "@/context/ShopContext";
import { DashboardTab, CustomerAddress } from "@/types/customer";
import { AdminOrder } from "@/types/admin";
import {
  getCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
  getCustomerOrders,
  getCustomerOrdersFromDb,
} from "@/services/customerService";
import { subscribeToOrdersRealtime } from "@/services/orderService";

export default function DashboardPage() {
  const {
    user,
    logoutUser,
    setCurrentPage,
    activeDashboardTab,
    setActiveDashboardTab,
    updateUserProfile,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
  } = useShop();

  // Selected Order for Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Address State
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    houseFlat: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // Notification Preferences State
  const [notificationSettings, setNotificationSettings] = useState({
    emailOrders: true,
    emailPromotions: true,
    smsUpdates: true,
    whatsappAlerts: true,
  });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState("");

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  // Load customer specific orders from database & local fallback
  const loadUserOrders = React.useCallback(async () => {
    if (!user?.email) return;
    try {
      const liveOrders = await getCustomerOrdersFromDb(user.email);
      setOrders(liveOrders);
    } catch (err) {
      console.warn("Error loading customer orders from DB:", err);
      const fallbackOrders = getCustomerOrders(user.email);
      setOrders(fallbackOrders);
    }
  }, [user]);

  // Sync selectedOrder modal whenever orders list updates
  useEffect(() => {
    if (selectedOrder) {
      const updatedSel = orders.find(
        (o) =>
          o.id === selectedOrder.id ||
          o.orderNumber === selectedOrder.orderNumber,
      );
      if (updatedSel) {
        setSelectedOrder(updatedSel);
      }
    }
  }, [orders]);

  // Load customer specific orders & addresses & subscribe to Realtime updates
  useEffect(() => {
    if (user?.email) {
      const custAddresses = getCustomerAddresses(user.email);
      setAddresses(custAddresses);

      loadUserOrders();

      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        dob: user.dob || "",
      });

      // Subscribe to real-time order status changes
      const unsubscribe = subscribeToOrdersRealtime(() => {
        console.log(
          "[ORDER TRACKING] Realtime order status event received. Refreshing customer tracking UI...",
        );
        loadUserOrders();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, loadUserOrders]);

  // Tab switcher helper with URL state sync
  const handleTabChange = (tab: DashboardTab) => {
    setActiveDashboardTab(tab);
    const subPath = tab === "overview" ? "" : `/${tab}`;
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/dashboard${subPath}`);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    logoutUser();
    setCurrentPage("login");
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/login");
    }
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      fullName: user?.name || "",
      phone: user?.phone || "",
      houseFlat: "",
      street: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      houseFlat: addr.houseFlat,
      street: addr.street,
      area: addr.area,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    if (editingAddress) {
      const updated = updateCustomerAddress(user.email, {
        ...addressForm,
        id: editingAddress.id,
      });
      setAddresses(updated);
    } else {
      const updated = addCustomerAddress(user.email, addressForm);
      setAddresses(updated);
    }
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    if (!user?.email) return;
    const updated = deleteCustomerAddress(user.email, id);
    setAddresses(updated);
  };

  const handleSetDefaultAddress = (id: string) => {
    if (!user?.email) return;
    const updated = setDefaultCustomerAddress(user.email, id);
    setAddresses(updated);
  };

  // Profile Save Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      dob: profileForm.dob,
    });
    setIsEditingProfile(false);
    setProfileSuccessMsg("Profile updated successfully.");
    setTimeout(() => setProfileSuccessMsg(""), 3000);
  };

  // Saved wishlisted products in database
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // Compute Summary Statistics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) =>
      o.orderStatus === "Processing" ||
      o.orderStatus === "Pending" ||
      o.orderStatus === "Confirmed" ||
      o.orderStatus === "Shipped",
  ).length;
  const deliveredOrdersCount = orders.filter(
    (o) => o.orderStatus === "Delivered",
  ).length;
  const wishlistCount = wishlist.length;

  if (!user) {
    return null; // Route guard in App.tsx handles redirecting
  }

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#171310] py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER WELCOME BANNER */}
        <div className="bg-[#FFFDF8] border border-[#171310]/15 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C5A15A]/10 to-transparent pointer-events-none rounded-bl-full" />

          <div className="flex items-center gap-5 z-10">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#C5A15A] shadow-md"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C5A15A] text-[#FFFDF8] font-serif text-2xl font-bold flex items-center justify-center border-2 border-[#C5A15A] shadow-md uppercase">
                {user.name ? user.name.charAt(0) : "C"}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-[#C5A15A]/15 text-[#C5A15A] border border-[#C5A15A]/30">
                  {user.provider === "google"
                    ? "Google Authenticated"
                    : "Valued Patron"}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#171310] tracking-wide">
                Welcome back, {user.name}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#171310]/60 font-light">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
            <button
              onClick={() => {
                setCurrentPage("shop");
                if (typeof window !== "undefined")
                  window.history.pushState({}, "", "/shop");
              }}
              className="flex-1 sm:flex-initial py-2.5 px-5 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#C5A15A] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              <span>Explore Collection</span>
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION TABS */}
        <div className="lg:hidden bg-[#FFFDF8] border border-[#171310]/15 p-2 overflow-x-auto flex items-center gap-1 scrollbar-none shadow-sm">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            {
              id: "orders",
              label: "My Orders",
              icon: Package,
              badge: orders.length,
            },
            {
              id: "wishlist",
              label: "Wishlist",
              icon: Heart,
              badge: wishlist.length,
            },
            { id: "profile", label: "My Profile", icon: UserIcon },
            { id: "addresses", label: "Addresses", icon: MapPin },
            { id: "payments", label: "Saved Payments", icon: CreditCard },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDashboardTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as DashboardTab)}
                className={`whitespace-nowrap px-4 py-2.5 font-sans text-xs font-medium tracking-wide flex items-center gap-2 transition-colors ${
                  isActive
                    ? "bg-[#171310] text-[#F7F3EB]"
                    : "text-[#171310]/70 hover:bg-[#F7F3EB] hover:text-[#171310]"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-[#C5A15A] text-[#171310]"
                        : "bg-[#171310]/10 text-[#171310]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* MAIN DASHBOARD LAYOUT: DESKTOP SIDEBAR + CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP LEFT SIDEBAR */}
          <div className="hidden lg:block lg:col-span-3 bg-[#FFFDF8] border border-[#171310]/15 shadow-sm p-4 sticky top-28 space-y-1">
            <div className="px-4 py-3 border-b border-[#171310]/10 mb-2">
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#171310]/50">
                Customer Menu
              </span>
            </div>

            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              {
                id: "orders",
                label: "My Orders",
                icon: Package,
                badge: orders.length,
              },
              {
                id: "wishlist",
                label: "Wishlist",
                icon: Heart,
                badge: wishlist.length,
              },
              { id: "profile", label: "My Profile", icon: UserIcon },
              { id: "addresses", label: "Addresses", icon: MapPin },
              { id: "payments", label: "Saved Payments", icon: CreditCard },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDashboardTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as DashboardTab)}
                  className={`w-full px-4 py-3 font-sans text-xs font-medium tracking-wide flex items-center justify-between transition-all duration-200 group border-l-2 ${
                    isActive
                      ? "bg-[#171310] text-[#F7F3EB] border-[#C5A15A]"
                      : "text-[#171310]/80 hover:bg-[#F7F3EB] hover:text-[#171310] border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={16}
                      className={
                        isActive
                          ? "text-[#C5A15A]"
                          : "text-[#171310]/50 group-hover:text-[#C5A15A]"
                      }
                    />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge !== undefined && tab.badge > 0 ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#C5A15A] text-[#171310]"
                          : "bg-[#171310]/10 text-[#171310]"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      size={14}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive
                          ? "opacity-100 text-[#C5A15A]"
                          : "text-[#171310]/40"
                      }`}
                    />
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#171310]/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-3 font-sans text-xs font-semibold tracking-wider text-rose-700 hover:bg-rose-50 border-l-2 border-transparent transition-colors flex items-center gap-3 uppercase"
              >
                <LogOut size={16} className="text-rose-600" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* MAIN CONTENT CONTAINER */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. OVERVIEW TAB */}
            {activeDashboardTab === "overview" && (
              <div className="space-y-8 animate-fadeIn">
                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-[#FFFDF8] p-5 border border-[#171310]/15 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-[#C5A15A]/10 flex items-center justify-center text-[#C5A15A]">
                      <Package size={20} />
                    </div>
                    <p className="font-serif text-3xl font-normal text-[#171310]">
                      {totalOrdersCount}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-widest text-[#171310]/60 font-medium">
                      Total Orders
                    </p>
                  </div>

                  <div className="bg-[#FFFDF8] p-5 border border-[#171310]/15 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Clock size={20} />
                    </div>
                    <p className="font-serif text-3xl font-normal text-[#171310]">
                      {pendingOrdersCount}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-widest text-[#171310]/60 font-medium">
                      Pending Orders
                    </p>
                  </div>

                  <div className="bg-[#FFFDF8] p-5 border border-[#171310]/15 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Truck size={20} />
                    </div>
                    <p className="font-serif text-3xl font-normal text-[#171310]">
                      {deliveredOrdersCount}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-widest text-[#171310]/60 font-medium">
                      Delivered Orders
                    </p>
                  </div>

                  <div className="bg-[#FFFDF8] p-5 border border-[#171310]/15 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                      <Heart size={20} />
                    </div>
                    <p className="font-serif text-3xl font-normal text-[#171310]">
                      {wishlistCount}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-widest text-[#171310]/60 font-medium">
                      Wishlist Items
                    </p>
                  </div>
                </div>

                {/* Recent Orders Card */}
                <div className="bg-[#FFFDF8] border border-[#171310]/15 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#171310]/10">
                    <div>
                      <h2 className="font-serif text-xl font-normal text-[#171310]">
                        Recent Orders
                      </h2>
                      <p className="font-sans text-xs text-[#171310]/60">
                        View and track your latest purchase activity.
                      </p>
                    </div>
                    {orders.length > 0 && (
                      <button
                        onClick={() => handleTabChange("orders")}
                        className="font-sans text-xs font-semibold text-[#C5A15A] hover:underline flex items-center gap-1"
                      >
                        <span>View All Orders</span>
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] border border-[#171310]/15 flex items-center justify-center text-[#171310]/40">
                        <ShoppingBag size={28} strokeWidth={1.2} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-normal text-[#171310]">
                          You haven't placed any orders yet.
                        </h3>
                        <p className="font-sans text-xs text-[#171310]/60 max-w-sm mx-auto">
                          Explore our royal collection of South Sea, Akoya, and
                          Tahitian pearl masterpieces.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentPage("shop");
                          if (typeof window !== "undefined")
                            window.history.pushState({}, "", "/shop");
                        }}
                        className="py-3 px-6 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A15A] transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 bg-[#FAF7F2] border border-[#171310]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C5A15A]/40 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {ord.items[0]?.product?.image ? (
                              <img
                                src={ord.items[0].product.image}
                                alt={ord.items[0].product.name}
                                className="w-16 h-16 object-cover border border-[#171310]/15 shrink-0 bg-white"
                              />
                            ) : (
                              <div
                                className="w-16 h-16 bg-[#F5EBDD] flex items-center justify-center text-[#171310]/40 shrink-0"
                              >
                                <Package size={24} />
                              </div>
                            )}

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#171310]">
                                  {ord.orderNumber}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                    ord.orderStatus === "Delivered"
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                      : ord.orderStatus === "Shipped"
                                        ? "bg-blue-50 text-blue-800 border-blue-300"
                                        : ord.orderStatus === "Processing"
                                          ? "bg-amber-50 text-amber-800 border-amber-300"
                                          : "bg-gray-50 text-gray-800 border-gray-300"
                                  }`}
                                >
                                  {ord.orderStatus}
                                </span>
                              </div>
                              <p className="font-sans text-xs font-medium text-[#171310] line-clamp-1">
                                {ord.items
                                  .map(
                                    (i) => i.product?.name || "Pearl Jewellery",
                                  )
                                  .join(", ")}
                              </p>
                              <p className="font-sans text-[11px] text-[#171310]/60">
                                Placed on{" "}
                                {new Date(ord.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-[#171310]/10 pt-2 sm:pt-0">
                            <span className="font-serif text-base font-semibold text-[#171310]">
                              ₹{ord.totalAmount.toLocaleString("en-IN")}
                            </span>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="py-1.5 px-3 bg-[#FFFDF8] border border-[#171310]/20 text-[#171310] hover:bg-[#171310] hover:text-[#F7F3EB] font-sans text-xs font-medium transition-colors"
                            >
                              View Order
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. MY ORDERS TAB */}
            {activeDashboardTab === "orders" && (
              <div className="bg-[#FFFDF8] border border-[#171310]/15 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#171310]/10">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-[#171310]">
                      My Orders
                    </h2>
                    <p className="font-sans text-xs text-[#171310]/60">
                      Track current orders, review purchase history, and
                      download receipts.
                    </p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] border border-[#171310]/15 flex items-center justify-center text-[#171310]/40">
                      <Package size={30} strokeWidth={1.2} />
                    </div>
                    <h3 className="font-serif text-xl font-normal text-[#171310]">
                      You haven't placed any orders yet.
                    </h3>
                    <p className="font-sans text-xs text-[#171310]/60 max-w-sm mx-auto">
                      Discover our high-jewellery collections crafted with South
                      Sea and Tahitian pearls.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentPage("shop");
                        if (typeof window !== "undefined")
                          window.history.pushState({}, "", "/shop");
                      }}
                      className="py-3 px-6 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A15A] transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="border border-[#171310]/15 bg-[#FAF7F2] overflow-hidden"
                      >
                        {/* Order Header */}
                        <div
                          className="p-4 bg-[#F5EBDD]/50 border-b border-[#171310]/10 flex flex-wrap items-center justify-between gap-4"
                        >
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
                            <div>
                              <span className="text-[#171310]/50 block text-[10px] uppercase tracking-wider font-semibold">
                                Order Placed
                              </span>
                              <span className="font-medium text-[#171310]">
                                {new Date(ord.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#171310]/50 block text-[10px] uppercase tracking-wider font-semibold">
                                Total Amount
                              </span>
                              <span className="font-semibold text-[#171310]">
                                ₹{ord.totalAmount.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#171310]/50 block text-[10px] uppercase tracking-wider font-semibold">
                                Payment Method
                              </span>
                              <span className="font-medium text-[#171310]">
                                {ord.paymentMethod}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-[#171310]">
                              {ord.orderNumber}
                            </span>
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                ord.orderStatus === "Delivered"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : ord.orderStatus === "Shipped"
                                    ? "bg-blue-50 text-blue-800 border-blue-300"
                                    : ord.orderStatus === "Processing"
                                      ? "bg-amber-50 text-amber-800 border-amber-300"
                                      : "bg-gray-50 text-gray-800 border-gray-300"
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 space-y-4">
                          {ord.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171310]/10 last:border-0 last:pb-0"
                            >
                              <div className="flex items-center gap-4">
                                {item.product?.image ? (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover border border-[#171310]/15 shrink-0 bg-white"
                                  />
                                ) : (
                                  <div
                                    className="w-16 h-16 bg-[#F5EBDD] flex items-center justify-center text-[#171310]/40 shrink-0"
                                  >
                                    <Package size={24} />
                                  </div>
                                )}
                                <div className="space-y-0.5">
                                  <h4 className="font-serif text-sm font-normal text-[#171310]">
                                    {item.product?.name ||
                                      "Maharaj Pearl Jewellery"}
                                  </h4>
                                  {item.selectedSize && (
                                    <p className="font-sans text-[11px] text-[#171310]/60">
                                      Size: {item.selectedSize}
                                    </p>
                                  )}
                                  <p className="font-sans text-xs text-[#171310]/70 font-medium">
                                    Qty: {item.quantity} × ₹
                                    {item.unitPrice.toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-center">
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="py-1.5 px-4 bg-[#FFFDF8] border border-[#171310]/20 text-[#171310] hover:bg-[#171310] hover:text-[#F7F3EB] font-sans text-xs font-semibold tracking-wide transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. WISHLIST TAB */}
            {activeDashboardTab === "wishlist" && (
              <div className="bg-[#FFFDF8] border border-[#171310]/15 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#171310]/10">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-[#171310]">
                      Saved Wishlist
                    </h2>
                    <p className="font-sans text-xs text-[#171310]/60">
                      Your saved favorite pearl jewellery pieces.
                    </p>
                  </div>
                  <span className="font-sans text-xs font-semibold px-3 py-1 bg-[#C5A15A]/10 text-[#C5A15A] border border-[#C5A15A]/30">
                    {wishlistedProducts.length} Items
                  </span>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] border border-[#171310]/15 flex items-center justify-center text-rose-500">
                      <Heart size={28} strokeWidth={1.2} />
                    </div>
                    <h3 className="font-serif text-xl font-normal text-[#171310]">
                      Your wishlist is currently empty.
                    </h3>
                    <p className="font-sans text-xs text-[#171310]/60 max-w-sm mx-auto">
                      Save your favorite South Sea and Akoya pearl creations to
                      purchase anytime.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentPage("shop");
                        if (typeof window !== "undefined")
                          window.history.pushState({}, "", "/shop");
                      }}
                      className="py-3 px-6 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A15A] transition-colors"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="group bg-[#FFFDF8] border border-[#171310]/15 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative"
                      >
                        <div className="relative aspect-square bg-[#FAF7F2] overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Remove Wishlist Button */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(p.id)}
                            className="absolute top-3 right-3 p-2 bg-[#FFFDF8]/90 text-rose-600 hover:bg-rose-600 hover:text-white rounded-full transition-colors shadow-sm"
                            title="Remove from Wishlist"
                          >
                            <Trash2 size={16} />
                          </button>

                          {p.badge && (
                            <span className="absolute top-3 left-3 bg-[#171310] text-[#F7F3EB] font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                              {p.badge}
                            </span>
                          )}
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-[#C5A15A]">
                              {p.pearlType} • {p.materialFilter}
                            </span>
                            <h3 className="font-serif text-base font-normal text-[#171310] mt-0.5 line-clamp-1">
                              {p.name}
                            </h3>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="font-serif text-base font-semibold text-[#171310]">
                                {p.formattedPrice ||
                                  `₹${p.price.toLocaleString("en-IN")}`}
                              </span>
                              {p.comparePrice && (
                                <span className="font-sans text-xs text-[#171310]/40 line-through">
                                  ₹{p.comparePrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addToCart(p)}
                            className="w-full py-2.5 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-wider uppercase hover:bg-[#C5A15A] transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingBag size={14} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. MY PROFILE TAB */}
            {activeDashboardTab === "profile" && (
              <div className="bg-[#FFFDF8] border border-[#171310]/15 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#171310]/10">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-[#171310]">
                      My Profile
                    </h2>
                    <p className="font-sans text-xs text-[#171310]/60">
                      Manage your personal information and contact details.
                    </p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="py-2 px-4 bg-[#FAF7F2] border border-[#171310]/20 text-[#171310] font-sans text-xs font-semibold tracking-wide hover:bg-[#171310] hover:text-[#F7F3EB] transition-colors flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {profileSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600 shrink-0"
                    />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {isEditingProfile ? (
                  <form
                    onSubmit={handleSaveProfile}
                    className="space-y-6 max-w-xl"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block font-sans text-xs font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#171310]/20 font-sans text-sm focus:outline-none focus:border-[#C5A15A]"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-xs font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled
                          value={user.email}
                          className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 font-sans text-sm text-gray-500 cursor-not-allowed"
                        />
                        <span className="text-[10px] text-[#171310]/50 mt-1 block">
                          Email is tied to your account login.
                        </span>
                      </div>

                      <div>
                        <label className="block font-sans text-xs font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#171310]/20 font-sans text-sm focus:outline-none focus:border-[#C5A15A]"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-xs font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                          Date of Birth (Optional)
                        </label>
                        <input
                          type="date"
                          value={profileForm.dob}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              dob: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#171310]/20 font-sans text-sm focus:outline-none focus:border-[#C5A15A]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-[#171310]/10">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-widest uppercase hover:bg-[#C5A15A] transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="py-2.5 px-6 bg-[#FAF7F2] text-[#171310] border border-[#171310]/20 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-[#171310] hover:text-[#F7F3EB] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4 p-5 bg-[#FAF7F2] border border-[#171310]/10">
                      <h3 className="font-serif text-lg font-normal text-[#171310] pb-2 border-b border-[#171310]/10">
                        Account Details
                      </h3>

                      <div className="space-y-3 font-sans text-xs">
                        <div>
                          <span className="text-[#171310]/50 block text-[10px] uppercase font-semibold">
                            Full Name
                          </span>
                          <span className="font-medium text-sm text-[#171310]">
                            {user.name}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#171310]/50 block text-[10px] uppercase font-semibold">
                            Email Address
                          </span>
                          <span className="font-medium text-sm text-[#171310]">
                            {user.email}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#171310]/50 block text-[10px] uppercase font-semibold">
                            Phone Number
                          </span>
                          <span className="font-medium text-sm text-[#171310]">
                            {user.phone || "Not provided"}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#171310]/50 block text-[10px] uppercase font-semibold">
                            Date of Birth
                          </span>
                          <span className="font-medium text-sm text-[#171310]">
                            {user.dob
                              ? new Date(user.dob).toLocaleDateString()
                              : "Not provided"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-5 bg-[#FAF7F2] border border-[#171310]/10">
                      <h3 className="font-serif text-lg font-normal text-[#171310] pb-2 border-b border-[#171310]/10">
                        Security & Authentication
                      </h3>

                      <div className="space-y-3 font-sans text-xs">
                        <div>
                          <span className="text-[#171310]/50 block text-[10px] uppercase font-semibold">
                            Login Method
                          </span>
                          <span className="font-semibold text-sm text-[#171310] flex items-center gap-1.5 mt-1">
                            {user.provider === "google" ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>{" "}
                                Google OAuth
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                                Standard Email / Password
                              </>
                            )}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#171310]/50 block text-[10px] uppercase font-semibold">
                            Account ID
                          </span>
                          <span className="font-mono text-xs text-[#171310]/70 truncate block">
                            {user.id}
                          </span>
                        </div>

                        {user.avatarUrl && (
                          <div>
                            <span className="text-[#171310]/50 block text-[10px] uppercase font-semibold mb-1">
                              Google Avatar
                            </span>
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-12 h-12 rounded-full border border-[#C5A15A]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. ADDRESSES TAB */}
            {activeDashboardTab === "addresses" && (
              <div className="bg-[#FFFDF8] border border-[#171310]/15 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#171310]/10">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-[#171310]">
                      Shipping Addresses
                    </h2>
                    <p className="font-sans text-xs text-[#171310]/60">
                      Manage delivery addresses for seamless checkout.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="py-2.5 px-4 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-wider uppercase hover:bg-[#C5A15A] transition-colors flex items-center gap-2"
                  >
                    <Plus size={14} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] border border-[#171310]/15 flex items-center justify-center text-[#171310]/40">
                      <MapPin size={28} strokeWidth={1.2} />
                    </div>
                    <h3 className="font-serif text-xl font-normal text-[#171310]">
                      No saved addresses yet.
                    </h3>
                    <p className="font-sans text-xs text-[#171310]/60 max-w-sm mx-auto">
                      Add a shipping address to speed up your checkout process.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddAddress}
                      className="py-3 px-6 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A15A] transition-colors"
                    >
                      Add Address Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 bg-[#FAF7F2] border transition-all relative flex flex-col justify-between space-y-4 ${
                          addr.isDefault
                            ? "border-[#C5A15A] shadow-sm"
                            : "border-[#171310]/15 hover:border-[#171310]/30"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif text-base font-semibold text-[#171310]">
                              {addr.fullName}
                            </h4>
                            {addr.isDefault && (
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C5A15A] text-[#FFFDF8]">
                                DEFAULT ADDRESS
                              </span>
                            )}
                          </div>

                          <div className="font-sans text-xs text-[#171310]/80 space-y-1">
                            <p>
                              {addr.houseFlat}, {addr.street}
                            </p>
                            <p>
                              {addr.area}, {addr.city}
                            </p>
                            <p>
                              {addr.state} - {addr.pincode}
                            </p>
                            <p className="font-medium text-[#171310]">
                              {addr.country}
                            </p>
                            <p className="text-[#171310]/60 pt-1">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#171310]/10 flex items-center justify-between gap-2">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="font-sans text-xs text-[#C5A15A] hover:underline font-semibold"
                            >
                              Set as Default
                            </button>
                          )}
                          <div className="flex items-center gap-3 ml-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenEditAddress(addr)}
                              className="p-1.5 text-[#171310]/60 hover:text-[#C5A15A] transition-colors"
                              title="Edit Address"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-1.5 text-[#171310]/60 hover:text-rose-600 transition-colors"
                              title="Delete Address"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. SAVED PAYMENTS TAB */}
            {activeDashboardTab === "payments" && (
              <div className="bg-[#FFFDF8] border border-[#171310]/15 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#171310]/10">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-[#171310]">
                      Saved Payment Methods
                    </h2>
                    <p className="font-sans text-xs text-[#171310]/60">
                      Manage tokenized payment references and security
                      credentials.
                    </p>
                  </div>
                </div>

                {/* Security Requirement Banner */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-sans space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-950">
                    <ShieldCheck size={16} className="text-amber-600" />
                    <span>PCI-DSS Compliant Security Guarantee</span>
                  </div>
                  <p className="text-amber-900/80 leading-relaxed font-light">
                    For your financial safety, Maharaj Jewellery never stores
                    raw credit card numbers, CVVs, or UPI PINs. All payment
                    transactions are encrypted and processed through certified
                    PCI-DSS payment gateways.
                  </p>
                </div>

                {/* Requirement: Display "No saved payment methods" instead of fake cards */}
                <div className="py-16 text-center space-y-4 bg-[#FAF7F2] border border-[#171310]/10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#FFFDF8] border border-[#171310]/15 flex items-center justify-center text-[#171310]/40">
                    <CreditCard size={30} strokeWidth={1.2} />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#171310]">
                    No saved payment methods
                  </h3>
                  <p className="font-sans text-xs text-[#171310]/60 max-w-sm mx-auto">
                    You currently have no saved payment tokens. You can securely
                    select Razorpay, Credit/Debit Cards, UPI, or Net Banking
                    during checkout.
                  </p>
                </div>
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {activeDashboardTab === "settings" && (
              <div className="bg-[#FFFDF8] border border-[#171310]/15 p-6 sm:p-8 shadow-sm space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-[#171310]/10">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-[#171310]">
                      Account Settings
                    </h2>
                    <p className="font-sans text-xs text-[#171310]/60">
                      Manage notifications, security preferences, and privacy
                      controls.
                    </p>
                  </div>
                </div>

                {settingsSavedMsg && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600 shrink-0"
                    />
                    <span>{settingsSavedMsg}</span>
                  </div>
                )}

                {/* Notifications Section */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-normal text-[#171310] flex items-center gap-2">
                    <Bell size={18} className="text-[#C5A15A]" />
                    <span>Notification Preferences</span>
                  </h3>

                  <div className="space-y-3 font-sans text-xs bg-[#FAF7F2] p-5 border border-[#171310]/10">
                    {[
                      {
                        key: "emailOrders",
                        label: "Email Order Updates",
                        desc: "Receive real-time shipment notifications and receipts.",
                      },
                      {
                        key: "emailPromotions",
                        label: "VIP Exclusive Invitations",
                        desc: "Receive invitations for rare pearl releases and private masterclasses.",
                      },
                      {
                        key: "smsUpdates",
                        label: "SMS Delivery Alerts",
                        desc: "Receive SMS dispatch alerts on the day of delivery.",
                      },
                      {
                        key: "whatsappAlerts",
                        label: "WhatsApp Concierge Alerts",
                        desc: "Connect directly with our lead jeweler for order status.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-start justify-between py-2 border-b border-[#171310]/10 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-[#171310]">
                            {item.label}
                          </p>
                          <p className="text-[#171310]/60 font-light">
                            {item.desc}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={(notificationSettings as any)[item.key]}
                            onChange={(e) => {
                              setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked,
                              });
                              setSettingsSavedMsg("Preferences updated.");
                              setTimeout(() => setSettingsSavedMsg(""), 2500);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A15A]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy & Account Controls */}
                <div className="space-y-4 pt-4 border-t border-[#171310]/10">
                  <h3 className="font-serif text-lg font-normal text-[#171310] flex items-center gap-2">
                    <Lock size={18} className="text-[#C5A15A]" />
                    <span>Privacy & Session</span>
                  </h3>

                  <div className="bg-[#FAF7F2] p-5 border border-[#171310]/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-sans text-xs font-semibold text-[#171310]">
                          Active Customer Session
                        </p>
                        <p className="font-sans text-xs text-[#171310]/60 font-light">
                          Signed in as{" "}
                          <span className="font-medium text-[#171310]">
                            {user.email}
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="py-2.5 px-5 bg-rose-700 text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-rose-800 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        <span>Logout Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL (ADD / EDIT) */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#171310]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#171310]/20 w-full max-w-lg shadow-2xl p-6 space-y-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#171310]/10">
              <h3 className="font-serif text-xl font-normal text-[#171310]">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 text-[#171310]/50 hover:text-[#171310]"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveAddress}
              className="space-y-4 text-left font-sans text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    House / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.houseFlat}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        houseFlat: e.target.value,
                      })
                    }
                    placeholder="Flat 402, Royal Residency"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street: e.target.value })
                    }
                    placeholder="Road No. 36"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    Area / Landmark
                  </label>
                  <input
                    type="text"
                    value={addressForm.area}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, area: e.target.value })
                    }
                    placeholder="Jubilee Hills"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    placeholder="Hyderabad"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    placeholder="Telangana"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        pincode: e.target.value,
                      })
                    }
                    placeholder="500033"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-wider text-[#171310]/80 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#171310]/20 focus:outline-none focus:border-[#C5A15A]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                  className="accent-[#C5A15A] w-4 h-4"
                />
                <label
                  htmlFor="isDefault"
                  className="font-medium text-[#171310]"
                >
                  Set as default shipping address
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#171310]/10">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="py-2 px-4 bg-[#FAF7F2] text-[#171310] border border-[#171310]/20 font-semibold uppercase tracking-wider hover:bg-[#171310] hover:text-[#F7F3EB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 bg-[#171310] text-[#F7F3EB] font-semibold uppercase tracking-wider hover:bg-[#C5A15A] transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#171310]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#171310]/20 w-full max-w-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#171310]/10">
              <div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#C5A15A]">
                  Order Details
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#171310]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#171310]/50 hover:text-[#171310]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Status Timeline */}
            <div className="p-4 bg-[#FAF7F2] border border-[#171310]/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#171310]">
                  Order Status Timeline
                </span>
                <span className="font-mono font-bold text-[#C5A15A]">
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#171310]/70">
                <Clock size={14} className="text-[#C5A15A]" />
                <span>
                  Placed on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                </span>
              </div>

              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div className="pt-2 space-y-2 border-t border-[#171310]/10">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2
                        size={14}
                        className="text-emerald-600 mt-0.5 shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-[#171310]">
                          {step.status}
                        </span>
                        {step.note && (
                          <span className="text-[#171310]/60 ml-2">
                            — {step.note}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-normal text-[#171310]">
                Purchased Items
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FAF7F2] border border-[#171310]/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover border border-[#171310]/15 shrink-0 bg-white"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 bg-[#F5EBDD] flex items-center justify-center text-[#171310]/40 shrink-0"
                        >
                          <Package size={20} />
                        </div>
                      )}
                      <div>
                        <h5 className="font-serif text-sm font-normal text-[#171310]">
                          {item.product?.name || "Maharaj Pearl Jewellery"}
                        </h5>
                        {item.selectedSize && (
                          <p className="font-sans text-[11px] text-[#171310]/60">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        <p className="font-sans text-xs text-[#171310]/70">
                          Qty: {item.quantity} × ₹
                          {item.unitPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-sm font-semibold text-[#171310]">
                      ₹
                      {(item.quantity * item.unitPrice).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans text-xs">
              <div className="p-4 bg-[#FAF7F2] border border-[#171310]/10 space-y-1">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#171310]/50">
                  Shipping Address
                </span>
                <p className="font-semibold text-[#171310]">
                  {selectedOrder.customerName}
                </p>
                <p className="text-[#171310]/80">
                  {selectedOrder.shippingAddress.street}
                </p>
                <p className="text-[#171310]/80">
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state} -{" "}
                  {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-[#171310]/80">
                  {selectedOrder.shippingAddress.country}
                </p>
                <p className="text-[#171310]/60">
                  Phone: {selectedOrder.customerPhone}
                </p>
              </div>

              <div className="p-4 bg-[#FAF7F2] border border-[#171310]/10 space-y-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#171310]/50">
                  Payment Summary
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#171310]/70">Subtotal</span>
                    <span className="font-medium text-[#171310]">
                      ₹{selectedOrder.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span>
                        - ₹{selectedOrder.discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#171310]/70">Shipping</span>
                    <span className="font-medium text-[#171310]">
                      {selectedOrder.shippingFee === 0
                        ? "FREE"
                        : `₹${selectedOrder.shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#171310]/10 font-semibold text-sm text-[#171310]">
                    <span>Total Amount</span>
                    <span>
                      ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#171310]/60 pt-1">
                    Method: {selectedOrder.paymentMethod} (
                    {selectedOrder.paymentStatus})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-[#171310]/10">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-6 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-wider uppercase hover:bg-[#C5A15A] transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
