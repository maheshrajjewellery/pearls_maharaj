import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { ArrowLeftRight, Check, Info, Sparkles, MapPin, Ruler, Palette, Shapes, Layers } from 'lucide-react';
import { pearlTypesList, PearlTypeData } from './PearlTypes';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function PearlComparison() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [leftTypeId, setLeftTypeId] = useState<string>('akoya');
  const [rightTypeId, setRightTypeId] = useState<string>('south-sea');
  const prefersReduced = useReducedMotion();

  const leftType = pearlTypesList.find((p) => p.id === leftTypeId) || pearlTypesList[1];
  const rightType = pearlTypesList.find((p) => p.id === rightTypeId) || pearlTypesList[2];

  const comparisonMetrics = [
    {
      label: 'Typical Origin',
      icon: MapPin,
      leftVal: leftType.origin,
      rightVal: rightType.origin,
    },
    {
      label: 'Size Range',
      icon: Ruler,
      leftVal: leftType.sizeRange,
      rightVal: rightType.sizeRange,
    },
    {
      label: 'Common Colors',
      icon: Palette,
      leftVal: leftType.colors.join(', '),
      rightVal: rightType.colors.join(', '),
    },
    {
      label: 'Common Shapes',
      icon: Shapes,
      leftVal: leftType.shapes.join(', '),
      rightVal: rightType.shapes.join(', '),
    },
    {
      label: 'Luster Style',
      icon: Sparkles,
      leftVal: leftType.lusterProfile,
      rightVal: rightType.lusterProfile,
    },
    {
      label: 'Nacre Structure',
      icon: Layers,
      leftVal: leftType.nacreProfile,
      rightVal: rightType.nacreProfile,
    },
    {
      label: 'Host Mollusk',
      icon: Info,
      leftVal: leftType.mollusk,
      rightVal: rightType.mollusk,
    },
  ];

  return (
    <section
      id="pearl-comparison"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-[#30372F] text-pearlIvory-100 overflow-hidden border-b border-champagne-300/15"
      aria-label="Interactive pearl comparison"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(200, 169, 107, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(232, 220, 213, 0.04) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: luxuryEase }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-champagne-300" />
            <p className="text-champagne-300 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              10 — DIRECT ANALYSIS
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em] text-pearlIvory-50"
          >
            COMPARE <span className="text-champagne-300 italic font-serif font-light">PEARLS.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-pearlIvory-300/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            Select any two pearl types to compare their geographic origins, luster profiles, nacre composition, and sizing characteristics side by side.
          </motion.p>
        </div>

        {/* Dual Selectors Arena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">
          
          {/* Left Selector */}
          <div className="p-4 sm:p-5 bg-cocoa-400/70 border border-champagne-300/20 rounded-[2px] flex items-center justify-between gap-4">
            <label htmlFor="left-pearl-select" className="text-xs font-sans tracking-widest uppercase text-champagne-300 whitespace-nowrap">
              SELECT PEARL A:
            </label>
            <select
              id="left-pearl-select"
              value={leftTypeId}
              onChange={(e) => setLeftTypeId(e.target.value)}
              className="bg-cocoa-300 text-pearlIvory-50 text-xs sm:text-sm font-serif px-4 py-2 border border-champagne-300/40 rounded-[1px] focus:outline-none focus:border-champagne-300 cursor-pointer"
            >
              {pearlTypesList.map((p) => (
                <option key={p.id} value={p.id} className="bg-cocoa-300 text-pearlIvory-50">
                  {p.name} PEARL
                </option>
              ))}
            </select>
          </div>

          {/* Right Selector */}
          <div className="p-4 sm:p-5 bg-cocoa-400/70 border border-champagne-300/20 rounded-[2px] flex items-center justify-between gap-4">
            <label htmlFor="right-pearl-select" className="text-xs font-sans tracking-widest uppercase text-champagne-300 whitespace-nowrap">
              SELECT PEARL B:
            </label>
            <select
              id="right-pearl-select"
              value={rightTypeId}
              onChange={(e) => setRightTypeId(e.target.value)}
              className="bg-cocoa-300 text-pearlIvory-50 text-xs sm:text-sm font-serif px-4 py-2 border border-champagne-300/40 rounded-[1px] focus:outline-none focus:border-champagne-300 cursor-pointer"
            >
              {pearlTypesList.map((p) => (
                <option key={p.id} value={p.id} className="bg-cocoa-300 text-pearlIvory-50">
                  {p.name} PEARL
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Side-by-Side Comparison Table / Cards */}
        <div className="max-w-5xl mx-auto bg-cocoa-400/40 border border-champagne-300/20 rounded-[2px] overflow-hidden backdrop-blur-sm shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
          
          {/* Header Row with Images */}
          <div className="grid grid-cols-2 divide-x divide-champagne-300/15 border-b border-champagne-300/20 bg-cocoa-400/70">
            {/* Left Header */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1px] overflow-hidden flex-shrink-0 border border-champagne-300/30">
                <img
                  src={leftType.image}
                  alt={leftType.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-sans tracking-widest uppercase text-champagne-300 block">
                  VARIETY A
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-pearlIvory-50 font-normal">
                  {leftType.name}
                </h3>
              </div>
            </div>

            {/* Right Header */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1px] overflow-hidden flex-shrink-0 border border-champagne-300/30">
                <img
                  src={rightType.image}
                  alt={rightType.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-sans tracking-widest uppercase text-champagne-300 block">
                  VARIETY B
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-pearlIvory-50 font-normal">
                  {rightType.name}
                </h3>
              </div>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-champagne-300/10 text-xs sm:text-sm">
            {comparisonMetrics.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="p-4 sm:p-6 hover:bg-cocoa-300/30 transition-colors">
                  {/* Category Title Badge */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon size={13} className="text-champagne-300" />
                    <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-champagne-300">
                      {row.label}
                    </span>
                  </div>

                  {/* Dual Values */}
                  <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center">
                    <div className="px-2">
                      <p className="text-pearlIvory-200 font-light leading-relaxed">
                        {row.leftVal}
                      </p>
                    </div>
                    <div className="px-2">
                      <p className="text-pearlIvory-200 font-light leading-relaxed">
                        {row.rightVal}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Factual Disclaimer Footnote */}
          <div className="p-4 sm:p-6 bg-cocoa-400/80 border-t border-champagne-300/15 flex items-start gap-3">
            <Info size={16} className="text-champagne-300 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-pearlIvory-300/70 font-light leading-relaxed">
              <strong className="font-medium text-pearlIvory-100">Gemological Notice: </strong>
              Characteristics can vary within each individual pearl harvest. The metrics above represent typical scientific ranges rather than rigid universal guarantees for every harvested gem.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
