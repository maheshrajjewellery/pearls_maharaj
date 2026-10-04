import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { ShopCategory } from '@/types/shop';
import { AdminCategory } from '@/types/admin';

export default function CuratedCategories() {
  const { categories, setCategory, setCurrentPage, cmsData, isLoading, refreshPublicData } = useShop();
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const categoriesCMS = cmsData?.homepage?.discoverCategories;

  if (categoriesCMS && categoriesCMS.active === false) return null;

  const title = categoriesCMS?.title || 'Curated Categories';
  const subtitle = categoriesCMS?.subtitle || 'Explore our exquisite range of high jewellery';

  // Filter only published / active categories
  const activeCategories: AdminCategory[] = categories
    .filter((c) => c.enabled)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const handleCategoryClick = (categorySlug: string) => {
    setCategory(categorySlug as ShopCategory);
    setCurrentPage('shop');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/shop?category=${categorySlug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetry = async () => {
    setIsRefreshing(true);
    setFetchError(false);
    try {
      await refreshPublicData();
    } catch {
      setFetchError(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="bg-[#F7F3EB] py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-14 border-b border-[#30372F]/08">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#C5A15A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.2em] uppercase font-medium mb-3"
          >
            EXCLUSIVE CURATION
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-[#30372F] text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.01em]"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#30372F]/75 font-sans text-sm sm:text-base font-normal max-w-md mx-auto mt-3 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 1. LOADING SKELETON STATE */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col space-y-3">
                <div className="w-full aspect-[3/4] bg-[#30372F]/10 animate-pulse rounded-xs border border-[#30372F]/05" />
                <div className="h-4 w-3/4 bg-[#30372F]/10 animate-pulse rounded-xs" />
                <div className="h-3 w-1/2 bg-[#30372F]/10 animate-pulse rounded-xs" />
              </div>
            ))}
          </div>
        ) : fetchError ? (
          /* 2. ERROR STATE */
          <div className="text-center py-12 bg-[#FFFDF8] border border-[#30372F]/10 max-w-md mx-auto rounded p-6 shadow-xs space-y-4">
            <p className="text-xs text-[#30372F]/75 font-serif text-base">Unable to load collections right now.</p>
            <button
              onClick={handleRetry}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#30372F] text-[#F5EBDD] hover:bg-[#C5A15A] hover:text-[#30372F] text-xs font-semibold uppercase tracking-widest transition-colors rounded cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Try Again</span>
            </button>
          </div>
        ) : activeCategories.length === 0 ? (
          /* 3. EMPTY STATE */
          <div className="text-center py-12 text-[#30372F]/60 font-serif italic text-base">
            No collections available at the moment.
          </div>
        ) : (
          /* 4. DYNAMIC 4-COLUMN DESKTOP / 2-COLUMN TABLET & MOBILE GRID */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {activeCategories.map((category, index) => (
              <motion.div
                key={category.id || category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleCategoryClick(category.slug)}
                className="group relative cursor-pointer flex flex-col overflow-hidden bg-[#FFFDF8] border border-[#30372F]/10 rounded-xs hover:border-[#C5A15A]/60 transition-all duration-300 shadow-xs hover:shadow-md"
              >
                {/* 3:4 Portrait Image Container */}
                <div className="relative aspect-[3/4] w-full bg-[#2D332C] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg';
                    }}
                  />

                  {/* Gradient Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

                  {/* Product Count Badge */}
                  {category.itemCount !== undefined && category.itemCount > 0 && (
                    <span className="absolute top-3 right-3 bg-[#30372F]/80 backdrop-blur-xs text-[#C5A15A] text-[10px] font-sans font-bold px-2 py-0.5 tracking-wider rounded-xs border border-[#C5A15A]/20">
                      {category.itemCount} {category.itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                  )}

                  {/* Overlay Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end text-white pointer-events-none">
                    <span className="text-[#C5A15A] text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] font-sans font-semibold mb-1 opacity-90">
                      Collection
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-white group-hover:text-[#C5A15A] transition-colors duration-300 leading-snug">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Card Footer Content */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-[#FFFDF8] border-t border-[#30372F]/08">
                  <p className="text-[#30372F]/75 text-xs line-clamp-2 leading-relaxed mb-3 font-sans">
                    {category.description || `Discover our bespoke ${category.name.toLowerCase()} creations.`}
                  </p>

                  <div className="inline-flex items-center gap-2 text-[#30372F] group-hover:text-[#C5A15A] text-[11px] font-sans font-medium uppercase tracking-[0.12em] transition-colors duration-300">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A15A] group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
