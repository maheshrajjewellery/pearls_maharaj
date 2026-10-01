import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { artOfGivingData } from '@/data/giftingData';

export default function GiftingArtOfGiving() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section
      id="art-of-giving"
      ref={ref}
      className="w-full bg-[#FFFDF8] py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-b border-[rgba(41,35,31,0.08)] overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ASYMMETRIC IMAGE SIDE */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden rounded-xs border border-[rgba(41,35,31,0.08)] shadow-[0_15px_40px_rgba(41,35,31,0.05)]">
              <motion.img
                src={artOfGivingData.image}
                alt="The Art of Giving Pearl Crafting"
                initial={{ scale: 1.05, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full aspect-[4/3] object-cover object-center"
              />
            </div>

            {/* Subtle decorative gold frame accent */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b border-r border-[#C8A96B]/40 pointer-events-none hidden sm:block" />
          </div>

          {/* EDITORIAL TEXT SIDE */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="w-6 h-px bg-[#C8A96B]" />
              <span className="text-[11px] lg:text-[12px] tracking-[0.3em] font-medium uppercase text-[#B8A99A]">
                {artOfGivingData.eyebrow}
              </span>
            </motion.div>

            {/* Statement */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-[1.15] mb-8"
            >
              {artOfGivingData.statement}
            </motion.h2>

            {/* Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 text-[#29231F]/80 text-base lg:text-lg font-light leading-relaxed"
            >
              <p>{artOfGivingData.copyParagraph1}</p>
              <p>{artOfGivingData.copyParagraph2}</p>
            </motion.div>

            {/* Key Pillars Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-[rgba(41,35,31,0.12)]"
            >
              {[
                { label: 'Appreciation', detail: 'Honoring loyalty' },
                { label: 'Celebration', detail: 'Marking triumphs' },
                { label: 'Recognition', detail: 'Elevating leadership' },
                { label: 'Connection', detail: 'Forging bonds' },
              ].map((pillar) => (
                <div key={pillar.label} className="flex flex-col">
                  <span className="font-serif text-lg text-[#29231F] font-normal">
                    {pillar.label}
                  </span>
                  <span className="text-[11px] text-[#B8A99A] tracking-wider font-light uppercase mt-1">
                    {pillar.detail}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
