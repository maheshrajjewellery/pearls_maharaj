import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateCartQuantity, removeFromCart, cartSubtotal, cartCount } = useShop();

  const formattedSubtotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cartSubtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[80] bg-cocoa-300/40 backdrop-blur-[2px]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[85] w-full sm:max-w-[420px] bg-[#F7F3EC] flex flex-col shadow-[-10px_0_40px_rgba(41,35,31,0.12)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 h-20 border-b border-[rgba(41,35,31,0.12)] bg-[#F7F3EC]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-cocoa-300" />
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-cocoa-300 tracking-wide">
                  SHOPPING BAG
                </h2>
                <span className="text-xs font-sans text-cocoa-100 tracking-widest uppercase">
                  ({cartCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-cocoa-300 hover:text-champagne-400 p-2 transition-colors duration-300"
                aria-label="Close cart"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag size={40} strokeWidth={1} className="text-cocoa-100/40 mb-4" />
                  <p className="font-serif text-xl text-cocoa-300 mb-2">Your Bag is Empty</p>
                  <p className="text-xs text-cocoa-100 font-light mb-6">
                    Discover timeless pearls crafted for modern elegance.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 bg-cocoa-300 text-pearlIvory-50 text-xs tracking-widest uppercase font-light hover:bg-cocoa-200 transition-colors"
                  >
                    EXPLORE PIECES
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize || index}`}
                    className="flex gap-4 pb-6 border-b border-[rgba(41,35,31,0.08)] last:border-b-0"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 aspect-[3/4] bg-ivory-200 overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-sans text-sm font-medium text-cocoa-300 leading-snug line-clamp-2">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-cocoa-100 hover:text-red-800 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                        {item.selectedSize && (
                          <p className="text-[11px] font-sans text-cocoa-100/80 mt-0.5">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        <p className="text-xs font-sans font-normal text-cocoa-300 mt-1">
                          {item.product.formattedPrice}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[rgba(41,35,31,0.15)] bg-pearlIvory-50 h-7">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)
                            }
                            className="px-2 text-cocoa-300 hover:text-champagne-500 text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 text-[11px] font-sans text-cocoa-300 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)
                            }
                            className="px-2 text-cocoa-300 hover:text-champagne-500 text-xs"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-sans font-medium text-cocoa-300">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          }).format(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[rgba(41,35,31,0.12)] bg-[#F7F3EC] space-y-4">
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-cocoa-100">
                    <span>Subtotal</span>
                    <span className="text-cocoa-300 font-medium">{formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-cocoa-100">
                    <span>Insured Shipping</span>
                    <span className="text-champagne-600 font-medium">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans pt-2 border-t border-[rgba(41,35,31,0.08)]">
                    <span className="text-cocoa-300 font-medium">Estimated Total</span>
                    <span className="text-cocoa-300 font-medium text-base">{formattedSubtotal}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-sans text-cocoa-100 bg-pearlIvory-200/60 p-2.5 rounded-[1px]">
                  <ShieldCheck size={14} className="text-champagne-500 shrink-0" />
                  <span>Complimentary Luxury Velvet Box & Certificate of Authenticity included.</span>
                </div>

                <button
                  onClick={() => alert('Redirecting to Maharaj Jewellery Secure Checkout...')}
                  className="w-full py-3.5 bg-cocoa-300 hover:bg-cocoa-200 text-pearlIvory-50 text-xs font-sans font-medium tracking-[0.1em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-xs font-sans font-normal tracking-[0.08em] uppercase text-cocoa-100 hover:text-champagne-500 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
