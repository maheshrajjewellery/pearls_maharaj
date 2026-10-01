import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { sortOptions } from '@/data/shopProducts';
import { SortOption } from '@/types/shop';

export default function ShopToolbar() {
  const {
    totalProductCount,
    filterState,
    sortOption,
    setSortOption,
    setIsFilterDrawerOpen,
    activeFilterCount,
    clearSingleFilter,
    clearFilters,
  } = useShop();

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel = sortOptions.find((s) => s.id === sortOption)?.label || 'Featured';

  return (
    <div className="w-full bg-[#F7F3EC] border-b border-[rgba(41,35,31,0.12)]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Main Toolbar Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* LEFT: Piece Count */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs sm:text-[13px] font-normal tracking-[0.22em] uppercase text-cocoa-300">
              {totalProductCount} {totalProductCount === 1 ? 'PIECE' : 'PIECES'}
            </span>
          </div>

          {/* RIGHT: Filter Button & Sort Dropdown */}
          <div className="flex items-center gap-5 sm:gap-8">
            {/* Filter Drawer Trigger */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="group flex items-center gap-2 text-cocoa-300 hover:text-champagne-400 transition-colors duration-300 select-none"
              aria-label="Open filter drawer"
            >
              <SlidersHorizontal size={15} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-sans text-xs sm:text-[13px] tracking-[0.2em] uppercase font-normal">
                FILTER
              </span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-champagne-300 text-pearlIvory-50 text-[10px] font-medium flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Custom Minimal Luxury Sort Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="group flex items-center gap-1.5 text-cocoa-300 hover:text-champagne-400 transition-colors duration-300 select-none py-1"
                aria-label="Sort products"
              >
                <span className="font-sans text-xs sm:text-[13px] tracking-[0.2em] uppercase font-normal text-cocoa-100 hidden sm:inline">
                  SORT BY:
                </span>
                <span className="font-sans text-xs sm:text-[13px] tracking-[0.15em] uppercase font-normal text-cocoa-300">
                  {currentSortLabel}
                </span>
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  className={`text-cocoa-100 transition-transform duration-300 ${
                    isSortDropdownOpen ? 'rotate-180 text-champagne-400' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isSortDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-pearlIvory-50 border border-[rgba(41,35,31,0.12)] shadow-[0_8px_30px_rgba(41,35,31,0.08)] py-2 z-40">
                  {sortOptions.map((option) => {
                    const isSelected = sortOption === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortOption(option.id as SortOption);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'text-cocoa-300 font-medium bg-[#F7F3EC]'
                            : 'text-cocoa-100/90 font-light hover:text-champagne-400 hover:bg-pearlIvory-100'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-champagne-300" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Chips / Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-3 border-t border-[rgba(41,35,31,0.08)]">
            <span className="text-[11px] font-sans tracking-widest uppercase text-cocoa-100/60 mr-1">
              Active Filters:
            </span>

            {/* Pearl Types */}
            {filterState.pearlTypes.map((type) => (
              <button
                key={type}
                onClick={() => clearSingleFilter('pearlType', type)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pearlIvory-200 text-cocoa-300 text-[11px] tracking-wider uppercase border border-[rgba(41,35,31,0.1)] hover:border-champagne-300 hover:text-champagne-500 transition-colors"
              >
                <span>{type}</span>
                <X size={12} strokeWidth={1.5} />
              </button>
            ))}

            {/* Price ranges */}
            {filterState.priceRanges.map((range) => {
              const labelMap: Record<string, string> = {
                'under-10k': 'Under ₹10,000',
                '10k-25k': '₹10,000–₹25,000',
                '25k-50k': '₹25,000–₹50,000',
                'above-50k': '₹50,000+',
              };
              return (
                <button
                  key={range}
                  onClick={() => clearSingleFilter('priceRange', range)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pearlIvory-200 text-cocoa-300 text-[11px] tracking-wider uppercase border border-[rgba(41,35,31,0.1)] hover:border-champagne-300 hover:text-champagne-500 transition-colors"
                >
                  <span>{labelMap[range]}</span>
                  <X size={12} strokeWidth={1.5} />
                </button>
              );
            })}

            {/* Materials */}
            {filterState.materials.map((mat) => (
              <button
                key={mat}
                onClick={() => clearSingleFilter('material', mat)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pearlIvory-200 text-cocoa-300 text-[11px] tracking-wider uppercase border border-[rgba(41,35,31,0.1)] hover:border-champagne-300 hover:text-champagne-500 transition-colors"
              >
                <span>{mat}</span>
                <X size={12} strokeWidth={1.5} />
              </button>
            ))}

            {/* Collections */}
            {filterState.collections.map((col) => (
              <button
                key={col}
                onClick={() => clearSingleFilter('collection', col)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pearlIvory-200 text-cocoa-300 text-[11px] tracking-wider uppercase border border-[rgba(41,35,31,0.1)] hover:border-champagne-300 hover:text-champagne-500 transition-colors"
              >
                <span>{col}</span>
                <X size={12} strokeWidth={1.5} />
              </button>
            ))}

            {/* Colors */}
            {filterState.colors.map((c) => (
              <button
                key={c}
                onClick={() => clearSingleFilter('color', c)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pearlIvory-200 text-cocoa-300 text-[11px] tracking-wider uppercase border border-[rgba(41,35,31,0.1)] hover:border-champagne-300 hover:text-champagne-500 transition-colors"
              >
                <span>{c}</span>
                <X size={12} strokeWidth={1.5} />
              </button>
            ))}

            {/* Search query chip */}
            {filterState.searchQuery && (
              <button
                onClick={() => clearSingleFilter('search')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pearlIvory-200 text-cocoa-300 text-[11px] tracking-wider uppercase border border-[rgba(41,35,31,0.1)] hover:border-champagne-300 hover:text-champagne-500 transition-colors"
              >
                <span>Search: "{filterState.searchQuery}"</span>
                <X size={12} strokeWidth={1.5} />
              </button>
            )}

            {/* Clear all */}
            <button
              onClick={clearFilters}
              className="text-[11px] font-sans tracking-widest uppercase text-champagne-500 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
