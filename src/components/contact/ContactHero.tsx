import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const editorialEase = [0.22, 1, 0.36, 1] as const;

interface ContactHeroProps {
  onScrollToForm: () => void;
}

export default function ContactHero({ onScrollToForm }: ContactHeroProps) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full min-h-[48vh] lg:h-[52vh] max-h-[640px] bg-[#F7F3EC] flex items-center border-b border-[#29231F]/10 overflow-hidden"
      aria-label="Maharaj Jewellery Contact Hero"
    >
      {/* Subtle ambient luxury gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 85% 30%, rgba(200, 169, 107, 0.09) 0%, rgba(247, 243, 236, 0) 65%), radial-gradient(ellipse at 15% 85%, rgba(232, 220, 213, 0.45) 0%, rgba(247, 243, 236, 0) 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* LEFT: Text Content */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center max-w-[620px]">
            {/* Small Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: editorialEase }}
              className="flex items-center gap-3 mb-3.5 sm:mb-4"
            >
              <span className="h-px w-6 bg-[#C8A96B]" />
              <p className="text-[#C8A96B] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
                MAHARAJ JEWELLERY
              </p>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease: editorialEase }}
              className="font-serif font-normal text-[#29231F] text-[clamp(34px,5.2vw,62px)] leading-[1.05] tracking-[-0.015em] mb-4 sm:mb-5"
            >
              <span className="block">LET'S CREATE</span>
              <span className="block italic font-light text-[#29231F]/90">SOMETHING</span>
              <span className="block">TIMELESS.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.38, ease: editorialEase }}
              className="text-[#29231F]/80 text-[14px] sm:text-[15px] lg:text-[16px] font-sans font-light leading-[1.65] max-w-[480px] mb-6 sm:mb-7"
            >
              Whether you're searching for a signature pearl piece, planning your bridal jewellery or simply want to know more, we're here to help.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.48, ease: editorialEase }}
            >
              <button
                onClick={onScrollToForm}
                className="group inline-flex items-center gap-3.5 px-7 py-3.5 bg-[#29231F] hover:bg-[#C8A96B] text-[#FFFDF8] hover:text-[#29231F] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(41,35,31,0.08)]"
              >
                <span>START A CONVERSATION</span>
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </button>
            </motion.div>
          </div>

          {/* RIGHT: Refined Luxury Pearl Image (4:5 Ratio) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 justify-end items-center">
            <motion.div
              className="relative w-full max-w-[340px] xl:max-w-[380px] aspect-[4/5] overflow-hidden rounded-[2px] shadow-[0_8px_30px_rgba(41,35,31,0.07)] bg-[#E8DCD5]/40"
              initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: editorialEase }}
            >
              <img
                src="https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Refined hand-crafted pearl jewellery piece"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />

              {/* Gentle inner frame & vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#29231F]/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 border border-[#C8A96B]/20 pointer-events-none" />

              {/* Discreet badge */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#FFFDF8]/90 backdrop-blur-sm border border-[#29231F]/10 text-[9px] font-sans tracking-[0.22em] uppercase text-[#29231F]">
                Bespoke Atelier
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
