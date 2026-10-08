import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AboutHero() {
  const { setCurrentPage, setCategory, cmsData } = useShop();
  const prefersReduced = useReducedMotion();

  const aboutCMS = cmsData?.about;
  const heroHeading = aboutCMS?.heroHeading || "BEAUTY, CRAFTED TO LAST.";
  const heroImg =
    aboutCMS?.heroImage && aboutCMS.heroImage.trim() !== ""
      ? aboutCMS.heroImage
      : "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1400";

  const handleExplore = () => {
    setCurrentPage("shop");
    setCategory("all");
    window.history.pushState({}, "", "/shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full h-[72vh] sm:h-[75vh] min-h-[540px] max-h-[760px] bg-pearlIvory-100 overflow-hidden flex items-center select-none border-b border-cocoa-300/10"
      aria-label="MAHESHRAJ Jewellery About Hero"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 40%, rgba(200, 169, 107, 0.12) 0%, rgba(247, 243, 236, 0) 65%), radial-gradient(ellipse at 20% 70%, rgba(232, 220, 213, 0.5) 0%, rgba(247, 243, 236, 0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full py-10 lg:py-0">
          {/* LEFT: Editorial Text Content (55% on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center max-w-[620px] lg:max-w-none">
            {/* Small Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
              className="flex items-center gap-3 mb-4 sm:mb-5"
            >
              <span className="h-px w-6 bg-champagne-300" />
              <p className="text-champagne-400 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase">
                MAHESHRAJ JEWELLERY
              </p>
            </motion.div>

            {/* Main Heading - Revealed line-by-line */}
            <h1 className="font-serif font-normal text-cocoa-300 text-[clamp(36px,5.5vw,72px)] leading-[0.98] sm:leading-[1.02] tracking-[0.01em] mb-5 sm:mb-6">
              <span className="block overflow-hidden">
                <motion.span
                  className="block uppercase"
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.35, ease: luxuryEase }}
                >
                  {heroHeading}
                </motion.span>
              </span>
            </h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.8, ease: luxuryEase }}
              className="text-cocoa-200/80 text-[15px] sm:text-[16px] lg:text-[17px] font-sans font-normal leading-[1.65] max-w-[480px] mb-7 sm:mb-9"
            >
              Discover the story behind a jewellery house built around the
              timeless beauty of pearls.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.95, ease: luxuryEase }}
            >
              <button
                onClick={handleExplore}
                className="group inline-flex items-center gap-4 px-8 py-3.5 bg-champagne-100 hover:bg-champagne-200/90 text-cocoa-300 text-[12px] font-sans font-medium tracking-[0.1em] uppercase transition-all duration-300 border border-champagne-300/40 shadow-[0_2px_12px_rgba(200,169,107,0.12)] hover:shadow-[0_4px_20px_rgba(200,169,107,0.22)]"
              >
                <span>EXPLORE OUR COLLECTION</span>
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="text-cocoa-300 group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </button>
            </motion.div>
          </div>

          {/* RIGHT: Editorial Campaign Imagery (Controlled Scale & Proportions) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 justify-end items-center">
            <motion.div
              className="relative w-full max-w-[480px] xl:max-w-[540px] aspect-[4/5] overflow-hidden rounded-[2px] shadow-[0_8px_32px_rgba(41,35,31,0.08)] bg-pearlIvory-200"
              initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: luxuryEase }}
            >
              <img
                src={heroImg}
                alt="MAHESHRAJ Jewellery luxury pearl campaign"
                className="w-full h-full object-cover object-[68%_32%]"
                fetchPriority="high"
              />

              {/* Gentle internal vignette and champagne light accent */}
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa-300/25 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 border border-champagne-300/20 pointer-events-none" />

              {/* Editorial tag in corner */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-pearlIvory-100/90 backdrop-blur-sm border border-cocoa-300/10 text-[9px] font-sans tracking-[0.08em] uppercase font-medium text-cocoa-300">
                Editorial Campaign
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
