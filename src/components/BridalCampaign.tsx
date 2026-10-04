import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { bridalImage, bridalImageMobile } from '@/data/mockData';
import { useShop } from '@/context/ShopContext';

export default function BridalCampaign() {
  const { setCurrentPage, setCategory, cmsData } = useShop();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const isMobile = useMediaQuery('(max-width: 767px)');

  const bridalCMS = cmsData?.homepage?.bridalSection || {
    heading: cmsData?.bridal?.heroHeading || 'Bridal Elegance For Sacred Moments',
    subtitle: cmsData?.bridal?.heroSubheading || 'Discover majestic South Sea pearl strands, royal chokers, and diamond drop earrings crafted for sacred wedding celebrations.',
    image: cmsData?.bridal?.heroImage || (isMobile ? bridalImageMobile : bridalImage),
    ctaText: 'Explore Bridal Collection',
    active: true,
  };

  if (bridalCMS.active === false) return null;

  const bgImage = bridalCMS.image && bridalCMS.image.trim() !== '' 
    ? bridalCMS.image 
    : (isMobile ? bridalImageMobile : bridalImage);
  const heading = bridalCMS.heading || 'Bridal Elegance For Sacred Moments';
  const subtitle = bridalCMS.subtitle || 'Discover majestic South Sea pearl strands, royal chokers, and diamond drop earrings crafted for sacred wedding celebrations.';
  const ctaText = bridalCMS.ctaText || 'Explore Bridal Collection';

  return (
    <section ref={ref} className="relative min-h-[580px] lg:min-h-[640px] w-full overflow-hidden bg-[#30372F] flex flex-col justify-center">
      {/* Background Image Container */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={inView ? { clipPath: 'inset(0 0 0 0)' } : {}}
        transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
      >
        <motion.img
          src={bgImage}
          alt="Maharaj Bridal Pearl Jewellery Campaign"
          className="w-full h-full object-cover object-[center_35%]"
          initial={{ scale: 1.04 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          loading="lazy"
        />
        {/* Overlays for dark cinematic mood & strong text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#30372F]/90 via-[#30372F]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#30372F]/85 via-transparent to-[#30372F]/40" />
      </motion.div>

      {/* Content Block */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-20 flex items-center">
        <div className="max-w-xl text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#C5A15A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.1em] uppercase font-medium mb-3"
          >
            SACRED HEIRLOOMS
          </motion.p>

          <h2 className="font-serif text-white text-clamp-section font-normal tracking-[0.02em] leading-[1.08]">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {heading}
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/80 font-sans font-normal text-clamp-body max-w-md mt-5 leading-[1.7]"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <button
              onClick={() => {
                setCurrentPage('shop');
                setCategory('bridal');
                window.history.pushState({}, '', '/shop?category=bridal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#C5A15A] text-white text-xs font-sans tracking-[0.1em] uppercase font-medium hover:bg-[#C5A15A] hover:text-[#30372F] transition-all duration-400 group cursor-pointer rounded-[2px] min-touch-target w-full sm:w-auto"
            >
              <span>{ctaText}</span>
              <ArrowRight size={15} strokeWidth={1.5} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
