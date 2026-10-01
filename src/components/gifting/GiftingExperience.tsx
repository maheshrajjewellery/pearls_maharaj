import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { experienceSteps } from '@/data/giftingData';

export default function GiftingExperience() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="w-full bg-[#FFFDF8] py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-b border-[rgba(41,35,31,0.08)] overflow-hidden"
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
              THE GIFTING PROCESS
            </span>
            <span className="w-6 h-px bg-[#C8A96B]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight"
          >
            THE GIFTING EXPERIENCE
          </motion.h2>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {experienceSteps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start border-t border-[rgba(41,35,31,0.15)] pt-8 relative"
            >
              {/* Large Typography Step Number */}
              <span className="font-serif text-5xl sm:text-6xl text-[#C8A96B]/80 font-light tracking-tight mb-4 select-none">
                {step.number}
              </span>

              {/* Step Title */}
              <h3 className="font-serif text-2xl text-[#29231F] font-normal leading-tight mb-3">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-[#29231F]/75 text-sm font-light leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
