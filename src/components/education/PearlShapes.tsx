import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Compass, Check } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export interface PearlShapeItem {
  id: string;
  name: string;
  category: 'Symmetrical' | 'Semi-Baroque' | 'Baroque';
  symmetryScore: string;
  description: string;
  idealFor: string;
  svgShape: {
    type: 'circle' | 'ellipse' | 'button' | 'drop' | 'baroque' | 'nearRound';
  };
}

const pearlShapes: PearlShapeItem[] = [
  {
    id: 'round',
    name: 'ROUND',
    category: 'Symmetrical',
    symmetryScore: 'Perfect Sphericity (99%+)',
    description:
      'The rarest shape occurring naturally. A true spherical silhouette where diameter variance is virtually undetectable to the naked eye.',
    idealFor: 'Classic uniform single strands, solitaire studs, and timeless bridal chokers.',
    svgShape: { type: 'circle' },
  },
  {
    id: 'near-round',
    name: 'NEAR ROUND',
    category: 'Symmetrical',
    symmetryScore: 'High Symmetry (95%–98%)',
    description:
      'Appears perfectly round when strung into necklaces or viewed from a natural distance, with negligible elongation discernible only upon close inspection.',
    idealFor: 'Luxurious graduated strands and everyday high-luster necklaces.',
    svgShape: { type: 'nearRound' },
  },
  {
    id: 'oval',
    name: 'OVAL',
    category: 'Symmetrical',
    symmetryScore: 'Bilateral Symmetry',
    description:
      'A gracefully balanced elongated oval silhouette featuring smooth contours and harmonious curve proportions.',
    idealFor: 'Elongated pendants, statement cocktail rings, and modern hoop earrings.',
    svgShape: { type: 'ellipse' },
  },
  {
    id: 'button',
    name: 'BUTTON',
    category: 'Semi-Baroque',
    symmetryScore: 'Rotational Symmetry',
    description:
      'Flattened on one or both sides like a disc or rounded dome. Prized for its flush, comfortable sit against the skin.',
    idealFor: 'Post earrings, cuff links, flush ring mounts, and brooches.',
    svgShape: { type: 'button' },
  },
  {
    id: 'drop',
    name: 'DROP',
    category: 'Semi-Baroque',
    symmetryScore: 'Teardrop Symmetry',
    description:
      'Resembles a smooth teardrop or pear. Symmetrical drops are highly sought after by jewelers for balance and fluid elegance.',
    idealFor: 'Dangle earrings, regal tiara drops, and solitaire necklace pendants.',
    svgShape: { type: 'drop' },
  },
  {
    id: 'baroque',
    name: 'BAROQUE',
    category: 'Baroque',
    symmetryScore: 'Organic / Asymmetrical',
    description:
      'Completely freeform and organically sculpted by nature. Every single baroque pearl is an unrepeatable one-of-a-kind art piece with remarkable orient fire.',
    idealFor: 'High-jewelry sculptural art pieces, bespoke rings, and organic modern necklaces.',
    svgShape: { type: 'baroque' },
  },
];

