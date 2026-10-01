import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { ArrowRight, X, MapPin, Sparkles, CircleDot, Palette, Shapes, ShieldCheck } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export interface PearlTypeData {
  id: string;
  name: string;
  tagline: string;
  mollusk: string;
  origin: string;
  sizeRange: string;
  colors: string[];
  shapes: string[];
  characteristics: string;
  lusterProfile: string;
  nacreProfile: string;
  image: string;
  description: string;
  distinction: string;
}

export const pearlTypesList: PearlTypeData[] = [
  {
    id: 'freshwater',
    name: 'FRESHWATER',
    tagline: 'Organic Versatility & Remarkable Durability',
    mollusk: 'Hyriopsis cumingii (Triangle Sail Mussel)',
    origin: 'Pristine rivers, lakes, and aquaculture basins in China & Japan',
    sizeRange: '4mm – 12mm (select fireballs reach 15mm+)',
    colors: ['Pure White', 'Blush Pink', 'Lavender', 'Peach', 'Champagne Cream'],
    shapes: ['Round', 'Near-Round', 'Oval', 'Button', 'Drop', 'Baroque / Fireball'],
    characteristics:
      'Cultivated without a rigid bead nucleus in most cases, resulting in pearls composed almost entirely of solid crystalline nacre for exceptional durability.',
    lusterProfile: 'Soft, satiny orient with warm natural glow',
    nacreProfile: '100% solid natural nacre (non-nucleated)',
    image: 'https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'Freshwater pearls are celebrated for their astonishing spectrum of natural pastel hues, artistic freeform contours, and high durability due to their solid nacre composition.',
    distinction: 'Naturally occurs in delicate pastel and lavender tones without dye or enhancement.',
  },
  {
    id: 'akoya',
    name: 'AKOYA',
    tagline: 'The Quintessential Spherical Mirror Luster',
    mollusk: 'Pinctada fucata martensii (Akoya Pearl Oyster)',
    origin: 'Coastal ocean bays of Japan (Mie, Ehime, Nagasaki) & Southeast Asia',
    sizeRange: '6mm – 9.5mm (rarely exceeds 10mm)',
    colors: ['Pure White', 'Cream', 'Silver-White', 'Rose Overtones'],
    shapes: ['Perfect Round', 'Near-Round'],
    characteristics:
      'Renowned worldwide as the classic luxury pearl strand standard, distinguished by supreme sphericity and intense mirror-like reflection.',
    lusterProfile: 'Sharp, mirror-like specular reflections with distinct edges',
    nacreProfile: 'Concentric high-density aragonite layer over bead nucleus (0.4mm – 0.6mm)',
    image: 'https://images.pexels.com/photos/10877350/pexels-photo-10877350.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'The traditional pearl of choice for classic single and double-strand necklaces. Its cooler ocean waters yield dense, tightly aligned aragonite crystals producing crisp reflections.',
    distinction: 'Sets the benchmark for razor-sharp reflection clarity among all round pearls.',
  },
  {
    id: 'south-sea',
    name: 'SOUTH SEA',
    tagline: 'The Regal Queen of Warm & Golden Pearls',
    mollusk: 'Pinctada maxima (Silver-lipped & Gold-lipped Oyster)',
    origin: 'Northern Coast of Australia, Indonesia, and the Philippines',
    sizeRange: '9mm – 16mm (extraordinary specimens reach 20mm)',
    colors: ['Silvery White', 'Warm Champagne', 'Imperial Gold', 'Platinum'],
    shapes: ['Round', 'Near-Round', 'Drop', 'Oval', 'Baroque'],
    characteristics:
      'Produced by the largest pearl-producing oyster in pristine warm equatorial currents, known for majestic sizes and luxurious, deep satin opulence.',
    lusterProfile: 'Rich, soft, deep-seated velvet and satin glow',
    nacreProfile: 'Exceptionally thick natural nacre (2.0mm – 4.0mm)',
    image: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'South Sea pearls are renowned for their commanding size and incomparable thick nacre. White South Sea pearls hail primarily from Australia, while Golden varieties thrive in the Philippines and Indonesia.',
    distinction: 'Commands the largest natural diameter and thickest nacre mantle in fine jewellery.',
  },
  {
    id: 'tahitian',
    name: 'TAHITIAN',
    tagline: 'Exotic Dark Overtones & Peacock Iridescence',
    mollusk: 'Pinctada margaritifera (Black-lipped Oyster)',
    origin: 'Pristine lagoons of French Polynesia and the Cook Islands',
    sizeRange: '8mm – 16mm (averages 9.5mm – 12mm)',
    colors: ['Peacock Green', 'Aubergine / Eggplant', 'Charcoal Grey', 'Pistachio', 'Deep Black'],
    shapes: ['Round', 'Circled', 'Drop', 'Baroque', 'Oval', 'Button'],
    characteristics:
      'Naturally dark organic gemstones formed with mesmerizing multi-hued overtones that shimmer between peacock greens, violet undertones, and gunmetal silvers.',
    lusterProfile: 'High metallic sheen with dynamic prismatic undertones',
    nacreProfile: 'Substantial nacre thickness strictly regulated (min 0.8mm)',
    image: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'Often called "black pearls," Tahitian pearls are never truly jet black; rather, they present an alluring kaleidoscope of natural dark tones born from the black-lipped oyster mantle.',
    distinction: 'The only pearls naturally born in rich dark and peacock spectrums without dye.',
  },
];

