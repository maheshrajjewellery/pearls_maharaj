import React, { useState, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, MoveHorizontal, Sun, Eye } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function PearlLuster() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handlePointerMove(e.clientX);
    }
  };

  return (
    <section
      id="pearl-luster"
      ref={ref}
      className="relative w-full py-20 lg:py-28 bg-pearlIvory-100 text-cocoa-300 overflow-hidden border-b border-[rgba(41,35,31,0.08)] select-none"
      aria-label="Understanding pearl luster - the language of light"
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        
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
              07 — OPTICAL RADIANCE
            </p>
            <span className="h-px w-6 bg-champagne-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="font-serif text-cocoa-300 text-[clamp(32px,4.5vw,54px)] font-normal leading-[1.05] tracking-[-0.01em]"
          >
            THE LANGUAGE <span className="italic font-serif font-light text-cocoa-200">OF LIGHT.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="mt-3 text-cocoa-100/80 text-[14px] sm:text-[15px] font-sans font-light max-w-lg mx-auto leading-relaxed"
          >
            Luster describes the way light reflects from a pearl's surface. Drag the comparison slider below to observe the optical contrast between lower and higher luster.
          </motion.p>
        </div>

        {/* Interactive Comparison Arena */}
        <div className="max-w-5xl mx-auto">
          
          <div
            ref={containerRef}
            onMouseDown={(e) => {
              setIsDragging(true);
              handlePointerMove(e.clientX);
            }}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => {
              setIsDragging(true);
              if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX);
            }}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[520px] rounded-[2px] overflow-hidden shadow-[0_16px_50px_rgba(41,35,31,0.12)] border border-champagne-300/30 cursor-ew-resize bg-pearlIvory-200"
            role="slider"
            aria-valuenow={Math.round(sliderPos)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Interactive pearl luster comparison slider"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setSliderPos((p) => Math.max(5, p - 5));
              if (e.key === 'ArrowRight') setSliderPos((p) => Math.min(95, p + 5));
            }}
          >
            {/* RIGHT SIDE (Base): HIGHER LUSTER (Sharp, mirror-like specular highlights & vibrant orient) */}
            <div className="absolute inset-0 w-full h-full bg-[#1E1916]">
              <img
                src="https://images.pexels.com/photos/10877350/pexels-photo-10877350.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Higher luster pearl with crisp reflection and brilliant orient"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa-400/40 via-transparent to-transparent pointer-events-none" />

              {/* Moving light beam sweep across the high luster side */}
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{
                  x: ['-100%', '200%'],
                  opacity: [0, 0.4, 0.4, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none blur-md -skew-x-12"
              />

              {/* High Luster Label */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-cocoa-300/90 text-pearlIvory-50 backdrop-blur-md border border-champagne-300/40 text-[11px] font-sans font-medium tracking-[0.2em] uppercase rounded-[1px] shadow-lg">
                HIGHER LUSTER (MIRROR REFLECTION)
              </div>
            </div>

            {/* LEFT SIDE (Clipped): LOWER LUSTER (Chalky, diffused, soft edge reflection) */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="relative w-full h-full" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw' }}>
                <img
                  src="https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt="Lower luster pearl with soft, diffused reflection"
                  className="w-full h-full object-cover object-center filter brightness-90 saturate-75 contrast-90"
                />
                <div className="absolute inset-0 bg-cocoa-300/20 pointer-events-none" />

                {/* Low Luster Label */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-pearlIvory-50/90 text-cocoa-300 backdrop-blur-md border border-[rgba(41,35,31,0.12)] text-[11px] font-sans font-medium tracking-[0.2em] uppercase rounded-[1px] shadow-lg">
                  LOWER LUSTER (DIFFUSED)
                </div>
              </div>
            </div>

            {/* Vertical Slider Handle Line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-champagne-300 shadow-[0_0_10px_rgba(200,169,107,0.8)] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Central Luxury Handle Orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-pearlIvory-50 border-2 border-champagne-400 shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center justify-center">
                <MoveHorizontal size={14} className="text-cocoa-300" />
              </div>
            </div>

            {/* Bottom drag helper prompt */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-cocoa-300/70 text-pearlIvory-100 text-[10px] font-sans tracking-widest uppercase rounded-full backdrop-blur-sm pointer-events-none">
              DRAG SLIDER TO COMPARE
            </div>
          </div>

          {/* Educational Explanatory Cards Beneath Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            
            {/* Lower Luster Explanation */}
            <div className="p-6 bg-pearlIvory-50 border border-[rgba(41,35,31,0.08)] rounded-[1px] space-y-2">
              <div className="flex items-center gap-2 text-cocoa-200">
                <Sun size={14} className="text-champagne-400" />
                <span className="text-[11px] font-sans font-medium tracking-widest uppercase text-cocoa-300">
                  Diffused / Lower Luster
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-light text-cocoa-100/90 leading-relaxed">
                Reflections appear soft, blurry, or chalky around the edges. Light scatters due to less aligned aragonite crystals or thinner nacre deposition.
              </p>
            </div>

            {/* Higher Luster Explanation */}
            <div className="p-6 bg-pearlIvory-50 border border-champagne-300/40 rounded-[1px] space-y-2 shadow-[0_4px_16px_rgba(200,169,107,0.08)]">
              <div className="flex items-center gap-2 text-cocoa-200">
                <Sparkles size={14} className="text-champagne-400" />
                <span className="text-[11px] font-sans font-medium tracking-widest uppercase text-cocoa-300">
                  Mirror / Higher Luster
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-light text-cocoa-100/90 leading-relaxed">
                Reflections are crisp, distinct, and sharp. You can clearly discern the outline of light sources and nearby reflections bouncing from deep within the crystalline layers.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
