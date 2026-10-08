import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Plus, Minus, HelpCircle, CheckCircle } from "lucide-react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface MythItem {
  id: string;
  question: string;
  mythSummary: string;
  factExplanation: string;
}

const pearlMyths: MythItem[] = [
  {
    id: "myth-1",
    question: "Are all genuine pearls perfectly round?",
    mythSummary: "Myth: Only round pearls are genuine or valuable.",
    factExplanation:
      "Fact: Perfectly spherical pearls represent a tiny fraction of global harvests. Pearls naturally grow into ovals, buttons, teardrops, and asymmetrical baroques. High-luster baroque and drop pearls are revered in high jewellery for their unique sculptural artistry.",
  },
  {
    id: "myth-2",
    question: "Are cultured pearls real pearls?",
    mythSummary: "Myth: Cultured pearls are synthetic or imitation gems.",
    factExplanation:
      "Fact: Cultured pearls are 100% genuine organic gemstones. The only difference between natural and cultured pearls is that human pearl farmers carefully initiate the biological process by introducing a nucleus into the oyster. The mollusk itself deposits every single layer of natural nacre.",
  },
  {
    id: "myth-3",
    question: "Do pearls last forever without specialized care?",
    mythSummary: "Myth: Pearls are mineral stones that resist all chemicals.",
    factExplanation:
      "Fact: Pearl nacre is organic calcium carbonate (aragonite) held together by conchiolin protein. Contact with acidic perfumes, pool chlorine, or household cleaners will slowly erode the nacre and dull the luster. With simple routine care, pearls easily endure for generations.",
  },
  {
    id: "myth-4",
    question:
      "Is a larger pearl always higher in quality than a smaller pearl?",
    mythSummary: "Myth: Diameter is the single deciding metric of luxury.",
    factExplanation:
      "Fact: Luster, surface clarity, nacre thickness, and optical symmetry outweigh size. A luminous, mirror-like 7.5mm Akoya pearl is far more precious and visually captivating than a dull, chalky 11mm pearl with heavy blemishes.",
  },
  {
    id: "myth-5",
    question: "Should you scrape pearls on your teeth to test authenticity?",
    mythSummary: "Myth: Rubbing against enamel is a safe home test.",
    factExplanation:
      "Fact: While genuine nacre feels subtly gritty against tooth enamel due to microscopic aragonite platelets (whereas glass or plastic feels slick), biting or scraping can scratch delicate nacre layers. Visual inspection under magnification is the safe and professional method.",
  },
];

export default function PearlMyths() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [openId, setOpenId] = useState<string | null>("myth-1");
  const prefersReduced = useReducedMotion();

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="pearl-myths"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-pearlIvory-100 text-cocoa-300 overflow-hidden border-b border-[rgba(41,35,31,0.08)]"
      aria-label="Pearl myths and facts"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: luxuryEase }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-champagne-300" />
            <p className="text-champagne-400 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              13 — CLARITY & TRUTH
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-cocoa-300 text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em]"
          >
            PEARL MYTHS{" "}
            <span className="italic font-serif font-light text-cocoa-200">
              & FACTS.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-cocoa-100/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            Dispel common misconceptions with scientific, factual insights
            curated by MAHESHRAJ gemological researchers.
          </motion.p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {pearlMyths.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + idx * 0.07,
                  ease: luxuryEase,
                }}
                className={`border transition-all duration-300 rounded-[2px] overflow-hidden ${
                  isOpen
                    ? "bg-pearlIvory-50 border-champagne-400 shadow-[0_4px_20px_rgba(200,169,107,0.1)]"
                    : "bg-pearlIvory-50/70 border-[rgba(41,35,31,0.08)] hover:border-champagne-300/40"
                }`}
              >
                {/* Header Button */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`myth-content-${item.id}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-semibold text-champagne-500">
                      0{idx + 1}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-cocoa-300 font-normal">
                      {item.question}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-pearlIvory-100 border border-[rgba(41,35,31,0.08)] flex items-center justify-center text-cocoa-300 flex-shrink-0">
                    {isOpen ? (
                      <Minus size={15} strokeWidth={1.8} />
                    ) : (
                      <Plus size={15} strokeWidth={1.8} />
                    )}
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`myth-content-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: luxuryEase }}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-[rgba(41,35,31,0.06)] space-y-3">
                        <div className="flex items-center gap-2 text-cocoa-100 text-xs font-mono">
                          <HelpCircle
                            size={13}
                            className="text-champagne-400"
                          />
                          <span className="italic">{item.mythSummary}</span>
                        </div>
                        <p className="text-sm font-sans font-light text-cocoa-200 leading-relaxed pl-5 border-l-2 border-champagne-300">
                          {item.factExplanation}
                        </p>
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
