import { motion } from 'framer-motion';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function ShopHero() {
  return (
    <section
      className="relative w-full h-[32vh] sm:h-[35vh] lg:h-[40vh] min-h-[260px] max-h-[420px] bg-[#F7F3EC] flex items-center justify-center border-b border-[rgba(41,35,31,0.08)] select-none overflow-hidden"
      aria-label="Shop The Collection"
    >
      {/* Subtle warm pearl glow ambient background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(200, 169, 107, 0.12) 0%, rgba(247, 243, 236, 0) 70%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: luxuryEase }}
          className="flex items-center justify-center gap-3 mb-3 sm:mb-4"
        >
          <span className="h-px w-6 bg-champagne-300/60 hidden sm:inline-block" />
          <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-champagne-500">
            MAHARAJ JEWELLERY
          </span>
          <span className="h-px w-6 bg-champagne-300/60 hidden sm:inline-block" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: luxuryEase }}
          className="font-serif font-normal text-cocoa-300 text-4xl sm:text-5xl lg:text-6xl tracking-[0.02em] leading-tight mb-3 sm:mb-4"
        >
          THE COLLECTION
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: luxuryEase }}
          className="text-cocoa-100 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto"
        >
          Discover timeless pearls and jewellery crafted for modern elegance.
        </motion.p>
      </div>
    </section>
  );
}
