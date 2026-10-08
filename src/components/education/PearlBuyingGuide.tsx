import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import {
  Sparkles,
  Shapes,
  Palette,
  Ruler,
  Eye,
  Crown,
  ArrowRight,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface BuyingStep {
  step: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  expertTip: string;
  image: string;
}

const buyingSteps: BuyingStep[] = [
  {
    step: "01",
    title: "START WITH LUSTER",
    subtitle: "The Heart of the Pearl",
    icon: Sparkles,
    description:
      "Luster is the most crucial attribute. Look for sharp, mirror-like reflections where light sources have defined boundaries rather than a fuzzy, chalky glow.",
    expertTip:
      "A smaller pearl with intense mirror luster is consistently more striking than a larger, dull gem.",
    image:
      "https://images.pexels.com/photos/10877350/pexels-photo-10877350.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    step: "02",
    title: "CONSIDER SHAPE",
    subtitle: "Symmetry vs Organic Art",
    icon: Shapes,
    description:
      "Decide between the classical symmetry of a spherical Akoya or South Sea strand and the poetic, sculptural individuality of baroque and teardrop formations.",
    expertTip:
      "For traditional formalwear, choose round; for modern avant-garde couture, embrace organic baroques.",
    image:
      "https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    step: "03",
    title: "CHOOSE YOUR COLOR",
    subtitle: "Harmonize with Skin Tone",
    icon: Palette,
    description:
      "Select a hue that flatters your personal complexion. Cool skin tones shine in icy silver-white and dark Tahitians, while warm undertones radiate with cream and golden South Sea pearls.",
    expertTip:
      "Natural rose overtones provide a youthful blush effect against fair and medium complexions.",
    image:
      "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    step: "04",
    title: "SELECT YOUR SIZE",
    subtitle: "Scale to the Occasion",
    icon: Ruler,
    description:
      "Match the millimeter diameter to your wardrobe needs. 6–7mm offers understated daily refinement; 8–9mm makes a confident luxury statement; 10mm+ commands regal grand presence.",
    expertTip:
      "For a first investment strand, 7.0–7.5mm provides the most versatile proportion for day-to-evening transitions.",
    image:
      "https://images.pexels.com/photos/9429420/pexels-photo-9429420.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    step: "05",
    title: "CHECK THE SURFACE",
    subtitle: "Authentic Organic Character",
    icon: Eye,
    description:
      "Examine the pearl up close. Minor organic blemishes are proof of natural genesis. Focus on whether the blemishes are concentrated near the drill holes where they remain hidden.",
    expertTip:
      "Flawlessness is rare; prioritize how clean the pearl looks when viewed at an arm’s length conversational distance.",
    image:
      "https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    step: "06",
    title: "MATCH YOUR STYLE",
    subtitle: "Select Precious Mountings",
    icon: Crown,
    description:
      "Pair your pearls with the appropriate precious metal. Hand-knotted silk cords protect strands, while 18k yellow, rose, and white gold settings complement specific overtone profiles.",
    expertTip:
      "Ensure strands are strung on individually knotted silk to prevent pearls rubbing against each other.",
    image:
      "https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function PearlBuyingGuide() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { setCurrentPage } = useShop();
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="how-to-choose"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-pearlIvory-100 text-cocoa-300 overflow-hidden border-b border-[rgba(41,35,31,0.08)]"
      aria-label="How to choose a pearl - buying guide"
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: luxuryEase }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-champagne-300" />
            <p className="text-champagne-400 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              11 — ACQUISITION ADVISORY
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-cocoa-300 text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em]"
          >
            CHOOSING YOUR{" "}
            <span className="italic font-serif font-light text-cocoa-200">
              PEARL.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-cocoa-100/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            A six-step connoisseur guide curated by MAHESHRAJ master gemologists
            to assist you in selecting your ideal heirloom piece.
          </motion.p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {buyingSteps.map((stepItem, i) => {
            const Icon = stepItem.icon;

            return (
              <motion.div
                key={stepItem.step}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + i * 0.08,
                  ease: luxuryEase,
                }}
                className="group bg-pearlIvory-50 border border-[rgba(41,35,31,0.08)] hover:border-champagne-300/60 rounded-[2px] overflow-hidden shadow-[0_4px_20px_rgba(41,35,31,0.03)] hover:shadow-[0_12px_32px_rgba(41,35,31,0.08)] transition-all duration-500 flex flex-col justify-between"
              >
                {/* Small Editorial Image Accent with Step Overlay */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-pearlIvory-200">
                  <img
                    src={stepItem.image}
                    alt={stepItem.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa-300/50 via-cocoa-300/10 to-transparent pointer-events-none" />

                  {/* Step Number Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-pearlIvory-50/95 backdrop-blur-sm border border-[rgba(41,35,31,0.1)] text-xs font-mono font-semibold text-cocoa-300">
                    STEP {stepItem.step}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={14} className="text-champagne-500" />
                      <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-champagne-500">
                        {stepItem.subtitle}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-cocoa-300 font-normal mb-3 group-hover:text-champagne-500 transition-colors">
                      {stepItem.title}
                    </h3>

                    <p className="text-xs sm:text-[13px] font-sans font-light text-cocoa-100/90 leading-relaxed mb-6">
                      {stepItem.description}
                    </p>
                  </div>

                  {/* Specialist Tip */}
                  <div className="p-3.5 bg-pearlIvory-100 border-l-2 border-champagne-300 rounded-r-[1px]">
                    <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-cocoa-300 block mb-1">
                      MAHESHRAJ Specialist Tip
                    </span>
                    <p className="text-xs font-light text-cocoa-200 leading-relaxed italic">
                      "{stepItem.expertTip}"
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
