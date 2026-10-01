import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Layers, Disc, Eye, Check } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface AnatomyPart {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  significance: string;
  visualHighlight: {
    type: 'circle' | 'ring' | 'surface' | 'reflection';
    cx: number;
    cy: number;
    r?: number;
    rInner?: number;
    rOuter?: number;
  };
}

const anatomyParts: AnatomyPart[] = [
  {
    id: 'nacre',
    name: 'NACRE',
    scientificName: 'Mother-of-Pearl Matrix',
    description:
      "The layers of crystalline material that create much of a pearl's appearance and luster. Composed of thousands of microscopic aragonite platelets bound by organic conchiolin.",
    significance: 'Nacre thickness directly determines durability and optical depth.',
    visualHighlight: {
      type: 'ring',
      cx: 160,
      cy: 160,
      rInner: 36,
      rOuter: 116,
    },
  },
  {
    id: 'surface',
    name: 'SURFACE',
    scientificName: 'External Nacre Boundary',
    description:
      'The outermost perimeter of nacre. Natural pearls display subtle growth characteristics like tiny pits or wrinkles, while fine specimens boast smooth, clean surfaces.',
    significance: 'Smoothness ensures optimal specular reflection without light scatter.',
    visualHighlight: {
      type: 'surface',
      cx: 160,
      cy: 160,
      r: 120,
    },
  },
  {
    id: 'luster',
    name: 'LUSTER',
    scientificName: 'Optical Refraction & Orient',
    description:
      'The visual phenomenon created when light penetrates translucent nacre layers and reflects off microscopic aragonite crystals back to the viewer.',
    significance: 'Produces the signature deep inner glow and mirror-like highlights.',
    visualHighlight: {
      type: 'reflection',
      cx: 110,
      cy: 105,
      r: 28,
    },
  },
  {
    id: 'nucleus',
    name: 'CORE / NUCLEUS',
    scientificName: 'Internal Seed Center',
    description:
      'The central origin around which the mollusk deposits concentric nacre. In cultured pearls, this is typically a polished mother-of-pearl bead; in natural pearls, a microscopic organic particle.',
    significance: 'Provides the foundation and internal geometry for round pearl growth.',
    visualHighlight: {
      type: 'circle',
      cx: 160,
      cy: 160,
      r: 32,
    },
  },
];

