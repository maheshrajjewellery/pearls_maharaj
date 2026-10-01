import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { shopProducts } from '@/data/shopProducts';
import { ShopProduct } from '@/types/shop';

const popularKeywords = [
  'South Sea',
  'Akoya Choker',
  'Bridal Sets',
  'Pearl Earrings',
  'Baroque Pendant',
  'Emerald',
  '18K Gold',
];

export default function SearchModal() {
  const { isSearchOpen, closeSearch, setSearchQuery, openQuickView, setCurrentPage } = useShop();
  const [localQuery, setLocalQuery] = useState('');

  const liveResults = useMemo(() => {
    if (!localQuery.trim()) return [];
    const q = localQuery.toLowerCase().trim();
    return shopProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.descriptor.toLowerCase().includes(q) ||
          p.pearlType.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [localQuery]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: ShopProduct) => {
    closeSearch();
    openQuickView(product);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      setCurrentPage('shop');
      closeSearch();
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
    setCurrentPage('shop');
    closeSearch();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex flex-col bg-pearlIvory-100/98 backdrop-blur-md">
        {/* Top Header with Close */}
        <div className="flex items-center justify-between px-6 sm:px-12 lg:px-20 h-24 border-b border-[rgba(41,35,31,0.1)]">
          <span className="font-serif text-xl tracking-[0.15em] text-cocoa-300 font-medium">
            MAHARAJ
          </span>
          <button
            onClick={closeSearch}
            className="text-cocoa-300 hover:text-champagne-500 p-2 transition-colors"
            aria-label="Close search"
          >
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="max-w-3xl w-full mx-auto px-6 pt-12 sm:pt-16 pb-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={24}
              strokeWidth={1.5}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-champagne-500"
            />
            <input
              type="text"
              autoFocus
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search for pearl necklaces, earrings, collections..."
              className="w-full bg-transparent pl-10 pr-12 py-4 text-lg sm:text-2xl font-serif text-cocoa-300 placeholder:text-cocoa-100/40 border-b-2 border-cocoa-300/30 focus:border-champagne-400 focus:outline-none transition-colors"
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => setLocalQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-cocoa-100 hover:text-cocoa-300 p-1"
              >
                <X size={18} />
              </button>
            )}
          </form>

          {/* Popular Keywords */}
          <div className="mt-8">
            <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-cocoa-100/60 mb-3">
              POPULAR SEARCHES
            </p>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  className="px-3 py-1.5 bg-pearlIvory-200/80 hover:bg-pearlIvory-300 text-cocoa-300 text-xs font-sans tracking-wider transition-colors border border-[rgba(41,35,31,0.06)]"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* Live Search Suggestions */}
          {liveResults.length > 0 && (
            <div className="mt-10 border-t border-[rgba(41,35,31,0.1)] pt-6">
              <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-champagne-500 font-medium mb-4">
                SUGGESTED PIECES ({liveResults.length})
              </p>
              <div className="space-y-3">
                {liveResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="flex items-center gap-4 p-2.5 hover:bg-pearlIvory-200/60 cursor-pointer transition-colors border border-transparent hover:border-[rgba(41,35,31,0.08)]"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-16 aspect-[3/4] object-cover bg-ivory-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-sans uppercase tracking-widest text-cocoa-100/70">
                        {product.descriptor}
                      </p>
                      <h4 className="font-serif text-base text-cocoa-300 truncate">
                        {product.name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-sans font-medium text-cocoa-300">
                        {product.formattedPrice}
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-champagne-400 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
