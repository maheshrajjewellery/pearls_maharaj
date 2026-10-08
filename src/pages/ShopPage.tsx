import ShopHero from '@/components/shop/ShopHero';
import CategoryNav from '@/components/shop/CategoryNav';
import ShopToolbar from '@/components/shop/ShopToolbar';
import ShopProductGrid from '@/components/shop/ShopProductGrid';
import FilterDrawer from '@/components/shop/FilterDrawer';
import QuickViewModal from '@/components/shop/QuickViewModal';
import PearlGuideModal from '@/components/shop/PearlGuideModal';
import CartDrawer from '@/components/shop/CartDrawer';
import SearchModal from '@/components/shop/SearchModal';
export default function ShopPage() {
  return (
    <div className="w-full bg-[#F8F5F0] min-h-screen flex flex-col">
      {/* 1. SHOP HERO */}
      <ShopHero />

      {/* 2. CATEGORY NAVIGATION */}
      <CategoryNav />

      {/* 3. FILTER + SORT TOOLBAR */}
      <ShopToolbar />

      {/* 4. PRODUCT GRID + EDITORIAL PEARL BANNER + LOAD MORE */}
      <ShopProductGrid />

      {/* Interactive Drawers */}
      <FilterDrawer />
    </div>
  );
}
