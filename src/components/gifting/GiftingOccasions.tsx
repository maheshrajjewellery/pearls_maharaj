import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { giftingOccasions } from '@/data/giftingData';
import { ArrowUpRight } from 'lucide-react';

interface GiftingOccasionsProps {
  onSelectOccasion?: (occasionName: string) => void;
}

export default function GiftingOccasions({ onSelectOccasion }: GiftingOccasionsProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      className="w-full bg-[#F7F3EC] py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-b border-[rgba(41,35,31,0.08)] overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="w-6 h-px bg-[#C8A96B]" />
            <span className="text-[11px] lg:text-[12px] tracking-[0.3em] font-medium uppercase text-[#B8A99A]">
              OCCASIONS WORTH CELEBRATING
            </span>
            <span className="w-6 h-px bg-[#C8A96B]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight"
          >
            FOR MOMENTS THAT MATTER
          </motion.h2>
        </div>

        {/* 4 Editorial Image Blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {giftingOccasions.map((occasion, i) => {
            const isHovered = hoveredId === occasion.id;

            return (
              <motion.div
                key={occasion.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredId(occasion.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectOccasion && onSelectOccasion(occasion.title)}
                className="group relative cursor-pointer overflow-hidden rounded-xs bg-[#29231F] aspect-[3/4] flex flex-col justify-end p-7 shadow-[0_10px_30px_rgba(41,35,31,0.06)]"
              >
                {/* Background Image with Hover Scale 1 -> 1.035 */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={occasion.image}
                    alt={occasion.title}
                    className={`w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isHovered ? 'scale-[1.035]' : 'scale-100'
                    }`}
                  />
                  {/* Subtle Dark Gradient Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#29231F]/90 via-[#29231F]/35 to-transparent transition-opacity duration-500" />
                </div>

                {/* Content Overlay */}
                <div
                  className={`relative z-10 flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered ? '-translate-y-1.5' : 'translate-y-0'
                  }`}
                >
                  {/* Subtitle */}
                  <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-[#C8A96B] mb-2">
                    {occasion.subtitle}
                  </span>

                  {/* Title & Arrow */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-serif text-2xl lg:text-3xl text-[#FFFDF8] font-normal leading-tight">
                      {occasion.title}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full border border-[#FFFDF8]/30 flex items-center justify-center text-[#FFFDF8] transition-all duration-300 ${
                        isHovered ? 'border-[#C8A96B] bg-[#C8A96B] text-[#29231F]' : ''
                      }`}
                    >
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#F7F3EC]/80 text-xs sm:text-sm font-light leading-relaxed mb-4">
                    {occasion.description}
                  </p>

                  {/* Champagne Underline reveal on hover */}
                  <div className="w-full h-px bg-[#FFFDF8]/20 overflow-hidden">
                    <div
                      className={`h-full bg-[#C8A96B] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isHovered ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
