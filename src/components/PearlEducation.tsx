import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { pearlCategories } from '@/data/mockData';
import { useShop } from '@/context/ShopContext';

export default function PearlEducation() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { setCurrentPage } = useShop();

  const handleEducationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('education');
    window.history.pushState({}, '', '/education');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="bg-[#F7F3EB] py-16 sm:py-20 lg:py-28 px-6 lg:px-14 border-b border-[#171412]/08">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#B79A5A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.1em] uppercase font-medium mb-3"
          >
            CONNOISSEUR GUIDE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[#171412] text-clamp-section font-normal tracking-[0.02em]"
          >
            Pearl Education
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#171412]/80 font-sans font-normal text-clamp-body max-w-md mx-auto mt-3 leading-[1.7]"
          >
            Understand the essential factors that define pearl perfection: Luster, Nacre, Surface, Shape, and Size.
          </motion.p>
        </div>

        {/* Responsive Editorial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pearlCategories.map((category, i) => (
            <motion.a
              key={category.id}
              href="/education"
              onClick={handleEducationClick}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group block cursor-pointer bg-[#F4F0E8] p-4 sm:p-5 rounded-[2px] border border-[#171412]/08 hover:border-[#B79A5A]/40 transition-all duration-300"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/4] overflow-hidden mb-4 rounded-[2px] bg-[#EFE8D9] border border-[#171412]/05">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Details */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-[#171412] text-xl font-normal mb-1.5 group-hover:text-[#B79A5A] transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-[#171412]/80 text-xs sm:text-[13px] font-sans font-normal leading-[1.6]">
                    {category.description}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#B79A5A] opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 mt-1"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
