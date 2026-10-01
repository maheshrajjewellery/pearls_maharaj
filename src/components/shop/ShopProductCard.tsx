import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { ShopProduct } from '@/types/shop';
import { useShop } from '@/context/ShopContext';

interface ShopProductCardProps {
  product: ShopProduct;
  index: number;
}

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function ShopProductCard({ product, index }: ShopProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { isWishlisted, toggleWishlist, openQuickView, addToCart } = useShop();
  const wished = isWishlisted(product.id);

  // Stagger calculation based on index within row (4 columns)
  const delay = Math.min((index % 4) * 0.08, 0.32);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, clipPath: 'inset(0 0 5% 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: luxuryEase }}
      className="group flex flex-col cursor-pointer select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openQuickView(product)}
    >
      {/* 3:4 Portrait Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory-200 rounded-[1px]">
        {/* Primary Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: hovered && product.hoverImage ? 0 : 1,
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
          loading="lazy"
        />

        {/* Hover Crossfade Image */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
            loading="lazy"
          />
        )}

        {/* Top-Left Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-2.5 py-1 bg-pearlIvory-50/90 backdrop-blur-md text-[9px] sm:text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-cocoa-300 border border-[rgba(41,35,31,0.08)]">
              {product.badge}
            </span>
          </div>
        )}

        {/* Top-Right Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-pearlIvory-50/80 backdrop-blur-md rounded-full transition-all duration-300 hover:bg-pearlIvory-50 hover:scale-105 shadow-[0_2px_10px_rgba(41,35,31,0.08)]"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${
              wished
                ? 'fill-champagne-400 text-champagne-400'
                : 'text-cocoa-300 hover:text-champagne-400'
            }`}
          />
        </button>

        {/* Hover Action Bar at Bottom of Image (Quick View & Add to Bag) */}
        <div
          className={`absolute bottom-0 inset-x-0 z-20 flex flex-col sm:flex-row border-t border-[rgba(41,35,31,0.08)] bg-pearlIvory-50/95 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase font-light text-cocoa-300 hover:bg-cocoa-300 hover:text-pearlIvory-50 transition-colors duration-200 border-b sm:border-b-0 sm:border-r border-[rgba(41,35,31,0.08)]"
          >
            <Eye size={13} strokeWidth={1.5} />
            <span>Quick View</span>
          </button>

          {/* Add to Bag Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase font-light text-cocoa-300 hover:bg-cocoa-300 hover:text-pearlIvory-50 transition-colors duration-200"
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Product Details Underneath */}
      <div className="pt-3.5 sm:pt-4 text-center sm:text-left flex flex-col">
        {/* Descriptor / Pearl Type */}
        <p className="text-[10px] sm:text-[10.5px] font-sans tracking-[0.08em] uppercase font-medium text-[#B59662] mb-1 truncate">
          {product.descriptor}
        </p>

        {/* Product Title */}
        <h3 className="font-sans text-[14px] sm:text-base font-medium text-cocoa-300 leading-snug group-hover:text-champagne-500 transition-colors duration-300 mb-1 truncate">
          {product.name}
        </h3>

        {/* Price & Compare Price */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="font-sans text-xs sm:text-[13px] font-medium text-cocoa-300 tracking-wide">
            {product.formattedPrice}
          </span>
          {product.formattedComparePrice && (
            <span className="font-sans text-[11px] sm:text-xs font-normal text-cocoa-100/50 line-through">
              {product.formattedComparePrice}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
