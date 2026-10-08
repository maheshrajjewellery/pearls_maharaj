import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Shield, Compass, Droplet } from "lucide-react";
import { useShop } from "@/context/ShopContext";

const guideSections = [
  {
    id: "types",
    title: "PEARL VARIETIES",
    icon: Compass,
    content: [
      {
        name: "South Sea Pearls",
        origin: "Australia, Indonesia & Philippines",
        description:
          "The queen of pearls. Cultivated in the silver-lipped and gold-lipped Pinctada maxima oysters, known for exceptional size (9-20mm) and luxurious satin luster in white and warm champagne gold.",
      },
      {
        name: "Japanese Akoya Pearls",
        origin: "Japan (Mie & Ehime Prefectures)",
        description:
          "Renowned for intense mirror-like luster and near-perfect spherical geometry. The quintessential classic pearl with rose overtones, measuring 6-9.5mm.",
      },
      {
        name: "Tahitian Black Pearls",
        origin: "French Polynesia Lagoons",
        description:
          "Exotic dark pearls naturally produced by the black-lipped Pinctada margaritifera. They display mesmerizing undertones of peacock green, eggplant, pistachio, and gunmetal.",
      },
      {
        name: "Freshwater Pearls",
        origin: "Cultivated in Pristine Lakes & Rivers",
        description:
          "Composed entirely of solid crystalline nacre without a bead nucleus, offering remarkable durability, rich organic shapes, and soft luminous beauty.",
      },
      {
        name: "Baroque Pearls",
        origin: "Natural Freeform Formations",
        description:
          "Uniquely sculpted by nature with asymmetrical contours and high fire iridescent overtones. Every baroque jewel is completely one-of-a-kind.",
      },
    ],
  },
  {
    id: "luster",
    title: "LUSTER & GRADING",
    icon: Sparkles,
    content: [
      {
        name: "The Science of Pearl Glow",
        origin: "Nacre Thickness & Crystal Alignment",
        description:
          "Luster is the most vital characteristic of a pearl. It is created when light penetrates micro-thin concentric layers of aragonite crystals and bounces back, creating deep internal radiance (orient).",
      },
      {
        name: "MAHESHRAJ AAA Standard",
        origin: "Exacting Selection Criteria",
        description:
          "Every MAHESHRAJ pearl undergoes strict grading for surface purity, sphericity, nacre thickness, and sharp edge reflection before being set into precious gold.",
      },
    ],
  },
  {
    id: "care",
    title: "CARE & PRESERVATION",
    icon: Shield,
    content: [
      {
        name: "Last On, First Off",
        origin: "Gold Standard of Jewellery Care",
        description:
          "Always put your pearls on after applying perfume, hairspray, lotions, and cosmetics. Take them off first when undressing to protect the delicate nacre.",
      },
      {
        name: "Storage & Cleaning",
        origin: "Generational Longevity",
        description:
          "Store pearls flat in their silk-lined MAHESHRAJ pouch, away from dry heat and hard gemstones that could scratch the surface. Clean gently with a soft damp chamois cloth after wearing.",
      },
    ],
  },
];

export default function PearlGuideModal() {
  const { isPearlGuideOpen, closePearlGuide } = useShop();
  const [activeTab, setActiveTab] = useState("types");

  if (!isPearlGuideOpen) return null;

  const currentSection =
    guideSections.find((s) => s.id === activeTab) || guideSections[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closePearlGuide}
          className="fixed inset-0 bg-cocoa-300/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-pearlIvory-100 border border-[rgba(41,35,31,0.12)] shadow-[0_20px_60px_rgba(41,35,31,0.25)] overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-10 h-20 border-b border-[rgba(41,35,31,0.12)] bg-[#F7F3EC]">
            <div>
              <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-champagne-500 font-medium">
                MAHESHRAJ KNOWLEDGE ATELIER
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-cocoa-300 font-normal">
                THE PEARL GUIDE
              </h2>
            </div>
            <button
              onClick={closePearlGuide}
              className="text-cocoa-300 hover:text-champagne-500 p-2 transition-colors"
              aria-label="Close guide"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-start sm:justify-center border-b border-[rgba(41,35,31,0.1)] px-6 sm:px-10 bg-pearlIvory-50 overflow-x-auto no-scrollbar gap-8">
            {guideSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className={`flex items-center gap-2 py-4 text-xs font-sans tracking-[0.2em] uppercase transition-colors relative whitespace-nowrap ${
                    isActive
                      ? "text-cocoa-300 font-medium"
                      : "text-cocoa-100 font-light hover:text-champagne-500"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  <span>{sec.title}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeGuideTab"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-champagne-400"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 max-h-[60vh] overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSection.content.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#F7F3EC] border border-[rgba(41,35,31,0.08)] flex flex-col justify-between rounded-[1px]"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet size={13} className="text-champagne-500" />
                      <span className="text-[10px] font-sans tracking-widest uppercase text-champagne-500 font-medium">
                        {item.origin}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-cocoa-300 font-normal mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-light text-cocoa-100/90 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[rgba(41,35,31,0.1)] bg-[#F7F3EC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-cocoa-100 font-light text-center sm:text-left">
              Have specific questions regarding a particular pearl piece? Our
              gemologists are at your service.
            </p>
            <button
              onClick={closePearlGuide}
              className="px-6 py-2.5 bg-cocoa-300 text-pearlIvory-50 text-xs tracking-widest uppercase font-light hover:bg-cocoa-200 transition-colors whitespace-nowrap"
            >
              RETURN TO SHOP
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
