import { motion } from 'framer-motion';
import { ArrowRight, Gift, Award, Sparkles } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useShop } from '@/context/ShopContext';

export default function CorporateGiftingSection() {
  const { setCurrentPage } = useShop();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  const handleExploreGifting = () => {
    setCurrentPage('gifting');
    window.history.pushState({}, '', '/gifting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="bg-[#171412] py-16 sm:py-20 lg:py-28 px-6 lg:px-14 text-white overflow-hidden">
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Visual Packaging Image: Desktop Left / Mobile Top */}
        <div className="lg:col-span-6 relative w-full max-w-[540px] lg:max-w-none mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] rounded-[2px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/10"
          >
            <img
              src="https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Maharaj Corporate Gifting Presentation Box"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171412]/90 via-transparent to-transparent" />

            {/* Badge overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-[#171412]/85 backdrop-blur-md p-3.5 sm:p-4 rounded-[2px] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Gift className="text-[#B79A5A]" size={18} strokeWidth={1.4} />
                <span className="font-serif text-xs sm:text-sm text-white tracking-wide">
                  Bespoke Corporate Presentation Boxes
                </span>
              </div>
              <span className="hidden sm:inline-block text-[9.5px] font-sans tracking-[0.2em] uppercase text-[#B79A5A]">
                MAHARAJ VAULT
              </span>
            </div>
          </motion.div>
        </div>

        {/* Content Block: Desktop Right / Mobile Bottom */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[#B79A5A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.1em] uppercase font-medium mb-3">
              EXECUTIVE GIFTS & HEIRLOOMS
            </p>
            <h2 className="font-serif text-white text-clamp-section font-normal tracking-[0.02em] leading-tight mb-4 sm:mb-6">
              The Art of Corporate Gifting
            </h2>
            <p className="text-white/85 font-sans font-normal text-clamp-body leading-[1.7] mb-6 sm:mb-8">
              Honor key milestones, valued partners, and executive achievements with handcrafted South Sea pearl jewellery presented in custom engraved leather boxes.
            </p>

            {/* Benefits Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 pt-4 border-t border-white/10">
              <div className="flex items-start gap-3">
                <Award className="text-[#B79A5A] flex-shrink-0 mt-1" size={18} strokeWidth={1.5} />
                <div>
                  <h4 className="font-serif text-base text-white font-normal mb-0.5">Custom Insignia</h4>
                  <p className="text-white/70 text-xs font-sans font-normal">Monogramming & gold foil logo stamping</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="text-[#B79A5A] flex-shrink-0 mt-1" size={18} strokeWidth={1.5} />
                <div>
                  <h4 className="font-serif text-base text-white font-normal mb-0.5">Dedicated Concierge</h4>
                  <p className="text-white/70 text-xs font-sans font-normal">White-glove corporate assistance</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleExploreGifting}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#B79A5A] text-[#171412] hover:bg-[#D8C49A] transition-colors duration-300 text-xs font-sans tracking-[0.1em] uppercase font-medium rounded-[2px] cursor-pointer min-touch-target w-full sm:w-auto"
            >
              <span>Explore Corporate Gifting</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
