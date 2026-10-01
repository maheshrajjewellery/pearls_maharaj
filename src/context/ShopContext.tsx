import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShopCategory,
  PearlType,
  PriceFilter,
  MaterialFilter,
  CollectionFilter,
  ColorFilter,
  SortOption,
  ShopProduct,
  FilterState,
  CartItem,
} from '@/types/shop';
import { fetchProductsFromDb } from '@/services/productService';
import { fetchCategoriesFromDb, dbToAdminCategory } from '@/services/categoryService';
import { AdminCategory } from '@/types/admin';

interface ShopContextType {
  products: ShopProduct[];
  categories: AdminCategory[];
  filterState: FilterState;
  sortOption: SortOption;
  filteredProducts: ShopProduct[];
  totalProductCount: number;
  activeFilterCount: number;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  quickViewProduct: ShopProduct | null;
  openQuickView: (product: ShopProduct) => void;
  closeQuickView: () => void;
  isPearlGuideOpen: boolean;
  openPearlGuide: () => void;
  closePearlGuide: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setCategory: (category: ShopCategory) => void;
  togglePearlType: (pearlType: PearlType) => void;
  togglePriceRange: (priceRange: PriceFilter) => void;
  toggleMaterial: (material: MaterialFilter) => void;
  toggleCollection: (collection: CollectionFilter) => void;
  toggleColor: (color: ColorFilter) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (sort: SortOption) => void;
  clearFilters: () => void;
  clearSingleFilter: (filterKey: string, value?: string) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
  cart: CartItem[];
  addToCart: (product: ShopProduct, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  cartCount: number;
  cartSubtotal: number;
  currentPage: 'home' | 'shop' | 'about' | 'contact' | 'collections' | 'bridal' | 'education' | 'gifting' | 'login' | 'admin';
  setCurrentPage: (page: 'home' | 'shop' | 'about' | 'contact' | 'collections' | 'bridal' | 'education' | 'gifting' | 'login' | 'admin') => void;
  navigateToProduct: (product: ShopProduct) => void;
  refreshPublicData: () => Promise<void>;
  isLoading: boolean;
}

const initialFilterState: FilterState = {
  category: 'all',
  pearlTypes: [],
  priceRanges: [],
  materials: [],
  collections: [],
  colors: [],
  searchQuery: '',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dbProducts, setDbProducts] = useState<ShopProduct[]>([]);
  const [dbCategories, setDbCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Page routing state
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'about' | 'contact' | 'collections' | 'bridal' | 'education' | 'gifting' | 'login' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('admin')) return 'admin';
      if (path.includes('login')) return 'login';
      if (path.includes('gifting') || path.includes('corporate')) return 'gifting';
      if (path.includes('education')) return 'education';
      if (path.includes('contact')) return 'contact';
      if (path.includes('about')) return 'about';
      if (path.includes('shop')) return 'shop';
      if (path.includes('bridal')) return 'bridal';
      if (path.includes('collection')) return 'collections';
    }
    return 'login';
  });

  // Load active products and categories dynamically from database
  const refreshPublicData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cats, prodsData] = await Promise.all([
        fetchCategoriesFromDb(true),
        fetchProductsFromDb({ is_active: true }),
      ]);

      const prods = prodsData.products;
      const formattedCats = cats.map((c) => {
        const count = prods.filter((p) => p.category === c.slug).length;
        return dbToAdminCategory(c, count);
      });

      setDbCategories(formattedCats);
      setDbProducts(prods);
    } catch (err) {
      console.error('Error fetching public products from database:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPublicData();
  }, [refreshPublicData]);

  // Filters & Sorting state
  const [filterState, setFilterState] = useState<FilterState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category') as ShopCategory | null;
      const pearlParam = params.get('pearlType') as PearlType | null;
      const collectionParam = params.get('collection') as CollectionFilter | null;
      const searchParam = params.get('search') || '';

      return {
        ...initialFilterState,
        category: catParam || 'all',
        pearlTypes: pearlParam ? [pearlParam] : [],
        collections: collectionParam ? [collectionParam] : [],
        searchQuery: searchParam,
      };
    }
    return initialFilterState;
  });

  const [sortOption, setSortOption] = useState<SortOption>('featured');

  // Modals & Drawers state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);
  const [isPearlGuideOpen, setIsPearlGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('maharaj_wishlist');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('maharaj_cart');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maharaj_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maharaj_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Sync URL query when filters or category changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (filterState.category !== 'all') {
      params.set('category', filterState.category);
    }
    if (filterState.pearlTypes.length > 0) {
      params.set('pearlType', filterState.pearlTypes.join(','));
    }
    if (filterState.collections.length > 0) {
      params.set('collection', filterState.collections.join(','));
    }
    if (filterState.searchQuery) {
      params.set('search', filterState.searchQuery);
    }
    if (sortOption !== 'featured') {
      params.set('sort', sortOption);
    }

    const newQuery = params.toString();
    const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [filterState, sortOption]);

  // Wishlist actions
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  // Cart actions
  const addToCart = useCallback(
    (product: ShopProduct, quantity: number = 1, selectedSize?: string) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id && item.selectedSize === selectedSize
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...prev, { product, quantity, selectedSize }];
      });
      setIsCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
      )
    );
  }, []);

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number, selectedSize?: string) => {
      if (quantity <= 0) {
        removeFromCart(productId, selectedSize);
        return;
      }
      setCart((prev) =>
        prev.map((item) => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            return { ...item, quantity };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cart]
  );

  // Filter handlers
  const setCategory = useCallback((category: ShopCategory) => {
    setFilterState((prev) => ({ ...prev, category }));
  }, []);

  const togglePearlType = useCallback((pearlType: PearlType) => {
    setFilterState((prev) => ({
      ...prev,
      pearlTypes: prev.pearlTypes.includes(pearlType)
        ? prev.pearlTypes.filter((t) => t !== pearlType)
        : [...prev.pearlTypes, pearlType],
    }));
  }, []);

  const togglePriceRange = useCallback((priceRange: PriceFilter) => {
    setFilterState((prev) => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(priceRange)
        ? prev.priceRanges.filter((r) => r !== priceRange)
        : [...prev.priceRanges, priceRange],
    }));
  }, []);

  const toggleMaterial = useCallback((material: MaterialFilter) => {
    setFilterState((prev) => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material],
    }));
  }, []);

  const toggleCollection = useCallback((collection: CollectionFilter) => {
    setFilterState((prev) => ({
      ...prev,
      collections: prev.collections.includes(collection)
        ? prev.collections.filter((c) => c !== collection)
        : [...prev.collections, collection],
    }));
  }, []);

  const toggleColor = useCallback((color: ColorFilter) => {
    setFilterState((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({
      ...initialFilterState,
      category: 'all',
      searchQuery: '',
    });
  }, []);

  const clearSingleFilter = useCallback((filterKey: string, value?: string) => {
    setFilterState((prev) => {
      switch (filterKey) {
        case 'category':
          return { ...prev, category: 'all' };
        case 'pearlType':
          return {
            ...prev,
            pearlTypes: value ? prev.pearlTypes.filter((v) => v !== value) : [],
          };
        case 'priceRange':
          return {
            ...prev,
            priceRanges: value ? prev.priceRanges.filter((v) => v !== value) : [],
          };
        case 'material':
          return {
            ...prev,
            materials: value ? prev.materials.filter((v) => v !== value) : [],
          };
        case 'collection':
          return {
            ...prev,
            collections: value ? prev.collections.filter((v) => v !== value) : [],
          };
        case 'color':
          return {
            ...prev,
            colors: value ? prev.colors.filter((v) => v !== value) : [],
          };
        case 'search':
          return { ...prev, searchQuery: '' };
        default:
          return prev;
      }
    });
  }, []);

  // Filter and Sort computation on Database Products
  const filteredProducts = useMemo(() => {
    let result = [...dbProducts];

    // Category filter
    if (filterState.category !== 'all') {
      if (filterState.category === 'new-arrivals') {
        result = result.filter((p) => p.isNewArrival);
      } else {
        result = result.filter((p) => p.category === filterState.category || p.category === filterState.category.replace(/-/g, ' '));
      }
    }

    // Pearl type filter
    if (filterState.pearlTypes.length > 0) {
      result = result.filter((p) => filterState.pearlTypes.includes(p.pearlType));
    }

    // Price range filter
    if (filterState.priceRanges.length > 0) {
      result = result.filter((p) => {
        return filterState.priceRanges.some((range) => {
          if (range === 'under-10k') return p.price < 10000;
          if (range === '10k-25k') return p.price >= 10000 && p.price <= 25000;
          if (range === '25k-50k') return p.price > 25000 && p.price <= 50000;
          if (range === 'above-50k') return p.price > 50000;
          return false;
        });
      });
    }

    // Material filter
    if (filterState.materials.length > 0) {
      result = result.filter((p) => filterState.materials.includes(p.materialFilter));
    }

    // Collection filter
    if (filterState.collections.length > 0) {
      result = result.filter((p) => filterState.collections.includes(p.collection));
    }

    // Color filter
    if (filterState.colors.length > 0) {
      result = result.filter((p) => filterState.colors.includes(p.color));
    }

    // Search query filter
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.descriptor.toLowerCase().includes(q) ||
          p.pearlType.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [dbProducts, filterState, sortOption]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.category !== 'all') count += 1;
    count += filterState.pearlTypes.length;
    count += filterState.priceRanges.length;
    count += filterState.materials.length;
    count += filterState.collections.length;
    count += filterState.colors.length;
    if (filterState.searchQuery.trim()) count += 1;
    return count;
  }, [filterState]);

  // Modal actions
  const openQuickView = useCallback((product: ShopProduct) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const openPearlGuide = useCallback(() => {
    setIsPearlGuideOpen(true);
  }, []);

  const closePearlGuide = useCallback(() => {
    setIsPearlGuideOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const navigateToProduct = useCallback((product: ShopProduct) => {
    openQuickView(product);
  }, [openQuickView]);

  return (
    <ShopContext.Provider
      value={{
        products: dbProducts,
        categories: dbCategories,
        filterState,
        sortOption,
        filteredProducts,
        totalProductCount: filteredProducts.length,
        activeFilterCount,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isPearlGuideOpen,
        openPearlGuide,
        closePearlGuide,
        isSearchOpen,
        openSearch,
        closeSearch,
        isCartOpen,
        setIsCartOpen,
        setCategory,
        togglePearlType,
        togglePriceRange,
        toggleMaterial,
        toggleCollection,
        toggleColor,
        setSearchQuery,
        setSortOption,
        clearFilters,
        clearSingleFilter,
        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlist.length,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        cartCount,
        cartSubtotal,
        currentPage,
        setCurrentPage,
        navigateToProduct,
        refreshPublicData,
        isLoading,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
