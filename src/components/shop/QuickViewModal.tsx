import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, isWishlisted, toggleWishlist } = useShop();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Reset modal state when product changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setSelectedSize(
        quickViewProduct.availableSizes && quickViewProduct.availableSizes.length > 0
          ? quickViewProduct.availableSizes[0]
          : ''
      );
      setIsAddedToast(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const wished = isWishlisted(quickViewProduct.id);
  const galleryImages = quickViewProduct.images && quickViewProduct.images.length > 0
    ? quickViewProduct.images
    : [quickViewProduct.image, quickViewProduct.hoverImage].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedSize || undefined);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
      closeQuickView();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-cocoa-300/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-pearlIvory-50 border border-[rgba(41,35,31,0.12)] shadow-[0_20px_60px_rgba(41,35,31,0.25)] overflow-hidden z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-pearlIvory-50/90 backdrop-blur-md flex items-center justify-center text-cocoa-300 hover:text-champagne-500 hover:scale-105 transition-all shadow-sm"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* LEFT: Image Gallery (6 cols) */}
            <div className="md:col-span-6 bg-ivory-200 relative flex flex-col justify-between p-6 sm:p-8">
              {/* Active Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1px] bg-ivory-300">
                <img
                  src={galleryImages[selectedImageIndex] || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />
                {quickViewProduct.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-pearlIvory-50/95 backdrop-blur-md text-[9px] font-sans font-medium tracking-[0.08em] uppercase text-cocoa-300 border border-[rgba(41,35,31,0.08)]">
                    {quickViewProduct.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails list */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto no-scrollbar">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-18 aspect-[3/4] overflow-hidden border transition-all ${
                        selectedImageIndex === idx
                          ? 'border-champagne-400 ring-1 ring-champagne-400'
                          : 'border-[rgba(41,35,31,0.15)] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Specs & Actions (6 cols) */}
            <div className="md:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-pearlIvory-50">
              <div>
                {/* Category & Collection Eyebrow */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-sans tracking-[0.08em] uppercase font-medium text-champagne-500">
                    {quickViewProduct.collection}
                  </span>
                  <span className="text-cocoa-100/40">•</span>
                  <span className="text-[10px] font-sans tracking-[0.08em] uppercase font-normal text-cocoa-100">
                    {quickViewProduct.pearlType} Pearl
                  </span>
                </div>

                {/* Product Name */}
                <h2 className="font-sans text-xl sm:text-2xl text-cocoa-300 font-medium leading-tight mb-3">
                  {quickViewProduct.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-sans text-xl sm:text-2xl font-medium text-cocoa-300 tracking-tight">
                    {quickViewProduct.formattedPrice}
                  </span>
                  {quickViewProduct.formattedComparePrice && (
                    <span className="font-sans text-sm font-normal text-cocoa-100/50 line-through">
                      {quickViewProduct.formattedComparePrice}
                    </span>
                  )}
                  <span className="text-[10px] font-sans text-cocoa-100/70 tracking-wider uppercase ml-1">
                    (Inclusive of all taxes)
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm font-sans font-normal text-cocoa-100 leading-[1.6] mb-6">
                  {quickViewProduct.shortDescription}
                </p>

                {/* Specifications List */}
                <div className="border-t border-b border-[rgba(41,35,31,0.08)] py-4 my-5 space-y-2 text-xs font-sans">
                  <div className="flex justify-between py-0.5">
                    <span className="text-cocoa-100 font-normal">Pearl Size:</span>
                    <span className="text-cocoa-300 font-medium">{quickViewProduct.specs.pearlSize}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-cocoa-100 font-normal">Luster:</span>
                    <span className="text-cocoa-300 font-medium">{quickViewProduct.specs.luster}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-cocoa-100 font-normal">Metal & Purity:</span>
                    <span className="text-cocoa-300 font-medium">{quickViewProduct.specs.metalPurity}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-cocoa-100 font-normal">Hallmark:</span>
                    <span className="text-cocoa-300 font-medium">{quickViewProduct.specs.hallmark}</span>
                  </div>
                </div>

                {/* Size Selector if available */}
                {quickViewProduct.availableSizes && quickViewProduct.availableSizes.length > 0 && (
                  <div className="mb-5">
                    <label className="block text-[11px] font-sans tracking-[0.08em] uppercase font-medium text-cocoa-300 mb-2">
                      Select Size / Length:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 text-xs font-sans font-medium tracking-wider border transition-all ${
                            selectedSize === size
                              ? 'bg-cocoa-300 text-pearlIvory-50 border-cocoa-300'
                              : 'bg-pearlIvory-100 text-cocoa-300 border-[rgba(41,35,31,0.12)] hover:border-champagne-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="flex items-center gap-4 pt-2">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[rgba(41,35,31,0.2)] bg-pearlIvory-100 h-12">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 text-cocoa-300 hover:text-champagne-500 font-normal text-base"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-sans text-cocoa-300 font-medium min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 text-cocoa-300 hover:text-champagne-500 font-normal text-base"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddedToast}
                    className="flex-1 h-12 bg-cocoa-300 hover:bg-cocoa-200 text-pearlIvory-50 text-xs font-sans tracking-[0.1em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2 px-6"
                  >
                    {isAddedToast ? (
                      <>
                        <Check size={16} className="text-champagne-300" />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} strokeWidth={1.5} />
                        <span>ADD TO BAG</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className="w-12 h-12 flex items-center justify-center border border-[rgba(41,35,31,0.2)] hover:border-champagne-400 bg-pearlIvory-100 transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.5}
                      className={
                        wished
                          ? 'fill-champagne-400 text-champagne-400'
                          : 'text-cocoa-300 hover:text-champagne-400'
                      }
                    />
                  </button>
                </div>
              </div>

              {/* Trust badges footer */}
              <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-[rgba(41,35,31,0.08)] text-[10px] text-cocoa-100/80">
                <div className="flex items-center gap-1.5">
                  <Truck size={14} className="text-champagne-400 shrink-0" />
                  <span>Insured Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-champagne-400 shrink-0" />
                  <span>100% Hallmarked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-champagne-400 shrink-0" />
                  <span>Lifetime Care</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
