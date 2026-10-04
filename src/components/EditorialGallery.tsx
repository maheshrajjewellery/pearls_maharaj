import { motion } from 'framer-motion';
import { Instagram, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { editorialImages } from '@/data/mockData';
import { useShop } from '@/context/ShopContext';

export default function EditorialGallery() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { cmsData } = useShop();

  const galleryCMS = cmsData?.homepage?.editorialGallery;

  if (galleryCMS && galleryCMS.active === false) return null;

  const title = galleryCMS?.title || 'The Maharaj World';

  // Editorial layout: varied sizes
  const colSpans = [
    'md:col-span-2 md:row-span-2',
    'md:col-span-1',
    'md:col-span-1',
    'md:col-span-1',
    'md:col-span-1',
    'md:col-span-2',
  ];

  return (
    <section ref={ref} className="bg-ivory-100 py-20 lg:py-28 px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#C5A15A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.1em] uppercase font-medium mb-3"
          >
            EDITORIAL
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[#30372F] text-clamp-section font-normal tracking-[0.02em]"
          >
            {title}
          </motion.h2>
        </div>

        {/* Editorial grid with reduced, compact row heights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-3.5 auto-rows-[150px] sm:auto-rows-[180px] lg:auto-rows-[210px]">
          {editorialImages.map((item, i) => (
            <motion.a
              key={item.id}
              href="#"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.12 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-[2px] ${colSpans[i]}`}
            >
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal-500/0 group-hover:bg-charcoal-500/40 transition-all duration-500" />

              {/* Hover content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Instagram size={22} strokeWidth={1.5} className="text-ivory-50 mb-2" />
                <span className="text-ivory-50 text-[11px] tracking-widest uppercase font-light flex items-center gap-1.5">
                  View
                  <ArrowRight size={13} strokeWidth={1.5} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
