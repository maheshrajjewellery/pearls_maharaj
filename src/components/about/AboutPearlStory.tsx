import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useShop } from '@/context/ShopContext';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AboutPearlStory() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const prefersReduced = useReducedMotion();
  const { setCurrentPage, setCategory, cmsData } = useShop();

  const aboutCMS = cmsData?.about;
  const storyText = aboutCMS?.storyText || 'Pearls carry a quiet kind of beauty. Their natural variation, soft luster and timeless character make every piece feel individual.';
  const storyImg = aboutCMS?.storyImage && aboutCMS.storyImage.trim() !== ''
    ? aboutCMS.storyImage
    : 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1400';

  const handleExplorePearls = () => {
    setCurrentPage('shop');
    setCategory('all');
    window.history.pushState({}, '', '/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      className="relative bg-pearlIvory-50 py-24 sm:py-28 lg:py-36 px-6 sm:px-10 lg:px-16 xl:px-20 border-b border-cocoa-300/10 overflow-hidden"
      aria-label="The Pearl Story"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* LEFT: Large Macro Pearl Photograph with Reveal Animation */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative max-w-[560px] mx-auto lg:max-w-none">
              {/* Outer decorative subtle champagne border offset */}
              <div className="absolute -inset-2 sm:-inset-3 border border-champagne-300/30 rounded-[2px] pointer-events-none -z-0" />

              {/* Main Image Container with Clip-Path Reveal */}
              <motion.div
                className="relative overflow-hidden aspect-[4/5] sm:aspect-[4/5] rounded-[2px] shadow-[0_8px_32px_rgba(41,35,31,0.08)] bg-pearlIvory-200 z-10"
                initial={{ clipPath: prefersReduced ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }}
                animate={inView ? { clipPath: 'inset(0 0 0 0)' } : {}}
                transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
              >
                <motion.img
                  src={storyImg}
                  alt="Macro photography capturing natural pearl luster"
                  className="w-full h-full object-cover object-center"
                  initial={{ scale: prefersReduced ? 1 : 1.03 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 1.4, ease: luxuryEase, delay: 0.2 }}
                  loading="lazy"
                />

                {/* Subtle sheen layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cocoa-300/20 via-transparent to-white/10 pointer-events-none" />

                {/* Micro caption */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-pearlIvory-100/90 backdrop-blur-sm border border-cocoa-300/10 text-[9px] font-sans tracking-[0.08em] uppercase font-medium text-cocoa-300">
                  Macro Pearl Study
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Editorial Content */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center max-w-[560px] mx-auto lg:max-w-none">
            {/* Small eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: luxuryEase }}
              className="flex items-center gap-3 mb-4 sm:mb-5"
            >
              <span className="h-px w-6 bg-champagne-300" />
              <p className="text-champagne-500 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase">
                THE NATURE OF PEARLS
              </p>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: prefersReduced ? 0 : 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.2, ease: luxuryEase }}
              className="font-serif text-cocoa-300 text-[clamp(34px,5vw,58px)] font-normal leading-[1.05] tracking-[0.01em] mb-6 sm:mb-8"
            >
              WHY PEARLS?
            </motion.h2>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.4, ease: luxuryEase }}
              className="text-cocoa-200/85 text-[16px] sm:text-[17px] font-sans font-normal leading-[1.7] mb-8 sm:mb-10"
            >
              {storyText}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.6, ease: luxuryEase }}
            >
              <button
                onClick={handleExplorePearls}
                className="group inline-flex items-center gap-3.5 text-cocoa-300 hover:text-champagne-500 text-[12px] font-sans font-medium tracking-[0.1em] uppercase transition-colors duration-300"
              >
                <span>EXPLORE PEARLS</span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.7}
                  className="text-champagne-400 group-hover:translate-x-2 transition-transform duration-300"
                />
              </button>
              {/* Thin underline under CTA */}
              <div className="w-28 h-px bg-champagne-300/50 mt-2 group-hover:w-36 transition-all duration-300" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
