import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Palette, Droplet, Compass } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export interface PearlColorProfile {
  id: string;
  name: string;
  bodyColor: string;
  overtone: string;
  naturalOrigins: string;
  description: string;
  swatchGradient: string;
  macroImage: string;
}

const colorProfiles: PearlColorProfile[] = [
  {
    id: 'white',
    name: 'WHITE',
    bodyColor: 'Pure Crisp White to Soft Milk',
    overtone: 'Rose (Blush Pink), Silver, or Ivory Orient',
    naturalOrigins: 'Akoya (Japan), White South Sea (Australia), Freshwater',
    description:
      'The timeless archetype of luxury pearls. True white pearls possess an immaculate, clean body tone imbued with subtle secondary overtones of romantic blush or icy silver.',
    swatchGradient: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F8F5F0 50%, #D5D0CA 100%)',
    macroImage: 'https://images.pexels.com/photos/9429420/pexels-photo-9429420.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'cream',
    name: 'CREAM',
    bodyColor: 'Warm Vanilla and Soft Champagne',
    overtone: 'Golden Orient with Amber Undertones',
    naturalOrigins: 'Akoya, South Sea, Natural Persian Gulf Pearls',
    description:
      'Rich, warm, and inviting. Cream pearls harmonize exceptionally well with warm skin undertones and yellow or rose gold jewellery mountings.',
    swatchGradient: 'radial-gradient(circle at 35% 35%, #FFFDF8 0%, #F5F0E8 45%, #C5A15A 100%)',
    macroImage: 'https://images.pexels.com/photos/10877350/pexels-photo-10877350.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'pink',
    name: 'PINK',
    bodyColor: 'Natural Pastel Blush & Soft Rose',
    overtone: 'Lavender, Peach, and Shimmering Orient',
    naturalOrigins: 'Freshwater (China & Japan)',
    description:
      'Naturally produced without dyeing in freshwater mussels. Ranges from whisper-soft baby pink to vibrant metallic peach with iridescent lavender highlights.',
    swatchGradient: 'radial-gradient(circle at 35% 35%, #FFF5F2 0%, #E8DCD5 45%, #C29688 100%)',
    macroImage: 'https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'gold',
    name: 'GOLD',
    bodyColor: 'Rich 24K Champagne to Deep Golden Hue',
    overtone: 'Bronze, Honey, and Amber Luster',
    naturalOrigins: 'Golden South Sea (Philippines & Indonesia)',
    description:
      'Regarded as the rarest and most opulent natural pearl color. Cultivated by the gold-lipped Pinctada maxima oyster in deep tropical waters.',
    swatchGradient: 'radial-gradient(circle at 35% 35%, #FFF0C8 0%, #D4BE8A 50%, #9A7D32 100%)',
    macroImage: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'silver',
    name: 'SILVER',
    bodyColor: 'Cool Platinum and Shimmering Steel',
    overtone: 'Aquamarine and Icy Blue Overtones',
    naturalOrigins: 'White South Sea, Akoya, Tahitian',
    description:
      'A sleek, contemporary hue with high optical reflectivity. Displays mirror-like radiance that mirrors white gold and platinum settings.',
    swatchGradient: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E2E2E2 50%, #8C8C8C 100%)',
    macroImage: 'https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'grey',
    name: 'GREY',
    bodyColor: 'Smoky Dove Grey to Slate Charcoal',
    overtone: 'Silvery-Lilac and Gunmetal Orient',
    naturalOrigins: 'Tahitian, Freshwater, Akoya Blue/Baroque',
    description:
      'Sophisticated and understated. Grey pearls present an alluring balance between classical light pearls and dramatic dark Tahitian tones.',
    swatchGradient: 'radial-gradient(circle at 35% 35%, #D6D6D6 0%, #8A8A8A 55%, #3A3A3A 100%)',
    macroImage: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'black',
    name: 'BLACK',
    bodyColor: 'Deep Charcoal, Gunmetal & Emerald Black',
    overtone: 'Peacock Green, Aubergine Violet, Peacock Orient',
    naturalOrigins: 'Tahitian (French Polynesia)',
    description:
      'A mesmerizing natural wonder. Produced by the black-lipped oyster, Tahitian black pearls shimmer with complex peacock iridescence under natural light.',
    swatchGradient: 'radial-gradient(circle at 35% 35%, #555555 0%, #30372F 50%, #30372F 100%)',
    macroImage: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export default function PearlColors() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [activeColorId, setActiveColorId] = useState<string>('white');
  const prefersReduced = useReducedMotion();

  const activeColor = colorProfiles.find((c) => c.id === activeColorId) || colorProfiles[0];

  return (
    <section
      id="pearl-colors"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-[#30372F] text-pearlIvory-100 overflow-hidden border-b border-champagne-300/15"
      aria-label="Pearl colors - a spectrum of beauty"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 40%, rgba(200, 169, 107, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 60%, rgba(232, 220, 213, 0.05) 0%, transparent 65%)',
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
              06 — CHROMATICS
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em] text-pearlIvory-50"
          >
            A SPECTRUM <span className="text-champagne-300 italic font-serif font-light">OF BEAUTY.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-pearlIvory-300/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            Pearl color is composed of body color, translucent overtones, and deep iridescent orient. Select any shade below to inspect its gemological character.
          </motion.p>
        </div>

        {/* 7 Realistic Pearl Color Swatches Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-12">
          {colorProfiles.map((item) => {
            const isSelected = activeColorId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveColorId(item.id)}
                className={`group flex flex-col items-center gap-2 p-2 sm:p-3 rounded-[2px] transition-all duration-300 ${
                  isSelected
                    ? 'scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={`Select ${item.name} pearl color`}
                aria-pressed={isSelected}
              >
                {/* Pearl Orb Swatch */}
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'ring-2 ring-champagne-300 ring-offset-2 ring-offset-[#30372F] shadow-[0_0_20px_rgba(200,169,107,0.4)]'
                      : 'border border-pearlIvory-300/20 group-hover:border-champagne-300/50'
                  }`}
                  style={{
                    background: item.swatchGradient,
                    boxShadow: isSelected
                      ? '0 6px 16px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.6)'
                      : '0 4px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Subtle specular reflection spot */}
                  <div className="absolute top-[20%] left-[25%] w-2.5 h-2.5 rounded-full bg-white/70 blur-[0.5px]" />
                </div>

                {/* Color Name */}
                <span
                  className={`text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase transition-colors ${
                    isSelected ? 'text-champagne-300 font-medium' : 'text-pearlIvory-300/70'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Crossfade Display Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-cocoa-400/40 p-6 sm:p-10 rounded-[2px] border border-champagne-300/15 backdrop-blur-sm">
          
          {/* LEFT: Crossfading Macro Photography */}
          <div className="lg:col-span-6 relative aspect-[4/3.8] sm:aspect-[4/3] rounded-[2px] overflow-hidden bg-cocoa-500 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeColor.id}
                initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: luxuryEase }}
                className="absolute inset-0"
              >
                <img
                  src={activeColor.macroImage}
                  alt={`${activeColor.name} pearl specimen close-up`}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa-300/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 border border-champagne-300/20 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* In-image badge */}
            <div className="absolute bottom-4 left-4 px-3.5 py-1.5 bg-cocoa-400/90 backdrop-blur-md border border-champagne-300/30 text-[10px] font-sans tracking-[0.25em] uppercase text-champagne-300">
              {activeColor.name} SPECTRUM
            </div>
          </div>

          {/* RIGHT: Detailed Color Breakdown */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeColor.id}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -15 }}
                transition={{ duration: 0.45, ease: luxuryEase }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-2 text-champagne-300 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.25em] uppercase mb-1.5">
                    <Palette size={13} />
                    <span>NATURAL CHROMATIC PROFILE</span>
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl text-pearlIvory-50 font-normal">
                    {activeColor.name} PEARL
                  </h3>
                </div>

                <p className="text-pearlIvory-200/90 text-sm sm:text-[15px] font-sans font-light leading-relaxed">
                  {activeColor.description}
                </p>

                {/* Structured Optical Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-pearlIvory-300/10">
                  <div className="p-3.5 bg-cocoa-300/80 rounded-[1px] border border-pearlIvory-300/10 space-y-1">
                    <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-champagne-300 block">
                      Body Color
                    </span>
                    <p className="text-xs text-pearlIvory-100 font-light">{activeColor.bodyColor}</p>
                  </div>

                  <div className="p-3.5 bg-cocoa-300/80 rounded-[1px] border border-pearlIvory-300/10 space-y-1">
                    <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-champagne-300 block">
                      Typical Overtones
                    </span>
                    <p className="text-xs text-pearlIvory-100 font-light">{activeColor.overtone}</p>
                  </div>

                  <div className="sm:col-span-2 p-3.5 bg-cocoa-300/80 rounded-[1px] border border-pearlIvory-300/10 space-y-1">
                    <div className="flex items-center gap-2">
                      <Compass size={12} className="text-champagne-300" />
                      <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-champagne-300">
                        Primary Cultivating Varieties
                      </span>
                    </div>
                    <p className="text-xs text-pearlIvory-200 font-light">{activeColor.naturalOrigins}</p>
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
