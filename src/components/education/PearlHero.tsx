import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface PearlHeroProps {
  onBeginExploring?: () => void;
}

export default function PearlHero({ onBeginExploring }: PearlHeroProps) {
  const prefersReduced = useReducedMotion();
  const { cmsData } = useShop();

  const eduCMS = cmsData?.education;
  const heroTitle = eduCMS?.heroTitle || 'UNDERSTAND THE PEARL.';
  const heroSub = eduCMS?.heroSubtitle || 'Discover the natural beauty, character and craftsmanship behind every pearl.';

  const handleScrollDown = () => {
    if (onBeginExploring) {
      onBeginExploring();
    } else {
      const target = document.getElementById('what-is-a-pearl');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      className="relative w-full h-[65vh] min-h-[520px] max-h-[720px] bg-[#30372F] overflow-hidden flex flex-col justify-between items-center text-center select-none"
      aria-label="Maharaj Pearl Education Hero"
    >
      {/* Subtle ambient lighting vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(200, 169, 107, 0.09) 0%, rgba(41, 35, 31, 0.85) 60%, #30372F 100%)',
        }}
      />

      {/* Subtle luxury mesh grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(247, 243, 236, 0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top spacing */}
      <div className="pt-8 sm:pt-10 z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: luxuryEase }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-champagne-300/20 bg-cocoa-400/40 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
          <p className="text-champagne-300 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.35em] uppercase">
            THE MAHARAJ PEARL GUIDE
          </p>
        </motion.div>
      </div>

      {/* Center: Realistic Pearl Sphere with Cinematic Lighting */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <motion.div
          initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: luxuryEase }}
          className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 flex items-center justify-center"
        >
          {/* Outer soft ambient pearl glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-champagne-300/15 via-pearlIvory-100/10 to-transparent blur-xl scale-125" />

          {/* Pearl Body - Multi-layered gradient for realistic organic nacre luster */}
          <div
            className="relative w-full h-full rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_-10px_25px_rgba(41,35,31,0.6),inset_0_4px_12px_rgba(255,255,255,0.8)] overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FFFDF8 22%, #F7F3EC 45%, #E8DCD5 70%, #B8A99A 90%, #5A4E48 100%)',
            }}
          >
            {/* Iridescent orient overtone layer */}
            <div
              className="absolute inset-0 rounded-full opacity-60 mix-blend-color-dodge pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 40% 35%, rgba(200, 169, 107, 0.45) 0%, rgba(232, 220, 213, 0.3) 40%, rgba(184, 169, 154, 0.1) 80%, transparent 100%)',
              }}
            />

            {/* Specular mirror highlight reflection */}
            <div
              className="absolute top-[18%] left-[24%] w-8 h-8 sm:w-10 sm:h-10 rounded-full blur-[1px] opacity-90 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 80%)',
              }}
            />

            {/* Secondary warm bounce light from bottom-right */}
            <div
              className="absolute bottom-[10%] right-[16%] w-16 h-10 rounded-full blur-[6px] opacity-35 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse, rgba(200,169,107,0.7) 0%, transparent 80%)',
              }}
            />

            {/* Subtle moving light sweep across the pearl surface */}
            <motion.div
              initial={{ x: '-120%', opacity: 0 }}
              animate={{
                x: ['-120%', '160%'],
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: 2.8,
                delay: 1.2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 -skew-x-12 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none blur-[4px]"
            />
          </div>

          {/* Under-pearl drop shadow */}
          <div className="absolute -bottom-6 w-36 h-6 rounded-[100%] bg-black/40 blur-md pointer-events-none" />
        </motion.div>

        {/* Text Section - Fades in after pearl reveals */}
        <div className="mt-6 sm:mt-8 max-w-2xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: prefersReduced ? 0 : 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: luxuryEase }}
            className="font-serif font-normal text-pearlIvory-50 text-[clamp(28px,5vw,52px)] leading-[1.05] tracking-[0.02em] uppercase"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: prefersReduced ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: luxuryEase }}
            className="mt-3 sm:mt-4 text-pearlIvory-300/80 text-[14px] sm:text-[15px] font-sans font-light tracking-wide leading-relaxed max-w-lg mx-auto"
          >
            {heroSub}
          </motion.p>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.15, ease: luxuryEase }}
        className="pb-6 sm:pb-8 z-10"
      >
        <button
          onClick={handleScrollDown}
          className="group inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-champagne-300/30 bg-cocoa-400/30 hover:bg-champagne-300 hover:border-champagne-300 hover:text-cocoa-300 text-champagne-200 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.25em] uppercase transition-all duration-300"
          aria-label="Begin exploring the pearl guide"
        >
          <span>BEGIN EXPLORING</span>
          <ArrowDown
            size={14}
            strokeWidth={1.8}
            className="text-champagne-300 group-hover:text-cocoa-300 group-hover:translate-y-0.5 transition-all duration-300"
          />
        </button>
      </motion.div>
    </section>
  );
}