export default function PearlAnatomy() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [activePartId, setActivePartId] = useState<string>('nacre');
  const prefersReduced = useReducedMotion();

  const activePart = anatomyParts.find((p) => p.id === activePartId) || anatomyParts[0];

  return (
    <section
      id="pearl-anatomy"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-[#29231F] text-pearlIvory-100 overflow-hidden border-b border-champagne-300/15"
      aria-label="Pearl anatomy interactive diagram"
    >
      {/* Ambient background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(200, 169, 107, 0.08) 0%, transparent 65%), radial-gradient(ellipse at 80% 20%, rgba(232, 220, 213, 0.05) 0%, transparent 60%)',
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
              04 — GEM STRUCTURE
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em] text-pearlIvory-50"
          >
            PEARL <span className="text-champagne-300 italic font-serif font-light">ANATOMY.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-pearlIvory-300/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            Hover or tap any anatomical zone to explore the microscopic structure that creates a pearl's enduring radiance.
          </motion.p>
        </div>

        {/* Interactive Anatomy Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT / CENTER: Interactive Cross-Section SVG with Connecting Callouts */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[460px]">
            
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              
              {/* Radial Guide Ring */}
              <div className="absolute inset-0 rounded-full border border-champagne-300/10 pointer-events-none scale-110" />

              <svg
                viewBox="0 0 320 320"
                className="w-full h-full"
                aria-label="Pearl anatomy cross-section diagram"
              >
                <defs>
                  {/* Pearl Body Gradient */}
                  <radialGradient id="anatomyPearlGrad" cx="36%" cy="32%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#FFFDF8" />
                    <stop offset="60%" stopColor="#F7F3EC" />
                    <stop offset="82%" stopColor="#E8DCD5" />
                    <stop offset="95%" stopColor="#B8A99A" />
                    <stop offset="100%" stopColor="#5A4E48" />
                  </radialGradient>

                  {/* Nucleus Bead Gradient */}
                  <radialGradient id="anatomyNucleusGrad" cx="35%" cy="35%" r="50%">
                    <stop offset="0%" stopColor="#E8D9B8" />
                    <stop offset="60%" stopColor="#C4A35A" />
                    <stop offset="100%" stopColor="#5A4E48" />
                  </radialGradient>

                  {/* Highlight Pulse Filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Base Outer Pearl Sphere */}
                <circle
                  cx="160"
                  cy="160"
                  r="120"
                  fill="url(#anatomyPearlGrad)"
                  stroke="#C8A96B"
                  strokeWidth="1.5"
                  className="filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] cursor-pointer"
                />

                {/* Concentric Nacre Aragonite Micro Rings */}
                {[104, 90, 76, 62, 48].map((radius, i) => (
                  <circle
                    key={radius}
                    cx="160"
                    cy="160"
                    r={radius}
                    fill="none"
                    stroke="#C8A96B"
                    strokeWidth={1}
                    strokeDasharray={i % 2 === 0 ? '3 3' : '2 4'}
                    strokeOpacity={activePartId === 'nacre' ? 0.8 : 0.25}
                    className="transition-all duration-300"
                  />
                ))}

                {/* Interactive Highlight Layer for NACRE */}
                {activePartId === 'nacre' && (
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="80"
                    fill="none"
                    stroke="#FFDE99"
                    strokeWidth="70"
                    strokeOpacity="0.22"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                {/* Base Center Nucleus */}
                <circle
                  cx="160"
                  cy="160"
                  r="32"
                  fill="url(#anatomyNucleusGrad)"
                  stroke="#FFFDF8"
                  strokeWidth="1.5"
                  className="cursor-pointer"
                  onClick={() => setActivePartId('nucleus')}
                />

                {/* Interactive Highlight for NUCLEUS */}
                {activePartId === 'nucleus' && (
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="34"
                    fill="none"
                    stroke="#FFDE99"
                    strokeWidth="3"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                  />
                )}

                {/* Interactive Highlight for SURFACE */}
                {activePartId === 'surface' && (
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="122"
                    fill="none"
                    stroke="#FFDE99"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    transition={{ rotate: { duration: 15, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.4 } }}
                  />
                )}

                {/* Primary Luster Specular Reflection Oval */}
                <ellipse
                  cx="112"
                  cy="106"
                  rx="18"
                  ry="11"
                  fill="#FFFFFF"
                  opacity={activePartId === 'luster' ? 1 : 0.85}
                  transform="rotate(-28 112 106)"
                  className="cursor-pointer filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  onClick={() => setActivePartId('luster')}
                />

                {/* Interactive Highlight for LUSTER */}
                {activePartId === 'luster' && (
                  <motion.circle
                    cx="112"
                    cy="106"
                    r="28"
                    fill="none"
                    stroke="#FFDE99"
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Anatomical Pointer Line connecting Active Part */}
                <motion.g
                  key={activePartId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {activePartId === 'surface' && (
                    <>
                      <line x1="280" y1="160" x2="310" y2="160" stroke="#C8A96B" strokeWidth="1.5" />
                      <circle cx="280" cy="160" r="3" fill="#FFDE99" />
                    </>
                  )}
                  {activePartId === 'nacre' && (
                    <>
                      <line x1="225" y1="130" x2="300" y2="100" stroke="#C8A96B" strokeWidth="1.5" />
                      <circle cx="225" cy="130" r="3" fill="#FFDE99" />
                    </>
                  )}
                  {activePartId === 'nucleus' && (
                    <>
                      <line x1="160" y1="160" x2="280" y2="230" stroke="#C8A96B" strokeWidth="1.5" />
                      <circle cx="160" cy="160" r="3" fill="#FFDE99" />
                    </>
                  )}
                  {activePartId === 'luster' && (
                    <>
                      <line x1="112" y1="106" x2="40" y2="70" stroke="#C8A96B" strokeWidth="1.5" />
                      <circle cx="112" cy="106" r="3" fill="#FFDE99" />
                    </>
                  )}
                </motion.g>
              </svg>

            </div>

            {/* Hotspot buttons for fast selection */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {anatomyParts.map((part) => {
                const isActive = activePartId === part.id;
                return (
                  <button
                    key={part.id}
                    onClick={() => setActivePartId(part.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 ${
                      isActive
                        ? 'bg-champagne-300 text-cocoa-300 font-medium shadow-[0_2px_12px_rgba(200,169,107,0.3)]'
                        : 'bg-cocoa-400/60 text-pearlIvory-300/80 hover:text-champagne-300 hover:bg-cocoa-400 border border-pearlIvory-300/10'
                    }`}
                  >
                    {part.name}
                  </button>
                );
              })}
            </div>

          </div>

          {/* RIGHT: Detailed Information Panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePart.id}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -15 }}
                transition={{ duration: 0.45, ease: luxuryEase }}
                className="bg-cocoa-400/50 border border-champagne-300/20 p-6 sm:p-8 rounded-[2px] backdrop-blur-sm space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2 text-champagne-300 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.25em] uppercase mb-2">
                    <Layers size={13} />
                    <span>{activePart.scientificName}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-pearlIvory-50 font-normal">
                    {activePart.name}
                  </h3>
                </div>

                <p className="text-pearlIvory-200/90 text-sm sm:text-[15px] font-sans font-light leading-relaxed">
                  {activePart.description}
                </p>

                <div className="p-4 bg-cocoa-300/80 border-l-2 border-champagne-300 rounded-r-[1px] space-y-1">
                  <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-champagne-300">
                    Gemological Role
                  </span>
                  <p className="text-xs sm:text-[13px] font-light text-pearlIvory-300/90 leading-relaxed">
                    {activePart.significance}
                  </p>
                </div>

                {/* Quick Navigation to Other Anatomical Zones */}
                <div className="pt-4 border-t border-pearlIvory-300/10">
                  <p className="text-[10px] font-sans tracking-widest uppercase text-pearlIvory-300/50 mb-3">
                    EXPLORE ALL ZONES:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {anatomyParts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActivePartId(p.id)}
                        className={`text-left p-2 rounded-[1px] text-xs transition-colors flex items-center justify-between ${
                          activePartId === p.id
                            ? 'bg-champagne-300/15 text-champagne-200 font-medium'
                            : 'text-pearlIvory-300/70 hover:text-pearlIvory-100 hover:bg-cocoa-300/50'
                        }`}
                      >
                        <span>{p.name}</span>
                        {activePartId === p.id && <Check size={12} className="text-champagne-300" />}
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
