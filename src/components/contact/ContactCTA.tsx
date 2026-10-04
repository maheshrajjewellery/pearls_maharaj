import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

interface ContactCTAProps {
  onContactClick: () => void;
}

export default function ContactCTA({ onContactClick }: ContactCTAProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#F7F3EC] text-center overflow-hidden border-b border-[#30372F]/10"
      aria-label="Contact Call to Action"
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(200, 169, 107, 0.12) 0%, rgba(247, 243, 236, 0) 70%)',
        }}
      />

      <div className="relative z-10 max-w-[860px] mx-auto px-6 sm:px-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <span className="h-px w-6 bg-[#C5A15A]" />
          <span className="text-[#C5A15A] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
            BESPOKE JEWELLERY SERVICE
          </span>
          <span className="h-px w-6 bg-[#C5A15A]" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[clamp(28px,4.5vw,46px)] font-normal text-[#30372F] leading-[1.1] tracking-[-0.015em] mb-4"
        >
          YOUR NEXT PIECE
          <br />
          <span className="italic font-light text-[#30372F]/90">STARTS WITH A CONVERSATION.</span>
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-[15px] sm:text-[16px] text-[#30372F]/75 font-light leading-relaxed max-w-[480px] mx-auto mb-8"
        >
          Tell us what you're looking for.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={onContactClick}
            className="group inline-flex items-center gap-3.5 px-8 py-4 bg-[#30372F] hover:bg-[#C5A15A] text-[#FFFDF8] hover:text-[#30372F] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(41,35,31,0.08)] border border-[#C5A15A]/30"
          >
            <span>CONTACT MAHARAJ</span>
            <ArrowRight
              size={15}
              strokeWidth={1.8}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
