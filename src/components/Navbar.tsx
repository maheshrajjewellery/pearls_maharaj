import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, X, Mail } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useShop } from "@/context/ShopContext";
import {
  ShopCategory,
  PearlType,
  StoneFilter,
  ColorFilter,
} from "@/types/shop";

interface MegaCategoryOption {
  label: string;
  category?: ShopCategory;
  pearlType?: PearlType;
  stone?: StoneFilter;
  color?: ColorFilter;
  preset?: "bestsellers" | "new-arrivals";
}

interface MegaColumn {
  title: string;
  options: MegaCategoryOption[];
}

const megaMenuColumns: MegaColumn[] = [
  {
    title: "SHOP BY CATEGORY",
    options: [
      { label: "Pearl Necklaces", category: "necklaces" },
      { label: "Pearl Sets", category: "pearl-sets" },
      { label: "Pearl Bangles", category: "bangles" },
      { label: "Pearl Bracelets", category: "bracelets" },
      { label: "Pearl Earrings", category: "earrings" },
      { label: "Pearl Rings", category: "rings" },
      { label: "Pearl Cufflinks", category: "cufflinks" },
      { label: "Real Gems Stones", category: "gemstones" },
      { label: "Salt Water Pearls", category: "saltwater" },
      { label: "Pearl Combos", category: "pearl-combos" },
    ],
  },
  {
    title: "TYPE",
    options: [
      { label: "Akoya Pearls", pearlType: "Akoya" },
      { label: "Freshwater Pearls", pearlType: "Freshwater" },
      { label: "South Sea Pearls", pearlType: "South Sea" },
      { label: "Tahitian Pearls", pearlType: "Tahitian" },
      { label: "Keshi Pearls", pearlType: "Keshi" },
      { label: "All Types", pearlType: "All Types" },
    ],
  },
  {
    title: "BY STONE",
    options: [
      { label: "Diamond", stone: "Diamond" },
      { label: "Emeralds", stone: "Emeralds" },
      { label: "Pearls", stone: "Pearls" },
      { label: "Ruby", stone: "Ruby" },
      { label: "Sapphire", stone: "Sapphire" },
      { label: "Tanzanite", stone: "Tanzanite" },
      { label: "Multi-Color Beads / Stones", stone: "Multi-Color" },
    ],
  },
  {
    title: "BY COLOR",
    options: [
      { label: "White", color: "White" },
      { label: "Black", color: "Black" },
      { label: "Grey", color: "Grey" },
      { label: "Golden", color: "Golden" },
      { label: "Pink / Peach", color: "Pink / Peach" },
      { label: "Multi-color", color: "Multi-color" },
    ],
  },
];

const mainNavLinks = [
  { label: "Home", action: "home" },
  { label: "Shop", action: "shop", hasMegaMenu: true },
  { label: "About us", action: "about" },
  { label: "Contact us", action: "contact" },
  { label: "Make Your Bundle (add 5% off)", action: "bundle" },
  { label: "Pearl Education", action: "education" },
  { label: "Corporate Gifting", action: "gifting" },
];

