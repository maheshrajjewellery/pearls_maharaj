import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Ruler, Check } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export interface PearlSizeItem {
  mm: number;
  label: string;
  category: string;
  diameterScalePx: number; // Base pixel proportional diameter: 6mm=48px, 7mm=56px, 8mm=64px, 9mm=72px, 10mm+=88px
  proportionalRatio: string;
  description: string;
  stylingContext: string;
  rarityNote: string;
}

const pearlSizes: PearlSizeItem[] = [
  {
    mm: 6,
    label: '6.0 – 6.5 mm',
    category: 'Delicate Petite',
    diameterScalePx: 52,
    proportionalRatio: '1.0x Base',
    description:
      'Understated, youthful, and delicate. Provides a graceful accent without overwhelming subtle necklines.',
    stylingContext: 'Subtle daily studs, layered delicate chains, teen graduations, and minimalist styling.',
    rarityNote: 'Common in Akoya and Freshwater harvests.',
  },
  {
    mm: 7,
    label: '7.0 – 7.5 mm',
    category: 'The Classic Standard',
    diameterScalePx: 62,
    proportionalRatio: '1.18x Scale',
    description:
      'The quintessential classic pearl size worldwide. Effortlessly bridges versatile daytime elegance with evening formalwear.',
    stylingContext: 'The timeless single strand necklace, classic bridal pearl earrings, and versatile luxury studs.',
    rarityNote: 'The benchmark size for luxury heirloom pearl necklaces.',
  },
  {
    mm: 8,
    label: '8.0 – 8.5 mm',
    category: 'Opulent Presence',
    diameterScalePx: 72,
    proportionalRatio: '1.38x Scale',
    description:
      'Substantial, sophisticated, and commanding. Possesses noticeable volume and rich orient reflection across the collarbone.',
    stylingContext: 'Executive statement strands, cocktail earrings, engagement rings, and formal gala wear.',
    rarityNote: 'Requires extended cultivation time in mature oysters.',
  },
  {
    mm: 9,
    label: '9.0 – 9.5 mm',
    category: 'Prestige Scale',
    diameterScalePx: 82,
    proportionalRatio: '1.58x Scale',
    description:
      'Distinctive prestige size. The upper threshold for Akoya pearls and the starting gateway for regal South Sea & Tahitian gems.',
    stylingContext: 'High-jewellery centerpieces, luxury choker strands, and statement solitaire rings.',
    rarityNote: 'Represents less than 5% of classical Akoya harvests.',
  },
  {
    mm: 10,
    label: '10.0 – 15.0+ mm',
    category: 'Grand Heirloom',
    diameterScalePx: 100,
    proportionalRatio: '1.92x Scale',
    description:
      'Magnificent, museum-grade dimensions. Exclusively produced by South Sea and Tahitian giant oysters over several years.',
    stylingContext: 'Regal red-carpet chokers, extraordinary baroque pendants, and heirloom generational suites.',
    rarityNote: 'Extremely rare; value scales exponentially with size and perfection.',
  },
];

