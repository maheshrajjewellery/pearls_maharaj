import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShopCategory,
  PearlType,
  PriceFilter,
  MaterialFilter,
  CollectionFilter,
  ColorFilter,
  StoneFilter,
  SortOption,
  ShopProduct,
  FilterState,
  CartItem,
  UserProfile,
} from '@/types/shop';

export type { UserProfile };

import { fetchProductsFromDb, fetchProductBySlugFromDb } from '@/services/productService';
import { fetchCategoriesFromDb, dbToAdminCategory } from '@/services/categoryService';
import { AdminCategory } from '@/types/admin';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

import { DashboardTab, ExtendedUserProfile } from '@/types/customer';
import { AdminOrder } from '@/types/admin';
import { Coupon, validateCouponCode } from '@/services/checkoutService';
import { subscribeToOrdersRealtime, fetchOrdersFromDb } from '@/services/orderService';
import {
  fetchAllCMSData,
  AllCMSData,
  defaultContactCMS,
  defaultCorporateCMS,
  defaultFooterCMS,
} from '@/services/cmsService';
import {
  initialHomepageCMS,
  initialAboutCMS,
  initialPearlEducationCMS,
  initialBridalCMS,
} from '@/admin/data/adminMockData';

interface ShopContextType {
  user: ExtendedUserProfile | null;
  setUserProfile: (user: ExtendedUserProfile | null) => void;
  updateUserProfile: (updates: Partial<ExtendedUserProfile>) => void;
  logoutUser: () => void;
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
  isQuickViewLoading: boolean;
  openQuickView: (productOrId: ShopProduct | string) => void;
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
  toggleStone: (stone: StoneFilter) => void;
  togglePriceRange: (priceRange: PriceFilter) => void;
  toggleMaterial: (material: MaterialFilter) => void;
  toggleCollection: (collection: CollectionFilter) => void;
  toggleColor: (color: ColorFilter) => void;
  applyMegaFilter: (params: {
    category?: ShopCategory;
    pearlType?: PearlType;
    stone?: StoneFilter;
    color?: ColorFilter;
    preset?: 'bestsellers' | 'new-arrivals' | null;
  }) => void;
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
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  activeOrder: AdminOrder | null;
  setActiveOrder: (order: AdminOrder | null) => void;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCouponCode: (code: string) => { isValid: boolean; errorMessage?: string };
  removeCouponCode: () => void;
  currentPage: 'home' | 'shop' | 'about' | 'contact' | 'collections' | 'bridal' | 'education' | 'gifting' | 'login' | 'admin' | 'dashboard' | 'callback' | 'checkout' | 'checkout-success';
  setCurrentPage: (page: 'home' | 'shop' | 'about' | 'contact' | 'collections' | 'bridal' | 'education' | 'gifting' | 'login' | 'admin' | 'dashboard' | 'callback' | 'checkout' | 'checkout-success') => void;
  activeDashboardTab: DashboardTab;
  setActiveDashboardTab: (tab: DashboardTab) => void;
  navigateToProduct: (product: ShopProduct) => void;
  refreshPublicData: () => Promise<void>;
  cmsData: AllCMSData;
  refreshCMSData: () => Promise<void>;
  isLoading: boolean;
}

