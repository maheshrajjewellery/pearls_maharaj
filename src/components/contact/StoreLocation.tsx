import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { contactConfig } from '@/data/contactData';
import { useInView } from '@/hooks/useInView';

export default function StoreLocation() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#FFFDF8] border-b border-[#30372F]/10"
      aria-label="Store Location and Atelier Information"
    >
      <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-[#C5A15A]" />
            <span className="text-[#C5A15A] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              PHYSICAL PRESENCE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(28px,4vw,44px)] font-normal text-[#30372F] tracking-[-0.01em]"
          >
            VISIT US
          </motion.h2>
        </div>

        {/* Two-Column Grid: Left Details & Right Map Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          {/* LEFT: Address, Hours, Phone (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 bg-[#F7F3EC] border border-[#30372F]/10"
          >
            <div className="space-y-8">
              {/* Address / Location Notice */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#30372F]/10 flex items-center justify-center text-[#30372F] flex-shrink-0 mt-1">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#30372F]/50 block mb-1">
                    BOUTIQUE & ATELIER
                  </span>
                  <p className="font-serif text-xl sm:text-2xl text-[#30372F] font-normal mb-2">
                    {contactConfig.storeStatus}
                  </p>
                  <p className="font-sans text-[13px] text-[#30372F]/70 font-light leading-relaxed">
                    {contactConfig.storeNote}
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#30372F]/10 flex items-center justify-center text-[#30372F] flex-shrink-0 mt-1">
                  <Clock size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#30372F]/50 block mb-1">
                    OPENING HOURS
                  </span>
                  <p className="font-sans text-[14px] text-[#30372F] font-normal leading-relaxed">
                    {contactConfig.hoursWeekday}
                  </p>
                  <p className="font-sans text-[13px] text-[#C5A15A] font-normal">
                    {contactConfig.hoursWeekend}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#30372F]/10 flex items-center justify-center text-[#30372F] flex-shrink-0 mt-1">
                  <Phone size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#30372F]/50 block mb-1">
                    DIRECT APPOINTMENTS
                  </span>
                  <p className="font-sans text-[15px] text-[#30372F] font-normal">
                    {contactConfig.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Note at bottom */}
            <div className="mt-8 pt-6 border-t border-[#30372F]/10">
              <span className="text-[11px] font-sans text-[#30372F]/60 font-light">
                Private viewings are arranged with our senior curators by prior appointment.
              </span>
            </div>
          </motion.div>

          {/* RIGHT: Map Placeholder / Embed Area (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] bg-[#E8DCD5]/30 border border-[#30372F]/10 overflow-hidden flex flex-col items-center justify-center p-8 text-center"
          >
            {/* Subtle architectural grid pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(41,35,31,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(41,35,31,0.06) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Center Content Placeholder */}
            <div className="relative z-10 max-w-[380px] flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#FFFDF8] border border-[#C5A15A]/50 flex items-center justify-center text-[#C5A15A] mb-5 shadow-[0_4px_16px_rgba(41,35,31,0.05)]">
                <Navigation size={22} strokeWidth={1.5} />
              </div>

              <span className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#C5A15A] uppercase mb-2">
                INTERACTIVE MAP
              </span>

              <h3 className="font-serif text-2xl text-[#30372F] font-normal mb-3">
                Flagship Atelier Map
              </h3>

              <p className="font-sans text-[13px] sm:text-[14px] text-[#30372F]/70 font-light leading-relaxed mb-6">
                Interactive directions and store location map will be embedded here upon official boutique launch.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFDF8] border border-[#30372F]/15 text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-[#30372F]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15A] animate-pulse" />
                <span>LOCATION REVEAL COMING SOON</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
