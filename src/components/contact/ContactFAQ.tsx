import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { faqItems, FAQItem } from '@/data/contactData';
import { useInView } from '@/hooks/useInView';

export default function ContactFAQ() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  // Store open items; keep at most 1 item open for a clean, compact accordion
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#F7F3EC] border-b border-[#29231F]/10"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        
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
              CLIENT ASSISTANCE
            </span>
            <span className="h-px w-6 bg-[#C8A96B]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(28px,4vw,44px)] font-normal text-[#29231F] tracking-[-0.01em]"
          >
            COMMON QUESTIONS
          </motion.h2>
        </div>

        {/* Compact Accordion List */}
        <div className="space-y-4">
          {faqItems.map((item: FAQItem, index: number) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.75,
                  delay: 0.1 + index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`border transition-colors duration-300 ${
                  isOpen
                    ? 'border-[#C8A96B]/50 bg-[#FFFDF8] shadow-[0_2px_12px_rgba(41,35,31,0.03)]'
                    : 'border-[#29231F]/10 bg-[#FFFDF8]/70 hover:bg-[#FFFDF8]'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-question-${item.id}`}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96B] cursor-pointer group"
                >
                  <span className="font-serif text-lg sm:text-xl font-normal text-[#29231F] group-hover:text-[#C8A96B] transition-colors duration-300 pr-4">
                    {item.question}
                  </span>

                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'border-[#C8A96B] bg-[#C8A96B] text-[#29231F]'
                        : 'border-[#29231F]/15 text-[#29231F] group-hover:border-[#C8A96B] group-hover:text-[#C8A96B]'
                    }`}
                  >
                    {isOpen ? (
                      <Minus size={15} strokeWidth={1.8} />
                    ) : (
                      <Plus size={15} strokeWidth={1.8} />
                    )}
                  </div>
                </button>

                {/* Accordion Content with Height Animation (300-400ms, no bounce) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-7 sm:px-7 sm:pb-8 pt-1 text-[#29231F]/80 font-sans text-[14px] sm:text-[15px] font-light leading-[1.7] border-t border-[#29231F]/5">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
