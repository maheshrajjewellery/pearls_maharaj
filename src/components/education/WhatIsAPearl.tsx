import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, ShieldCheck, Compass } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function WhatIsAPearl() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="what-is-a-pearl"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-pearlIvory-100 text-cocoa-300 overflow-hidden border-b border-[rgba(41,35,31,0.08)]"
      aria-label="What is a pearl"
    >
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large Macro Pearl Image with Clip-Path & Controlled Scale */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/4.5] sm:aspect-[4/3.8] lg:aspect-[4/4.6] max-w-[620px] mx-auto overflow-hidden rounded-[2px] bg-pearlIvory-200 shadow-[0_12px_40px_rgba(41,35,31,0.07)]">
              <motion.div
                initial={{
                  clipPath: prefersReduced ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
                }}
                animate={
                  inView
                    ? { clipPath: 'inset(0% 0% 0% 0%)' }
                    : { clipPath: prefersReduced ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' }
                }
                transition={{ duration: 1.2, ease: luxuryEase }}
                className="w-full h-full relative"
              >
                <motion.img
                  src="https://images.pexels.com/photos/9429420/pexels-photo-9429420.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  alt="Macro photograph showing exquisite pearl surface and iridescent nacre"
                  initial={{ scale: prefersReduced ? 1 : 1.03 }}
                  animate={inView ? { scale: 1 } : { scale: prefersReduced ? 1 : 1.03 }}
                  transition={{ duration: 1.4, ease: luxuryEase }}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />

                {/* Subtle luxury overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa-300/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 border border-champagne-300/15 pointer-events-none" />
              </motion.div>

              {/* Floating Museum Caption */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: luxuryEase }}
                className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-4 py-2 bg-pearlIvory-50/95 backdrop-blur-md border border-[rgba(41,35,31,0.1)] text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-cocoa-300 flex items-center gap-2"
              >
                <Sparkles size={12} className="text-champagne-400" />
                <span>Macro Pearl Surface Detail</span>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Editorial Content */}
          <div className="lg:col-span-6 flex flex-col justify-center max-w-[620px] mx-auto lg:mx-0">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: luxuryEase }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-6 bg-champagne-300" />
              <p className="text-champagne-400 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
                01 — THE BASICS
              </p>
            </motion.div>

            {/* Main Heading */}
            <h2 className="font-serif text-cocoa-300 text-[clamp(34px,4.5vw,56px)] leading-[1.04] font-normal tracking-[-0.01em] mb-6">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.15, ease: luxuryEase }}
                >
                  WHAT IS
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block italic font-light text-cocoa-200 font-serif"
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.28, ease: luxuryEase }}
                >
                  A PEARL?
                </motion.span>
              </span>
            </h2>

            {/* Editorial Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: luxuryEase }}
              className="space-y-4 text-cocoa-200/90 text-[15px] sm:text-[16px] font-sans font-light leading-[1.7]"
            >
              <p className="font-normal text-cocoa-300">
                A pearl is an organic gemstone formed inside a mollusk when layers of nacre build around an irritant or implanted nucleus.
              </p>
              <p>
                Unlike mineral gemstones mined from deep within the earth, pearls are created by living creatures. Natural pearls form without human intervention, while cultured pearls are formed with human assistance.
              </p>
            </motion.div>

            {/* Key Comparison Badges */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.55, ease: luxuryEase }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[rgba(41,35,31,0.1)]"
            >
              <div className="p-4 bg-pearlIvory-50 border border-[rgba(41,35,31,0.06)] rounded-[1px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <Compass size={14} className="text-champagne-400" />
                  <span className="text-[11px] font-sans font-medium tracking-[0.18em] uppercase text-cocoa-300">
                    Natural Pearls
                  </span>
                </div>
                <p className="text-[13px] font-light text-cocoa-100/80 leading-relaxed">
                  Occur spontaneously in wild mollusks without human intervention. Extremely rare in modern times.
                </p>
              </div>

              <div className="p-4 bg-pearlIvory-50 border border-[rgba(41,35,31,0.06)] rounded-[1px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck size={14} className="text-champagne-400" />
                  <span className="text-[11px] font-sans font-medium tracking-[0.18em] uppercase text-cocoa-300">
                    Cultured Pearls
                  </span>
                </div>
                <p className="text-[13px] font-light text-cocoa-100/80 leading-relaxed">
                  Carefully nurtured by expert pearl farmers who introduce a tiny nucleus into a host oyster or mussel.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
