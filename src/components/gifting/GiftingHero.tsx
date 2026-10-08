import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { giftingHeroData } from "@/data/giftingData";
import { useShop } from "@/context/ShopContext";

interface GiftingHeroProps {
  onEnquireClick: () => void;
  onExploreClick: () => void;
}

export default function GiftingHero({
  onEnquireClick,
  onExploreClick,
}: GiftingHeroProps) {
  const { cmsData } = useShop();
  const corpCMS = cmsData?.corporate;

  const eyebrow = "ROYAL CORPORATE GIFTING";
  const heading1 = corpCMS?.heroHeading || giftingHeroData.headingLine1;
  const heading2 = giftingHeroData.headingLine2;
  const supportingCopy =
    corpCMS?.heroSubheading || giftingHeroData.supportingCopy;
  const heroImg =
    corpCMS?.heroImage && corpCMS.heroImage.trim() !== ""
      ? corpCMS.heroImage
      : giftingHeroData.heroImage;

  return (
    <section className="relative w-full bg-[#F7F3EC] py-12 lg:py-20 flex items-center overflow-hidden border-b border-[rgba(41,35,31,0.08)]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F7F3EC] via-[#FFFDF8]/40 to-[#F7F3EC] pointer-events-none" />

      <div className="relative max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: Editorial Text */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="w-6 h-px bg-[#C5A15A]" />
              <span className="text-[11px] lg:text-[12px] tracking-[0.3em] font-medium uppercase text-[#B8A99A]">
                {eyebrow}
              </span>
            </motion.div>

            {/* Line-by-Line Heading Reveal */}
            <div className="mb-6 overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-[#30372F] leading-[1.08] tracking-[-0.01em]"
              >
                <span>{heading1}</span>
              </motion.h1>
            </div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[#30372F]/80 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-9"
            >
              {supportingCopy}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              {/* Primary CTA */}
              <button
                onClick={onEnquireClick}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#30372F] text-[#FFFDF8] text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 hover:bg-[#C5A15A] hover:text-[#30372F] shadow-sm"
              >
                <span>{giftingHeroData.primaryCta}</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-transparent border border-[#30372F]/25 text-[#30372F] text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 hover:border-[#C5A15A] hover:text-[#C5A15A]"
              >
                <span>{giftingHeroData.secondaryCta}</span>
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Premium Composition with subtle clip-path reveal */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ clipPath: "inset(10% 0% 10% 0%)", opacity: 0, y: 12 }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full max-w-[500px] lg:max-w-none aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-xs overflow-hidden shadow-[0_20px_50px_rgba(41,35,31,0.08)] border border-[rgba(41,35,31,0.1)]"
            >
              <img
                src={giftingHeroData.heroImage}
                alt="MAHESHRAJ Corporate Pearl Jewellery Gift Box Composition"
                className="w-full h-full object-cover object-center transform transition-transform duration-1000"
              />

              {/* Subtle warm ambient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#30372F]/30 via-transparent to-transparent pointer-events-none" />

              {/* Light sweep effect across pearls on entrance */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.8, delay: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFDF8]/40 to-transparent transform -skew-x-12 pointer-events-none"
              />

              {/* Floating accent badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#FFFDF8]/90 backdrop-blur-md p-4 border border-[#C5A15A]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-[#C5A15A]" />
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#30372F]">
                    Bespoke Presentation Box
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8A99A]">
                  MAHESHRAJ Seal
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