export default function PearlShapes() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [activeShapeId, setActiveShapeId] = useState<string>('round');
  const prefersReduced = useReducedMotion();

  const activeShape = pearlShapes.find((s) => s.id === activeShapeId) || pearlShapes[0];

  return (
    <section
      id="pearl-shapes"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-pearlIvory-100 text-cocoa-300 overflow-hidden border-b border-[rgba(41,35,31,0.08)]"
      aria-label="Pearl shapes - shape matters"
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: luxuryEase }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-champagne-300" />
            <p className="text-champagne-400 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              05 — MORPHOLOGY
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-cocoa-300 text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em]"
          >
            SHAPE <span className="italic font-serif font-light text-cocoa-200">MATTERS.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-cocoa-100/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            Arranged in natural continuum from perfect mathematical symmetry to freeform organic poetry. Every silhouette possesses unique aesthetic character.
          </motion.p>
        </div>

        {/* Continuum Scale Bar */}
        <div className="hidden sm:flex items-center justify-between max-w-4xl mx-auto mb-8 px-4 text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-cocoa-100/60">
          <span>← MORE SYMMETRICAL</span>
          <div className="flex-1 mx-6 h-px bg-gradient-to-r from-champagne-300 via-cocoa-300/20 to-champagne-300" />
          <span>MORE ORGANIC →</span>
        </div>

        {/* 6 Shape Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mb-12">
          {pearlShapes.map((shape, i) => {
            const isActive = activeShapeId === shape.id;

            return (
              <motion.button
                key={shape.id}
                onClick={() => setActiveShapeId(shape.id)}
                onMouseEnter={() => setActiveShapeId(shape.id)}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: luxuryEase }}
                className={`group relative p-5 rounded-[2px] border text-center flex flex-col items-center justify-between transition-all duration-300 ${
                  isActive
                    ? 'bg-pearlIvory-50 border-champagne-400 shadow-[0_8px_25px_rgba(200,169,107,0.18)] scale-[1.03]'
                    : 'bg-pearlIvory-50/70 border-[rgba(41,35,31,0.07)] hover:border-champagne-300/50 hover:bg-pearlIvory-50'
                }`}
                aria-pressed={isActive}
              >
                {/* Visual Pearl Shape Illustration */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-3">
                  
                  {/* Subtle soft ambient glow on active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-champagne-300/20 blur-md scale-110 pointer-events-none" />
                  )}

                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <defs>
                      <radialGradient id={`shapeGrad-${shape.id}`} cx="38%" cy="32%" r="62%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="25%" stopColor="#FFFDF8" />
                        <stop offset="65%" stopColor="#F7F3EC" />
                        <stop offset="85%" stopColor="#E8DCD5" />
                        <stop offset="100%" stopColor="#B8A99A" />
                      </radialGradient>
                    </defs>

                    {shape.svgShape.type === 'circle' && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill={`url(#shapeGrad-${shape.id})`}
                        stroke="#C5A15A"
                        strokeWidth="1"
                        className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                      />
                    )}

                    {shape.svgShape.type === 'nearRound' && (
                      <ellipse
                        cx="50"
                        cy="50"
                        rx="38"
                        ry="35"
                        fill={`url(#shapeGrad-${shape.id})`}
                        stroke="#C5A15A"
                        strokeWidth="1"
                        className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                      />
                    )}

                    {shape.svgShape.type === 'ellipse' && (
                      <ellipse
                        cx="50"
                        cy="50"
                        rx="28"
                        ry="40"
                        fill={`url(#shapeGrad-${shape.id})`}
                        stroke="#C5A15A"
                        strokeWidth="1"
                        className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                      />
                    )}

                    {shape.svgShape.type === 'button' && (
                      <path
                        d="M 16,52 C 16,30 32,18 50,18 C 68,18 84,30 84,52 C 84,68 70,72 50,72 C 30,72 16,68 16,52 Z"
                        fill={`url(#shapeGrad-${shape.id})`}
                        stroke="#C5A15A"
                        strokeWidth="1"
                        className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                      />
                    )}

                    {shape.svgShape.type === 'drop' && (
                      <path
                        d="M 50,14 C 54,26 78,48 78,64 C 78,78 65,86 50,86 C 35,86 22,78 22,64 C 22,48 46,26 50,14 Z"
                        fill={`url(#shapeGrad-${shape.id})`}
                        stroke="#C5A15A"
                        strokeWidth="1"
                        className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                      />
                    )}

                    {shape.svgShape.type === 'baroque' && (
                      <path
                        d="M 45,18 C 62,14 78,28 80,44 C 82,60 74,72 65,82 C 54,90 32,84 24,70 C 16,56 22,38 34,26 C 38,22 40,20 45,18 Z"
                        fill={`url(#shapeGrad-${shape.id})`}
                        stroke="#C5A15A"
                        strokeWidth="1"
                        className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                      />
                    )}

                    {/* Specular Highlight */}
                    <circle cx="40" cy="36" r="4" fill="#FFFFFF" opacity="0.8" />
                  </svg>
                </div>

                {/* Shape Label */}
                <div>
                  <h3
                    className={`font-serif text-base sm:text-lg font-normal transition-colors ${
                      isActive ? 'text-cocoa-300 font-medium' : 'text-cocoa-200'
                    }`}
                  >
                    {shape.name}
                  </h3>
                  <span className="text-[10px] font-sans tracking-widest uppercase text-champagne-500 block mt-0.5">
                    {shape.category}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detailed Focus Box for Currently Selected Shape */}
        <motion.div
          key={activeShape.id}
          initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: luxuryEase }}
          className="max-w-4xl mx-auto bg-pearlIvory-50 border border-champagne-300/40 p-6 sm:p-8 rounded-[2px] shadow-[0_6px_24px_rgba(41,35,31,0.04)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[rgba(41,35,31,0.1)] pb-4 md:pb-0 md:pr-6">
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-champagne-500 font-medium">
                SYMMETRY PROFILE
              </span>
              <h4 className="font-serif text-2xl text-cocoa-300 font-normal mt-1">
                {activeShape.name} PEARL
              </h4>
              <p className="text-xs font-mono text-cocoa-200 mt-1">
                {activeShape.symmetryScore}
              </p>
            </div>

            <div className="md:col-span-8 space-y-3">
              <p className="text-sm font-sans font-light text-cocoa-100/90 leading-relaxed">
                {activeShape.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-cocoa-300">
                <span className="font-medium text-champagne-500 uppercase tracking-wider text-[10px]">
                  Optimal Jewellery Design:
                </span>
                <span className="font-light">{activeShape.idealFor}</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
