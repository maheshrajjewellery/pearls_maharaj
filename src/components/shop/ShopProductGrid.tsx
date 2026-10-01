import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import ShopProductCard from './ShopProductCard';
import EditorialPearlBanner from './EditorialPearlBanner';

const INITIAL_VISIBLE_COUNT = 16;
const BATCH_INCREMENT = 8;
const BANNER_POSITION = 8; // Insert editorial banner after product #8

export default function ShopProductGrid() {
  const { filteredProducts, clearFilters } = useShop();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Products to display based on visibleCount
  const currentProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + BATCH_INCREMENT);
      setIsLoadingMore(false);
    }, 350);
  };

  // If no products match the current filters
  if (filteredProducts.length === 0) {
    return (
      <div className="w-full py-28 sm:py-36 px-6 bg-[#F8F5F0]">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-pearlIvory-200 border border-[rgba(41,35,31,0.1)] flex items-center justify-center mb-6 text-champagne-500">
              <Sparkles size={20} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-cocoa-300 tracking-wide mb-3">
              NO PIECES FOUND
            </h3>
            <p className="text-cocoa-100 text-xs sm:text-sm font-light leading-relaxed mb-8 max-w-xs">
              Try adjusting your filter selection or clear filters to view our complete collection.
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-3.5 bg-cocoa-300 text-pearlIvory-50 text-xs tracking-[0.22em] uppercase font-light hover:bg-cocoa-200 transition-colors duration-300"
            >
              CLEAR FILTERS
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Split products for the editorial banner insertion
  const firstBatch = currentProducts.slice(0, BANNER_POSITION);
  const secondBatch = currentProducts.slice(BANNER_POSITION);
  const showBanner = currentProducts.length >= BANNER_POSITION;

  return (
    <section className="w-full bg-[#F8F5F0] py-10 sm:py-14 lg:py-16">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* FIRST BATCH OF PRODUCTS (4-col desktop, 3-col tablet, 2-col mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-7 gap-y-10 sm:gap-y-14">
          {firstBatch.map((product, index) => (
            <ShopProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        {/* EDITORIAL PEARL BANNER (Inserted after first 8 products) */}
        {showBanner && <EditorialPearlBanner />}

        {/* SECOND BATCH OF PRODUCTS (CONTINUATION) */}
        {secondBatch.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-7 gap-y-10 sm:gap-y-14">
            {secondBatch.map((product, index) => (
              <ShopProductCard
                key={product.id}
                product={product}
                index={BANNER_POSITION + index}
              />
            ))}
          </div>
        )}

        {/* LOAD MORE / PAGINATION AREA */}
        <div className="mt-16 sm:mt-20 lg:mt-24 flex flex-col items-center justify-center text-center">
          {/* Piece Counter indicator */}
          <p className="text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase font-light text-cocoa-100/70 mb-4">
            Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} Pieces
          </p>

          {/* Minimal Progress Bar */}
          <div className="w-44 h-0.5 bg-cocoa-300/10 mb-8 rounded-full overflow-hidden">
            <div
              className="h-full bg-champagne-400 transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(
                  100,
                  (Math.min(visibleCount, filteredProducts.length) / filteredProducts.length) * 100
                )}%`,
              }}
            />
          </div>

          {/* Load More Button */}
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="group min-w-[200px] px-8 py-3.5 border border-cocoa-300 text-cocoa-300 text-xs font-sans tracking-[0.25em] uppercase font-normal hover:bg-[#29231F] hover:text-[#F7F3EC] transition-all duration-300 flex items-center justify-center gap-3 select-none"
            >
              {isLoadingMore ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>LOADING...</span>
                </>
              ) : (
                <span>LOAD MORE</span>
              )}
            </button>
          ) : (
            <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-cocoa-100/50">
              End of Collection
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
