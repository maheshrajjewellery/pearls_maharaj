import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function EditorialPearlBanner() {
  const { openPearlGuide } = useShop();

  return (
    <div className="w-full my-12 sm:my-16 lg:my-20">
      <div className="relative w-full min-h-[380px] lg:min-h-[440px] bg-[#F7F3EC] border border-[rgba(41,35,31,0.1)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-stretch">
          {/* LEFT: Large Editorial Photography (5-6 cols on desktop) */}
          <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[440px] overflow-hidden bg-ivory-200">
            <img
              src="https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Maharaj Jewellery Pearl Editorial"
              className="w-full h-full object-cover object-[center_35%] transition-transform duration-1000 hover:scale-105"
              loading="lazy"
            />
            {/* Subtle soft vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-[#F7F3EC]/30" />
          </div>

          {/* RIGHT: Editorial Content (6-7 cols on desktop) */}
          <div className="lg:col-span-6 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 sm:py-14 bg-[#F7F3EC]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: luxuryEase }}
              className="max-w-md"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-6 bg-champagne-300" />
                <p className="text-champagne-500 text-[11px] font-sans font-medium tracking-[0.28em] uppercase">
                  THE PEARL GUIDE
                </p>
              </div>

              {/* Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-cocoa-300 leading-[1.08] tracking-[-0.01em] mb-4">
                UNDERSTAND
                <br />
                YOUR PEARLS.
              </h2>

              {/* Supporting Text */}
              <p className="text-cocoa-100 text-xs sm:text-sm font-light leading-relaxed mb-8">
                Discover the characteristics, care and craftsmanship behind every pearl in the Maharaj vault.
              </p>

              {/* Action Button */}
              <div>
                <button
                  onClick={openPearlGuide}
                  className="group inline-flex items-center gap-3 text-cocoa-300 text-xs font-sans tracking-[0.22em] uppercase font-medium hover:text-champagne-500 transition-colors duration-300 py-1 border-b border-cocoa-300/40 hover:border-champagne-500"
                >
                  <span>EXPLORE PEARL GUIDE</span>
                  <ArrowRight
                    size={15}
                    strokeWidth={1.5}
                    className="group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
