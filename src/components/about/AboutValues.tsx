import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface ValuePrinciple {
  num: string;
  title: string;
  description: string;
}

const principles: ValuePrinciple[] = [
  {
    num: '01',
    title: 'CRAFTSMANSHIP',
    description: 'Attention to detail at every stage.',
  },
  {
    num: '02',
    title: 'TIMELESS DESIGN',
    description: 'Pieces created beyond passing trends.',
  },
  {
    num: '03',
    title: 'PERSONAL CONNECTION',
    description: 'Jewellery made for meaningful moments.',
  },
];

export default function AboutValues() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative bg-pearlIvory-50 py-24 sm:py-28 lg:py-36 px-6 sm:px-10 lg:px-16 xl:px-20 border-b border-cocoa-300/10 overflow-hidden"
      aria-label="What We Value"
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: luxuryEase }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-px w-6 bg-champagne-300" />
            <p className="text-champagne-500 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase">
              PRINCIPLES
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: prefersReduced ? 0 : 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: luxuryEase }}
            className="font-serif text-cocoa-300 text-[clamp(34px,5vw,56px)] font-normal leading-[1.05] tracking-[0.01em]"
          >
            WHAT WE VALUE
          </motion.h2>
        </div>

        {/* Minimal Editorial Layout: 3 Large Typography Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 xl:gap-16">
          {principles.map((p, idx) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.2 + idx * 0.15,
                ease: luxuryEase,
              }}
              className="group flex flex-col pt-6 border-t border-cocoa-300/15 relative"
            >
              {/* Subtle animated champagne highlight line on top */}
              <div className="absolute top-0 left-0 h-px w-12 bg-champagne-300 group-hover:w-full transition-all duration-500 ease-out" />

              {/* Number indicator */}
              <span className="font-serif text-champagne-400 text-sm tracking-[0.1em] font-normal mb-4 block">
                {p.num}
              </span>

              {/* Principle Title in Large High-Contrast Serif */}
              <h3 className="font-serif text-cocoa-300 text-2xl sm:text-3xl font-normal tracking-wide mb-4 leading-snug group-hover:text-champagne-500 transition-colors duration-300">
                {p.title}
              </h3>

              {/* Clean minimal description */}
              <p className="text-cocoa-200/80 text-[15px] sm:text-[16px] font-sans font-normal leading-[1.7]">
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