export default function PearlSize() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [activeSizeMm, setActiveSizeMm] = useState<number>(7);
  const prefersReduced = useReducedMotion();

  const activeSize = pearlSizes.find((s) => s.mm === activeSizeMm) || pearlSizes[1];

  return (
    <section
      id="pearl-size"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-[#29231F] text-pearlIvory-100 overflow-hidden border-b border-champagne-300/15 select-none"
      aria-label="Pearl size and proportion guide"
    >
      {/* Background radial ambient lights */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(200, 169, 107, 0.08) 0%, transparent 65%), radial-gradient(ellipse at 10% 20%, rgba(232, 220, 213, 0.04) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: luxuryEase }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-champagne-300" />
            <p className="text-champagne-300 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              08 — PROPORTIONS
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em] text-pearlIvory-50"
          >
            SCALE & <span className="text-champagne-300 italic font-serif font-light">PROPORTION.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-pearlIvory-300/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            Pearl size is typically measured in millimeters. The visual spheres below maintain true physical proportionality.
          </motion.p>
        </div>

        {/* Proportional Comparison Runway */}
        <div className="bg-cocoa-400/50 border border-champagne-300/20 p-6 sm:p-10 lg:p-12 rounded-[2px] backdrop-blur-sm mb-10">
          
          {/* Proportional Spheres Horizontal Track */}
          <div className="flex items-end justify-between sm:justify-around gap-4 sm:gap-6 py-8 border-b border-champagne-300/15 overflow-x-auto no-scrollbar">
            {pearlSizes.map((item) => {
              const isSelected = activeSizeMm === item.mm;

              return (
                <button
                  key={item.mm}
                  onClick={() => setActiveSizeMm(item.mm)}
                  className={`group flex flex-col items-center gap-4 transition-all duration-300 flex-shrink-0 ${
                    isSelected ? 'scale-105' : 'opacity-65 hover:opacity-100'
                  }`}
                  aria-label={`Select ${item.label} size`}
                  aria-pressed={isSelected}
                >
                  {/* Proportional Scaled Sphere */}
                  <div className="flex items-end justify-center h-[120px]">
                    <div
                      className={`relative rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'ring-2 ring-champagne-300 ring-offset-4 ring-offset-[#29231F] shadow-[0_10px_30px_rgba(200,169,107,0.4)]'
                          : 'shadow-[0_6px_16px_rgba(0,0,0,0.4)] group-hover:shadow-[0_8px_20px_rgba(200,169,107,0.2)]'
                      }`}
                      style={{
                        width: `${item.diameterScalePx}px`,
                        height: `${item.diameterScalePx}px`,
                        background:
                          'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FFFDF8 25%, #F7F3EC 55%, #E8DCD5 80%, #B8A99A 95%, #5A4E48 100%)',
                      }}
                    >
                      {/* Specular highlight point */}
                      <div
                        className="absolute top-[18%] left-[22%] rounded-full bg-white blur-[0.5px]"
                        style={{
                          width: `${Math.max(4, item.diameterScalePx * 0.18)}px`,
                          height: `${Math.max(4, item.diameterScalePx * 0.18)}px`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Millimeter Label & Marker */}
                  <div className="text-center">
                    <div
                      className={`text-xs sm:text-sm font-serif transition-colors ${
                        isSelected ? 'text-champagne-300 font-medium' : 'text-pearlIvory-200'
                      }`}
                    >
                      {item.mm}mm{item.mm === 10 ? '+' : ''}
                    </div>
                    <span className="text-[9px] font-sans font-mono text-pearlIvory-300/50 uppercase tracking-widest block">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Millimeter Scale Ruler */}
          <div className="pt-6 flex items-center justify-between text-[10px] font-mono text-pearlIvory-300/40">
            <span>6.0 MM (PETITE)</span>
            <div className="flex-1 mx-4 border-b border-dashed border-champagne-300/20" />
            <span>10.0+ MM (GRAND HEIRLOOM)</span>
          </div>
        </div>

        {/* Dynamic Detail Card for Selected Size */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSize.mm}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : -12 }}
            transition={{ duration: 0.4, ease: luxuryEase }}
            className="max-w-4xl mx-auto bg-cocoa-400/70 border border-champagne-300/30 p-6 sm:p-8 rounded-[2px] shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Size Meta */}
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-champagne-300/15 pb-4 md:pb-0 md:pr-6">
                <div className="flex items-center gap-2 text-champagne-300 text-[10px] font-sans font-medium tracking-widest uppercase mb-1">
                  <Ruler size={13} />
                  <span>DIAMETER METRIC</span>
                </div>
                <h3 className="font-serif text-3xl text-pearlIvory-50 font-normal">
                  {activeSize.label}
                </h3>
                <p className="text-xs font-sans text-champagne-200 mt-1">
                  {activeSize.category}
                </p>
              </div>

              {/* Right Column: Context & Styling */}
              <div className="md:col-span-8 space-y-3">
                <p className="text-sm font-sans font-light text-pearlIvory-200 leading-relaxed">
                  {activeSize.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-cocoa-300/60 rounded-[1px] border border-pearlIvory-300/10">
                    <span className="text-[10px] font-sans font-medium text-champagne-300 uppercase tracking-wider block mb-1">
                      Ideal Setting & Styling
                    </span>
                    <p className="text-pearlIvory-300/90 font-light">{activeSize.stylingContext}</p>
                  </div>

                  <div className="p-3 bg-cocoa-300/60 rounded-[1px] border border-pearlIvory-300/10">
                    <span className="text-[10px] font-sans font-medium text-champagne-300 uppercase tracking-wider block mb-1">
                      Harvest Occurrence
                    </span>
                    <p className="text-pearlIvory-300/90 font-light">{activeSize.rarityNote}</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
