import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useShop } from '@/context/ShopContext';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AboutSignature() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const prefersReduced = useReducedMotion();
  const { setCurrentPage, setCategory } = useShop();

  const handleDiscover = () => {
    setCurrentPage('shop');
    setCategory('all');
    window.history.pushState({}, '', '/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      className="relative bg-pearlIvory-100 py-24 sm:py-28 lg:py-36 px-6 sm:px-10 lg:px-16 xl:px-20 border-b border-cocoa-300/10 overflow-hidden"
      aria-label="The Maharaj Signature"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* LEFT: Large Portrait-Oriented Jewellery Image */}
          <div className="lg:col-span-6">
            <div className="relative max-w-[520px] mx-auto lg:max-w-none">
              {/* Subtle architectural offset frame */}
              <div className="absolute -inset-3 border border-champagne-300/25 rounded-[2px] pointer-events-none -z-0" />
              
              <motion.div
                className="relative overflow-hidden aspect-[3/4] sm:aspect-[4/5] rounded-[2px] shadow-[0_12px_40px_rgba(41,35,31,0.08)] bg-pearlIvory-200 z-10"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: luxuryEase }}
              >
                <img
                  src="https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  alt="Maharaj signature handcrafted pearl jewellery"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />

                {/* Soft natural light gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa-300/20 via-transparent to-transparent pointer-events-none" />

                {/* Signature badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-pearlIvory-100/95 backdrop-blur-sm border border-cocoa-300/10 text-[9px] font-sans tracking-[0.08em] uppercase font-medium text-cocoa-300">
                  Signature Strand
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Editorial Text Block */}
          <div className="lg:col-span-6 flex flex-col justify-center max-w-[540px] mx-auto lg:max-w-none">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: luxuryEase }}
              className="flex items-center gap-3 mb-4 sm:mb-5"
            >
              <span className="h-px w-6 bg-champagne-300" />
              <p className="text-champagne-500 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase">
                THE MAHARAJ SIGNATURE
              </p>
            </motion.div>

            {/* Heading */}
            <h2 className="font-serif text-cocoa-300 text-[clamp(36px,5.2vw,62px)] font-normal leading-[1.02] tracking-[0.01em] mb-6 sm:mb-7">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 36 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.15, ease: luxuryEase }}
                >
                  TIMELESS
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block italic font-normal text-cocoa-200"
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 36 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.3, ease: luxuryEase }}
                >
                  BY DESIGN.
                </motion.span>
              </span>
            </h2>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.45, ease: luxuryEase }}
              className="text-cocoa-200/85 text-[16px] sm:text-[17px] font-sans font-normal leading-[1.7] mb-8 sm:mb-10"
            >
              Every piece is designed with a balance of classic elegance and contemporary expression.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.6, ease: luxuryEase }}
            >
              <button
                onClick={handleDiscover}
                className="group inline-flex items-center gap-3.5 text-cocoa-300 hover:text-champagne-500 text-[12px] font-sans font-medium tracking-[0.1em] uppercase transition-colors duration-300"
              >
                <span>DISCOVER THE COLLECTION</span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.7}
                  className="text-champagne-400 group-hover:translate-x-2 transition-transform duration-300"
                />
              </button>
              {/* Thin underline */}
              <div className="w-36 h-px bg-champagne-300/50 mt-2 group-hover:w-48 transition-all duration-300" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
