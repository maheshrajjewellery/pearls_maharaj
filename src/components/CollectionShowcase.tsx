import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useShop } from '@/context/ShopContext';
import { ShopCategory } from '@/types/shop';
import { AdminCategory } from '@/types/admin';

const luxuryEase = [0.22, 1, 0.36, 1] as const;

// Section header reveal animation
const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase,
    },
  },
};

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: luxuryEase,
    },
  },
};

const imageClipVariants = {
  hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.1, ease: luxuryEase },
  },
};

const imageInitialScaleVariants = {
  hidden: { scale: 1.06 },
  visible: {
    scale: 1.0,
    transition: { duration: 1.2, ease: luxuryEase },
  },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.35, ease: luxuryEase },
  },
};

interface CategoryCardProps {
  categoryItem: AdminCategory;
  index: number;
  isMobile: boolean;
  prefersReduced: boolean | null;
}

function CategoryCard({ categoryItem, index, isMobile, prefersReduced }: CategoryCardProps) {
  const { setCurrentPage, setCategory } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCategory(categoryItem.slug as ShopCategory);
    setCurrentPage('shop');
    window.history.pushState({}, '', `/shop?category=${categoryItem.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile || prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  const imageParallaxX = !isMobile && !prefersReduced && isHovered ? mouseOffset.x * 7 : 0;
  const imageParallaxY = !isMobile && !prefersReduced && isHovered ? mouseOffset.y * 6 : 0;
  const textParallaxX = !isMobile && !prefersReduced && isHovered ? mouseOffset.x * -2 : 0;
  const textParallaxY = !isMobile && !prefersReduced && isHovered ? mouseOffset.y * -2 : 0;

  const editorialHeightClasses = [
    'h-[400px] sm:h-[430px] lg:h-[470px]',
    'h-[380px] sm:h-[400px] lg:h-[430px]',
    'h-[380px] sm:h-[400px] lg:h-[430px]',
    'h-[400px] sm:h-[430px] lg:h-[470px] lg:-translate-y-3',
  ][index % 4];

  return (
    <motion.div variants={cardVariants} className="w-full">
      <motion.a
        href={`#shop?category=${categoryItem.slug}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative overflow-hidden block w-full rounded-[2px] bg-charcoal-400 cursor-pointer select-none ${editorialHeightClasses}`}
        aria-label={`Explore ${categoryItem.name} Category`}
      >
        <motion.div variants={imageClipVariants} className="absolute inset-0 overflow-hidden w-full h-full">
          <motion.div
            variants={imageInitialScaleVariants}
            className="w-full h-full will-change-transform"
            style={{
              transform:
                !isMobile && !prefersReduced
                  ? `translate3d(${imageParallaxX}px, ${imageParallaxY}px, 0) scale(${isHovered ? 1.045 : 1.0})`
                  : undefined,
              transition: isHovered
                ? 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
                : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <img
              src={categoryItem.image}
              alt={categoryItem.name}
              className="w-full h-full object-cover select-none"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E]/90 via-[#12100E]/35 to-transparent pointer-events-none" />

        <div
          className="absolute inset-0 bg-charcoal-500 pointer-events-none transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: isHovered ? 0.18 : 0 }}
        />

        <motion.div
          variants={textRevealVariants}
          className="absolute inset-0 flex flex-col justify-end p-6 lg:p-7 z-10 will-change-transform"
          style={{
            transform:
              !isMobile && !prefersReduced && isHovered
                ? `translate3d(${textParallaxX}px, ${textParallaxY}px, 0)`
                : undefined,
            transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span className="text-champagne-200 text-[10px] tracking-[0.25em] uppercase font-light mb-2 opacity-90">
            Category • {categoryItem.itemCount} Items
          </span>

          <h3
            className="font-serif text-ivory-50 text-2xl lg:text-3xl font-light leading-snug will-change-transform"
            style={{
              transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {categoryItem.name}
          </h3>

          <p className="text-ivory-50/75 text-xs font-light mt-1.5 line-clamp-2 leading-relaxed max-w-[280px]">
            {categoryItem.description || `Explore our dynamic ${categoryItem.name} collection.`}
          </p>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15 text-champagne-200 group-hover:text-ivory-50 transition-colors duration-300">
            <span className="text-[10px] tracking-[0.22em] uppercase font-light">
              Explore {categoryItem.name}
            </span>
            <div
              className="will-change-transform flex items-center"
              style={{
                transform: isHovered ? 'translateX(6px)' : 'translateX(0)',
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <ArrowRight size={13} strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>
      </motion.a>
    </motion.div>
  );
}

export default function CollectionShowcase() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReduced = useReducedMotion();
  const { categories } = useShop();

  const displayCategories = categories.filter((c) => c.enabled).slice(0, 4);

  return (
    <section
      id="collections"
      className="bg-ivory-50 py-20 lg:py-28 px-6 lg:px-12 transition-colors duration-500 overflow-hidden"
      aria-label="Discover Categories"
    >
      <div className="max-w-[1360px] mx-auto">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-14 lg:mb-18"
        >
          <p className="text-champagne-500 text-xs tracking-widest-xl uppercase font-light mb-3 sm:mb-4">
            High Jewellery Curation
          </p>
          <h2 className="font-serif text-charcoal-400 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
            Discover The Categories
          </h2>
          <p className="text-charcoal-100/65 text-sm sm:text-base font-light max-w-lg mx-auto mt-3 sm:mt-4 leading-relaxed">
            Database-driven jewellery categories designed for every expression of royal luxury.
          </p>
        </motion.div>

        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-end"
        >
          {displayCategories.map((cat, i) => (
            <CategoryCard
              key={cat.id}
              categoryItem={cat}
              index={i}
              isMobile={isMobile}
              prefersReduced={prefersReduced}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