export default function PearlTypes() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [selectedType, setSelectedType] = useState<PearlTypeData | null>(null);
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="types-of-pearls"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-pearlIvory-100 text-cocoa-300 overflow-hidden border-b border-[rgba(41,35,31,0.08)]"
      aria-label="Know your pearls - types of pearls"
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: luxuryEase }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="h-px w-6 bg-champagne-300" />
              <p className="text-champagne-400 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
                03 — VARIETIES
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
              className="font-serif text-cocoa-300 text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em]"
            >
              KNOW YOUR <span className="italic font-serif font-light text-cocoa-200">PEARLS.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="text-cocoa-100/80 text-[14px] sm:text-[15px] font-sans font-light max-w-md leading-relaxed"
          >
            Explore the four principal varieties cultivated across global aquatic ecosystems. Click any variety for detailed gemological data.
          </motion.p>
        </div>

        {/* 4 Pearl Categories Grid (Horizontal on Desktop, Swipe on Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {pearlTypesList.map((pearl, i) => (
            <motion.div
              key={pearl.id}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: luxuryEase }}
              onClick={() => setSelectedType(pearl)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedType(pearl);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View detailed information on ${pearl.name} pearls`}
              className="group cursor-pointer flex flex-col bg-pearlIvory-50 border border-[rgba(41,35,31,0.08)] hover:border-champagne-300/60 hover:bg-[#F2ECE3] transition-all duration-500 rounded-[2px] overflow-hidden shadow-[0_4px_20px_rgba(41,35,31,0.03)] hover:shadow-[0_12px_32px_rgba(41,35,31,0.08)] text-left"
            >
              {/* Image Container with Controlled Aspect Ratio & Hover Scale */}
              <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-pearlIvory-200">
                <img
                  src={pearl.image}
                  alt={`${pearl.name} pearl specimen photography`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa-300/40 via-transparent to-transparent pointer-events-none" />

                {/* Size Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-pearlIvory-50/90 backdrop-blur-sm border border-[rgba(41,35,31,0.1)] text-[10px] font-mono text-cocoa-300">
                  {pearl.sizeRange.split('(')[0].trim()}
                </div>

                {/* Subtitle tag */}
                <div className="absolute bottom-3 left-3 text-[10px] font-sans font-medium tracking-widest uppercase text-pearlIvory-50 bg-cocoa-300/80 px-2.5 py-1 backdrop-blur-sm">
                  {pearl.id.toUpperCase()}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-cocoa-300 group-hover:text-champagne-400 transition-colors duration-300 font-normal">
                      {pearl.name}
                    </h3>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.8}
                      className="text-cocoa-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-champagne-400 transition-all duration-300"
                    />
                  </div>

                  <p className="text-[13px] font-sans font-light text-cocoa-100/80 leading-relaxed mb-4 line-clamp-2">
                    {pearl.tagline}
                  </p>
                </div>

                {/* Factual Snapshot */}
                <div className="pt-4 border-t border-[rgba(41,35,31,0.08)] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-cocoa-200">
                    <MapPin size={12} className="text-champagne-400 flex-shrink-0" />
                    <span className="truncate">{pearl.origin.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-cocoa-200">
                    <Palette size={12} className="text-champagne-400 flex-shrink-0" />
                    <span className="truncate">{pearl.colors.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Detailed Information Modal / Drawer */}
      <AnimatePresence>
        {selectedType && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedType(null)}
              className="fixed inset-0 bg-cocoa-300/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: luxuryEase }}
              className="relative w-full max-w-4xl bg-pearlIvory-50 border border-champagne-300/30 shadow-[0_25px_70px_rgba(41,35,31,0.3)] overflow-hidden z-10 my-auto rounded-[2px]"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedType.name} details`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 sm:px-10 h-20 border-b border-[rgba(41,35,31,0.12)] bg-pearlIvory-100">
                <div>
                  <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-champagne-400 font-medium">
                    GEMOLOGICAL PROFILE
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl text-cocoa-300 font-normal">
                    {selectedType.name} PEARL
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedType(null)}
                  className="p-2 text-cocoa-300 hover:text-champagne-400 transition-colors rounded-full"
                  aria-label="Close details"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-10 max-h-[70vh] overflow-y-auto space-y-8">
                {/* Intro Hero inside Modal */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 aspect-[4/3.5] rounded-[1px] overflow-hidden">
                    <img
                      src={selectedType.image}
                      alt={selectedType.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-7 space-y-3">
                    <p className="font-serif text-xl sm:text-2xl text-cocoa-300 italic">
                      "{selectedType.tagline}"
                    </p>
                    <p className="text-sm font-sans font-light text-cocoa-100/90 leading-relaxed">
                      {selectedType.description}
                    </p>
                    <div className="p-3 bg-pearlIvory-100 border-l-2 border-champagne-300 text-xs text-cocoa-200">
                      <span className="font-medium text-cocoa-300">Key Distinction: </span>
                      {selectedType.distinction}
                    </div>
                  </div>
                </div>

                {/* Structured Gemological Data Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[rgba(41,35,31,0.08)]">
                  
                  {/* Origin */}
                  <div className="p-4 bg-pearlIvory-100 rounded-[1px] border border-[rgba(41,35,31,0.06)]">
                    <div className="flex items-center gap-2 mb-1 text-champagne-400">
                      <MapPin size={14} />
                      <span className="text-[11px] font-sans font-medium tracking-widest uppercase">Typical Origin</span>
                    </div>
                    <p className="text-xs text-cocoa-300 font-light">{selectedType.origin}</p>
                  </div>

                  {/* Mollusk Host */}
                  <div className="p-4 bg-pearlIvory-100 rounded-[1px] border border-[rgba(41,35,31,0.06)]">
                    <div className="flex items-center gap-2 mb-1 text-champagne-400">
                      <CircleDot size={14} />
                      <span className="text-[11px] font-sans font-medium tracking-widest uppercase">Host Mollusk</span>
                    </div>
                    <p className="text-xs text-cocoa-300 font-light italic">{selectedType.mollusk}</p>
                  </div>

                  {/* Size Range */}
                  <div className="p-4 bg-pearlIvory-100 rounded-[1px] border border-[rgba(41,35,31,0.06)]">
                    <div className="flex items-center gap-2 mb-1 text-champagne-400">
                      <Sparkles size={14} />
                      <span className="text-[11px] font-sans font-medium tracking-widest uppercase">Size Range</span>
                    </div>
                    <p className="text-xs text-cocoa-300 font-light">{selectedType.sizeRange}</p>
                  </div>

                  {/* Luster Character */}
                  <div className="p-4 bg-pearlIvory-100 rounded-[1px] border border-[rgba(41,35,31,0.06)]">
                    <div className="flex items-center gap-2 mb-1 text-champagne-400">
                      <ShieldCheck size={14} />
                      <span className="text-[11px] font-sans font-medium tracking-widest uppercase">Luster Profile</span>
                    </div>
                    <p className="text-xs text-cocoa-300 font-light">{selectedType.lusterProfile}</p>
                  </div>

                  {/* Colors */}
                  <div className="p-4 bg-pearlIvory-100 rounded-[1px] border border-[rgba(41,35,31,0.06)]">
                    <div className="flex items-center gap-2 mb-1 text-champagne-400">
                      <Palette size={14} />
                      <span className="text-[11px] font-sans font-medium tracking-widest uppercase">Typical Colors</span>
                    </div>
                    <p className="text-xs text-cocoa-300 font-light">{selectedType.colors.join(', ')}</p>
                  </div>

                  {/* Shapes */}
                  <div className="p-4 bg-pearlIvory-100 rounded-[1px] border border-[rgba(41,35,31,0.06)]">
                    <div className="flex items-center gap-2 mb-1 text-champagne-400">
                      <Shapes size={14} />
                      <span className="text-[11px] font-sans font-medium tracking-widest uppercase">Common Shapes</span>
                    </div>
                    <p className="text-xs text-cocoa-300 font-light">{selectedType.shapes.join(', ')}</p>
                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[rgba(41,35,31,0.1)] bg-pearlIvory-100 flex items-center justify-between">
                <span className="text-xs text-cocoa-100 font-light">
                  All pearl characteristics represent general gemological ranges.
                </span>
                <button
                  onClick={() => setSelectedType(null)}
                  className="px-6 py-2.5 bg-cocoa-300 text-pearlIvory-50 text-xs tracking-widest uppercase font-medium hover:bg-cocoa-200 transition-colors"
                >
                  CLOSE PROFILE
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
