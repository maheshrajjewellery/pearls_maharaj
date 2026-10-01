import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Eye, Shapes, Palette, Ruler, Layers } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface QualityFactor {
  number: string;
  title: string;
  icon: React.ElementType;
  shortDescription: string;
  gemologicalInsight: string;
}

const qualityFactors: QualityFactor[] = [
  {
    number: '01',
    title: 'LUSTER',
    icon: Sparkles,
    shortDescription: 'The intensity and sharpness of reflections from the pearl surface.',
    gemologicalInsight:
      'Luster is the supreme value attribute. The sharper and deeper the reflection of light sources, the higher the optical allure.',
  },
  {
    number: '02',
    title: 'SURFACE',
    icon: Eye,
    shortDescription: 'The presence, subtlety, and location of natural blemishes or growth marks.',
    gemologicalInsight:
      'As organic creations, nearly all pearls possess subtle surface birthmarks. Flawless surfaces represent exceptional rarity.',
  },
  {
    number: '03',
    title: 'SHAPE',
    icon: Shapes,
    shortDescription: 'The geometric symmetry and organic contour harmony of the gemstone.',
    gemologicalInsight:
      'While perfect sphericity is mathematically rarest, organic baroque and symmetrical drops possess celebrated artistic character.',
  },
  {
    number: '04',
    title: 'COLOR',
    icon: Palette,
    shortDescription: 'The combination of base body color, translucent overtones, and orient.',
    gemologicalInsight:
      'Evaluated for richness, saturation, and multi-chromatic overtones such as rose reflections on white or peacock tones on black.',
  },
  {
    number: '05',
    title: 'SIZE',
    icon: Ruler,
    shortDescription: 'The diameter measured in millimeters across the pearl axis.',
    gemologicalInsight:
      'Larger pearls require older host mollusks and extended gestation periods, with value scaling significantly as diameter increases.',
  },
  {
    number: '06',
    title: 'NACRE',
    icon: Layers,
    shortDescription: 'The thickness and density of concentric crystalline calcium carbonate layers.',
    gemologicalInsight:
      'Thick, dense nacre ensures long-term generational durability, resistance to wear, and produces deep optical luminosity.',
  },
];

export default function PearlQuality() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="pearl-quality"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-pearlIvory-100 text-cocoa-300 overflow-hidden border-b border-[rgba(41,35,31,0.08)]"
      aria-label="What makes a pearl beautiful - pearl quality factors"
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        
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
              <p className="text-champagne-400 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
                09 — VALUE ATTRIBUTES
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
              className="font-serif text-cocoa-300 text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em]"
            >
              WHAT MAKES A PEARL <span className="italic font-serif font-light text-cocoa-200">BEAUTIFUL?</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="text-cocoa-100/80 text-[14px] sm:text-[15px] font-sans font-light max-w-md leading-relaxed"
          >
            Fine pearls are evaluated based on six fundamental attributes. Harmonious interplay between these factors defines the gem's ultimate elegance.
          </motion.p>
        </div>

        {/* 6 Quality Factors Horizontal Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {qualityFactors.map((factor, i) => {
            const Icon = factor.icon;

            return (
              <motion.div
                key={factor.number}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: luxuryEase }}
                className="group p-6 sm:p-8 bg-pearlIvory-50 border border-[rgba(41,35,31,0.08)] hover:border-champagne-300/60 rounded-[2px] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(41,35,31,0.06)] flex flex-col justify-between"
              >
                <div>
                  {/* Top Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-champagne-500">
                      {factor.number}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-pearlIvory-100 flex items-center justify-center text-champagne-500 group-hover:bg-champagne-300 group-hover:text-cocoa-300 transition-colors duration-300">
                      <Icon size={16} strokeWidth={1.7} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl text-cocoa-300 font-normal mb-3 group-hover:text-champagne-500 transition-colors">
                    {factor.title}
                  </h3>

                  {/* Short Explanation */}
                  <p className="text-cocoa-300 text-sm font-normal leading-relaxed mb-4">
                    "{factor.shortDescription}"
                  </p>
                </div>

                {/* Gemological Insight Footnote */}
                <div className="pt-4 border-t border-[rgba(41,35,31,0.06)]">
                  <p className="text-xs text-cocoa-100/80 font-light leading-relaxed">
                    {factor.gemologicalInsight}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
