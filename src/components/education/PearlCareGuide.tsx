import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Shield, Droplets, Box, Wrench, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface CareStep {
  id: string;
  tag: string;
  title: string;
  rule: string;
  detail: string;
  icon: React.ElementType;
  image: string;
}

const careSteps: CareStep[] = [
  {
    id: 'wear',
    tag: '01 — APPLICATION',
    title: 'WEAR',
    rule: 'Last on, first off.',
    detail:
      'Always apply perfumes, hairsprays, cosmetics, and body lotions before putting on your pearls. Remove your pearls first when undressing.',
    icon: Shield,
    image: 'https://images.pexels.com/photos/7743044/pexels-photo-7743044.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'clean',
    tag: '02 — HYGIENE',
    title: 'CLEAN',
    rule: 'Soft, damp cloth wipe.',
    detail:
      'Gently wipe your pearls with a soft, damp microfiber or chamois cloth after each wear to eliminate natural skin oils and perspiration.',
    icon: Droplets,
    image: 'https://images.pexels.com/photos/30557505/pexels-photo-30557505.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'store',
    tag: '03 — PRESERVATION',
    title: 'STORE',
    rule: 'Flat in soft pouches.',
    detail:
      'Store pearls separately from diamonds and metallic gems that could scratch the delicate nacre. Never store pearls in airtight synthetic bags.',
    icon: Box,
    image: 'https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'check',
    tag: '04 — MAINTENANCE',
    title: 'CHECK',
    rule: 'Periodic strand restringing.',
    detail:
      'Have jewellery settings, clasps, and silk knotted strands inspected annually by our atelier to preserve structural security and beauty.',
    icon: Wrench,
    image: 'https://images.pexels.com/photos/6263146/pexels-photo-6263146.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function PearlCareGuide() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { setCurrentPage } = useShop();
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="pearl-care"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-[#30372F] text-pearlIvory-100 overflow-hidden border-b border-champagne-300/15"
      aria-label="Pearl care guide - preservation and maintenance"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 30%, rgba(200, 169, 107, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(232, 220, 213, 0.04) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 lg:mb-18 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: luxuryEase }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="h-px w-6 bg-champagne-300" />
              <p className="text-champagne-300 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
                12 — PRESERVATION
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
              className="font-serif text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em] text-pearlIvory-50"
            >
              CARE FOR <span className="text-champagne-300 italic font-serif font-light">YOUR PEARLS.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="text-pearlIvory-300/80 text-[14px] sm:text-[15px] font-sans font-light max-w-md leading-relaxed"
          >
            Organic gemstones thrive on gentle, intentional care. Follow the four essential rituals below to ensure your pearls radiate across generations.
          </motion.p>
        </div>

        {/* 4 Minimal Illustrated Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {careSteps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: luxuryEase }}
                className="group bg-cocoa-400/50 border border-champagne-300/20 hover:border-champagne-300/60 p-6 sm:p-7 rounded-[2px] backdrop-blur-sm transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Image with subtle move on hover */}
                  <div className="relative aspect-[4/3] w-full rounded-[1px] overflow-hidden mb-6 bg-cocoa-500">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-cocoa-300/30 group-hover:bg-cocoa-300/10 transition-colors duration-500" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cocoa-300/80 backdrop-blur-sm border border-champagne-300/30 flex items-center justify-center text-champagne-300">
                      <Icon size={15} strokeWidth={1.7} />
                    </div>
                  </div>

                  {/* Step Meta */}
                  <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-champagne-300 block mb-1">
                    {step.tag}
                  </span>

                  <h3 className="font-serif text-2xl text-pearlIvory-50 font-normal mb-2 group-hover:text-champagne-300 transition-colors">
                    {step.title}
                  </h3>

                  {/* Expanding champagne line on hover */}
                  <div className="h-px w-8 bg-champagne-300/40 group-hover:w-16 group-hover:bg-champagne-300 transition-all duration-500 mb-4" />

                  <p className="text-xs sm:text-[13px] font-mono text-champagne-200 font-medium mb-3">
                    "{step.rule}"
                  </p>

                  <p className="text-xs font-sans font-light text-pearlIvory-200/80 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Care Protocol Action Strip */}
        <div className="mt-12 pt-8 border-t border-champagne-300/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-pearlIvory-300/70 font-light text-center sm:text-left">
            Have a vintage pearl strand requiring professional inspection or silk restringing?
          </p>

          <button
            onClick={() => {
              setCurrentPage('contact');
              window.history.pushState({}, '', '/contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-3 px-6 py-2.5 bg-champagne-300 text-cocoa-300 hover:bg-champagne-200 text-xs font-sans font-medium tracking-widest uppercase rounded-[1px] transition-all duration-300 whitespace-nowrap"
          >
            <span>CONSULT ATELIER CARE SPECIALIST</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
