import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { craftStages, craftsmanshipBg } from '@/data/mockData';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { useShop } from '@/context/ShopContext';

export default function Craftsmanship() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReduced = useReducedMotion();
  const { cmsData } = useShop();

  const craftCMS = cmsData?.homepage?.craftsmanship;

  if (craftCMS && craftCMS.active === false) return null;

  const bgImg = craftCMS?.bgImage && craftCMS.bgImage.trim() !== '' ? craftCMS.bgImage : craftsmanshipBg;
  const heading = craftCMS?.heading || 'Crafted to Last';
  const subtitle = craftCMS?.subtitle || 'Observe how raw organic pearls transform into fine jewellery heirlooms through our 5-stage creation sequence.';

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-58%']);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#30372F] text-white overflow-hidden"
      style={{ height: isMobile || prefersReduced ? 'auto' : '130vh' }}
    >
      <div
        ref={ref}
        className={`${
          isMobile || prefersReduced
            ? 'py-16 px-6'
            : 'sticky top-0 h-screen min-h-[600px] max-h-[860px] flex flex-col justify-center'
        }`}
      >
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={bgImg}
            alt="Maharaj Craftsmanship background"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#30372F]/95 via-[#30372F]/85 to-[#30372F]" />
        </div>

        {/* Section Header */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#C5A15A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.1em] uppercase font-medium mb-3"
          >
            MASTER ARTISANRY
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-white text-clamp-section font-normal tracking-[0.02em] leading-tight"
          >
            {heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/80 font-sans font-normal text-clamp-body max-w-md mx-auto mt-3 leading-[1.7]"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Visual Jewellery Chain Connection Graphic */}
        <div className="relative z-10 max-w-4xl mx-auto w-full my-6 hidden sm:block">
          <div className="flex items-center justify-between px-12 relative">
            <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-[1px] bg-[#C5A15A]/30 z-0" />
            {craftStages.map((stage) => (
              <div key={stage.number} className="relative z-10 flex flex-col items-center">
                <span className="w-4 h-4 rounded-full bg-[#30372F] border-2 border-[#C5A15A] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15A]" />
                </span>
                <span className="text-[10px] font-sans text-[#C5A15A] font-medium tracking-widest mt-1">
                  {stage.number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stages Content Display */}
        {isMobile || prefersReduced ? (
          /* Mobile Stacked / Carousel Cards with NO horizontal page overflow */
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-6 max-w-[1280px] mx-auto w-full">
            {craftStages.map((stage) => (
              <div
                key={stage.number}
                className="text-left bg-white/05 p-4 rounded-[2px] border border-white/10 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-3 rounded-[2px] border border-white/10">
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#30372F]/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 font-serif text-[#C5A15A] text-xl font-normal">
                    {stage.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-white text-lg font-normal mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-white/70 text-xs font-sans font-light leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Scroll-Driven Horizontal Sequence */
          <div className="relative z-10 w-full overflow-hidden mt-6">
            <motion.div
              style={{ x }}
              className="flex gap-6 lg:gap-8 px-12 lg:px-20 will-change-transform"
            >
              {craftStages.map((stage) => (
                <div
                  key={stage.number}
                  className="flex-shrink-0 w-[280px] lg:w-[320px] text-left group"
                >
                  <div className="relative aspect-[16/11] overflow-hidden mb-4 rounded-[2px] shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/12">
                    <img
                      src={stage.image}
                      alt={stage.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#30372F]/85 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 font-serif text-[#C5A15A] text-2xl font-light">
                      {stage.number}
                    </span>
                  </div>
                  <h3 className="font-serif text-white text-xl font-normal mb-1 group-hover:text-[#C5A15A] transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-white/70 text-xs font-sans font-light leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}