const initialFilterState: FilterState = {
  category: 'all',
  pearlTypes: [],
  stones: [],
  priceRanges: [],
  materials: [],
  collections: [],
  colors: [],
  searchQuery: '',
  preset: null,
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dbProducts, setDbProducts] = useState<ShopProduct[]>([]);
  const [dbCategories, setDbCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // User Profile State
  const [user, setUser] = useState<ExtendedUserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('maharaj_user');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const setUserProfile = useCallback((newUser: ExtendedUserProfile | null) => {
    setUser(newUser);
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem('maharaj_user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('maharaj_user');
      }
    }
  }, []);

  const updateUserProfile = useCallback((updates: Partial<ExtendedUserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('maharaj_user', JSON.stringify(updated));
        try {
          const registeredUsersStr = localStorage.getItem('maharaj_registered_users');
          if (registeredUsersStr) {
            let registeredUsers: ExtendedUserProfile[] = JSON.parse(registeredUsersStr);
            const idx = registeredUsers.findIndex((u) => u.email.toLowerCase() === updated.email.toLowerCase());
            if (idx >= 0) {
              registeredUsers[idx] = { ...registeredUsers[idx], ...updated };
              localStorage.setItem('maharaj_registered_users', JSON.stringify(registeredUsers));
            }
          }
        } catch {}
      }
      return updated;
    });
  }, []);

  const logoutUser = useCallback(() => {
    setUserProfile(null);
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
  }, [setUserProfile]);

  // Dashboard Tab state
  const [activeDashboardTab, setActiveDashboardTab] = useState<DashboardTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/dashboard/orders')) return 'orders';
      if (path.includes('/dashboard/wishlist')) return 'wishlist';
      if (path.includes('/dashboard/profile')) return 'profile';
      if (path.includes('/dashboard/addresses')) return 'addresses';
      if (path.includes('/dashboard/payments')) return 'payments';
      if (path.includes('/dashboard/settings')) return 'settings';
    }
    return 'overview';
  });

  // Page routing state
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'about' | 'contact' | 'collections' | 'bridal' | 'education' | 'gifting' | 'login' | 'admin' | 'dashboard' | 'callback' | 'checkout' | 'checkout-success'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('admin')) return 'admin';
      if (path.includes('callback')) return 'callback';
      if (path.includes('dashboard')) return 'dashboard';
      if (path.includes('checkout/success') || path.includes('checkout-success')) return 'checkout-success';
      if (path.includes('checkout')) return 'checkout';
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

  // Global Supabase Auth Listener for Google OAuth session processing across all pages
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let isMounted = true;

    const handleSessionUser = (sbUser: any, provider?: string) => {
      const meta = sbUser.user_metadata || {};
      let profile: ExtendedUserProfile = {
        id: sbUser.id,
        googleId: meta.sub || sbUser.id,
        name: meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'Customer',
        email: sbUser.email || '',
        avatarUrl: meta.avatar_url || meta.picture || '',
        provider: provider || sbUser.app_metadata?.provider || 'google',
      };

      try {
        const registeredUsersStr = localStorage.getItem('maharaj_registered_users');
        let registeredUsers: ExtendedUserProfile[] = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
        const existingIdx = registeredUsers.findIndex((u) => u.email.toLowerCase() === profile.email.toLowerCase());
        if (existingIdx >= 0) {
          profile = { ...registeredUsers[existingIdx], ...profile };
          registeredUsers[existingIdx] = profile;
        } else {
          registeredUsers.push(profile);
        }
        localStorage.setItem('maharaj_registered_users', JSON.stringify(registeredUsers));
      } catch {}

      setUserProfile(profile);

      // Auto-redirect customer to /dashboard on OAuth callback or login
      if (typeof window !== 'undefined' && !profile.email.toLowerCase().includes('admin')) {
        const path = window.location.pathname.toLowerCase();
        const hasAuthParams =
          window.location.hash.includes('access_token') ||
          window.location.search.includes('code');

        if (path.includes('login') || path === '/' || hasAuthParams || path.includes('dashboard')) {
          setCurrentPage('dashboard');
          window.history.replaceState({}, '', '/dashboard');
        }
      }
    };

    // Check existing session on startup
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data?.session?.user && isMounted) {
          handleSessionUser(data.session.user);
        }
      })
      .catch((err) => console.error('Error getting initial session:', err));

    // Listen to Auth State Changes
    const { data: authSubscription } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user && isMounted) {
        handleSessionUser(session.user, session.user.app_metadata?.provider);
      }
    });

    return () => {
      isMounted = false;
      authSubscription?.subscription?.unsubscribe();
    };
  }, [setUserProfile, setCurrentPage]);

  // Dynamic CMS Data State
  const [cmsData, setCmsData] = useState<AllCMSData>({
    homepage: initialHomepageCMS,
    about: initialAboutCMS,
    education: initialPearlEducationCMS,
    bridal: initialBridalCMS,
    contact: defaultContactCMS,
    corporate: defaultCorporateCMS,
    footer: defaultFooterCMS,
  });

  const refreshCMSData = useCallback(async () => {
    try {
      const cms = await fetchAllCMSData();
      setCmsData(cms);
    } catch (err) {
      console.error('Error fetching CMS data in ShopContext:', err);
    }
  }, []);

  // Load active products, categories, and CMS data dynamically from database
  const refreshPublicData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cats, prodsData, cms] = await Promise.all([
        fetchCategoriesFromDb(true),
        fetchProductsFromDb({ is_active: true }),
        fetchAllCMSData(),
      ]);

      const prods = prodsData.products;
      const formattedCats = cats.map((c) => {
        const count = prods.filter((p) => p.category === c.slug).length;
        return dbToAdminCategory(c, count);
      });

      setDbCategories(formattedCats);
      setDbProducts(prods);
      if (cms) setCmsData(cms);
    } catch (err) {
      console.error('Error fetching public products & CMS from database:', err);
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
  const [isQuickViewLoading, setIsQuickViewLoading] = useState(false);
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
    const path = window.location.pathname.toLowerCase();
    // Do NOT alter URL query string if on auth callback route or when authorization code exists
    if (path.includes('callback') || window.location.search.includes('code=') || window.location.search.includes('error=')) {
      return;
    }

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

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('maharaj_cart');
    }
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cart]
  );

  // Active Checkout Order State
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('maharaj_latest_order');
        return saved ? JSON.parse(saved) : null;
      } catch {}
    }
    return null;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeOrder) {
        localStorage.setItem('maharaj_latest_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('maharaj_latest_order');
      }
    }
  }, [activeOrder]);

  // Subscribe to Realtime DB updates for activeOrder if open
  useEffect(() => {
    if (!activeOrder?.id && !activeOrder?.orderNumber) return;

    const targetId = activeOrder.id;
    const targetNum = activeOrder.orderNumber;

    const unsubscribe = subscribeToOrdersRealtime(async () => {
      try {
        const res = await fetchOrdersFromDb({ pageSize: 1000 });
        const updated = res.orders.find(
          (o) => o.id === targetId || o.orderNumber === targetNum
        );
        if (updated) {
          console.log(`[ORDER TRACKING] Active order realtime update: ${updated.orderStatus}`);
          setActiveOrder(updated);
        }
      } catch (err) {
        console.warn('Realtime active order sync error:', err);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [activeOrder?.id, activeOrder?.orderNumber]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const res = validateCouponCode(appliedCoupon.code, cartSubtotal);
    return res.isValid ? res.discountAmount : 0;
  }, [appliedCoupon, cartSubtotal]);

  const applyCouponCode = useCallback(
    (code: string) => {
      const res = validateCouponCode(code, cartSubtotal);
      if (res.isValid && res.coupon) {
        setAppliedCoupon(res.coupon);
        return { isValid: true };
      } else {
        setAppliedCoupon(null);
        return { isValid: false, errorMessage: res.errorMessage || 'Invalid coupon code.' };
      }
    },
    [cartSubtotal]
  );

  const removeCouponCode = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Filter handlers
  const setCategory = useCallback((category: ShopCategory) => {
    setFilterState((prev) => ({ ...prev, category }));
  }, []);

  const togglePearlType = useCallback((pearlType: PearlType) => {
    if (pearlType === 'All Types') {
      setFilterState((prev) => ({ ...prev, pearlTypes: [] }));
      return;
    }
    setFilterState((prev) => ({
      ...prev,
      pearlTypes: prev.pearlTypes.includes(pearlType)
        ? prev.pearlTypes.filter((t) => t !== pearlType)
        : [...prev.pearlTypes, pearlType],
    }));
  }, []);

  const toggleStone = useCallback((stone: StoneFilter) => {
    setFilterState((prev) => ({
      ...prev,
      stones: prev.stones.includes(stone)
        ? prev.stones.filter((s) => s !== stone)
        : [...prev.stones, stone],
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

  const applyMegaFilter = useCallback((params: {
    category?: ShopCategory;
    pearlType?: PearlType;
    stone?: StoneFilter;
    color?: ColorFilter;
    preset?: 'bestsellers' | 'new-arrivals' | null;
  }) => {
    setFilterState({
      ...initialFilterState,
      category: params.category || 'all',
      pearlTypes: params.pearlType && params.pearlType !== 'All Types' ? [params.pearlType] : [],
      stones: params.stone ? [params.stone] : [],
      colors: params.color ? [params.color] : [],
      preset: params.preset || null,
    });
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
        case 'stone':
          return {
            ...prev,
            stones: value ? prev.stones.filter((v) => v !== value) : [],
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
        case 'preset':
          return { ...prev, preset: null };
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

    // Presets from Mega Menu
    if (filterState.preset === 'bestsellers') {
      result = result.filter((p) => p.badge === 'BESTSELLER' || p.isFeatured);
    } else if (filterState.preset === 'new-arrivals') {
      result = result.filter((p) => p.isNewArrival || p.badge === 'NEW');
    }

    // Category filter
    if (filterState.category !== 'all') {
      if (filterState.category === 'new-arrivals') {
        result = result.filter((p) => p.isNewArrival);
      } else if (filterState.category === 'bestsellers') {
        result = result.filter((p) => p.badge === 'BESTSELLER' || p.isFeatured);
      } else {
        result = result.filter((p) => {
          const cat = p.category.toLowerCase().replace(/\s+/g, '-');
          const target = filterState.category.toLowerCase();
          return cat === target || p.category === filterState.category;
        });
      }
    }

    // Pearl type filter
    if (filterState.pearlTypes.length > 0) {
      result = result.filter((p) => filterState.pearlTypes.includes(p.pearlType));
    }

    // Stone filter
    if (filterState.stones.length > 0) {
      result = result.filter((p) => {
        if (p.stone && filterState.stones.includes(p.stone)) return true;
        const text = `${p.material} ${p.descriptor} ${p.shortDescription} ${p.name}`.toLowerCase();
        return filterState.stones.some((st) => text.includes(st.toLowerCase()));
      });
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
      result = result.filter((p) => {
        if (filterState.colors.includes(p.color)) return true;
        const pColor = p.color.toLowerCase();
        return filterState.colors.some((c) => {
          const cLow = c.toLowerCase();
          if (cLow === 'white' && pColor.includes('white')) return true;
          if (cLow === 'black' && (pColor.includes('black') || pColor.includes('peacock'))) return true;
          if (cLow === 'grey' && (pColor.includes('grey') || pColor.includes('silver'))) return true;
          if (cLow === 'golden' && (pColor.includes('gold') || pColor.includes('champagne'))) return true;
          if ((cLow === 'pink / peach' || cLow === 'pink' || cLow === 'peach') && (pColor.includes('pink') || pColor.includes('rose') || pColor.includes('blush') || pColor.includes('peach'))) return true;
          if (cLow === 'multi-color' && (pColor.includes('multi') || pColor.includes('mix'))) return true;
          return false;
        });
      });
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
    if (filterState.preset) count += 1;
    count += filterState.pearlTypes.length;
    count += filterState.stones.length;
    count += filterState.priceRanges.length;
    count += filterState.materials.length;
    count += filterState.collections.length;
    count += filterState.colors.length;
    if (filterState.searchQuery.trim()) count += 1;
    return count;
  }, [filterState]);

  // Modal actions
  const openQuickView = useCallback(async (productOrId: ShopProduct | string) => {
    if (typeof productOrId === 'string') {
      setIsQuickViewLoading(true);
      const found = dbProducts.find((p) => p.id === productOrId || p.slug === productOrId);
      if (found) {
        setQuickViewProduct(found);
        setIsQuickViewLoading(false);
      } else {
        try {
          const fetched = await fetchProductBySlugFromDb(productOrId);
          setQuickViewProduct(fetched);
        } catch (err) {
          console.error('Error fetching quick view product by slug/id:', err);
          setQuickViewProduct(null);
        } finally {
          setIsQuickViewLoading(false);
        }
      }
    } else {
      setQuickViewProduct(productOrId);
      setIsQuickViewLoading(false);
    }
  }, [dbProducts]);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
    setIsQuickViewLoading(false);
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
        user,
        setUserProfile,
        updateUserProfile,
        logoutUser,
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
        isQuickViewLoading,
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
        toggleStone,
        togglePriceRange,
        toggleMaterial,
        toggleCollection,
        toggleColor,
        applyMegaFilter,
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
        clearCart,
        cartCount,
        cartSubtotal,
        activeOrder,
        setActiveOrder,
        appliedCoupon,
        couponDiscount,
        applyCouponCode,
        removeCouponCode,
        currentPage,
        setCurrentPage,
        activeDashboardTab,
        setActiveDashboardTab,
        navigateToProduct,
        refreshPublicData,
        cmsData,
        refreshCMSData,
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
