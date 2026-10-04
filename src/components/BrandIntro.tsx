import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { brandIntroImage } from '@/data/mockData';
import { useShop } from '@/context/ShopContext';

export default function BrandIntro() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { setCurrentPage, cmsData } = useShop();

  const storyCMS = cmsData?.homepage?.pearlStory;

  if (storyCMS && storyCMS.active === false) return null;

  const introImage = storyCMS?.image && storyCMS.image.trim() !== '' ? storyCMS.image : brandIntroImage;
  const heading = storyCMS?.heading || 'Crafted For Generations.';
  const content = storyCMS?.content || 'At Maharaj Jewellery, every pearl tells an unspoken story of patience, luster, and natural artistry. We source the rarest organic pearls from pristine ocean waters and set them in handcrafted gold and platinum heirlooms.';
  const ctaText = storyCMS?.ctaText || 'Discover Our Legacy';

  return (
    <section ref={ref} id="brand-intro" className="relative bg-[#F8F5F0] py-16 sm:py-20 lg:py-28 px-6 lg:px-14 border-b border-[#30372F]/08 overflow-hidden">
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Mobile: Image First / Desktop & Tablet: Right Side */}
        <div className="lg:col-span-6 order-1 lg:order-2 w-full max-w-[500px] lg:max-w-none mx-auto">
          <motion.div
            className="relative overflow-hidden aspect-[4/5] rounded-[2px] shadow-[0_12px_40px_rgba(23,20,18,0.08)] border border-[#30372F]/10"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={inView ? { clipPath: 'inset(0 0 0 0)' } : {}}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
          >
            <motion.img
              src={introImage}
              alt="Macro photograph of a rare South Sea pearl"
              className="w-full h-full object-cover"
              initial={{ scale: 1.06 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Text Content Block */}
        <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#C5A15A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.1em] uppercase font-medium mb-3"
          >
            THE WORLD OF PEARLS
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[#30372F] text-clamp-section font-normal tracking-[0.02em] leading-[1.08]"
          >
            {heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#30372F]/80 font-sans font-normal text-clamp-body leading-[1.7] max-w-xl mt-5 sm:mt-6"
          >
            {content}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <button
              onClick={() => {
                setCurrentPage('about');
                window.history.pushState({}, '', '/about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-3 text-[#30372F] hover:text-[#C5A15A] text-xs font-sans tracking-[0.1em] uppercase font-medium cursor-pointer transition-colors duration-300 min-touch-target"
            >
              <span>{ctaText}</span>
              <ArrowRight size={15} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-400 text-[#C5A15A]" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
