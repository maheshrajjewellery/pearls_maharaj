import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import ProductCard from './ProductCard';
import { useShop } from '@/context/ShopContext';

export default function ProductGrid() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { products, cmsData, isLoading } = useShop();

  const featuredCMS = cmsData?.homepage?.featuredCollections;

  if (featuredCMS && featuredCMS.active === false) return null;

  const title = featuredCMS?.title || 'New Arrivals & Signature Pieces';
  const subtitle = featuredCMS?.subtitle || 'Handcrafted creations celebrating the organic radiance of South Sea and Tahitian pearls.';

  // Pick active products for the homepage (featured or new arrivals)
  const displayProducts = products.filter((p) => p.isFeatured || p.isNewArrival).slice(0, 8);
  const finalProducts = displayProducts.length > 0 ? displayProducts : products.slice(0, 8);

  return (
    <section ref={ref} className="bg-[#FFFDF8] py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-14 border-b border-[#30372F]/08">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#C5A15A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.1em] uppercase font-medium mb-3"
          >
            SIGNATURE SELECTION
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[#30372F] text-clamp-section font-normal tracking-[0.02em]"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#30372F]/80 text-clamp-body font-sans font-normal max-w-md mx-auto mt-3 leading-[1.7]"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Product Grid: 2 Columns on Mobile/Tablet, 4 Columns on Desktop */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col space-y-3">
                <div className="w-full aspect-[3/4] bg-[#30372F]/10 animate-pulse rounded-xs" />
                <div className="h-4 w-3/4 bg-[#30372F]/10 animate-pulse rounded-xs" />
                <div className="h-3 w-1/2 bg-[#30372F]/10 animate-pulse rounded-xs" />
              </div>
            ))}
          </div>
        ) : finalProducts.length === 0 ? (
          <p className="text-center text-[#30372F]/60 font-serif italic py-8">
            No featured products available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {finalProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

