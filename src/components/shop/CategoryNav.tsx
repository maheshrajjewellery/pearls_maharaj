import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '@/context/ShopContext';
import { ShopCategory } from '@/types/shop';

export default function CategoryNav() {
  const { filterState, setCategory, categories } = useShop();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (catSlug: ShopCategory) => {
    setCategory(catSlug);
  };

  const navCategories: { id: ShopCategory; label: string }[] = useMemo(() => {
    const list: { id: ShopCategory; label: string }[] = [{ id: 'all', label: 'All Jewellery' }];
    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        list.push({ id: cat.slug as ShopCategory, label: cat.name });
      });
    }
    return list;
  }, [categories]);

  return (
    <nav
      className="w-full bg-[#F7F3EC] border-b border-[rgba(41,35,31,0.12)] sticky top-[90px] lg:top-[100px] z-30 transition-all duration-300"
      aria-label="Category Navigation"
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar py-3.5 sm:py-4 gap-6 sm:gap-8 lg:gap-10">
          {navCategories.map((category) => {
            const isActive = filterState.category === category.id;
            const isHovered = hoveredCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id as ShopCategory)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`group relative whitespace-nowrap py-1 font-sans text-xs sm:text-[13px] tracking-[0.2em] uppercase transition-colors duration-300 select-none ${
                  isActive
                    ? 'text-cocoa-300 font-medium'
                    : 'text-cocoa-100/80 font-light hover:text-champagne-400'
                }`}
              >
                {category.label}

                {/* Active Underline */}
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-champagne-300"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover Underline when not active */}
                {!isActive && (
                  <span
                    className={`absolute -bottom-1 left-0 h-[1.5px] bg-champagne-200 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isHovered ? 'w-full opacity-80' : 'w-0 opacity-0'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
