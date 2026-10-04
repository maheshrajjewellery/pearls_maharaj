import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import ProductCard from './ProductCard';
import { useShop } from '@/context/ShopContext';
import { ShopCategory } from '@/types/shop';

export default function ProductGrid() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { products, cmsData, categories, setCategory, setCurrentPage } = useShop();
  const [activeTab, setActiveTab] = useState<string>('all');

  const gridCMS = cmsData?.homepage?.discoverCategories;

  if (gridCMS && gridCMS.active === false) return null;

  const title = gridCMS?.title || 'Curated Categories & Signature Pieces';
  const subtitle =
    gridCMS?.subtitle ||
    'Explore our exquisite range of high jewellery handcrafted with rare South Sea, Akoya, and Tahitian pearls.';

  // Dynamically build category tabs from DB categories + static fallbacks
  const categoryTabs = useMemo(() => {
    const tabs: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All Categories', count: products.length },
    ];

    if (categories && categories.length > 0) {
      categories
        .filter((cat) => cat.enabled !== false)
        .forEach((cat) => {
          const targetSlug = (cat.slug || '').toLowerCase();
          const count = products.filter((p) => {
            const pCat = (p.category || '').toLowerCase();
            return (
              pCat === targetSlug ||
              pCat.includes(targetSlug) ||
              targetSlug.includes(pCat) ||
              (targetSlug.includes('bridal') && pCat.includes('bridal'))
            );
          }).length;

          tabs.push({
            id: cat.slug,
            label: cat.name,
            count,
          });
        });
    } else {
      const defaultCats = [
        { id: 'necklaces', label: 'Necklaces' },
        { id: 'earrings', label: 'Earrings' },
        { id: 'rings', label: 'Rings' },
        { id: 'bracelets', label: 'Bracelets' },
        { id: 'bangles', label: 'Bangles' },
        { id: 'bridal-jewellery', label: 'Bridal' },
      ];

      defaultCats.forEach((cat) => {
        const count = products.filter((p) =>
          (p.category || '').toLowerCase().includes(cat.id.replace('-jewellery', ''))
        ).length;
        tabs.push({ id: cat.id, label: cat.label, count });
      });
    }

    return tabs;
  }, [categories, products]);

  // Filter products by selected active category tab
  const displayedProducts = useMemo(() => {
    if (activeTab === 'all') {
      // Return top featured & new arrivals first, max 8 items
      const featured = products.filter((p) => p.isFeatured || p.isNewArrival);
      return featured.length > 0 ? featured.slice(0, 8) : products.slice(0, 8);
    }

    const target = activeTab.toLowerCase();
    const filtered = products.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      return (
        pCat === target ||
        pCat.includes(target) ||
        target.includes(pCat) ||
        (target.includes('bridal') && pCat.includes('bridal')) ||
        (target.includes('sets') && (pCat.includes('sets') || pCat.includes('combo')))
      );
    });

    return filtered.length > 0 ? filtered : products.slice(0, 4);
  }, [products, activeTab]);

  const activeTabObject = categoryTabs.find((t) => t.id === activeTab) || categoryTabs[0];

  const handleExploreCategoryInShop = () => {
    const targetCat = activeTab === 'all' ? 'all' : (activeTab as ShopCategory);
    setCategory(targetCat);
    setCurrentPage('shop');
    window.history.pushState({}, '', `/shop?category=${activeTab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="bg-[#F7F3EB] py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-14 border-b border-[#30372F]/08">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#C5A15A] text-[10.5px] sm:text-[11px] font-sans tracking-[0.15em] uppercase font-medium mb-3 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A15A]" /> EXCLUSIVE CATEGORY CURATION
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
            className="text-[#30372F]/80 text-clamp-body font-sans font-normal max-w-lg mx-auto mt-3 leading-[1.7]"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* CURATED CATEGORY TABS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar pb-4 mb-10 gap-2 sm:gap-3 border-b border-[#30372F]/10"
        >
          {categoryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 text-xs sm:text-[13px] font-sans tracking-[0.12em] uppercase transition-all duration-300 rounded whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#30372F] text-[#F7F3EC] shadow-sm font-semibold'
                    : 'bg-[#FFFDF8] text-[#30372F]/80 hover:text-[#30372F] hover:bg-[#EFEBE4] border border-[#30372F]/10'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#C5A15A] text-[#30372F] font-bold' : 'bg-[#30372F]/10 text-[#30372F]/70'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* PRODUCT GRID DISPLAY */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {displayedProducts.length === 0 ? (
              <div className="text-center text-[#30372F]/60 italic py-16 bg-[#FFFDF8] border border-[#30372F]/10 rounded">
                <p className="font-serif text-lg text-[#30372F]">No products found in this category section yet.</p>
                <p className="text-xs mt-1">Explore our other high jewellery collections below.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {displayedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* BOTTOM EXPLORE CATEGORY ACTION BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <button
            onClick={handleExploreCategoryInShop}
            className="group inline-flex items-center gap-3 bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-8 py-3.5 text-xs font-sans font-semibold tracking-[0.15em] uppercase transition-all duration-300 rounded shadow-md cursor-pointer"
          >
            <span>VIEW ALL {activeTabObject.label.toUpperCase()} IN SHOP</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

