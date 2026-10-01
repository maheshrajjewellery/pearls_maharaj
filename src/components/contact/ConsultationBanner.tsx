import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

interface ConsultationBannerProps {
  onBookConsultation: () => void;
}

export default function ConsultationBanner({ onBookConsultation }: ConsultationBannerProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#29231F] text-[#FFFDF8] py-16 sm:py-20 lg:py-24 overflow-hidden border-b border-[#FFFDF8]/10"
      aria-label="Jewellery Consultation Banner"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 50%, rgba(200, 169, 107, 0.08) 0%, rgba(41, 35, 31, 0) 65%), radial-gradient(ellipse at 85% 80%, rgba(232, 220, 213, 0.04) 0%, rgba(41, 35, 31, 0) 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT / CONTENT: Text & Call to Action (55-60%) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center max-w-[620px]">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-6 bg-[#C8A96B]" />
              <span className="text-[#C8A96B] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
                BESPOKE ATELIER
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[clamp(32px,5vw,56px)] font-normal leading-[1.05] tracking-[-0.015em] text-[#FFFDF8] mb-5"
            >
              <span className="block">LOOKING FOR</span>
              <span className="block italic font-light text-[#E8DCD5]">SOMETHING PERSONAL?</span>
            </motion.h2>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-[15px] sm:text-[16px] text-[#FFFDF8]/75 font-light leading-relaxed max-w-[500px] mb-8"
            >
              For bridal jewellery, custom pieces or a special pearl selection, speak directly with our team.
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={onBookConsultation}
                className="group inline-flex items-center gap-3.5 px-8 py-4 bg-[#C8A96B] hover:bg-[#FFFDF8] text-[#29231F] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
              >
                <span>BOOK A CONSULTATION</span>
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </button>
            </motion.div>
          </div>

          {/* RIGHT / IMAGE: Luxury Pearl Image (~40-45%) with clip-path reveal */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
              animate={
                inView
                  ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
                  : { clipPath: 'inset(0 100% 0 0)', opacity: 0 }
              }
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[420px] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden border border-[#FFFDF8]/15"
            >
              <img
                src="https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Bespoke pearl inspection and craftsmanship"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#29231F]/40 via-transparent to-transparent pointer-events-none" />

              {/* Accent corner text */}
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#29231F]/80 backdrop-blur-sm border border-[#FFFDF8]/10 text-[9px] font-sans tracking-[0.25em] uppercase text-[#FFFDF8]">
                Bespoke Pearl Curation
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
