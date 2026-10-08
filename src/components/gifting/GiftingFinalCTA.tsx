import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { finalCtaData } from "@/data/giftingData";
import { ArrowRight } from "lucide-react";

interface GiftingFinalCTAProps {
  onStartConversation: () => void;
}

export default function GiftingFinalCTA({
  onStartConversation,
}: GiftingFinalCTAProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#30372F] text-[#FFFDF8] py-20 lg:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-[#3D332E]/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT: Text & CTA */}
          <div className="lg:col-span-8 flex flex-col items-start z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium text-[#C5A15A] mb-3"
            >
              MAHESHRAJ CORPORATE CONCIERGE
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] mb-4 text-[#FFFDF8]"
            >
              <span>{finalCtaData.headingLine1}</span>
              <br />
              <span className="italic text-[#C5A15A] font-light">
                {finalCtaData.headingLine2}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[#E8DCD5]/80 text-sm sm:text-base font-light mb-8 max-w-xl"
            >
              {finalCtaData.smallText}
            </motion.p>

            <motion.button
              onClick={onStartConversation}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#C5A15A] text-[#30372F] text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 hover:bg-[#FFFDF8] hover:text-[#30372F] shadow-md"
            >
              <span>{finalCtaData.ctaText}</span>
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>
          </div>

          {/* RIGHT: Subtle Pearl / Jewellery Visual with traveling soft light highlight */}
          <div className="lg:col-span-4 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border border-[#C5A15A]/30 p-2 bg-[#30372F]"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src={finalCtaData.pearlImage}
                  alt="Subtle MAHESHRAJ Pearl Visual"
                  className="w-full h-full object-cover object-center"
                />

                {/* SOFT HIGHLIGHT TRAVELS ACROSS PEARL ONCE AS SECTION ENTERS VIEWPORT */}
                <motion.div
                  initial={{ x: "-120%", opacity: 0 }}
                  animate={inView ? { x: "120%", opacity: [0, 0.7, 0] } : {}}
                  transition={{ duration: 2.2, delay: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFDF8]/50 to-transparent transform -skew-x-12 pointer-events-none"
                />
              </div>

              {/* Decorative subtle ring */}
              <div className="absolute -inset-2 rounded-full border border-[#C5A15A]/20 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
