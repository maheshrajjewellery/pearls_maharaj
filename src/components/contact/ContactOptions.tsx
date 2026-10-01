import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { contactOptions, ContactOption } from '@/data/contactData';
import { useInView } from '@/hooks/useInView';

interface ContactOptionsProps {
  onSelectOption: (interestValue: string) => void;
}

export default function ContactOptions({ onSelectOption }: ContactOptionsProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#FFFDF8] border-b border-[#29231F]/10"
      aria-label="How can we help options"
    >
      <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-[#C8A96B]" />
            <span className="text-[#C8A96B] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              CONSULTATION PATHWAYS
            </span>
            <span className="h-px w-6 bg-[#C8A96B]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(28px,4vw,44px)] font-normal text-[#29231F] tracking-[-0.01em]"
          >
            HOW CAN WE HELP?
          </motion.h2>
        </div>

        {/* Three Large Editorial Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {contactOptions.map((option: ContactOption, index: number) => (
            <motion.button
              key={option.number}
              onClick={() => onSelectOption(option.interestValue)}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.75,
                delay: 0.15 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col justify-between text-left p-8 sm:p-10 lg:p-11 bg-[#F7F3EC] hover:bg-[#E8DCD5] transition-colors duration-300 border border-[#29231F]/10 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C8A96B]"
              aria-label={`Select ${option.title}`}
            >
              {/* Top: Number & Accent */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-2xl sm:text-3xl text-[#B8A99A] group-hover:text-[#C8A96B] transition-colors duration-300 font-light">
                    {option.number}
                  </span>
                  <span className="h-px w-8 bg-[#29231F]/15 group-hover:bg-[#C8A96B] group-hover:w-12 transition-all duration-300" />
                </div>

                {/* Title (y: 0 -> -4px on hover) */}
                <h3 className="font-serif text-2xl sm:text-[26px] font-normal text-[#29231F] tracking-tight mb-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                  {option.title}
                </h3>

                {/* Short Description */}
                <p className="font-sans text-[14px] sm:text-[15px] text-[#29231F]/70 font-light leading-relaxed mb-10">
                  {option.description}
                </p>
              </div>

              {/* Bottom: Action link with animated arrow (x: 0 -> 6px on hover) */}
              <div className="flex items-center gap-3 pt-6 border-t border-[#29231F]/10">
                <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-[#29231F] group-hover:text-[#29231F]">
                  {option.actionText}
                </span>
                <ArrowRight
                  size={14}
                  strokeWidth={1.8}
                  className="text-[#29231F] group-hover:text-[#C8A96B] transform group-hover:translate-x-1.5 transition-all duration-300"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
