import React, { useState, useEffect } from "react";
import { useAdmin, AdminTab } from "../../context/AdminContext";
import {
  Search,
  Package,
  ShoppingBag,
  Users,
  Briefcase,
  ArrowRight,
  X,
} from "lucide-react";

export const AdminGlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    products,
    orders,
    customers,
    corporateEnquiries,
    setActiveTab,
  } = useAdmin();

  const [query, setQuery] = useState("");

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === "Escape" && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.trim().toLowerCase();

  // Search matching logic
  const matchedProducts = q
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.collection.toLowerCase().includes(q) ||
            p.pearlType.toLowerCase().includes(q),
        )
        .slice(0, 4)
    : [];

  const matchedOrders = q
    ? orders
        .filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerEmail.toLowerCase().includes(q),
        )
        .slice(0, 4)
    : [];

  const matchedCustomers = q
    ? customers
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q),
        )
        .slice(0, 4)
    : [];

  const matchedCorporate = q
    ? corporateEnquiries
        .filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.company.toLowerCase().includes(q) ||
            e.enquiryNumber.toLowerCase().includes(q),
        )
        .slice(0, 4)
    : [];

  const hasResults =
    matchedProducts.length > 0 ||
    matchedOrders.length > 0 ||
    matchedCustomers.length > 0 ||
    matchedCorporate.length > 0;

  const navigateAndClose = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsSearchModalOpen(false);
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 bg-[#29231F]/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-[#FFFDF8] border border-[#29231F]/20 max-w-2xl w-full shadow-2xl overflow-hidden relative">
        {/* INPUT HEADER */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#29231F]/10 bg-[#F5F1EB]">
          <Search className="w-5 h-5 text-[#C8A96B] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search products, orders, customers, or corporate requests..."
            className="w-full bg-transparent border-none text-sm text-[#29231F] placeholder-[#29231F]/40 px-3 focus:outline-none font-medium"
            autoFocus
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-[#29231F]/50 hover:text-[#29231F] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RESULTS BODY */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {!q && (
            <div className="py-8 text-center text-[#29231F]/50">
              <p className="font-serif text-base text-[#29231F]/80 mb-1">
                Global Admin Search
              </p>
              <p className="text-xs">
                Search products by name, orders by ID, customers by email, or
                corporate enquiries.
              </p>
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center text-[#29231F]/60">
              <p className="text-sm font-medium mb-1">
                No results matching "{query}"
              </p>
              <p className="text-xs text-[#29231F]/40">
                Try checking spelling or using a broader term like "pearl" or
                "order".
              </p>
            </div>
          )}

          {/* PRODUCTS SECTION */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#C8A96B] font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Products
                </span>
                <button
                  onClick={() => navigateAndClose("products")}
                  className="hover:underline flex items-center gap-1 text-[10px]"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigateAndClose("products")}
                    className="flex items-center justify-between p-2.5 bg-[#F5F1EB] hover:bg-[#E8DED0]/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-8 h-8 object-cover border border-[#29231F]/10"
                      />
                      <div>
                        <p className="font-medium text-[#29231F]">{p.name}</p>
                        <p className="text-[10px] text-[#29231F]/60">
                          {p.pearlType} • {p.formattedPrice}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#C8A96B]/20 text-[#29231F] font-semibold px-2 py-0.5">
                      Product
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS SECTION */}
          {matchedOrders.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#C8A96B] font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Orders
                </span>
                <button
                  onClick={() => navigateAndClose("orders")}
                  className="hover:underline flex items-center gap-1 text-[10px]"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {matchedOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => navigateAndClose("orders")}
                    className="flex items-center justify-between p-2.5 bg-[#F5F1EB] hover:bg-[#E8DED0]/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-[#29231F]">
                        {o.orderNumber} - {o.customerName}
                      </p>
                      <p className="text-[10px] text-[#29231F]/60">
                        {o.items.length} item(s) • ₹
                        {o.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-[10px] bg-[#29231F] text-[#F7F3EC] font-semibold px-2 py-0.5">
                      {o.orderStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMERS SECTION */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#C8A96B] font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Customers
                </span>
                <button
                  onClick={() => navigateAndClose("customers")}
                  className="hover:underline flex items-center gap-1 text-[10px]"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {matchedCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigateAndClose("customers")}
                    className="flex items-center justify-between p-2.5 bg-[#F5F1EB] hover:bg-[#E8DED0]/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-[#29231F]">{c.name}</p>
                      <p className="text-[10px] text-[#29231F]/60">
                        {c.email} • Spent ₹
                        {c.totalSpent.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-[10px] bg-[#E8DED0] text-[#29231F] font-semibold px-2 py-0.5">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CORPORATE SECTION */}
          {matchedCorporate.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#C8A96B] font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Corporate Requests
                </span>
                <button
                  onClick={() => navigateAndClose("corporate-enquiries")}
                  className="hover:underline flex items-center gap-1 text-[10px]"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {matchedCorporate.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => navigateAndClose("corporate-enquiries")}
                    className="flex items-center justify-between p-2.5 bg-[#F5F1EB] hover:bg-[#E8DED0]/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-[#29231F]">
                        {e.company} ({e.name})
                      </p>
                      <p className="text-[10px] text-[#29231F]/60">
                        {e.numberOfGifts} Gifts • {e.occasion}
                      </p>
                    </div>
                    <span className="text-[10px] border border-[#29231F]/30 text-[#29231F] font-semibold px-2 py-0.5">
                      {e.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER TIP */}
        <div className="px-4 py-2 border-t border-[#29231F]/10 bg-[#F5F1EB] flex items-center justify-between text-[10px] text-[#29231F]/50">
          <span>Press ESC or click outside to dismiss</span>
          <span>MAHARAJ JEWELLERY ADMIN</span>
        </div>
      </div>
    </div>
  );
};
