import React from "react";
import { useAdmin, AdminTab } from "../../context/AdminContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  Users,
  Briefcase,
  FileText,
  Megaphone,
  Star,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, expandedGroups, toggleGroup, logout } =
    useAdmin();

  const handleNavClick = (tab: AdminTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const navItemClass = (tab: AdminTab) => {
    const isActive = activeTab === tab;
    return `group flex items-center justify-between px-4 py-2.5 text-xs tracking-wider uppercase transition-all duration-200 ${
      isActive
        ? "bg-[#C8A96B]/15 text-[#29231F] font-semibold border-r-4 border-[#C8A96B]"
        : "text-[#29231F]/70 hover:text-[#29231F] hover:bg-[#E8DED0]/50"
    }`;
  };

  const subNavItemClass = (tab: AdminTab) => {
    const isActive = activeTab === tab;
    return `flex items-center gap-3 pl-9 pr-4 py-2 text-xs tracking-wide transition-all duration-200 ${
      isActive
        ? "text-[#C8A96B] font-medium bg-[#C8A96B]/10 border-r-2 border-[#C8A96B]"
        : "text-[#29231F]/65 hover:text-[#29231F] hover:bg-[#E8DED0]/30"
    }`;
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-[250px] bg-[#F7F3EC] border-r border-[#29231F]/10 flex flex-col transition-transform duration-300 ${
        isMobileOpen
          ? "translate-x-0 shadow-2xl"
          : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* BRANDING LOGO HEADER */}
      <div className="p-6 border-b border-[#29231F]/10 flex items-center justify-between bg-[#F7F3EC]">
        <div className="flex flex-col">
          <span className="font-serif text-xl tracking-[0.25em] text-[#29231F] font-light leading-none">
            MAHARAJ
          </span>
          <span className="text-[9px] tracking-[0.35em] text-[#C8A96B] uppercase font-medium mt-1">
            JEWELLERY
          </span>
          <span className="text-[8px] tracking-[0.15em] text-[#29231F]/40 uppercase mt-0.5">
            ADMIN SYSTEM
          </span>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden text-[#29231F]/60 hover:text-[#29231F] p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* NAVIGATION ITEMS LIST */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 no-scrollbar">
        {/* DASHBOARD */}
        <button
          onClick={() => handleNavClick("dashboard")}
          className={navItemClass("dashboard")}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard
              className={`w-4 h-4 ${activeTab === "dashboard" ? "text-[#C8A96B]" : "text-[#29231F]/60"}`}
            />
            <span>Dashboard</span>
          </div>
        </button>

        {/* CATALOGUE GROUP */}
        <div>
          <button
            onClick={() => toggleGroup("catalogue")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs tracking-wider uppercase text-[#29231F]/70 hover:text-[#29231F] hover:bg-[#E8DED0]/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-[#29231F]/60" />
              <span>Catalogue</span>
            </div>
            {expandedGroups.catalogue ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#29231F]/40" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#29231F]/40" />
            )}
          </button>
          {expandedGroups.catalogue && (
            <div className="mt-1 space-y-0.5 border-l border-[#29231F]/10 ml-5">
              <button
                onClick={() => handleNavClick("products")}
                className={subNavItemClass("products")}
              >
                <Package className="w-3.5 h-3.5 opacity-70" />
                <span>Products</span>
              </button>
              <button
                onClick={() => handleNavClick("categories")}
                className={subNavItemClass("categories")}
              >
                <Layers className="w-3.5 h-3.5 opacity-70" />
                <span>Categories</span>
              </button>
              <button
                onClick={() => handleNavClick("collections")}
                className={subNavItemClass("collections")}
              >
                <Sparkles className="w-3.5 h-3.5 opacity-70" />
                <span>Collections</span>
              </button>
            </div>
          )}
        </div>

        {/* ORDERS */}
        <button
          onClick={() => handleNavClick("orders")}
          className={navItemClass("orders")}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag
              className={`w-4 h-4 ${activeTab === "orders" ? "text-[#C8A96B]" : "text-[#29231F]/60"}`}
            />
            <span>Orders</span>
          </div>
        </button>

        {/* CUSTOMERS */}
        <button
          onClick={() => handleNavClick("customers")}
          className={navItemClass("customers")}
        >
          <div className="flex items-center gap-3">
            <Users
              className={`w-4 h-4 ${activeTab === "customers" ? "text-[#C8A96B]" : "text-[#29231F]/60"}`}
            />
            <span>Customers</span>
          </div>
        </button>

        {/* CORPORATE GIFTING GROUP */}
        <div>
          <button
            onClick={() => toggleGroup("corporate")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs tracking-wider uppercase text-[#29231F]/70 hover:text-[#29231F] hover:bg-[#E8DED0]/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-[#29231F]/60" />
              <span>Corporate Gifting</span>
            </div>
            {expandedGroups.corporate ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#29231F]/40" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#29231F]/40" />
            )}
          </button>
          {expandedGroups.corporate && (
            <div className="mt-1 space-y-0.5 border-l border-[#29231F]/10 ml-5">
              <button
                onClick={() => handleNavClick("corporate-enquiries")}
                className={subNavItemClass("corporate-enquiries")}
              >
                <span>Enquiries</span>
              </button>
              <button
                onClick={() => handleNavClick("corporate-orders")}
                className={subNavItemClass("corporate-orders")}
              >
                <span>Corporate Orders</span>
              </button>
            </div>
          )}
        </div>

        {/* CONTENT (CMS) GROUP */}
        <div>
          <button
            onClick={() => toggleGroup("content")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs tracking-wider uppercase text-[#29231F]/70 hover:text-[#29231F] hover:bg-[#E8DED0]/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#29231F]/60" />
              <span>Content CMS</span>
            </div>
            {expandedGroups.content ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#29231F]/40" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#29231F]/40" />
            )}
          </button>
          {expandedGroups.content && (
            <div className="mt-1 space-y-0.5 border-l border-[#29231F]/10 ml-5">
              <button
                onClick={() => handleNavClick("homepage-cms")}
                className={subNavItemClass("homepage-cms")}
              >
                <span>Homepage</span>
              </button>
              <button
                onClick={() => handleNavClick("about-cms")}
                className={subNavItemClass("about-cms")}
              >
                <span>About Us</span>
              </button>
              <button
                onClick={() => handleNavClick("education-cms")}
                className={subNavItemClass("education-cms")}
              >
                <span>Pearl Education</span>
              </button>
              <button
                onClick={() => handleNavClick("bridal-cms")}
                className={subNavItemClass("bridal-cms")}
              >
                <span>Bridal</span>
              </button>
              <button
                onClick={() => handleNavClick("contact-cms")}
                className={subNavItemClass("contact-cms")}
              >
                <span>Contact Us</span>
              </button>
            </div>
          )}
        </div>

        {/* MARKETING GROUP */}
        <div>
          <button
            onClick={() => toggleGroup("marketing")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs tracking-wider uppercase text-[#29231F]/70 hover:text-[#29231F] hover:bg-[#E8DED0]/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Megaphone className="w-4 h-4 text-[#29231F]/60" />
              <span>Marketing</span>
            </div>
            {expandedGroups.marketing ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#29231F]/40" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#29231F]/40" />
            )}
          </button>
          {expandedGroups.marketing && (
            <div className="mt-1 space-y-0.5 border-l border-[#29231F]/10 ml-5">
              <button
                onClick={() => handleNavClick("banners")}
                className={subNavItemClass("banners")}
              >
                <span>Banners</span>
              </button>
              <button
                onClick={() => handleNavClick("newsletter")}
                className={subNavItemClass("newsletter")}
              >
                <span>Newsletter</span>
              </button>
            </div>
          )}
        </div>

        {/* REVIEWS */}
        <button
          onClick={() => handleNavClick("reviews")}
          className={navItemClass("reviews")}
        >
          <div className="flex items-center gap-3">
            <Star
              className={`w-4 h-4 ${activeTab === "reviews" ? "text-[#C8A96B]" : "text-[#29231F]/60"}`}
            />
            <span>Reviews</span>
          </div>
        </button>

        {/* ANALYTICS */}
        <button
          onClick={() => handleNavClick("analytics")}
          className={navItemClass("analytics")}
        >
          <div className="flex items-center gap-3">
            <BarChart3
              className={`w-4 h-4 ${activeTab === "analytics" ? "text-[#C8A96B]" : "text-[#29231F]/60"}`}
            />
            <span>Analytics</span>
          </div>
        </button>

        {/* SETTINGS */}
        <button
          onClick={() => handleNavClick("settings")}
          className={navItemClass("settings")}
        >
          <div className="flex items-center gap-3">
            <Settings
              className={`w-4 h-4 ${activeTab === "settings" ? "text-[#C8A96B]" : "text-[#29231F]/60"}`}
            />
            <span>Settings</span>
          </div>
        </button>
      </nav>

      {/* FOOTER USER / LOGOUT */}
      <div className="p-4 border-t border-[#29231F]/10 bg-[#E8DED0]/30">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-[#29231F]/80 hover:text-red-700 hover:bg-[#E8DED0]/80 transition-colors"
        >
          <span className="font-medium">Logout Admin</span>
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
