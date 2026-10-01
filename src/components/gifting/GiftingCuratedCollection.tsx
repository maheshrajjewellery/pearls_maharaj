import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { curatedGiftingCollection, CuratedGiftingItem } from '@/data/giftingData';
import { useShop } from '@/context/ShopContext';
import { Eye, ArrowRight } from 'lucide-react';

import { PearlType, CollectionFilter } from '@/types/shop';

interface GiftingCuratedCollectionProps {
  onEnquireProduct?: (productName: string) => void;
}

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'earrings', label: 'Pearl Earrings' },
  { id: 'bracelets', label: 'Pearl Bracelets' },
  { id: 'pendants', label: 'Pearl Pendants' },
  { id: 'necklaces', label: 'Pearl Necklaces' },
  { id: 'sets', label: 'Jewellery Sets' },
];

export default function GiftingCuratedCollection({ onEnquireProduct }: GiftingCuratedCollectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const { openQuickView } = useShop();

  const filteredItems =
    activeCategory === 'all'
      ? curatedGiftingCollection
      : curatedGiftingCollection.filter((item) => item.category === activeCategory);

  const handleQuickView = (item: CuratedGiftingItem) => {
    // Map item to shop product interface to open standard modal
    const validPearlType: PearlType =
      item.specs.pearlType.includes('Akoya')
        ? 'Akoya'
        : item.specs.pearlType.includes('South Sea')
        ? 'South Sea'
        : 'Freshwater';

    openQuickView({
      id: item.id,
      name: item.name,
      slug: item.id,
      price: parseInt(item.price.replace(/[^\d]/g, ''), 10) || 50000,
      formattedPrice: item.price,
      category: 'necklaces',
      pearlType: validPearlType,
      material: item.specs.material,
      materialFilter: 'Gold',
      collection: 'Royal Pearls' as CollectionFilter,
      color: 'White',
      priceRange: 'above-50k',
      image: item.image,
      hoverImage: item.hoverImage,
      images: [item.image, item.hoverImage],
      descriptor: `${item.specs.pearlType} • ${item.specs.material}`,
      shortDescription: item.description,
      specs: {
        pearlSize: '8.0 - 12.0 mm',
        luster: 'AAA High Mirror Luster',
        metalPurity: item.specs.material,
        hallmark: 'BIS Hallmarked 750 Gold',
        origin: 'Curated Waters',
        closure: 'Bespoke Clasp',
        weight: '12-40 grams',
      },
      isNewArrival: false,
      isFeatured: true,
      rating: 5.0,
      reviewsCount: 18,
      inStock: true,
      createdAt: '2026-01-01',
    });
  };

  return (
    <section
      id="curated-collection"
      ref={ref}
      className="w-full bg-[#FFFDF8] py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-b border-[rgba(41,35,31,0.08)] overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="w-6 h-px bg-[#C8A96B]" />
            <span className="text-[11px] lg:text-[12px] tracking-[0.3em] font-medium uppercase text-[#B8A99A]">
              CURATED GIFTING COLLECTION
            </span>
            <span className="w-6 h-px bg-[#C8A96B]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight mb-4"
          >
            CURATED FOR YOUR OCCASION
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#29231F]/70 text-base font-light"
          >
            Explore our signature pearl creations crafted specifically for executive corporate gifting.
          </motion.p>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 mb-14">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-[#29231F]'
                    : 'text-[#B8A99A] hover:text-[#29231F]'
                }`}
              >
                {cat.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabGifting"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A96B]"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* SPACIOUS EDITORIAL PRODUCT SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {filteredItems.map((item, index) => {
            const isHovered = hoveredProductId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredProductId(item.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                className="group flex flex-col bg-[#F7F3EC]/50 border border-[rgba(41,35,31,0.08)] p-6 transition-all duration-500 hover:shadow-[0_15px_45px_rgba(41,35,31,0.06)]"
              >
                {/* 3:4 Portrait Image Container */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F7F3EC] mb-6 rounded-xs">
                  {/* Base Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isHovered && item.hoverImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                    }`}
                  />

                  {/* Hover Image Reveal */}
                  {item.hoverImage && (
                    <img
                      src={item.hoverImage}
                      alt={`${item.name} Detail`}
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                      }`}
                    />
                  )}

                  {/* Champagne-gold detail line across top of image on hover */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-[#C8A96B] transition-all duration-500 ${
                      isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />

                  {/* Floating Action Button */}
                  <button
                    onClick={() => handleQuickView(item)}
                    className={`absolute bottom-4 right-4 p-3 bg-[#FFFDF8]/90 text-[#29231F] rounded-full shadow-md transition-all duration-300 hover:bg-[#29231F] hover:text-[#FFFDF8] ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    title="Quick View Details"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                {/* Info Container */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-[#B8A99A]">
                        {item.categoryLabel}
                      </span>
                      <span className="text-xs font-serif font-medium text-[#C8A96B]">
                        {item.price}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#29231F] font-normal leading-tight mb-2 group-hover:text-[#C8A96B] transition-colors duration-300">
                      {item.name}
                    </h3>

                    <p className="text-[#29231F]/70 text-xs sm:text-sm font-light leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Link & Subtle Gold Line */}
                  <div>
                    <div className="w-full h-px bg-[rgba(41,35,31,0.12)] mb-4 relative overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 bg-[#C8A96B] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isHovered ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleQuickView(item)}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#29231F] group-hover:text-[#C8A96B] transition-colors duration-300"
                      >
                        <span>VIEW COLLECTION</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>

                      {onEnquireProduct && (
                        <button
                          onClick={() => onEnquireProduct(item.name)}
                          className="text-[11px] uppercase tracking-[0.15em] text-[#B8A99A] hover:text-[#29231F] underline underline-offset-4"
                        >
                          Enquire
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
