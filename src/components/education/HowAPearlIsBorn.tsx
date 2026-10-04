import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Layers, ShieldAlert, CheckCircle2, ChevronRight, Play, Pause } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface StageInfo {
  step: string;
  title: string;
  subtitle: string;
  scientificTerm: string;
  description: string;
  layersCount: string;
  keyFact: string;
}

const stages: StageInfo[] = [
  {
    step: '01',
    title: 'TRIGGER',
    subtitle: 'The Organic Catalyst',
    scientificTerm: 'Irritant / Mantle Insertion',
    description:
      'A microscopic natural irritant (in wild oysters) or a tiny bead nucleus alongside donor mantle tissue (in cultured farming) enters the mollusk.',
    layersCount: '0 Nacre Layers',
    keyFact: 'The mollusk detects the foreign element and activates its natural defensive biological mechanism.',
  },
  {
    step: '02',
    title: 'NUCLEUS / IRRITANT',
    subtitle: 'Enclosure & Epithelial Sac',
    scientificTerm: 'Pearl Sac Formation',
    description:
      'The mollusk secretes mantle epithelial cells that completely envelop the nucleus, forming a protective biological sphere called the pearl sac.',
    layersCount: 'Initial Organic Matrix',
    keyFact: 'Conchiolin, an organic protein, acts as the natural adhesive bonding upcoming mineral crystal layers.',
  },
  {
    step: '03',
    title: 'NACRE LAYERS',
    subtitle: 'Concentric Crystal Secretion',
    scientificTerm: 'Aragonite Crystallization',
    description:
      'Over months and years, the mollusk deposits thousands of microscopic, hexagonal platelets of aragonite (calcium carbonate) in concentric rings.',
    layersCount: '1,000 to 5,000+ Micro Layers',
    keyFact: 'Each micro-layer is only 0.5 microns thick; light enters and bounces between these plates to create luster.',
  },
  {
    step: '04',
    title: 'PEARL',
    subtitle: 'The Luminous Gemstone',
    scientificTerm: 'Mature Organic Gemstone',
    description:
      'After careful gestation in clean aquatic ecosystems, a lustrous, finished gemstone with deep orient and rich overtones emerges.',
    layersCount: 'Fully Consolidated Nacre',
    keyFact: 'The culmination of nature and time: a finished organic gem that requires no cutting or polishing to reveal its brilliance.',
  },
];

