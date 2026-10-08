import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useShop } from "@/context/ShopContext";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AboutCTA() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const prefersReduced = useReducedMotion();
  const { setCurrentPage, setCategory } = useShop();

  const handleShopCollection = () => {
    setCurrentPage("shop");
    setCategory("all");
    window.history.pushState({}, "", "/shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactUs = () => {
    window.location.href =
      "mailto:concierge@MAHESHRAJjewellery.com?subject=Inquiry%20-%20MAHESHRAJ%20Jewellery";
  };

  return (
    <section
      ref={ref}
      className="relative bg-pearlIvory-100 py-24 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16 select-none overflow-hidden"
      aria-label="Find Your Timeless Piece"
    >
      {/* Background warm lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(200, 169, 107, 0.08) 0%, rgba(247, 243, 236, 0) 65%)",
        }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col items-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="flex items-center gap-3 mb-4 sm:mb-5"
        >
          <span className="h-px w-6 bg-champagne-300" />
          <p className="text-champagne-500 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase">
            COLLECTION
          </p>
          <span className="h-px w-6 bg-champagne-300" />
        </motion.div>

        {/* Heading */}
        <h2 className="font-serif text-cocoa-300 text-[clamp(34px,5vw,58px)] font-normal leading-[1.02] tracking-[0.01em] mb-4 sm:mb-5">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: prefersReduced ? 0 : 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15, ease: luxuryEase }}
            >
              FIND YOUR
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block italic font-normal text-cocoa-200"
              initial={{ opacity: 0, y: prefersReduced ? 0 : 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: luxuryEase }}
            >
              TIMELESS PIECE.
            </motion.span>
          </span>
        </h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.45, ease: luxuryEase }}
          className="text-cocoa-200/80 text-[15px] sm:text-[16px] font-sans font-normal leading-relaxed mb-8 sm:mb-10 max-w-[420px]"
        >
          Explore the MAHESHRAJ Jewellery collection.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.6, ease: luxuryEase }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={handleShopCollection}
            className="w-full sm:w-auto px-9 py-3.5 bg-champagne-100 hover:bg-champagne-200/90 text-cocoa-300 text-[12px] font-sans font-medium tracking-[0.1em] uppercase transition-all duration-300 border border-champagne-300/40 shadow-[0_2px_12px_rgba(200,169,107,0.12)] hover:shadow-[0_4px_20px_rgba(200,169,107,0.22)]"
          >
            SHOP COLLECTION
          </button>

          <button
            onClick={handleContactUs}
            className="w-full sm:w-auto px-9 py-3.5 bg-transparent hover:bg-cocoa-300/5 text-cocoa-300 text-[12px] font-sans font-medium tracking-[0.1em] uppercase transition-all duration-300 border border-cocoa-300/30 hover:border-cocoa-300"
          >
            CONTACT US
          </button>
        </motion.div>
      </div>
    </section>
  );
}