export default function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeHoverLink, setActiveHoverLink] = useState<string | null>(null);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    cartCount,
    setIsCartOpen,
    openSearch,
    applyMegaFilter,
    setCurrentPage,
    currentPage,
    user,
  } = useShop();

  // Navigation click handler
  const handleNavClick = (action: string) => {
    setMobileOpen(false);
    setIsMegaMenuOpen(false);

    if (action === "home") {
      setCurrentPage("home");
      window.history.pushState({}, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "contact") {
      setCurrentPage("contact");
      window.history.pushState({}, "", "/contact");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "about") {
      setCurrentPage("about");
      window.history.pushState({}, "", "/about");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "shop") {
      setCurrentPage("shop");
      applyMegaFilter({ category: "all" });
      window.history.pushState({}, "", "/shop");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "bundle") {
      setCurrentPage("shop");
      applyMegaFilter({ category: "pearl-combos" });
      window.history.pushState({}, "", "/shop?category=pearl-combos");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "bridal") {
      setCurrentPage("shop");
      applyMegaFilter({ category: "bridal" });
      window.history.pushState({}, "", "/shop?category=bridal");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "education") {
      setCurrentPage("education");
      window.history.pushState({}, "", "/education");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "gifting") {
      setCurrentPage("gifting");
      window.history.pushState({}, "", "/gifting");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "login") {
      setCurrentPage("login");
      window.history.pushState({}, "", "/login");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "dashboard") {
      setCurrentPage("dashboard");
      window.history.pushState({}, "", "/customer/dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "admin") {
      setCurrentPage("admin");
      window.history.pushState({}, "", "/admin");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMegaOptionClick = (option: MegaCategoryOption) => {
    setIsMegaMenuOpen(false);
    setCurrentPage("shop");

    applyMegaFilter({
      category: option.category,
      pearlType: option.pearlType,
      stone: option.stone,
      color: option.color,
      preset: option.preset,
    });

    let queryParam = "";
    if (option.category) queryParam = `?category=${option.category}`;
    else if (option.pearlType) queryParam = `?pearlType=${option.pearlType}`;
    else if (option.stone) queryParam = `?stone=${option.stone}`;
    else if (option.color) queryParam = `?color=${option.color}`;
    else if (option.preset) queryParam = `?preset=${option.preset}`;

    window.history.pushState({}, "", `/shop${queryParam}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMouseEnterShop = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeaveShop = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  return (
    <>
      {/* DESKTOP & MOBILE HEADER BAR (Dark Slate Green #30372F) */}
      <header
        className={`sticky top-0 z-50 w-full bg-[#30372F] text-[#F5EBDD] border-b border-[rgba(197,161,90,0.25)] transition-all duration-300 ease-in-out ${
          isScrolled ? "shadow-[0_4px_24px_rgba(48,55,47,0.3)]" : ""
        }`}
      >
        <div className="mx-auto max-w-[1720px] px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex h-[80px] lg:h-[88px] items-center justify-between">
            {/* LEFT: PEARLS BY MANGATRAI LOGO */}

            <button
              onClick={() => handleNavClick("home")}
              className="flex items-center justify-center group focus:outline-none"
              aria-label="MAHESHRAJ Jewellery Home"
            >
              <img
                src="image.png"
                alt="MAHESHRAJ Jewellery"
                width={180}
                height={80}
                className="h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>

            {/* CENTER: DESKTOP NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
              {mainNavLinks.map(({ label, action, hasMegaMenu }) => {
                const isCurrent =
                  (action === "gifting" && currentPage === "gifting") ||
                  (action === "education" && currentPage === "education") ||
                  (action === "about" && currentPage === "about") ||
                  (action === "contact" && currentPage === "contact") ||
                  (action === "shop" && currentPage === "shop") ||
                  (action === "home" && currentPage === "home");

                const isHovered = activeHoverLink === label;

                return (
                  <div
                    key={label}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => {
                      setActiveHoverLink(label);
                      if (hasMegaMenu) handleMouseEnterShop();
                    }}
                    onMouseLeave={() => {
                      setActiveHoverLink(null);
                      if (hasMegaMenu) handleMouseLeaveShop();
                    }}
                  >
                    <button
                      onClick={() => handleNavClick(action)}
                      className={`relative font-sans text-[12px] xl:text-[13px] font-medium tracking-wide transition-colors duration-200 ease-out flex items-center focus:outline-none ${
                        isHovered || isCurrent
                          ? "text-[#C5A15A]"
                          : "text-[#F5EBDD] hover:text-[#C5A15A]"
                      }`}
                    >
                      <span>{label}</span>

                      {/* Smooth Champagne Gold underline */}
                      <span
                        className={`absolute -bottom-1 left-0 h-[2px] bg-[#C5A15A] transition-all duration-300 pointer-events-none ${
                          isHovered || isCurrent ? "w-full" : "w-0"
                        }`}
                      />
                    </button>

                    {/* SHOP MEGA-MENU DROPDOWN */}
                    {hasMegaMenu && (
                      <AnimatePresence>
                        {isMegaMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{
                              duration: 0.25,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="absolute top-full -left-20 w-[1100px] xl:w-[1240px] bg-[#30372F] text-[#F5EBDD] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[rgba(197,161,90,0.25)] p-8 xl:p-10 rounded-b-md z-50 pointer-events-auto cursor-default"
                            onMouseEnter={handleMouseEnterShop}
                            onMouseLeave={handleMouseLeaveShop}
                          >
                            <div className="grid grid-cols-12 gap-8 items-start">
                              {/* Left 4 Columns: CATEGORY, TYPE, BY STONE, BY COLOR */}
                              <div className="col-span-8 grid grid-cols-4 gap-6">
                                {megaMenuColumns.map((col) => (
                                  <div
                                    key={col.title}
                                    className="flex flex-col"
                                  >
                                    <h4 className="font-sans text-[11px] font-bold tracking-wider uppercase text-[#C5A15A] mb-4 pb-1 border-b border-[rgba(197,161,90,0.25)]">
                                      {col.title}
                                    </h4>
                                    <ul className="space-y-2.5">
                                      {col.options.map((opt) => (
                                        <li key={opt.label}>
                                          <button
                                            onClick={() =>
                                              handleMegaOptionClick(opt)
                                            }
                                            className="text-left w-full font-sans text-[13px] text-[#F5EBDD]/85 hover:text-[#C5A15A] hover:font-medium transition-colors duration-150"
                                          >
                                            {opt.label}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              {/* Right Side: 2 Visual Featured Cards */}
                              <div className="col-span-4 grid grid-cols-2 gap-4">
                                {/* Card 1: BEST SELLERS */}
                                <div
                                  onClick={() =>
                                    handleMegaOptionClick({
                                      label: "Best Sellers",
                                      preset: "bestsellers",
                                    })
                                  }
                                  className="group cursor-pointer flex flex-col items-center text-center"
                                >
                                  <div className="w-full aspect-[4/5] rounded overflow-hidden shadow-sm relative bg-[#252C24] mb-3 border border-[rgba(197,161,90,0.25)]">
                                    <img
                                      src="https://images.pexels.com/photos/10835519/pexels-photo-10835519.jpeg?auto=compress&cs=tinysrgb&w=800"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=800";
                                      }}
                                      alt="Best Sellers"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>
                                  <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-[#F5EBDD] group-hover:text-[#C5A15A] transition-colors">
                                    BEST SELLERS
                                  </span>
                                </div>

                                {/* Card 2: NEW COLLECTION */}
                                <div
                                  onClick={() =>
                                    handleMegaOptionClick({
                                      label: "New Arrivals",
                                      preset: "new-arrivals",
                                    })
                                  }
                                  className="group cursor-pointer flex flex-col items-center text-center"
                                >
                                  <div className="w-full aspect-[4/5] rounded overflow-hidden shadow-sm relative bg-[#252C24] mb-3 border border-[rgba(197,161,90,0.25)]">
                                    <img
                                      src="https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800"
                                      alt="New Collection"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>
                                  <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-[#F5EBDD] group-hover:text-[#C5A15A] transition-colors">
                                    NEW COLLECTION
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* RIGHT UTILITY ICONS */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
              {/* Mail Button */}
              <button
                onClick={() => handleNavClick("contact")}
                className="p-1.5 text-[#F5EBDD] hover:text-[#C5A15A] transition-colors focus:outline-none"
                aria-label="Contact Us"
                title="Contact Us"
              >
                <Mail size={20} strokeWidth={1.5} />
              </button>

              {/* Search Button */}
              <button
                onClick={openSearch}
                className="p-1.5 text-[#F5EBDD] hover:text-[#C5A15A] transition-colors focus:outline-none"
                aria-label="Search"
                title="Search Products"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Account Button */}
              <button
                onClick={() => handleNavClick(user ? "dashboard" : "login")}
                className="flex items-center gap-2 p-1.5 text-[#F5EBDD] hover:text-[#C5A15A] transition-colors focus:outline-none"
                aria-label="User Account"
                title={user ? `Signed in as ${user.name}` : "User Account"}
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#C5A15A]"
                  />
                ) : user ? (
                  <div className="w-6 h-6 rounded-full bg-[#C5A15A] text-[#30372F] text-[10px] font-bold flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <User size={20} strokeWidth={1.5} />
                )}
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-[#F5EBDD] hover:text-[#C5A15A] transition-colors focus:outline-none"
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#C5A15A] text-[#30372F] text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                  {cartCount > 0 ? cartCount : 1}
                </span>
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-1.5 text-[#F5EBDD] hover:text-[#C5A15A] transition-colors focus:outline-none ml-1"
                aria-label="Open Mobile Menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#30372F] text-[#F5EBDD] flex flex-col justify-between overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-[80px] border-b border-[rgba(197,161,90,0.25)] flex-shrink-0">
              <button
                onClick={() => handleNavClick("home")}
                className="flex flex-col text-left"
              >
                <span className="font-serif text-2xl font-normal text-[#F5EBDD]">
                  Pearls{" "}
                  <span className="italic font-light text-sm text-[#C5A15A]">
                    by MAHESHRAJ
                  </span>
                </span>
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#F5EBDD] hover:text-[#C5A15A] transition-colors focus:outline-none"
                aria-label="Close Navigation"
              >
                <X size={26} strokeWidth={1.5} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-10">
              {mainNavLinks.map(({ label, action }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(action)}
                  className="font-serif text-2xl font-normal tracking-wide text-[#F5EBDD] hover:text-[#C5A15A] transition-colors"
                >
                  {label}
                </button>
              ))}

              {/* Login / Account button in Mobile Menu Drawer */}
              <button
                onClick={() => handleNavClick(user ? "dashboard" : "login")}
                className="flex items-center gap-2.5 mt-4 px-6 py-2.5 rounded-full border border-[#C5A15A]/50 text-[#C5A15A] hover:bg-[#C5A15A]/10 transition-colors font-sans text-sm tracking-wider uppercase font-medium"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#C5A15A]"
                  />
                ) : user ? (
                  <div className="w-5 h-5 rounded-full bg-[#C5A15A] text-[#30372F] text-[9px] font-bold flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <User size={18} strokeWidth={1.5} />
                )}
                <span>
                  {user ? `My Account (${user.name})` : "Sign In / Login"}
                </span>
              </button>
            </div>

            <div className="px-6 py-6 border-t border-[rgba(197,161,90,0.25)] text-center flex-shrink-0">
              <p className="font-sans text-[11px] tracking-widest uppercase text-[#F5EBDD]/60 font-light">
                PEARLS BY MAHESHRAJ • ESTD 1905
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
