import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface StageInfo {
  tag: string;
  title: string;
  subtitle: string;
  description: string;
}

const stages: StageInfo[] = [
  {
    tag: 'STAGE 01',
    title: 'FROM NATURE',
    subtitle: 'The Organic Origin',
    description: 'An unblemished natural pearl formed slowly in deep marine currents, glowing with internal iridescence.',
  },
  {
    tag: 'STAGE 02',
    title: 'TO DESIGN',
    subtitle: 'Architectural Blueprint',
    description: 'Fine champagne gold guide lines and geometric proportions are drawn around the gem’s contours.',
  },
  {
    tag: 'STAGE 03',
    title: 'TO CRAFT',
    subtitle: 'Atelier Metallurgy',
    description: 'Master artisans hand-forge the 18K gold setting, embracing the pearl in seamless royal prong filigree.',
  },
  {
    tag: 'STAGE 04',
    title: 'TO YOU',
    subtitle: 'The Heirloom Finished',
    description: 'The completed Maharaj signature masterpiece gleams, ready to become a timeless part of your story.',
  },
];

export default function AboutTransformation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [manualStage, setManualStage] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    mass: 0.3,
    restDelta: 0.0008,
  });

  // Scroll mapping ranges:
  // Stage 1: 0.00 - 0.25 (FROM NATURE)
  // Stage 2: 0.25 - 0.50 (TO DESIGN)
  // Stage 3: 0.50 - 0.75 (TO CRAFT)
  // Stage 4: 0.75 - 1.00 (TO YOU)

  // Computed visual properties
  // Gold geometry lines (Design phase)
  const designLinesOpacity = useTransform(smoothProgress, [0.18, 0.32, 0.75, 0.85], [0, 1, 1, 0.3]);
  const designLinesScale = useTransform(smoothProgress, [0.2, 0.45], [0.85, 1]);
  const designDashOffset = useTransform(smoothProgress, [0.2, 0.45], [300, 0]);

  // Craft metal prongs / halo (Craft phase)
  const craftOpacity = useTransform(smoothProgress, [0.42, 0.58], [0, 1]);
  const craftScale = useTransform(smoothProgress, [0.45, 0.65], [0.92, 1]);

  // Final jewellery brilliance / chain / sweep (To You phase)
  const finalJewelleryOpacity = useTransform(smoothProgress, [0.68, 0.82], [0, 1]);
  const lightSweepX = useTransform(smoothProgress, [0.78, 0.95], ['-100%', '200%']);
  const lightSweepOpacity = useTransform(smoothProgress, [0.78, 0.83, 0.92, 0.96], [0, 0.8, 0.8, 0]);

  // Pearl subtle breathing / vertical travel
  const pearlY = useTransform(smoothProgress, [0, 0.5, 1], [0, -10, 0]);
  const pearlGlow = useTransform(smoothProgress, [0, 0.5, 0.85, 1], [0.2, 0.4, 0.65, 0.5]);

  // Stage text active index calculation for scroll
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Sync active stage based on scroll or manual click
  smoothProgress.on('change', (latest) => {
    if (manualStage === null) {
      if (latest < 0.28) setActiveStageIndex(0);
      else if (latest < 0.55) setActiveStageIndex(1);
      else if (latest < 0.78) setActiveStageIndex(2);
      else setActiveStageIndex(3);
    }
  });

  const currentDisplayStage = manualStage !== null ? manualStage : activeStageIndex;
  const currentInfo = stages[currentDisplayStage];

  return (
    <section
      ref={containerRef}
      className="relative bg-[#30372F] text-pearlIvory-50 select-none overflow-hidden"
      style={{ height: prefersReduced ? 'auto' : '170vh' }}
      aria-label="From Pearl to Jewellery Transformation"
    >
      <div
        className={`${
          prefersReduced ? 'relative py-24 sm:py-28' : 'sticky top-0 h-screen min-h-[620px] max-h-[880px]'
        } w-full flex flex-col items-center justify-center px-6 sm:px-10`}
      >
        {/* Ambient background illumination */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(200, 169, 107, 0.12) 0%, rgba(23, 20, 18, 0.85) 60%, #30372F 100%)',
          }}
        />

        {/* Top Eyebrow */}
        <div className="relative z-10 text-center mb-4 sm:mb-6">
          <p className="text-champagne-300 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.35em] uppercase mb-1">
            TRANSFORMATION
          </p>
          <p className="text-pearlIvory-300/60 text-xs font-serif italic tracking-wide">
            From single gem to finished heirloom
          </p>
        </div>

        {/* Central Stage Container (Aspect Controlled) */}
        <div className="relative z-10 w-full max-w-[620px] aspect-[1/1] sm:aspect-[4/3] max-h-[420px] flex items-center justify-center">
          
          {/* Radial soft spotlight behind pearl */}
          <motion.div
            className="absolute w-[280px] sm:w-[360px] h-[280px] sm:h-[360px] rounded-full bg-champagne-300/15 blur-[60px] pointer-events-none"
            style={{ opacity: prefersReduced ? 0.3 : pearlGlow }}
          />

          {/* SVG Canvas for Elegant Metallurgy, CAD lines & Pearl Anchor */}
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full max-w-[440px] overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Pearl Natural Gradient */}
              <radialGradient id="naturePearlGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#F9F6F0" />
                <stop offset="70%" stopColor="#E9DDC7" />
                <stop offset="95%" stopColor="#B59960" />
                <stop offset="100%" stopColor="#7E683A" />
              </radialGradient>

              {/* Gold Polished Gradient */}
              <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4BE8A" />
                <stop offset="35%" stopColor="#FFFDF8" />
                <stop offset="70%" stopColor="#C5A15A" />
                <stop offset="100%" stopColor="#8A6E30" />
              </linearGradient>

              {/* Pearl Shadow Filter */}
              <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.6" />
              </filter>

              {/* Gold Line Glow Filter */}
              <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. TOP SUSPENSION / PENDANT BAIL (Jewellery state) */}
            <motion.g
              style={{
                opacity: prefersReduced ? 1 : finalJewelleryOpacity,
              }}
            >
              {/* Fine gold chain entering from top */}
              <path
                d="M 250 40 L 250 140"
                stroke="url(#goldFiligree)"
                strokeWidth="1.8"
                strokeDasharray="3 2"
                filter="url(#goldGlow)"
              />
              {/* Ornate royal bail */}
              <path
                d="M 238 140 C 238 126, 262 126, 262 140 C 262 152, 238 152, 238 140 Z"
                fill="url(#goldFiligree)"
                stroke="#B09040"
                strokeWidth="0.8"
              />
              <circle cx="250" cy="140" r="2.5" fill="#FFFDF8" />
            </motion.g>

            {/* 2. ARCHITECTURAL / CAD DESIGN WIREFRAME (Design state) */}
            <motion.g
              style={{
                opacity: prefersReduced ? 0.3 : designLinesOpacity,
                scale: prefersReduced ? 1 : designLinesScale,
                transformOrigin: '250px 250px',
              }}
            >
              {/* Outer compass grid */}
              <circle
                cx="250"
                cy="250"
                r="115"
                fill="none"
                stroke="#C5A15A"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <circle
                cx="250"
                cy="250"
                r="135"
                fill="none"
                stroke="#C5A15A"
                strokeWidth="0.5"
                opacity="0.4"
              />
              {/* Crosshair guide lines */}
              <line x1="110" y1="250" x2="390" y2="250" stroke="#C5A15A" strokeWidth="0.6" opacity="0.35" />
              <line x1="250" y1="110" x2="250" y2="390" stroke="#C5A15A" strokeWidth="0.6" opacity="0.35" />
              
              {/* Golden ratio diamond enclosure */}
              <polygon
                points="250,135 365,250 250,365 135,250"
                fill="none"
                stroke="#C5A15A"
                strokeWidth="0.8"
                strokeDasharray="6 3"
                opacity="0.5"
              />
            </motion.g>

            {/* 3. SOLID GOLDSMITH PRONGS & HALO SETTING (Craft state) */}
            <motion.g
              style={{
                opacity: prefersReduced ? 1 : craftOpacity,
                scale: prefersReduced ? 1 : craftScale,
                transformOrigin: '250px 250px',
              }}
            >
              {/* Filigree halo ring */}
              <circle
                cx="250"
                cy="250"
                r="92"
                fill="none"
                stroke="url(#goldFiligree)"
                strokeWidth="2.2"
                filter="url(#goldGlow)"
              />
              
              {/* 8-Point Goldsmith Setting Prongs */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const px = 250 + Math.cos(rad) * 88;
                const py = 250 + Math.sin(rad) * 88;
                return (
                  <g key={deg}>
                    <circle cx={px} cy={py} r="4.2" fill="url(#goldFiligree)" stroke="#8A6E30" strokeWidth="0.6" />
                    <circle cx={px} cy={py} r="1.5" fill="#FFFDF8" />
                  </g>
                );
              })}

              {/* Lower crown bezel drop */}
              <path
                d="M 220 338 C 235 358, 265 358, 280 338"
                fill="none"
                stroke="url(#goldFiligree)"
                strokeWidth="2"
              />
            </motion.g>

            {/* 4. THE CENTRAL PEARL (Continuous visual anchor throughout) */}
            <motion.g
              style={{
                y: prefersReduced ? 0 : pearlY,
                transformOrigin: '250px 250px',
              }}
            >
              {/* Pearl sphere */}
              <circle
                cx="250"
                cy="250"
                r="72"
                fill="url(#naturePearlGrad)"
                filter="url(#softShadow)"
              />
              
              {/* Internal nacre highlight / luster curve */}
              <ellipse
                cx="225"
                cy="218"
                rx="28"
                ry="16"
                fill="#FFFFFF"
                opacity="0.8"
                transform="rotate(-20 225 218)"
              />
              {/* Secondary delicate specular sparkle */}
              <circle cx="218" cy="208" r="4.5" fill="#FFFFFF" opacity="0.95" />

              {/* Ultra-fine perimeter luster ring */}
              <circle
                cx="250"
                cy="250"
                r="72"
                fill="none"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="0.8"
              />
            </motion.g>

            {/* 5. LIGHT SWEEP HIGHLIGHT ACROSS MASTERPIECE */}
            <motion.rect
              x="0"
              y="0"
              width="80"
              height="500"
              fill="url(#goldFiligree)"
              style={{
                opacity: prefersReduced ? 0 : lightSweepOpacity,
                x: prefersReduced ? 0 : lightSweepX,
                mixBlendMode: 'screen',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
          </svg>
        </div>

        {/* Dynamic Text Story Block */}
        <div className="relative z-10 max-w-[540px] text-center mt-6 sm:mt-8 min-h-[140px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDisplayStage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5, ease: luxuryEase }}
              className="flex flex-col items-center"
            >
              <span className="text-champagne-300 text-[10px] font-sans font-medium tracking-[0.3em] uppercase mb-1.5">
                {currentInfo.tag} • {currentInfo.subtitle}
              </span>
              <h3 className="font-serif text-pearlIvory-50 text-[30px] sm:text-[42px] font-light tracking-wide leading-none mb-3">
                {currentInfo.title}
              </h3>
              <p className="text-pearlIvory-300/75 text-[14px] sm:text-[15px] font-sans font-light leading-relaxed max-w-[440px]">
                {currentInfo.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stage Navigation Pills */}
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 mt-6">
          {stages.map((stage, idx) => {
            const isActive = currentDisplayStage === idx;
            return (
              <button
                key={stage.title}
                onClick={() => setManualStage(idx)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 border ${
                  isActive
                    ? 'bg-champagne-300 text-cocoa-400 border-champagne-300 font-medium shadow-[0_0_12px_rgba(200,169,107,0.3)]'
                    : 'bg-transparent text-pearlIvory-300/60 border-pearlIvory-300/20 hover:border-champagne-300/50 hover:text-pearlIvory-50'
                }`}
              >
                {stage.title}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
