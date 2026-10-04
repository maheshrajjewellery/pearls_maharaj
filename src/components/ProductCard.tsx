import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { ShopProduct } from '@/types/shop';
import { useShop } from '@/context/ShopContext';

interface ProductCardProps {
  product: ShopProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useShop();
  const isWished = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => openQuickView(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[#EFE8D9] border border-[#30372F]/08">
        {/* Primary image */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: hovered && product.hoverImage ? 0 : 1,
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
          loading="lazy"
        />
        {/* Hover image */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
            loading="lazy"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#171310] text-[#F7F3EC] text-[9px] font-sans tracking-[0.18em] uppercase font-semibold rounded-[1px]">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-[#F7F3EB]/90 backdrop-blur-sm rounded-full hover:bg-[#F7F3EB] transition-colors duration-300 min-touch-target shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={isWished ? 'fill-[#C5A15A] text-[#C5A15A]' : 'text-[#30372F]'}
          />
        </button>

        {/* Desktop Quick Actions (Slide-up) */}
        <div
          className="hidden sm:flex absolute bottom-0 left-0 right-0 z-10 flex-col gap-px bg-[#F7F3EB] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-t border-[#30372F]/10"
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="flex items-center justify-center gap-2 py-3 text-[11px] tracking-[0.18em] uppercase font-medium text-[#30372F] hover:bg-[#30372F] hover:text-[#F7F3EB] transition-colors duration-300 min-touch-target"
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            Add To Bag
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-4 text-center flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[#C5A15A] text-[9.5px] sm:text-[10px] font-sans tracking-[0.08em] uppercase font-medium mb-1">
            {product.pearlType}
          </p>
          <h3 className="font-sans text-sm sm:text-base font-medium text-[#30372F] mb-1 group-hover:text-[#C5A15A] transition-colors duration-300">
            {product.name}
          </h3>
        </div>
        <div className="mt-1">
          <span className="text-[#30372F]/90 text-xs sm:text-sm font-sans font-medium">
            {product.formattedPrice}
          </span>
          {product.formattedComparePrice && (
            <span className="ml-2 text-[#30372F]/40 text-xs font-sans line-through">
              {product.formattedComparePrice}
            </span>
          )}
        </div>

        {/* Mobile direct Add to Bag button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="sm:hidden mt-3 w-full py-2.5 px-3 border border-[#30372F]/20 text-[#30372F] hover:bg-[#30372F] hover:text-[#F7F3EB] transition-colors text-[10px] font-sans tracking-[0.15em] uppercase font-medium rounded-[2px] min-touch-target flex items-center justify-center gap-1.5"
        >
          <ShoppingBag size={12} />
          <span>Add to Bag</span>
        </button>
      </div>
    </motion.div>
  );
}
