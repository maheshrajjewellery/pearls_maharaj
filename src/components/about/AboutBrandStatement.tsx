import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AboutBrandStatement() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative w-full h-[52vh] sm:h-[58vh] min-h-[440px] max-h-[620px] bg-cocoa-300 overflow-hidden flex items-center justify-center select-none"
      aria-label="MAHESHRAJ Jewellery Editorial Brand Statement"
    >
      {/* Background Photography (Full-Width Macro Pearl Imagery) */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src="https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luminous pearl in organic shell backdrop"
          className="w-full h-full object-cover object-[50%_45%]"
          initial={{ scale: prefersReduced ? 1 : 1.05, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 0.45 } : {}}
          transition={{ duration: 1.6, ease: luxuryEase }}
          loading="lazy"
        />

        {/* Cinematic Deep Cocoa Feathered Overlay & Vignette for pristine legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa-300 via-cocoa-300/70 to-cocoa-300" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-cocoa-300/40 to-cocoa-300" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-[1080px] mx-auto px-6 sm:px-10 text-center flex flex-col items-center">
        {/* Small Brand Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-6 bg-champagne-300/60" />
          <p className="text-champagne-300 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase">
            MAHESHRAJ JEWELLERY
          </p>
          <span className="h-px w-6 bg-champagne-300/60" />
        </motion.div>

        {/* Prominent Editorial Brand Statement */}
        <blockquote className="font-serif text-pearlIvory-50 text-[clamp(28px,4.5vw,56px)] font-normal leading-[1.08] sm:leading-[1.12] tracking-[0.01em] max-w-[880px] mb-6">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: prefersReduced ? 0 : 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: luxuryEase }}
            >
              “THE BEAUTY OF A PEARL
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block italic font-normal text-champagne-100"
              initial={{ opacity: 0, y: prefersReduced ? 0 : 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.35, ease: luxuryEase }}
            >
              IS IN ITS IMPERFECTIONS.”
            </motion.span>
          </span>
        </blockquote>

        {/* Minimal Champagne Accent */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={inView ? { width: "60px", opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: luxuryEase }}
          className="h-px bg-champagne-300/60"
        />
      </div>
    </section>
  );
}
