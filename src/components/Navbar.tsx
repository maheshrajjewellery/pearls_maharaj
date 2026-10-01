import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useShop } from "@/context/ShopContext";
import { ShopCategory } from "@/types/shop";

interface MegaMenuColumn {
  title: string;
  categoryAction?: ShopCategory;
  items: {
    label: string;
    categoryId: ShopCategory;
    description: string;
    image: string;
  }[];
}

const megaMenuColumns: MegaMenuColumn[] = [
  {
    title: "SHOP",
    items: [
      {
        label: "New Arrivals",
        categoryId: "new-arrivals",
        description:
          "Freshly crafted designs featuring rare South Sea & Tahitian pearls.",
        image:
          "https://images.pexels.com/photos/10835519/pexels-photo-10835519.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Pearl Necklaces",
        categoryId: "necklaces",
        description:
          "Luminous chokers, opera strands, and solitaire pearl pendants.",
        image:
          "https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Pearl Earrings",
        categoryId: "earrings",
        description:
          "Timeless studs, baroque drop earrings, and diamond-encrusted pairs.",
        image:
          "https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Pearl Bracelets",
        categoryId: "bracelets",
        description:
          "Delicate single-strand bracelets and modern gold cuff accents.",
        image:
          "https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Pearl Rings",
        categoryId: "rings",
        description:
          "Sculptural gold rings highlighting exceptional solitaire pearls.",
        image:
          "https://images.pexels.com/photos/19525066/pexels-photo-19525066.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
  {
    title: "BRIDAL",
    categoryAction: "bridal",
    items: [
      {
        label: "Bridal Sets",
        categoryId: "bridal",
        description:
          "Royal multi-strand heirloom sets designed for sacred wedding vows.",
        image:
          "https://images.pexels.com/photos/25389117/pexels-photo-25389117.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Wedding Jewellery",
        categoryId: "bridal",
        description:
          "Intricate pearl chokers, matha pattis, and bridal drop earrings.",
        image:
          "https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
  {
    title: "COLLECTIONS",
    categoryAction: "all",
    items: [
      {
        label: "Classic Pearls",
        categoryId: "all",
        description:
          "Timeless Akoya and South Sea pearl designs rooted in heritage.",
        image:
          "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Modern Pearls",
        categoryId: "all",
        description:
          "Sculptural metalwork and asymmetrical baroque pearl creations.",
        image:
          "https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        label: "Gemstone Jewellery",
        categoryId: "gemstones",
        description:
          "Radiant emeralds, sapphires, and diamonds paired with fine pearls.",
        image:
          "https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
];

const mainNavLinks = [
  { label: "Home", action: "home" },
  { label: "Shop", action: "shop", hasMegaMenu: true },
  { label: "About", action: "about" },
  { label: "Pearl Education", action: "education" },
  { label: "Bridal", action: "bridal" },
  { label: "Corporate Gifting", action: "gifting" },
];

export default function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activePreviewImage, setActivePreviewImage] = useState<{
    title: string;
    description: string;
    image: string;
  }>({
    title: "Featured Editorial",
    description:
      "Explore hand-selected South Sea & Tahitian pearls crafted into timeless heirlooms.",
    image:
      "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1000",
  });
  const [activeHoverLink, setActiveHoverLink] = useState<string | null>(null);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    cartCount,
    setIsCartOpen,
    wishlistCount,
    openSearch,
    setCategory,
    setCurrentPage,
    currentPage,
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
      setCategory("all");
      window.history.pushState({}, "", "/shop");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "bridal") {
      setCurrentPage("shop");
      setCategory("bridal");
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
    } else if (action === "admin") {
      setCurrentPage("admin");
      window.history.pushState({}, "", "/admin");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMegaCategoryClick = (catId: ShopCategory) => {
    setIsMegaMenuOpen(false);
    setCurrentPage("shop");
    setCategory(catId);
    window.history.pushState(
      {},
      "",
      `/shop${catId !== "all" ? `?category=${catId}` : ""}`,
    );
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
      {/* DESKTOP & MOBILE HEADER BAR (Warm Champagne Beige #E8DED0) */}
      <header
        className={`sticky top-0 z-50 w-full bg-[#E8DED0] border-b transition-all duration-300 ease-in-out ${
          isScrolled
            ? "border-[#3B332D]/12 shadow-[0_4px_24px_rgba(59,51,45,0.08)]"
            : "border-[#3B332D]/08"
        }`}
      >
        <div className="mx-auto max-w-[1720px] px-6 md:px-10 lg:px-14 xl:px-20">
          <div className="flex h-[88px] lg:h-[90px] items-center justify-between">
            {/* LEFT: MAHARAJ JEWELLERY LOGO (#3B332D) */}
            <button
              onClick={() => handleNavClick("home")}
              className="flex flex-col leading-none select-none text-left group focus:outline-none min-touch-target justify-center"
              aria-label="MAHARAJ JEWELLERY Home"
            >
              <span className="font-serif text-2xl lg:text-[25px] font-normal tracking-[0.18em] text-[#3B332D] transition-colors duration-300 group-hover:text-[#A98650]">
                MAHARAJ
              </span>
              <span className="font-sans text-[9px] lg:text-[9.5px] font-light tracking-[0.38em] uppercase text-[#3B332D]/75 mt-1">
                JEWELLERY
              </span>
            </button>

            {/* CENTER: DESKTOP NAVIGATION LINKS (Warm Espresso #4A4038) */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-11 h-full">
              {mainNavLinks.map(({ label, action, hasMegaMenu }) => {
                const isCurrent =
                  (action === "gifting" && currentPage === "gifting") ||
                  (action === "education" && currentPage === "education") ||
                  (action === "about" && currentPage === "about") ||
                  (action === "shop" && currentPage === "shop") ||
                  (action === "bridal" && currentPage === "bridal") ||
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
                      className={`relative font-sans text-[11px] lg:text-[12px] font-medium tracking-[0.1em] uppercase transition-colors duration-300 ease-out flex items-center focus:outline-none ${
                        isHovered
                          ? "text-[#A98650]"
                          : isCurrent
                            ? "text-[#4A4038]"
                            : "text-[#4A4038]/85"
                      }`}
                    >
                      <span>{label}</span>

                      {/* Smooth Muted Champagne Gold (#B59662) center-expanding underline */}
                      <span
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[1px] bg-[#B59662] transition-transform duration-300 ease-out pointer-events-none origin-center ${
                          isHovered || isCurrent
                            ? "w-full scale-x-100"
                            : "w-full scale-x-0"
                        }`}
                      />
                    </button>

                    {/* SHOP MEGA-MENU DROPDOWN */}
                    {hasMegaMenu && (
                      <AnimatePresence>
                        {isMegaMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] xl:w-[980px] bg-[#E8DED0] border border-[#3B332D]/12 shadow-[0_20px_50px_rgba(59,51,45,0.12)] p-8 lg:p-9 rounded-[2px] z-50 pointer-events-auto cursor-default"
                            onMouseEnter={handleMouseEnterShop}
                            onMouseLeave={handleMouseLeaveShop}
                          >
                            <div className="grid grid-cols-12 gap-8 items-stretch">
                              {/* Left Columns: SHOP, BRIDAL, COLLECTIONS */}
                              <div className="col-span-8 grid grid-cols-3 gap-6">
                                {megaMenuColumns.map((col) => (
                                  <div
                                    key={col.title}
                                    className="flex flex-col"
                                  >
                                    <h4 className="font-sans text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#B59662] mb-4 pb-2 border-b border-[#3B332D]/12">
                                      {col.title}
                                    </h4>
                                    <ul className="space-y-3">
                                      {col.items.map((item) => (
                                        <li key={item.label}>
                                          <button
                                            onClick={() =>
                                              handleMegaCategoryClick(
                                                item.categoryId,
                                              )
                                            }
                                            onMouseEnter={() =>
                                              setActivePreviewImage({
                                                title: item.label,
                                                description: item.description,
                                                image: item.image,
                                              })
                                            }
                                            className="group text-left w-full flex items-center justify-between text-[#4A4038]/85 hover:text-[#A98650] transition-colors duration-200"
                                          >
                                            <span className="font-serif text-[15.5px] font-normal tracking-wide group-hover:text-[#A98650] transition-colors">
                                              {item.label}
                                            </span>
                                            <ArrowRight
                                              size={13}
                                              className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-[#B59662]"
                                            />
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              {/* Right Column: Editorial Image Preview */}
                              <div className="col-span-4 relative overflow-hidden rounded-[2px] bg-[#DED0C1] min-h-[290px] flex flex-col justify-end p-6 border border-[#3B332D]/12">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={activePreviewImage.image}
                                    initial={{ opacity: 0, scale: 1.03 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35 }}
                                    className="absolute inset-0"
                                  >
                                    <img
                                      src={activePreviewImage.image}
                                      alt={activePreviewImage.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#3B332D]/90 via-[#3B332D]/30 to-transparent" />
                                  </motion.div>
                                </AnimatePresence>

                                <div className="relative z-10 text-white">
                                  <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#B59662] block mb-1 font-medium">
                                    EDITORIAL SELECTION
                                  </span>
                                  <h5 className="font-serif text-lg font-normal text-white mb-1 leading-snug">
                                    {activePreviewImage.title}
                                  </h5>
                                  <p className="text-[11px] font-sans font-light text-white/80 line-clamp-2 leading-relaxed">
                                    {activePreviewImage.description}
                                  </p>
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

            {/* RIGHT: UTILITY ICONS (#4A4038 default, #B59662 on hover) */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              {/* Search Button */}
              <button
                onClick={openSearch}
                className="p-2 text-[#4A4038] hover:text-[#B59662] transition-colors duration-300 focus:outline-none min-touch-target flex items-center justify-center"
                aria-label="Search"
                title="Search Collection"
              >
                <Search size={19} strokeWidth={1.25} />
              </button>

              {/* Account Button */}
              <button
                onClick={() => handleNavClick("login")}
                className="hidden lg:flex p-2 text-[#4A4038] hover:text-[#B59662] transition-colors duration-300 focus:outline-none min-touch-target items-center justify-center"
                aria-label="Client Account"
                title="Client Account"
              >
                <User size={19} strokeWidth={1.25} />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  setCurrentPage("shop");
                  window.history.pushState({}, "", "/shop");
                }}
                className="relative hidden lg:flex p-2 text-[#4A4038] hover:text-[#B59662] transition-colors duration-300 focus:outline-none min-touch-target items-center justify-center"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={19} strokeWidth={1.25} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B59662] text-[#3B332D] text-[9px] font-semibold flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#4A4038] hover:text-[#B59662] transition-colors duration-300 focus:outline-none min-touch-target flex items-center justify-center"
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag size={19} strokeWidth={1.25} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B59662] text-[#3B332D] text-[9px] font-semibold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Menu Toggle (Width <= 768px) */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-[#4A4038] hover:text-[#B59662] transition-colors duration-300 focus:outline-none min-touch-target flex items-center justify-center"
                aria-label="Open Mobile Menu"
              >
                <Menu size={22} strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN DEDICATED MOBILE NAVIGATION OVERLAY (Warm Champagne Beige #E8DED0) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#E8DED0] flex flex-col justify-between overflow-y-auto"
          >
            {/* Mobile Navigation Header */}
            <div className="flex items-center justify-between px-6 h-[80px] border-b border-[#3B332D]/12 flex-shrink-0">
              <button
                onClick={() => handleNavClick("home")}
                className="flex flex-col leading-none text-left"
              >
                <span className="font-serif text-2xl font-normal tracking-[0.18em] text-[#3B332D]">
                  MAHARAJ
                </span>
                <span className="font-sans text-[9px] font-light tracking-[0.35em] uppercase text-[#3B332D]/60 mt-1">
                  JEWELLERY
                </span>
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#4A4038] hover:text-[#B59662] transition-colors focus:outline-none min-touch-target flex items-center justify-center"
                aria-label="Close Mobile Navigation"
              >
                <X size={26} strokeWidth={1.25} />
              </button>
            </div>

            {/* Mobile Navigation Links with Staggered Sequential Reveal */}
            <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-6 px-6 py-10 my-auto">
              {[
                { label: "HOME", action: "home" },
                { label: "SHOP", action: "shop" },
                { label: "ABOUT", action: "about" },
                { label: "PEARL EDUCATION", action: "education" },
                { label: "BRIDAL", action: "bridal" },
                { label: "CORPORATE GIFTING", action: "gifting" },
                { label: "CONTACT", action: "contact" },
              ].map(({ label, action }, index) => {
                const isCurrent =
                  (action === "gifting" && currentPage === "gifting") ||
                  (action === "education" && currentPage === "education") ||
                  (action === "about" && currentPage === "about") ||
                  (action === "shop" && currentPage === "shop") ||
                  (action === "bridal" && currentPage === "bridal") ||
                  (action === "home" && currentPage === "home");

                return (
                  <div
                    key={label}
                    className="w-full flex flex-col items-center"
                  >
                    <motion.button
                      onClick={() => handleNavClick(action)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: 0.08 + index * 0.07,
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`font-serif text-2xl sm:text-3xl font-normal tracking-[0.1em] transition-colors duration-300 py-1 ${
                        isCurrent
                          ? "text-[#B59662]"
                          : "text-[#4A4038] hover:text-[#B59662]"
                      }`}
                    >
                      {label}
                    </motion.button>

                    {/* Subtle Muted Champagne Gold Line Divider between groups */}
                    {(index === 2 || index === 5) && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.05,
                          duration: 0.4,
                        }}
                        className="w-16 h-[1px] bg-[#B59662]/30 my-3"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Overlay Footer */}
            <div className="px-6 py-6 border-t border-[#3B332D]/12 text-center flex-shrink-0">
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#3B332D]/60 font-light">
                A STUDY IN PEARLS — MAHARAJ JEWELLERY
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
