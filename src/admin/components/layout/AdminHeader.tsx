import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import {
  Search,
  Bell,
  Menu,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const AdminHeader: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const {
    activeTab,
    setIsSearchModalOpen,
    adminUser,
    logout,
    orders,
    corporateEnquiries,
  } = useAdmin();
  const { setCurrentPage } = useShop();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Notifications calculation
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === "Pending",
  ).length;
  const newCorporateCount = corporateEnquiries.filter(
    (c) => c.status === "New",
  ).length;
  const totalNotifications = pendingOrdersCount + newCorporateCount;

  // Tab Title Map
  const tabTitles: Record<string, { title: string; subtext: string }> = {
    dashboard: {
      title: "Admin Overview",
      subtext: "Real-time performance summary & active metrics",
    },
    products: {
      title: "Product Catalogue",
      subtext: "Manage high jewellery items, pricing, and inventory",
    },
    categories: {
      title: "Product Categories",
      subtext: "Organize store categories and display order",
    },
    collections: {
      title: "Jewellery Collections",
      subtext: "Curate themed and editorial collections",
    },
    orders: {
      title: "Order Management",
      subtext: "Process customer orders, shipments, and status",
    },
    customers: {
      title: "Customer Directory",
      subtext: "Client profiles, order histories, and VIP tiers",
    },
    "corporate-enquiries": {
      title: "Corporate Gifting Enquiries",
      subtext: "Manage high-volume institutional requests",
    },
    "corporate-orders": {
      title: "Corporate Orders",
      subtext: "Track bulk corporate procurement",
    },
    "homepage-cms": {
      title: "Homepage Content Manager",
      subtext: "Update hero banner, stories, and editorial grids",
    },
    "about-cms": {
      title: "About Us CMS",
      subtext: "Manage heritage story, values, and brand philosophy",
    },
    "education-cms": {
      title: "Pearl Education CMS",
      subtext: "Educational masterclasses and pearl quality guides",
    },
    "bridal-cms": {
      title: "Bridal Content Manager",
      subtext: "Bridal campaign banners and curated wedding sets",
    },
    "contact-cms": {
      title: "Contact Enquiries",
      subtext: "Private consultation and concierge messages",
    },
    banners: {
      title: "Banners & Marketing",
      subtext: "Manage promotional banners and campaign links",
    },
    reviews: {
      title: "Customer Reviews",
      subtext: "Moderate product reviews and testimonials",
    },
    newsletter: {
      title: "Newsletter Subscribers",
      subtext: "Export email list and view inner circle members",
    },
    analytics: {
      title: "Sales & Performance Analytics",
      subtext: "Revenue trends, top products, and conversion metrics",
    },
    settings: {
      title: "Store Settings",
      subtext: "Store info, taxes, shipping rules, and SEO defaults",
    },
  };

  const currentInfo = tabTitles[activeTab] || {
    title: "Admin Panel",
    subtext: "Maharaj Jewellery Management",
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F5F1EB] border-b border-[#29231F]/10 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* LEFT: MOBILE TOGGLE + TITLE */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-[#29231F] hover:bg-[#E8DED0] rounded-none transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-serif text-lg md:text-xl text-[#29231F] font-semibold tracking-wide leading-tight">
            {currentInfo.title}
          </h1>
          <p className="text-[11px] text-[#29231F]/60 hidden sm:block">
            {currentInfo.subtext}
          </p>
        </div>
      </div>

      {/* RIGHT: SEARCH + PUBLIC VIEW + NOTIFICATIONS + PROFILE */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* GLOBAL SEARCH TRIGGER */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-2 bg-[#FFFDF8] border border-[#29231F]/15 px-3 py-1.5 text-xs text-[#29231F]/60 hover:text-[#29231F] hover:border-[#C8A96B] transition-all shadow-xs"
        >
          <Search className="w-3.5 h-3.5 text-[#C8A96B]" />
          <span className="hidden lg:inline">
            Search products, orders, customers...
          </span>
          <span className="lg:hidden">Search</span>
          <kbd className="hidden lg:inline-block bg-[#E8DED0]/50 text-[9px] px-1.5 py-0.5 border border-[#29231F]/10 font-mono text-[#29231F]/80">
            ⌘K
          </kbd>
        </button>

        {/* VIEW PUBLIC WEBSITE */}
        <button
          onClick={() => setCurrentPage("home")}
          className="hidden sm:flex items-center gap-1.5 text-xs text-[#29231F]/70 hover:text-[#C8A96B] px-2 py-1 transition-colors"
          title="View Store Front"
        >
          <span className="text-[11px] uppercase tracking-wider font-medium">
            Store Front
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* NOTIFICATIONS POPOVER */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-[#29231F]/70 hover:text-[#29231F] relative hover:bg-[#E8DED0]/40 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8A96B] text-[#29231F] text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalNotifications}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              className="absolute right-0 mt-2 w-72 md:w-80 bg-[#FFFDF8] border border-[#29231F]/15 shadow-xl p-4 z-50 animate-fadeIn"
              onMouseLeave={() => setIsNotifOpen(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#29231F]/10 mb-3">
                <span className="font-serif text-sm font-semibold text-[#29231F]">
                  Notifications
                </span>
                <span className="text-[10px] bg-[#C8A96B]/20 text-[#29231F] font-bold px-2 py-0.5">
                  {totalNotifications} New
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto text-xs">
                {pendingOrdersCount > 0 && (
                  <div className="p-2.5 bg-[#F5F1EB] border-l-2 border-[#C8A96B] flex flex-col gap-1">
                    <span className="font-medium text-[#29231F]">
                      Pending Orders
                    </span>
                    <span className="text-[#29231F]/70 text-[11px]">
                      {pendingOrdersCount} order(s) require review and
                      processing.
                    </span>
                  </div>
                )}
                {newCorporateCount > 0 && (
                  <div className="p-2.5 bg-[#F5F1EB] border-l-2 border-[#29231F] flex flex-col gap-1">
                    <span className="font-medium text-[#29231F]">
                      New Corporate Enquiry
                    </span>
                    <span className="text-[#29231F]/70 text-[11px]">
                      {newCorporateCount} corporate gifting request(s) awaiting
                      reply.
                    </span>
                  </div>
                )}
                {totalNotifications === 0 && (
                  <p className="text-center py-4 text-[#29231F]/50 text-xs italic">
                    All notifications cleared. Everything up to date.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ADMIN PROFILE */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-2 hover:bg-[#E8DED0]/40 transition-colors"
          >
            <div className="w-7 h-7 bg-[#29231F] text-[#F7F3EC] flex items-center justify-center font-serif text-xs font-semibold rounded-full border border-[#C8A96B]">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-[#29231F] leading-none">
                {adminUser?.name || "Admin"}
              </span>
              <span className="text-[9px] text-[#C8A96B] uppercase tracking-wider font-semibold">
                {adminUser?.role || "Super Admin"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#29231F]/50 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-[#FFFDF8] border border-[#29231F]/15 shadow-xl py-2 z-50"
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="px-4 py-2 border-b border-[#29231F]/10">
                <p className="text-xs font-semibold text-[#29231F]">
                  {adminUser?.name}
                </p>
                <p className="text-[10px] text-[#29231F]/60 truncate">
                  {adminUser?.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setCurrentPage("home");
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#29231F]/80 hover:bg-[#F5F1EB] hover:text-[#29231F] flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>Go to Customer Store</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
