import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { ArrowRight, Sparkles, MessageCircle, ShoppingBag } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function PearlEducationCTA() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { setCurrentPage, setCategory } = useShop();
  const prefersReduced = useReducedMotion();

  const handleShopClick = () => {
    setCurrentPage('shop');
    setCategory('all');
    window.history.pushState({}, '', '/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = () => {
    setCurrentPage('contact');
    window.history.pushState({}, '', '/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      className="relative w-full py-20 lg:py-24 bg-[#F7F3EC] text-cocoa-300 overflow-hidden border-t border-[rgba(41,35,31,0.08)]"
      aria-label="Explore Maharaj Jewellery collection"
    >
      {/* Background soft ambient radial light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(200, 169, 107, 0.12) 0%, rgba(247, 243, 236, 0) 70%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 text-center relative z-10">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: luxuryEase }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-champagne-300/30 bg-pearlIvory-50/80 mb-6"
        >
          <Sparkles size={12} className="text-champagne-500" />
          <p className="text-champagne-500 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.3em] uppercase">
            MAHARAJ JEWELLERY
          </p>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
          className="font-serif text-[clamp(34px,5vw,60px)] font-normal leading-[1.02] tracking-[-0.015em] text-cocoa-300 mb-5"
        >
          NOW THAT YOU <br />
          <span className="italic font-serif font-light text-cocoa-200">KNOW YOUR PEARLS.</span>
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
          className="text-cocoa-200/90 text-[15px] sm:text-[17px] font-sans font-light max-w-lg mx-auto leading-relaxed mb-9"
        >
          Explore the Maharaj Jewellery collection and find a piece that speaks to you.
        </motion.p>

        {/* Dual Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: luxuryEase }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          {/* Shop Pearls */}
          <button
            onClick={handleShopClick}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 px-8 py-4 bg-cocoa-300 hover:bg-cocoa-200 text-pearlIvory-50 text-[12px] font-sans font-medium tracking-[0.2em] uppercase rounded-[1px] transition-all duration-300 shadow-[0_4px_16px_rgba(41,35,31,0.15)] hover:shadow-[0_8px_24px_rgba(41,35,31,0.25)]"
          >
            <ShoppingBag size={15} strokeWidth={1.7} />
            <span>SHOP PEARLS</span>
            <ArrowRight
              size={15}
              strokeWidth={1.8}
              className="group-hover:translate-x-1.5 transition-transform duration-300 text-champagne-300"
            />
          </button>

          {/* Contact A Specialist */}
          <button
            onClick={handleContactClick}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 px-8 py-4 bg-pearlIvory-50 hover:bg-pearlIvory-200 text-cocoa-300 border border-champagne-300/60 text-[12px] font-sans font-medium tracking-[0.2em] uppercase rounded-[1px] transition-all duration-300 shadow-[0_2px_10px_rgba(200,169,107,0.1)]"
          >
            <MessageCircle size={15} strokeWidth={1.7} className="text-champagne-500" />
            <span>CONTACT A SPECIALIST</span>
            <ArrowRight
              size={15}
              strokeWidth={1.8}
              className="group-hover:translate-x-1.5 transition-transform duration-300 text-cocoa-300"
            />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
