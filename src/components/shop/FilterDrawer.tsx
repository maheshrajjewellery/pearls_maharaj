import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import {
  pearlTypeOptions,
  priceOptions,
  materialOptions,
  collectionOptions,
  colorOptions,
  shopCategories,
} from '@/data/shopProducts';
import {
  ShopCategory,
  PearlType,
  PriceFilter,
  MaterialFilter,
  CollectionFilter,
  ColorFilter,
} from '@/types/shop';

export default function FilterDrawer() {
  const {
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    filterState,
    setCategory,
    togglePearlType,
    togglePriceRange,
    toggleMaterial,
    toggleCollection,
    toggleColor,
    clearFilters,
    totalProductCount,
    categories,
  } = useShop();

  const dynamicCategoryOptions = [
    { id: 'all', label: 'All Categories' },
    ...categories.map((c) => ({ id: c.slug, label: c.name })),
  ];

  // Collapsible section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    pearlType: true,
    price: true,
    material: true,
    collection: true,
    color: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <AnimatePresence>
      {isFilterDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-cocoa-300/40 backdrop-blur-[2px]"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-[420px] lg:max-w-[440px] bg-[#F7F3EC] flex flex-col shadow-[-10px_0_40px_rgba(41,35,31,0.12)]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 h-20 border-b border-[rgba(41,35,31,0.12)] bg-[#F7F3EC]">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-cocoa-300 tracking-wide">
                  FILTERS
                </h2>
                <span className="text-xs font-sans text-cocoa-100 tracking-widest uppercase">
                  ({totalProductCount} pieces)
                </span>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="text-cocoa-300 hover:text-champagne-400 p-2 transition-colors duration-300"
                aria-label="Close filters"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Filter Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-8 divide-y divide-[rgba(41,35,31,0.08)]">
              {/* 1. Category */}
              <div className="pt-2 first:pt-0">
                <button
                  onClick={() => toggleSection('category')}
                  className="w-full flex items-center justify-between pb-3 text-left"
                >
                  <span className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-cocoa-300">
                    CATEGORY
                  </span>
                  <span className="text-xs text-cocoa-100 font-light">
                    {openSections.category ? '—' : '+'}
                  </span>
                </button>
                {openSections.category && (
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {dynamicCategoryOptions.map((cat) => {
                      const isSelected = filterState.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id as ShopCategory)}
                          className={`text-left px-3 py-2 text-xs tracking-wider uppercase transition-all duration-200 border ${
                            isSelected
                              ? 'bg-cocoa-300 text-pearlIvory-50 border-cocoa-300'
                              : 'bg-pearlIvory-100 text-cocoa-300/80 border-[rgba(41,35,31,0.1)] hover:border-champagne-300'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Pearl Type */}
              <div className="pt-6">
                <button
                  onClick={() => toggleSection('pearlType')}
                  className="w-full flex items-center justify-between pb-3 text-left"
                >
                  <span className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-cocoa-300">
                    PEARL TYPE
                  </span>
                  <span className="text-xs text-cocoa-100 font-light">
                    {openSections.pearlType ? '—' : '+'}
                  </span>
                </button>
                {openSections.pearlType && (
                  <div className="space-y-3 pt-2">
                    {pearlTypeOptions.map((type) => {
                      const isChecked = filterState.pearlTypes.includes(type as PearlType);
                      return (
                        <label
                          key={type}
                          onClick={() => togglePearlType(type as PearlType)}
                          className="flex items-center justify-between cursor-pointer group select-none py-0.5"
                        >
                          <span className="text-xs sm:text-[13px] tracking-wide text-cocoa-300 font-light group-hover:text-champagne-500 transition-colors">
                            {type}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-[2px] border transition-all duration-200 flex items-center justify-center ${
                              isChecked
                                ? 'bg-cocoa-300 border-cocoa-300 text-pearlIvory-50'
                                : 'border-cocoa-300/30 group-hover:border-champagne-300 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check size={12} strokeWidth={2.5} />}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Price Range */}
              <div className="pt-6">
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between pb-3 text-left"
                >
                  <span className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-cocoa-300">
                    PRICE
                  </span>
                  <span className="text-xs text-cocoa-100 font-light">
                    {openSections.price ? '—' : '+'}
                  </span>
                </button>
                {openSections.price && (
                  <div className="space-y-3 pt-2">
                    {priceOptions.map((option) => {
                      const isChecked = filterState.priceRanges.includes(option.id as PriceFilter);
                      return (
                        <label
                          key={option.id}
                          onClick={() => togglePriceRange(option.id as PriceFilter)}
                          className="flex items-center justify-between cursor-pointer group select-none py-0.5"
                        >
                          <span className="text-xs sm:text-[13px] tracking-wide text-cocoa-300 font-light group-hover:text-champagne-500 transition-colors">
                            {option.label}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-[2px] border transition-all duration-200 flex items-center justify-center ${
                              isChecked
                                ? 'bg-cocoa-300 border-cocoa-300 text-pearlIvory-50'
                                : 'border-cocoa-300/30 group-hover:border-champagne-300 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check size={12} strokeWidth={2.5} />}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Material */}
              <div className="pt-6">
                <button
                  onClick={() => toggleSection('material')}
                  className="w-full flex items-center justify-between pb-3 text-left"
                >
                  <span className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-cocoa-300">
                    MATERIAL
                  </span>
                  <span className="text-xs text-cocoa-100 font-light">
                    {openSections.material ? '—' : '+'}
                  </span>
                </button>
                {openSections.material && (
                  <div className="space-y-3 pt-2">
                    {materialOptions.map((mat) => {
                      const isChecked = filterState.materials.includes(mat as MaterialFilter);
                      return (
                        <label
                          key={mat}
                          onClick={() => toggleMaterial(mat as MaterialFilter)}
                          className="flex items-center justify-between cursor-pointer group select-none py-0.5"
                        >
                          <span className="text-xs sm:text-[13px] tracking-wide text-cocoa-300 font-light group-hover:text-champagne-500 transition-colors">
                            {mat}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-[2px] border transition-all duration-200 flex items-center justify-center ${
                              isChecked
                                ? 'bg-cocoa-300 border-cocoa-300 text-pearlIvory-50'
                                : 'border-cocoa-300/30 group-hover:border-champagne-300 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check size={12} strokeWidth={2.5} />}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. Color / Tone */}
              <div className="pt-6">
                <button
                  onClick={() => toggleSection('color')}
                  className="w-full flex items-center justify-between pb-3 text-left"
                >
                  <span className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-cocoa-300">
                    PEARL HUE & COLOR
                  </span>
                  <span className="text-xs text-cocoa-100 font-light">
                    {openSections.color ? '—' : '+'}
                  </span>
                </button>
                {openSections.color && (
                  <div className="space-y-3 pt-2">
                    {colorOptions.map((c) => {
                      const isChecked = filterState.colors.includes(c.id as ColorFilter);
                      return (
                        <label
                          key={c.id}
                          onClick={() => toggleColor(c.id as ColorFilter)}
                          className="flex items-center justify-between cursor-pointer group select-none py-0.5"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-cocoa-300/20 shadow-inner"
                              style={{ backgroundColor: c.colorHex }}
                            />
                            <span className="text-xs sm:text-[13px] tracking-wide text-cocoa-300 font-light group-hover:text-champagne-500 transition-colors">
                              {c.label}
                            </span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-[2px] border transition-all duration-200 flex items-center justify-center ${
                              isChecked
                                ? 'bg-cocoa-300 border-cocoa-300 text-pearlIvory-50'
                                : 'border-cocoa-300/30 group-hover:border-champagne-300 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check size={12} strokeWidth={2.5} />}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 6. Collection */}
              <div className="pt-6">
                <button
                  onClick={() => toggleSection('collection')}
                  className="w-full flex items-center justify-between pb-3 text-left"
                >
                  <span className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-cocoa-300">
                    COLLECTION
                  </span>
                  <span className="text-xs text-cocoa-100 font-light">
                    {openSections.collection ? '—' : '+'}
                  </span>
                </button>
                {openSections.collection && (
                  <div className="space-y-3 pt-2">
                    {collectionOptions.map((col) => {
                      const isChecked = filterState.collections.includes(col as CollectionFilter);
                      return (
                        <label
                          key={col}
                          onClick={() => toggleCollection(col as CollectionFilter)}
                          className="flex items-center justify-between cursor-pointer group select-none py-0.5"
                        >
                          <span className="text-xs sm:text-[13px] tracking-wide text-cocoa-300 font-light group-hover:text-champagne-500 transition-colors">
                            {col}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-[2px] border transition-all duration-200 flex items-center justify-center ${
                              isChecked
                                ? 'bg-cocoa-300 border-cocoa-300 text-pearlIvory-50'
                                : 'border-cocoa-300/30 group-hover:border-champagne-300 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check size={12} strokeWidth={2.5} />}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Sticky Footer */}
            <div className="p-6 border-t border-[rgba(41,35,31,0.12)] bg-[#F7F3EC] space-y-3">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-3.5 bg-cocoa-300 hover:bg-cocoa-200 text-pearlIvory-50 text-xs tracking-[0.22em] uppercase font-light transition-all duration-300 text-center"
              >
                APPLY FILTERS ({totalProductCount})
              </button>
              <button
                onClick={clearFilters}
                className="w-full py-2.5 bg-transparent text-cocoa-100 hover:text-champagne-500 text-xs tracking-[0.2em] uppercase font-light transition-colors text-center"
              >
                CLEAR ALL
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
