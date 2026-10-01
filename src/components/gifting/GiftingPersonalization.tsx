import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { customizationSteps, giftingHeroData } from '@/data/giftingData';
import { CheckCircle2 } from 'lucide-react';

export default function GiftingPersonalization() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="w-full bg-[#F7F3EC] py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-b border-[rgba(41,35,31,0.08)] overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="w-6 h-px bg-[#C8A96B]" />
            <span className="text-[11px] lg:text-[12px] tracking-[0.3em] font-medium uppercase text-[#B8A99A]">
              PERSONALIZED GIFTING ARCHITECTURE
            </span>
            <span className="w-6 h-px bg-[#C8A96B]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight mb-4"
          >
            MAKE IT PERSONAL.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#29231F]/70 text-base font-light"
          >
            Every detail is tailored to embody your brand identity and reflect the significance of your occasion.
          </motion.p>
        </div>

        {/* TOP: Premium Packaging Showcase Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto mb-20 overflow-hidden rounded-xs border border-[rgba(41,35,31,0.1)] shadow-[0_20px_50px_rgba(41,35,31,0.06)] bg-[#29231F]"
        >
          <img
            src={giftingHeroData.boxImage}
            alt="Maharaj Personalized Packaging Box Composition"
            className="w-full h-[350px] sm:h-[450px] lg:h-[500px] object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#29231F] via-[#29231F]/30 to-transparent" />
          
          {/* Overlay Box Quote */}
          <div className="absolute bottom-8 left-8 right-8 sm:bottom-12 sm:left-12 sm:right-12 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#C8A96B] mb-2 block">
              Packaging & Presentation
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FFFDF8] font-normal leading-snug">
              Custom velvet boxes, gold leaf accents, and calligraphed cards designed to impress.
            </h3>
          </div>
        </motion.div>

        {/* BOTTOM: Horizontal Timeline & Numbered Editorial Layout */}
        <div className="relative pt-6">
          {/* Progressive Connecting Champagne Gold Line (Desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-px bg-[rgba(41,35,31,0.15)] z-0">
            <motion.div
              initial={{ width: '0%' }}
              animate={inView ? { width: '100%' } : {}}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-[#C8A96B]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 relative z-10">
            {customizationSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start bg-[#FFFDF8] lg:bg-transparent p-6 lg:p-0 rounded-xs border lg:border-none border-[rgba(41,35,31,0.08)] shadow-xs lg:shadow-none"
              >
                {/* Number Circle Node */}
                <div className="w-14 h-14 rounded-full bg-[#FFFDF8] border border-[#C8A96B] flex items-center justify-center mb-6 shadow-sm">
                  <span className="font-serif text-lg font-medium text-[#29231F]">
                    {step.number}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="font-serif text-xl sm:text-2xl text-[#29231F] font-normal mb-3">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-[#29231F]/80 text-xs sm:text-sm font-light leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Detail Bullet */}
                <div className="mt-auto pt-3 border-t border-[rgba(41,35,31,0.1)] w-full flex items-start gap-2 text-[11px] text-[#B8A99A] font-light leading-normal">
                  <CheckCircle2 size={13} className="text-[#C8A96B] shrink-0 mt-0.5" />
                  <span>{step.detail}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
