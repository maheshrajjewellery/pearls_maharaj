import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AboutPhilosophy() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const prefersReduced = useReducedMotion();

  const quoteLines = [
    '“Jewellery should not simply be worn.',
    'It should become part of your story.”',
  ];

  return (
    <section
      ref={ref}
      className="relative bg-pearlIvory-100 py-24 sm:py-28 lg:py-36 px-6 sm:px-10 lg:px-16 xl:px-20 border-b border-cocoa-300/10 overflow-hidden"
      aria-label="Maharaj Brand Philosophy"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT: Small Label */}
          <div className="lg:col-span-4 flex flex-col items-start pt-2">
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: luxuryEase }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-champagne-300" />
              <p className="text-champagne-500 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase">
                OUR PHILOSOPHY
              </p>
            </motion.div>
          </div>

          {/* RIGHT: Large Serif Statement + Short Paragraph */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Statement line-by-line reveal */}
            <blockquote className="font-serif text-cocoa-300 text-[clamp(28px,4.2vw,50px)] font-normal leading-[1.12] sm:leading-[1.14] tracking-[0.01em] mb-8 sm:mb-10">
              {quoteLines.map((line, idx) => (
                <span key={idx} className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={{
                      opacity: 0,
                      y: prefersReduced ? 0 : 40,
                      clipPath: prefersReduced ? 'none' : 'inset(0 0 100% 0)',
                    }}
                    animate={
                      inView
                        ? {
                            opacity: 1,
                            y: 0,
                            clipPath: prefersReduced ? 'none' : 'inset(0 0 0% 0)',
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.95,
                      delay: 0.2 + idx * 0.18,
                      ease: luxuryEase,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </blockquote>

            {/* Supporting paragraph following smoothly */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.65, ease: luxuryEase }}
              className="max-w-[620px]"
            >
              <p className="text-cocoa-200/80 text-[16px] sm:text-[17px] font-sans font-normal leading-[1.7] text-balance">
                Maharaj Jewellery brings together the natural beauty of pearls, refined design and careful craftsmanship to create pieces meant to be remembered.
              </p>
            </motion.div>

            {/* Subtle decorative champagne signature flourish */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={inView ? { width: '80px', opacity: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.85, ease: luxuryEase }}
              className="h-px bg-champagne-300 mt-10 sm:mt-12"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
