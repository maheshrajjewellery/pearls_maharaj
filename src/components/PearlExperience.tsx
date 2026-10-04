import { useRef, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

/**
 * Necklace path — graceful U curve. ViewBox 0 0 600 320.
 */
const NECKLACE_PATH =
  'M 40 60 C 40 240, 160 300, 300 300 C 440 300, 560 240, 560 60';

const PEARL_POSITIONS = [
  { x: 60, y: 92 },
  { x: 92, y: 152 },
  { x: 138, y: 208 },
  { x: 196, y: 254 },
  { x: 262, y: 282 },
  { x: 338, y: 282 },
  { x: 404, y: 254 },
  { x: 462, y: 208 },
  { x: 508, y: 152 },
  { x: 540, y: 92 },
];

const PEARL_STARTS = [
  { x: 120, y: 40 },
  { x: 480, y: 40 },
  { x: 40, y: 200 },
  { x: 560, y: 200 },
  { x: 200, y: 20 },
  { x: 400, y: 20 },
  { x: 60, y: 280 },
  { x: 540, y: 280 },
  { x: 300, y: 30 },
  { x: 300, y: 320 },
];

export default function PearlExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.35,
    restDelta: 0.0005,
  });

  // Timeline
  // 0.00–0.15  pearls appear
  // 0.15–0.35  pearls travel
  // 0.35–0.55  chain draws
  // 0.55–0.80  pearls attach
  // 0.80–0.92  settle + sweep
  // 0.92–1.00  text

  const chainDraw = useTransform(progress, [0.35, 0.6], [0, 1]);
  const chainOpacity = useTransform(progress, [0.3, 0.45], [0, 1]);

  const sweepX = useTransform(progress, [0.82, 0.95], ['-20%', '120%']);
  const sweepOpacity = useTransform(progress, [0.82, 0.86, 0.92, 0.95], [0, 0.9, 0.9, 0]);

  const glowOpacity = useTransform(progress, [0, 0.5, 0.85, 1], [0.05, 0.25, 0.45, 0.35]);

  const titleOpacity = useTransform(progress, [0.9, 1], [0, 1]);
  const titleY = useTransform(progress, [0.9, 1], [14, 0]);

  const eyebrowOpacity = useTransform(progress, [0, 0.15, 0.35], [0, 0.5, 0]);

  const reduced = prefersReduced;

  const pearlTimings = useMemo(
    () =>
      Array.from({ length: PEARL_POSITIONS.length }, (_, i) => {
        const appearStart = 0.02 + i * 0.012;
        const appearEnd = appearStart + 0.08;
        const travelStart = 0.15 + i * 0.012;
        const travelEnd = travelStart + 0.18;
        const attachStart = 0.55 + i * 0.024;
        const attachEnd = attachStart + 0.08;
        return { appearStart, appearEnd, travelStart, travelEnd, attachStart, attachEnd };
      }),
    []
  );

  return (
    <section
      ref={containerRef}
      aria-label="The Maharaj signature — made to last"
      className="relative bg-[#12100E] select-none"
      style={{ height: reduced ? '60vh' : '115vh' }}
    >
      <div className="sticky top-0 h-screen min-h-[560px] max-h-[780px] w-full overflow-hidden flex items-center justify-center">
        {/* Ambient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 50% 55%, rgba(200,169,107,0.14) 0%, rgba(18,16,14,0) 70%), radial-gradient(ellipse at 50% 50%, rgba(28,23,20,0.9) 0%, #12100E 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Stage */}
        <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
          <motion.p
            className="absolute top-[10%] left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-[#C5A15A] pointer-events-none"
            style={{ opacity: reduced ? 0.6 : eyebrowOpacity }}
          >
            The Art of Craft
          </motion.p>

          {/* Necklace scene — compact */}
          <div
            className="relative w-full max-w-[640px]"
            style={{ aspectRatio: '600 / 360' }}
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(200,169,107,0.35) 0%, rgba(200,169,107,0) 65%)',
                filter: 'blur(40px)',
                opacity: reduced ? 0.3 : glowOpacity,
              }}
            />

            <svg
              viewBox="0 0 600 360"
              className="absolute inset-0 w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="pearlGrad" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="30%" stopColor="#F7F3EC" />
                  <stop offset="65%" stopColor="#E8D9B8" />
                  <stop offset="100%" stopColor="#A88F5A" />
                </radialGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8a7440" />
                  <stop offset="50%" stopColor="#E8D9B8" />
                  <stop offset="100%" stopColor="#8a7440" />
                </linearGradient>
                <filter id="chainGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="pearlShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.55" />
                </filter>
              </defs>

              <motion.path
                d={NECKLACE_PATH}
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="1.6"
                strokeLinecap="round"
                filter="url(#chainGlow)"
                style={{
                  pathLength: reduced ? 1 : chainDraw,
                  opacity: reduced ? 0.9 : chainOpacity,
                }}
              />

              {PEARL_POSITIONS.map((pos, i) => {
                const t = pearlTimings[i];
                const start = PEARL_STARTS[i];

                const appearOpacity = useTransform(
                  progress,
                  [t.appearStart, t.appearEnd],
                  [0, 1]
                );
                const appearBlur = useTransform(
                  progress,
                  [t.appearStart, t.appearEnd],
                  [4, 0]
                );
                const appearFilter = useTransform(appearBlur, (v) => `blur(${v}px)`);

                const x = useTransform(
                  progress,
                  [t.travelStart, t.travelEnd],
                  [start.x, pos.x]
                );
                const y = useTransform(
                  progress,
                  [t.travelStart, t.travelEnd],
                  [start.y, pos.y]
                );

                const settleScale = useTransform(
                  progress,
                  [t.attachStart, t.attachStart + 0.03, t.attachEnd],
                  [1, 1.06, 1]
                );

                const rotate = useTransform(
                  progress,
                  [t.travelStart, t.travelEnd],
                  [0, (i % 2 === 0 ? 1 : -1) * 18]
                );

                const pinOpacity = useTransform(
                  progress,
                  [t.attachStart, t.attachStart + 0.02],
                  [0, 1]
                );

                const r = 17 + (i % 3) * 1.5;

                return (
                  <motion.g
                    key={i}
                    style={{
                      x: reduced ? pos.x : x,
                      y: reduced ? pos.y : y,
                      rotate: reduced ? 0 : rotate,
                      scale: reduced ? 1 : settleScale,
                      opacity: reduced ? 1 : appearOpacity,
                      filter: reduced ? 'none' : appearFilter,
                      transformOrigin: 'center',
                      transformBox: 'fill-box',
                    }}
                  >
                    <motion.circle
                      cx="0"
                      cy={-r - 1.5}
                      r="1.4"
                      fill="#C5A15A"
                      style={{ opacity: reduced ? 1 : pinOpacity }}
                    />
                    <circle cx="0" cy="0" r={r} fill="url(#pearlGrad)" filter="url(#pearlShadow)" />
                    <ellipse
                      cx={-r * 0.3}
                      cy={-r * 0.35}
                      rx={r * 0.35}
                      ry={r * 0.22}
                      fill="rgba(255,255,255,0.75)"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r={r}
                      fill="none"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="0.6"
                    />
                  </motion.g>
                );
              })}

              <motion.rect
                x="0"
                y="0"
                width="80"
                height="360"
                fill="url(#goldGrad)"
                style={{
                  opacity: reduced ? 0 : sweepOpacity,
                  x: reduced ? 0 : sweepX,
                  mixBlendMode: 'screen',
                  filter: 'blur(14px)',
                  pointerEvents: 'none',
                }}
              />
            </svg>
          </div>

          {/* Final text */}
          <motion.div
            className="mt-4 sm:mt-6 text-center"
            style={{
              opacity: reduced ? 1 : titleOpacity,
              y: reduced ? 0 : titleY,
            }}
          >
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.32em] uppercase text-[#C5A15A] mb-2.5">
              The Maharaj Signature
            </p>
            <h2 className="font-serif text-[#F7F3EC] text-[30px] sm:text-[42px] lg:text-[52px] font-normal leading-[0.98] tracking-[-0.015em]">
              MADE <span className="italic font-light text-[#E8D9B8]">TO LAST.</span>
            </h2>
            <p className="mt-3 text-[#F7F3EC]/65 text-[13px] sm:text-[14px] font-sans font-light leading-relaxed max-w-[380px] mx-auto">
              Crafted piece by piece.
              <br />
              Designed to become part of your story.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}