export default function HowAPearlIsBorn() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const prefersReduced = useReducedMotion();

  // Optional auto-play through stages
  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = stages[activeStage];

  return (
    <section
      id="how-a-pearl-is-born"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-[#30372F] text-pearlIvory-100 overflow-hidden border-b border-champagne-300/15"
      aria-label="How a pearl is born scientific infographic"
    >
      {/* Background ambient radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(200, 169, 107, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(232, 220, 213, 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: luxuryEase }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-champagne-300" />
            <p className="text-champagne-300 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              02 — THE GENESIS
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em] text-pearlIvory-50"
          >
            HOW A PEARL <span className="text-champagne-300 italic font-serif font-light">IS BORN.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-pearlIvory-300/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            An extraordinary biological metamorphosis where microscopic crystalline layers transform into an organic gemstone.
          </motion.p>
        </div>

        {/* 4-Step Navigation Timeline */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {stages.map((st, idx) => {
            const isActive = activeStage === idx;
            const isPassed = activeStage > idx;

            return (
              <button
                key={st.step}
                onClick={() => {
                  setActiveStage(idx);
                  setIsPlaying(false);
                }}
                className={`group relative text-left p-4 sm:p-5 rounded-[1px] border transition-all duration-300 ${
                  isActive
                    ? 'bg-cocoa-400/80 border-champagne-300/80 shadow-[0_4px_20px_rgba(200,169,107,0.15)]'
                    : 'bg-cocoa-400/30 border-pearlIvory-300/10 hover:border-champagne-300/30 hover:bg-cocoa-400/50'
                }`}
                aria-pressed={isActive}
              >
                {/* Active Indicator bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
                    isActive ? 'bg-champagne-300' : isPassed ? 'bg-champagne-400/40' : 'bg-transparent'
                  }`}
                />

                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-sans font-medium tracking-[0.2em] uppercase transition-colors ${
                      isActive ? 'text-champagne-300' : 'text-pearlIvory-300/50'
                    }`}
                  >
                    STEP {st.step}
                  </span>
                  <span className="text-[10px] text-pearlIvory-300/40 font-mono">
                    {idx === 0 ? 'START' : idx === 3 ? 'MATURE' : `STAGE ${idx + 1}`}
                  </span>
                </div>

                <h3
                  className={`font-serif text-base sm:text-lg tracking-wide transition-colors ${
                    isActive ? 'text-pearlIvory-50 font-normal' : 'text-pearlIvory-300/70 group-hover:text-pearlIvory-100'
                  }`}
                >
                  {st.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Interactive Infographic Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-cocoa-400/40 p-6 sm:p-10 lg:p-12 rounded-[2px] border border-champagne-300/15 backdrop-blur-sm">
          
          {/* LEFT: Central SVG Pearl Cross-Section Layer Construction */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[400px]">
            
            {/* Infographic Grid Rings Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-72 h-72 rounded-full border border-dashed border-champagne-300/40" />
              <div className="absolute w-88 h-88 rounded-full border border-champagne-300/20" />
              <div className="absolute h-px w-full bg-champagne-300/15" />
              <div className="absolute w-px h-full bg-champagne-300/15" />
            </div>

            {/* Dynamic Pearl Cross-Section SVG */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full transform transition-transform duration-700"
                aria-label="Pearl biological cross-section illustration"
              >
                <defs>
                  {/* Outer nacre luster gradient */}
                  <radialGradient id="nacreGlow" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#FFFDF8" />
                    <stop offset="55%" stopColor="#F7F3EC" />
                    <stop offset="78%" stopColor="#E8DCD5" />
                    <stop offset="92%" stopColor="#B8A99A" />
                    <stop offset="100%" stopColor="#5A4E48" />
                  </radialGradient>

                  {/* Translucent aragonite layers */}
                  <radialGradient id="layerGrad1" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#E8D9B8" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#C5A15A" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#5A4E48" stopOpacity="0.7" />
                  </radialGradient>

                  {/* Nucleus core gradient */}
                  <radialGradient id="nucleusGrad" cx="35%" cy="35%" r="50%">
                    <stop offset="0%" stopColor="#E8DCD5" />
                    <stop offset="60%" stopColor="#A8998C" />
                    <stop offset="100%" stopColor="#4A3F39" />
                  </radialGradient>

                  {/* Irritant spark gradient */}
                  <radialGradient id="sparkGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFDE99" />
                    <stop offset="60%" stopColor="#C5A15A" />
                    <stop offset="100%" stopColor="#7A6038" />
                  </radialGradient>
                </defs>

                {/* STAGE 4: Completed Outer Pearl Sphere */}
                <motion.circle
                  cx="160"
                  cy="160"
                  r="135"
                  fill="url(#nacreGlow)"
                  stroke="#C5A15A"
                  strokeWidth="1.5"
                  initial={false}
                  animate={{
                    opacity: activeStage >= 3 ? 1 : 0,
                    scale: activeStage >= 3 ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.8, ease: luxuryEase }}
                  className="filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                />

                {/* STAGE 3: Concentric Aragonite Nacre Shells (Building Up) */}
                <motion.g
                  initial={false}
                  animate={{
                    opacity: activeStage >= 2 ? 1 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Concentric rings */}
                  {[115, 98, 82, 66, 52].map((radius, i) => (
                    <motion.circle
                      key={radius}
                      cx="160"
                      cy="160"
                      r={radius}
                      fill="none"
                      stroke="#C5A15A"
                      strokeWidth={1}
                      strokeDasharray={i % 2 === 0 ? '4 3' : undefined}
                      strokeOpacity={0.4 + i * 0.12}
                      initial={false}
                      animate={{
                        scale: activeStage >= 2 ? [0.95, 1] : 0.8,
                        opacity: activeStage >= 2 ? 1 : 0,
                      }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: luxuryEase }}
                    />
                  ))}

                  {/* Semi-transparent crystalline wave fill */}
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="110"
                    fill="url(#layerGrad1)"
                    initial={false}
                    animate={{ opacity: activeStage === 2 ? 0.85 : activeStage > 2 ? 0.35 : 0 }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.g>

                {/* STAGE 2: Epithelial Pearl Sac Boundary */}
                <motion.circle
                  cx="160"
                  cy="160"
                  r="52"
                  fill="rgba(200, 169, 107, 0.25)"
                  stroke="#C5A15A"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  initial={false}
                  animate={{
                    opacity: activeStage >= 1 ? 1 : 0,
                    scale: activeStage >= 1 ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.7, ease: luxuryEase }}
                />

                {/* STAGE 1 & 2: Nucleus / Irritant Core */}
                <motion.circle
                  cx="160"
                  cy="160"
                  r="26"
                  fill={activeStage === 0 ? 'url(#sparkGrad)' : 'url(#nucleusGrad)'}
                  stroke="#E8DCD5"
                  strokeWidth="1.5"
                  initial={false}
                  animate={{
                    scale: activeStage === 0 ? [1, 1.15, 1] : 1,
                    opacity: 1,
                  }}
                  transition={{
                    scale: activeStage === 0 ? { duration: 2, repeat: Infinity } : { duration: 0.5 },
                  }}
                />

                {/* Stage 0 Pulsing Irritant Beacon Ring */}
                {activeStage === 0 && (
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="38"
                    fill="none"
                    stroke="#FFDE99"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    animate={{
                      scale: [1, 1.4, 1.8],
                      opacity: [0.9, 0.4, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}

                {/* Cross-section highlight specular in Stage 4 */}
                {activeStage === 3 && (
                  <motion.ellipse
                    cx="120"
                    cy="120"
                    rx="18"
                    ry="10"
                    fill="#FFFFFF"
                    opacity="0.85"
                    transform="rotate(-25 120 120)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </svg>
            </div>

            {/* Micro Badge under Graphic */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-cocoa-300/60 rounded-full border border-champagne-300/20 text-[10px] font-sans tracking-[0.2em] uppercase text-champagne-300">
              <Sparkles size={11} />
              <span>{current.layersCount}</span>
            </div>
          </div>

          {/* RIGHT: Detailed Scientific Editorial Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: prefersReduced ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: prefersReduced ? 0 : -20 }}
                transition={{ duration: 0.5, ease: luxuryEase }}
                className="space-y-6"
              >
                {/* Stage Header */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[12px] font-mono text-champagne-300 font-bold px-2 py-0.5 bg-champagne-300/15 rounded-[1px] border border-champagne-300/30">
                      PHASE {current.step} / 04
                    </span>
                    <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-pearlIvory-300/60">
                      {current.scientificTerm}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-pearlIvory-50 font-normal">
                    {current.title}
                  </h3>
                  <p className="text-champagne-200 text-sm font-light mt-1 italic">
                    {current.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-pearlIvory-200/90 text-sm sm:text-base font-sans font-light leading-relaxed">
                  {current.description}
                </p>

                {/* Key Biological Insight Box */}
                <div className="p-4 sm:p-5 bg-cocoa-300/80 border-l-2 border-champagne-300 rounded-r-[1px] space-y-1.5">
                  <div className="flex items-center gap-2 text-champagne-300 text-[11px] font-sans font-medium tracking-[0.18em] uppercase">
                    <Layers size={13} />
                    <span>Biological Mechanism</span>
                  </div>
                  <p className="text-xs sm:text-[13px] font-light text-pearlIvory-300/90 leading-relaxed">
                    {current.keyFact}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Interactive Step Navigator Footer */}
            <div className="pt-8 mt-6 border-t border-champagne-300/15 flex flex-wrap items-center justify-between gap-4">
              {/* Play / Pause Autoplay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-champagne-300/20 text-champagne-300 text-[11px] font-sans tracking-widest uppercase hover:bg-champagne-300/10 transition-colors"
                aria-label={isPlaying ? 'Pause auto-cycle' : 'Play auto-cycle'}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'Pause Sequence' : 'Auto Sequence'}</span>
              </button>

              {/* Next Step Button */}
              <div className="flex items-center gap-3">
                <button
                  disabled={activeStage === 0}
                  onClick={() => {
                    setActiveStage((prev) => Math.max(0, prev - 1));
                    setIsPlaying(false);
                  }}
                  className={`px-4 py-1.5 text-xs font-sans tracking-widest uppercase rounded-[1px] border transition-colors ${
                    activeStage === 0
                      ? 'border-pearlIvory-300/10 text-pearlIvory-300/30 cursor-not-allowed'
                      : 'border-champagne-300/30 text-champagne-200 hover:bg-champagne-300/10'
                  }`}
                >
                  PREVIOUS
                </button>

                <button
                  onClick={() => {
                    setActiveStage((prev) => (prev + 1) % stages.length);
                    setIsPlaying(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-sans font-medium tracking-widest uppercase bg-champagne-300 text-cocoa-300 hover:bg-champagne-200 rounded-[1px] transition-colors"
                >
                  <span>{activeStage === 3 ? 'RESTART' : 'NEXT STAGE'}</span>
                  <ChevronRight size={13} strokeWidth={2} />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
