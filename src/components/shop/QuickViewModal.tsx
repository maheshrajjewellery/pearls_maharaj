import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  ShoppingBag,
  Zap,
  ExternalLink,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  Minus,
  Plus,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const DEFAULT_FALLBACK_IMAGE =
  'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    isQuickViewLoading,
    closeQuickView,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setIsCartOpen,
    setCurrentPage,
    setSearchQuery,
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll and register Escape key listener when modal opens
  useEffect(() => {
    if (quickViewProduct || isQuickViewLoading) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeQuickView();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Focus close button for accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [quickViewProduct, isQuickViewLoading, closeQuickView]);

  // Reset internal component state whenever selected product changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setIsAddedToast(false);
      setFailedImages({});
      if (quickViewProduct.availableSizes && quickViewProduct.availableSizes.length > 0) {
        setSelectedSize(quickViewProduct.availableSizes[0]);
      } else if (quickViewProduct.specs?.closure) {
        setSelectedSize(quickViewProduct.specs.closure);
      } else {
        setSelectedSize('');
      }
    }
  }, [quickViewProduct]);

  // Do not render anything if modal is closed and not loading
  if (!quickViewProduct && !isQuickViewLoading) return null;

  // Image list computation with fallbacks
  const galleryImages: string[] = quickViewProduct
    ? quickViewProduct.images && quickViewProduct.images.length > 0
      ? quickViewProduct.images
      : [quickViewProduct.image, quickViewProduct.hoverImage].filter(Boolean) as string[]
    : [];

  const currentImageSrc =
    failedImages[selectedImageIndex] || !galleryImages[selectedImageIndex]
      ? DEFAULT_FALLBACK_IMAGE
      : galleryImages[selectedImageIndex];

  // Stock status logic
  const inStock = quickViewProduct?.inStock ?? true;
  const stockQuantity = (quickViewProduct as any)?.stock_quantity ?? (inStock ? 15 : 0);

  // Discount calculation logic
  const price = quickViewProduct?.price ?? 0;
  const comparePrice = quickViewProduct?.comparePrice;
  const hasDiscount = Boolean(comparePrice && comparePrice > price);
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice! - price) / comparePrice!) * 100)
    : 0;

  // Actions handlers
  const handleAddToCart = () => {
    if (!quickViewProduct || !inStock) return;
    addToCart(quickViewProduct, quantity, selectedSize || undefined);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (!quickViewProduct || !inStock) return;
    addToCart(quickViewProduct, quantity, selectedSize || undefined);
    closeQuickView();
    setIsCartOpen(true);
  };

  const handleViewDetails = () => {
    if (!quickViewProduct) return;
    closeQuickView();
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/shop?product=${quickViewProduct.slug}`);
    }
    setSearchQuery(quickViewProduct.name);
    setCurrentPage('shop');
  };

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const wished = quickViewProduct ? isWishlisted(quickViewProduct.id) : false;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={quickViewProduct?.name || 'Product Quick View'}
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-[#171310]/65 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-[#FFFDF8] border border-[rgba(41,35,31,0.12)] shadow-[0_25px_60px_rgba(41,35,31,0.25)] rounded-[2px] overflow-hidden z-10 my-auto max-h-[90vh] sm:max-h-[85vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={closeQuickView}
            className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-pearlIvory-50/90 backdrop-blur-md flex items-center justify-center text-cocoa-300 hover:text-champagne-500 hover:scale-105 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-400"
            aria-label="Close modal"
          >
            <X size={19} strokeWidth={1.5} />
          </button>

          {/* Loading State */}
          {isQuickViewLoading && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-10 h-10 text-champagne-500 animate-spin mb-4" />
              <p className="font-serif text-lg text-cocoa-300 tracking-wide">
                Retrieving Product Details...
              </p>
              <p className="font-sans text-xs text-cocoa-100/60 mt-1">
                Fetching authentic jewellery specifications
              </p>
            </div>
          )}

          {/* Empty / Error State */}
          {!isQuickViewLoading && !quickViewProduct && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <AlertCircle className="w-12 h-12 text-champagne-500 mb-4 stroke-1" />
              <h3 className="font-serif text-xl text-cocoa-300 mb-2">
                Product Details Unavailable
              </h3>
              <p className="font-sans text-xs text-cocoa-100/70 max-w-md mb-6">
                The requested product could not be loaded at this time. Please browse our main catalogue or select another piece.
              </p>
              <button
                onClick={closeQuickView}
                className="px-6 py-2.5 bg-cocoa-300 text-pearlIvory-50 text-xs font-sans tracking-[0.15em] uppercase font-medium hover:bg-cocoa-200 transition-colors"
              >
                Close Window
              </button>
            </div>
          )}

          {/* Product Quick View Main Content */}
          {!isQuickViewLoading && quickViewProduct && (
            <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto w-full flex-1">
              {/* LEFT COLUMN: Gallery & Images (6 Cols) */}
              <div className="md:col-span-6 bg-[#F8F5F0] relative flex flex-col justify-between p-4 sm:p-6 lg:p-8 border-b md:border-b-0 md:border-r border-[rgba(41,35,31,0.08)]">
                {/* Main Product Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-ivory-200 shadow-inner group">
                  <img
                    src={currentImageSrc}
                    alt={quickViewProduct.name}
                    onError={() => handleImageError(selectedImageIndex)}
                    className="w-full h-full object-cover object-center transition-all duration-500"
                  />

                  {/* Product Badge */}
                  {quickViewProduct.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-pearlIvory-50/95 backdrop-blur-md text-[9px] font-sans font-medium tracking-[0.18em] uppercase text-cocoa-300 border border-[rgba(41,35,31,0.1)] shadow-sm">
                      {quickViewProduct.badge}
                    </span>
                  )}

                  {/* Stock Status Ribbon Badge on Image */}
                  {!inStock && (
                    <div className="absolute inset-0 bg-cocoa-300/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="px-4 py-2 bg-pearlIvory-50/95 text-cocoa-300 font-sans text-xs font-medium tracking-[0.2em] uppercase border border-[rgba(41,35,31,0.15)] shadow-md">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Multiple Images Thumbnail Strip */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-1 pt-1 no-scrollbar">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-14 h-18 aspect-[3/4] rounded-[1px] overflow-hidden border transition-all shrink-0 focus:outline-none ${
                          selectedImageIndex === idx
                            ? 'border-champagne-500 ring-2 ring-champagne-400/50 opacity-100 scale-[1.02]'
                            : 'border-[rgba(41,35,31,0.15)] opacity-70 hover:opacity-100'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img
                          src={failedImages[idx] ? DEFAULT_FALLBACK_IMAGE : img}
                          alt={`${quickViewProduct.name} thumbnail ${idx + 1}`}
                          onError={() => handleImageError(idx)}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Specs, Stock, Pricing & Actions (6 Cols) */}
              <div className="md:col-span-6 p-5 sm:p-7 lg:p-9 flex flex-col justify-between bg-[#FFFDF8]">
                <div>
                  {/* Category & Collection Eyebrow */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-sans tracking-[0.15em] uppercase font-semibold text-champagne-500">
                      {quickViewProduct.collection || 'Royal Pearls'}
                    </span>
                    <span className="text-cocoa-100/30 text-xs">•</span>
                    <span className="text-[10px] font-sans tracking-[0.12em] uppercase font-medium text-cocoa-100/80">
                      {quickViewProduct.pearlType} Pearl
                    </span>
                    {quickViewProduct.category && (
                      <>
                        <span className="text-cocoa-100/30 text-xs">•</span>
                        <span className="text-[10px] font-sans tracking-[0.12em] uppercase font-medium text-cocoa-100/60">
                          {quickViewProduct.category}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title & Wishlist Row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="font-serif text-2xl sm:text-3xl text-cocoa-300 font-medium leading-tight">
                      {quickViewProduct.name}
                    </h2>
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(41,35,31,0.15)] hover:border-champagne-400 bg-pearlIvory-50 transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-400"
                      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={17}
                        strokeWidth={1.5}
                        className={
                          wished
                            ? 'fill-champagne-400 text-champagne-400 scale-110 transition-transform'
                            : 'text-cocoa-300 hover:text-champagne-400 transition-colors'
                        }
                      />
                    </button>
                  </div>

                  {/* SKU & Availability Status Row */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap text-[11px] font-sans">
                    <span className="text-cocoa-100/60 font-mono uppercase tracking-wider">
                      SKU: {quickViewProduct.specs?.hallmark || quickViewProduct.slug.toUpperCase()}
                    </span>
                    <span className="text-cocoa-100/20">|</span>
                    {inStock ? (
                      stockQuantity <= 5 ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Only {stockQuantity} left in stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          In Stock • Ready to Ship
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded-sm border border-rose-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Currently Unavailable
                      </span>
                    )}
                  </div>

                  {/* Price Section with Discount Tag */}
                  <div className="flex items-baseline gap-3 mb-5 flex-wrap">
                    <span className="font-sans text-2xl sm:text-3xl font-semibold text-cocoa-300 tracking-tight">
                      {quickViewProduct.formattedPrice}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="font-sans text-sm sm:text-base font-normal text-cocoa-100/50 line-through">
                          {quickViewProduct.formattedComparePrice}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-sans font-semibold tracking-wider text-amber-800 bg-amber-100/80 border border-amber-200 rounded-sm uppercase">
                          SAVE {discountPercent}% OFF
                        </span>
                      </>
                    )}
                    <span className="text-[10px] font-sans text-cocoa-100/60 tracking-wider uppercase w-full sm:w-auto">
                      (Inclusive of all taxes)
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm font-sans text-cocoa-100 leading-[1.65] mb-5">
                    {quickViewProduct.shortDescription || quickViewProduct.descriptor}
                  </p>

                  {/* Specifications Grid */}
                  <div className="border-t border-b border-[rgba(41,35,31,0.08)] py-3.5 my-5 space-y-1.5 text-xs font-sans bg-[#FBF8F3] px-3.5 rounded-[1px]">
                    {quickViewProduct.specs?.pearlSize && (
                      <div className="flex justify-between py-0.5 border-b border-[rgba(41,35,31,0.04)]">
                        <span className="text-cocoa-100/80 font-normal">Pearl Size:</span>
                        <span className="text-cocoa-300 font-medium">{quickViewProduct.specs.pearlSize}</span>
                      </div>
                    )}
                    {quickViewProduct.specs?.luster && (
                      <div className="flex justify-between py-0.5 border-b border-[rgba(41,35,31,0.04)]">
                        <span className="text-cocoa-100/80 font-normal">Luster:</span>
                        <span className="text-cocoa-300 font-medium">{quickViewProduct.specs.luster}</span>
                      </div>
                    )}
                    {quickViewProduct.specs?.metalPurity && (
                      <div className="flex justify-between py-0.5 border-b border-[rgba(41,35,31,0.04)]">
                        <span className="text-cocoa-100/80 font-normal">Metal & Purity:</span>
                        <span className="text-cocoa-300 font-medium">{quickViewProduct.specs.metalPurity}</span>
                      </div>
                    )}
                    {quickViewProduct.specs?.origin && (
                      <div className="flex justify-between py-0.5">
                        <span className="text-cocoa-100/80 font-normal">Origin:</span>
                        <span className="text-cocoa-300 font-medium">{quickViewProduct.specs.origin}</span>
                      </div>
                    )}
                  </div>

                  {/* Variant / Size Selector */}
                  {quickViewProduct.availableSizes && quickViewProduct.availableSizes.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[11px] font-sans tracking-[0.1em] uppercase font-semibold text-cocoa-300">
                          Select Size / Length:
                        </label>
                        {selectedSize && (
                          <span className="text-xs font-sans text-champagne-500 font-medium">
                            Selected: {selectedSize}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quickViewProduct.availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3.5 py-1.5 text-xs font-sans font-medium tracking-wider border transition-all rounded-[1px] ${
                              selectedSize === size
                                ? 'bg-cocoa-300 text-pearlIvory-50 border-cocoa-300 shadow-sm ring-1 ring-cocoa-300'
                                : 'bg-pearlIvory-50 text-cocoa-300 border-[rgba(41,35,31,0.15)] hover:border-champagne-400 hover:bg-pearlIvory-100'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Control & Actions Row */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      {/* Quantity Selector (+ / - controls) */}
                      <div className="flex items-center border border-[rgba(41,35,31,0.2)] bg-pearlIvory-50 h-11 rounded-[1px]">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1 || !inStock}
                          className="w-10 h-full flex items-center justify-center text-cocoa-300 hover:text-champagne-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-sans text-cocoa-300 font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
                          disabled={quantity >= stockQuantity || !inStock}
                          className="w-10 h-full flex items-center justify-center text-cocoa-300 hover:text-champagne-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Add to Bag Button */}
                      <button
                        onClick={handleAddToCart}
                        disabled={!inStock || isAddedToast}
                        className="flex-1 h-11 bg-cocoa-300 hover:bg-cocoa-200 disabled:bg-cocoa-100/40 text-pearlIvory-50 text-xs font-sans tracking-[0.15em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2 px-5 rounded-[1px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-400"
                      >
                        {isAddedToast ? (
                          <>
                            <Check size={16} className="text-champagne-300" />
                            <span>ADDED TO BAG</span>
                          </>
                        ) : !inStock ? (
                          <span>OUT OF STOCK</span>
                        ) : (
                          <>
                            <ShoppingBag size={15} strokeWidth={1.5} />
                            <span>ADD TO BAG</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Secondary Actions: Buy Now & View Details */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {/* Buy Now Button */}
                      <button
                        onClick={handleBuyNow}
                        disabled={!inStock}
                        className="h-11 bg-[#C5A15A] hover:bg-[#A08250] disabled:opacity-40 text-pearlIvory-50 text-[11px] font-sans tracking-[0.15em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-1.5 px-4 rounded-[1px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-400"
                      >
                        <Zap size={14} fill="currentColor" />
                        <span>BUY NOW</span>
                      </button>

                      {/* View Details Button */}
                      <button
                        onClick={handleViewDetails}
                        className="h-11 border border-[rgba(41,35,31,0.2)] hover:border-cocoa-300 hover:bg-cocoa-300 hover:text-pearlIvory-50 text-cocoa-300 text-[11px] font-sans tracking-[0.15em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-1.5 px-4 rounded-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-400"
                      >
                        <span>VIEW DETAILS</span>
                        <ExternalLink size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trust Badges Footer */}
                <div className="grid grid-cols-3 gap-2 pt-5 mt-6 border-t border-[rgba(41,35,31,0.08)] text-[10px] font-sans text-cocoa-100/80">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <Truck size={13} className="text-champagne-500 shrink-0" />
                    <span>Insured Express Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <ShieldCheck size={13} className="text-champagne-500 shrink-0" />
                    <span>100% BIS Hallmarked</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-end">
                    <Sparkles size={13} className="text-champagne-500 shrink-0" />
                    <span>Lifetime Care Service</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
