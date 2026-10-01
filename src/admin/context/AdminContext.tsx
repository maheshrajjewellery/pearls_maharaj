import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AdminOrder,
  AdminCustomer,
  CorporateEnquiry,
  ContactEnquiry,
  AdminReview,
  Banner,
  NewsletterSubscriber,
  AdminCategory,
  AdminCollection,
  HomepageCMS,
  AboutCMS,
  PearlEducationCMS,
  BridalCMS,
  AdminSettings,
  AdminUser,
  ActivityLog,
} from '@/types/admin';
import { ShopProduct } from '@/types/shop';
import {
  fetchCategoriesFromDb,
  createCategoryInDb,
  updateCategoryInDb,
  deleteCategoryFromDb,
  dbToAdminCategory,
} from '@/services/categoryService';
import {
  fetchProductsFromDb,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb,
} from '@/services/productService';
import {
  initialOrders,
  initialCustomers,
  initialCorporateEnquiries,
  initialContactEnquiries,
  initialReviews,
  initialBanners,
  initialNewsletterSubscribers,
  initialCollections,
  initialHomepageCMS,
  initialAboutCMS,
  initialPearlEducationCMS,
  initialBridalCMS,
  initialSettings,
  initialActivityLogs,
} from '../data/adminMockData';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'collections'
  | 'orders'
  | 'customers'
  | 'corporate-enquiries'
  | 'corporate-orders'
  | 'homepage-cms'
  | 'about-cms'
  | 'education-cms'
  | 'bridal-cms'
  | 'contact-cms'
  | 'banners'
  | 'reviews'
  | 'newsletter'
  | 'analytics'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface ConfirmModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

interface AdminContextType {
  // Navigation & Tabs
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (group: string) => void;

  // Auth
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // Global Search
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Notification / Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Confirmation Modal
  confirmModalConfig: ConfirmModalConfig;
  requestConfirmation: (config: Omit<ConfirmModalConfig, 'isOpen'>) => void;
  closeConfirmation: () => void;

  // Data Collections
  products: ShopProduct[];
  categories: AdminCategory[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  corporateEnquiries: CorporateEnquiry[];
  contactEnquiries: ContactEnquiry[];
  reviews: AdminReview[];
  banners: Banner[];
  newsletterSubscribers: NewsletterSubscriber[];
  collections: AdminCollection[];
  homepageCMS: HomepageCMS;
  aboutCMS: AboutCMS;
  educationCMS: PearlEducationCMS;
  bridalCMS: BridalCMS;
  settings: AdminSettings;
  activityLogs: ActivityLog[];
  isLoading: boolean;

  // CRUD & Actions
  addProduct: (product: Partial<ShopProduct> & { images?: string[]; sku?: string }) => Promise<boolean>;
  updateProduct: (product: Partial<ShopProduct> & { id: string; images?: string[]; sku?: string }) => Promise<boolean>;
  deleteProduct: (id: string, softDelete?: boolean) => Promise<boolean>;
  duplicateProduct: (product: ShopProduct) => Promise<boolean>;

  addCategory: (category: { name: string; slug?: string; description?: string; image?: string; enabled?: boolean }) => Promise<boolean>;
  updateCategory: (category: { id: string; name?: string; slug?: string; description?: string; image?: string; enabled?: boolean }) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  addCollection: (collection: AdminCollection) => void;
  updateCollection: (collection: AdminCollection) => void;
  deleteCollection: (id: string) => void;

  updateOrderStatus: (orderId: string, status: AdminOrder['orderStatus'], note?: string) => void;
  updateCorporateEnquiryStatus: (id: string, status: CorporateEnquiry['status'], internalNotes?: string) => void;
  deleteCorporateEnquiry: (id: string) => void;

  updateContactEnquiryStatus: (id: string, status: ContactEnquiry['status']) => void;

  updateReviewStatus: (id: string, status: AdminReview['status']) => void;
  deleteReview: (id: string) => void;

  addBanner: (banner: Banner) => void;
  updateBanner: (banner: Banner) => void;
  deleteBanner: (id: string) => void;

  updateHomepageCMS: (cms: Partial<HomepageCMS>) => void;
  updateAboutCMS: (cms: Partial<AboutCMS>) => void;
  updateEducationCMS: (cms: Partial<PearlEducationCMS>) => void;
  updateBridalCMS: (cms: Partial<BridalCMS>) => void;

  updateSettings: (settings: Partial<AdminSettings>) => void;
  exportNewsletterCSV: () => void;
  refreshDbData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    catalogue: true,
    corporate: false,
    content: false,
    marketing: false,
  });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('maharaj_admin_session') === 'active';
    }
    return true;
  });

  const [adminUser] = useState<AdminUser | null>({
    id: 'admin-1',
    name: 'Maharaj Executive',
    email: 'admin@maharajjewellery.com',
    role: 'Super Admin',
    avatarUrl: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Confirmation Modal
  const [confirmModalConfig, setConfirmModalConfig] = useState<ConfirmModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const requestConfirmation = useCallback((config: Omit<ConfirmModalConfig, 'isOpen'>) => {
    setConfirmModalConfig({ ...config, isOpen: true });
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Database Driven Collections
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  // Other collections
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [customers] = useState<AdminCustomer[]>(initialCustomers);
  const [corporateEnquiries, setCorporateEnquiries] = useState<CorporateEnquiry[]>(initialCorporateEnquiries);
  const [contactEnquiries, setContactEnquiries] = useState<ContactEnquiry[]>(initialContactEnquiries);
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [newsletterSubscribers] = useState<NewsletterSubscriber[]>(initialNewsletterSubscribers);
  const [collections, setCollections] = useState<AdminCollection[]>(initialCollections);
  const [homepageCMS, setHomepageCMS] = useState<HomepageCMS>(initialHomepageCMS);
  const [aboutCMS, setAboutCMS] = useState<AboutCMS>(initialAboutCMS);
  const [educationCMS, setEducationCMS] = useState<PearlEducationCMS>(initialPearlEducationCMS);
  const [bridalCMS, setBridalCMS] = useState<BridalCMS>(initialBridalCMS);
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  // Load Database Categories and Products
  const refreshDbData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dbCats, dbProdsData] = await Promise.all([
        fetchCategoriesFromDb(false),
        fetchProductsFromDb({}),
      ]);

      const prods = dbProdsData.products;

      // Calculate associated items count per category
      const adminCats = dbCats.map((cat) => {
        const count = prods.filter((p) => p.category === cat.slug || (p as any).category_id === cat.id).length;
        return dbToAdminCategory(cat, count);
      });

      setCategories(adminCats);
      setProducts(prods);
    } catch (err) {
      console.error('Error fetching database products/categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDbData();
  }, [refreshDbData]);

  // Auth functions
  const login = useCallback((email: string, pass: string) => {
    if (email && pass) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('maharaj_admin_session', 'active');
      }
      addToast('Welcome back to Maharaj Jewellery Admin Panel', 'success');
      return true;
    }
    return false;
  }, [addToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('maharaj_admin_session');
    }
    addToast('Logged out successfully', 'info');
  }, [addToast]);

  const toggleGroup = useCallback((group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }, []);

  // PRODUCT DB ACTIONS
  const addProduct = useCallback(async (input: Partial<ShopProduct> & { images?: string[]; sku?: string }) => {
    try {
      // Find category_id for selected category slug
      const selectedCat = categories.find((c) => c.slug === input.category || c.id === input.category);
      const category_id = selectedCat ? (selectedCat as any).dbId || selectedCat.id : undefined;

      const created = await createProductInDb({
        name: input.name || '',
        sku: input.sku || input.specs?.hallmark || `MJ-SKU-${Date.now().toString().slice(-4)}`,
        slug: input.slug,
        category_id: category_id,
        category_slug: input.category,
        short_description: input.shortDescription,
        description: input.descriptor,
        price: input.price || 0,
        sale_price: input.comparePrice || null,
        stock_quantity: input.inStock ? 10 : 0,
        material: input.material,
        gemstone: input.pearlType,
        color: input.color,
        size: input.specs?.pearlSize,
        weight: input.specs?.weight,
        featured: input.isFeatured ?? true,
        is_active: input.inStock ?? true,
        is_new: input.isNewArrival ?? true,
        is_sale: !!(input.comparePrice && input.comparePrice > 0),
        images: input.images || (input.image ? [input.image, input.hoverImage || input.image] : []),
      });

      addToast(`Product "${created.name}" created successfully.`, 'success');
      setActivityLogs((prev) => [
        { id: Math.random().toString(), type: 'Product', title: 'Product Created', description: `Added ${created.name}`, timestamp: 'Just now', severity: 'success' },
        ...prev,
      ]);
      await refreshDbData();
      return true;
    } catch (err: any) {
      addToast(err.message || 'Failed to create product.', 'error');
      return false;
    }
  }, [categories, addToast, refreshDbData]);

  const updateProduct = useCallback(async (input: Partial<ShopProduct> & { id: string; images?: string[]; sku?: string }) => {
    try {
      const selectedCat = categories.find((c) => c.slug === input.category || c.id === input.category);
      const category_id = selectedCat ? (selectedCat as any).dbId || selectedCat.id : undefined;

      const updated = await updateProductInDb(input.id, {
        name: input.name,
        sku: input.sku || input.specs?.hallmark,
        slug: input.slug,
        category_id,
        short_description: input.shortDescription,
        description: input.descriptor,
        price: input.price,
        sale_price: input.comparePrice,
        stock_quantity: input.inStock ? 10 : 0,
        material: input.material,
        gemstone: input.pearlType,
        color: input.color,
        size: input.specs?.pearlSize,
        weight: input.specs?.weight,
        featured: input.isFeatured,
        is_active: input.inStock,
        is_new: input.isNewArrival,
        images: input.images,
      });

      addToast(`Product "${updated.name}" updated successfully.`, 'success');
      await refreshDbData();
      return true;
    } catch (err: any) {
      addToast(err.message || 'Failed to update product.', 'error');
      return false;
    }
  }, [categories, addToast, refreshDbData]);

  const deleteProduct = useCallback(async (id: string, softDelete: boolean = false) => {
    try {
      const target = products.find((p) => p.id === id);
      await deleteProductFromDb(id, softDelete);
      addToast(`Product "${target?.name || id}" ${softDelete ? 'deactivated' : 'deleted'}.`, 'info');
      await refreshDbData();
      return true;
    } catch (err: any) {
      addToast(err.message || 'Failed to delete product.', 'error');
      return false;
    }
  }, [products, addToast, refreshDbData]);

  const duplicateProduct = useCallback(async (product: ShopProduct) => {
    try {
      const rand = Math.floor(1000 + Math.random() * 9000);
      const duplicated = await createProductInDb({
        name: `${product.name} (Copy)`,
        sku: `MJ-SKU-${rand}`,
        slug: `${product.slug}-copy-${rand}`,
        category_slug: product.category,
        short_description: product.shortDescription,
        description: product.descriptor,
        price: product.price,
        sale_price: product.comparePrice || null,
        stock_quantity: product.inStock ? 10 : 0,
        material: product.material,
        gemstone: product.pearlType,
        color: product.color,
        size: product.specs?.pearlSize,
        weight: product.specs?.weight,
        featured: product.isFeatured,
        is_active: product.inStock,
        is_new: true,
        images: product.images && product.images.length > 0 ? product.images : [product.image],
      });
      addToast(`Duplicated "${product.name}" as new product "${duplicated.name}".`, 'success');
      await refreshDbData();
      return true;
    } catch (err: any) {
      addToast(err.message || 'Failed to duplicate product.', 'error');
      return false;
    }
  }, [addToast, refreshDbData]);

  // CATEGORY DB ACTIONS
  const addCategory = useCallback(async (cat: { name: string; slug?: string; description?: string; image?: string; enabled?: boolean }) => {
    try {
      const created = await createCategoryInDb({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image_url: cat.image,
        is_active: cat.enabled ?? true,
      });
      addToast(`Category "${created.name}" created in database.`, 'success');
      await refreshDbData();
      return true;
    } catch (err: any) {
      addToast(err.message || 'Failed to create category.', 'error');
      return false;
    }
  }, [addToast, refreshDbData]);

  const updateCategory = useCallback(async (cat: { id: string; name?: string; slug?: string; description?: string; image?: string; enabled?: boolean }) => {
    try {
      const updated = await updateCategoryInDb(cat.id, {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image_url: cat.image,
        is_active: cat.enabled,
      });
      addToast(`Category "${updated.name}" updated successfully.`, 'success');
      await refreshDbData();
      return true;
    } catch (err: any) {
      addToast(err.message || 'Failed to update category.', 'error');
      return false;
    }
  }, [addToast, refreshDbData]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await deleteCategoryFromDb(id);
      addToast('Category deleted successfully.', 'info');
      await refreshDbData();
      return true;
    } catch (err: any) {
      // Show explicit clear error message if products belong to category!
      addToast(err.message || 'Cannot delete category.', 'error');
      return false;
    }
  }, [addToast, refreshDbData]);

  // Collections CRUD
  const addCollection = useCallback((col: AdminCollection) => {
    setCollections((prev) => [...prev, col]);
    addToast(`Collection "${col.name}" created.`, 'success');
  }, [addToast]);

  const updateCollection = useCallback((col: AdminCollection) => {
    setCollections((prev) => prev.map((c) => (c.id === col.id ? col : c)));
    addToast(`Collection "${col.name}" updated.`, 'success');
  }, [addToast]);

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    addToast('Collection deleted.', 'info');
  }, [addToast]);

  // Orders
  const updateOrderStatus = useCallback((orderId: string, status: AdminOrder['orderStatus'], note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const updatedTimeline = [
            ...ord.timeline,
            { status, timestamp: new Date().toISOString(), note: note || `Status updated to ${status}` },
          ];
          return {
            ...ord,
            orderStatus: status,
            updatedAt: new Date().toISOString(),
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
    addToast(`Order ${orderId} status updated to ${status}.`, 'success');
  }, [addToast]);

  // Corporate Enquiries
  const updateCorporateEnquiryStatus = useCallback((id: string, status: CorporateEnquiry['status'], internalNotes?: string) => {
    setCorporateEnquiries((prev) =>
      prev.map((enq) => (enq.id === id ? { ...enq, status, ...(internalNotes !== undefined ? { internalNotes } : {}) } : enq))
    );
    addToast(`Corporate Enquiry updated to status: ${status}`, 'success');
  }, [addToast]);

  const deleteCorporateEnquiry = useCallback((id: string) => {
    setCorporateEnquiries((prev) => prev.filter((e) => e.id !== id));
    addToast('Corporate Enquiry archived/deleted.', 'info');
  }, [addToast]);

  // Contact Enquiries
  const updateContactEnquiryStatus = useCallback((id: string, status: ContactEnquiry['status']) => {
    setContactEnquiries((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    addToast(`Contact Enquiry status updated to ${status}`, 'success');
  }, [addToast]);

  // Reviews
  const updateReviewStatus = useCallback((id: string, status: AdminReview['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    addToast(`Review status changed to ${status}`, 'success');
  }, [addToast]);

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    addToast('Review deleted.', 'info');
  }, [addToast]);

  // Banners
  const addBanner = useCallback((banner: Banner) => {
    setBanners((prev) => [...prev, banner]);
    addToast('New Banner created.', 'success');
  }, [addToast]);

  const updateBanner = useCallback((banner: Banner) => {
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
    addToast('Banner updated.', 'success');
  }, [addToast]);

  const deleteBanner = useCallback((id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    addToast('Banner removed.', 'info');
  }, [addToast]);

  // CMS Updates
  const updateHomepageCMS = useCallback((cms: Partial<HomepageCMS>) => {
    setHomepageCMS((prev) => ({ ...prev, ...cms }));
    addToast('Homepage CMS updated successfully.', 'success');
  }, [addToast]);

  const updateAboutCMS = useCallback((cms: Partial<AboutCMS>) => {
    setAboutCMS((prev) => ({ ...prev, ...cms }));
    addToast('About Us CMS updated successfully.', 'success');
  }, [addToast]);

  const updateEducationCMS = useCallback((cms: Partial<PearlEducationCMS>) => {
    setEducationCMS((prev) => ({ ...prev, ...cms }));
    addToast('Pearl Education CMS updated.', 'success');
  }, [addToast]);

  const updateBridalCMS = useCallback((cms: Partial<BridalCMS>) => {
    setBridalCMS((prev) => ({ ...prev, ...cms }));
    addToast('Bridal Content CMS updated.', 'success');
  }, [addToast]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Store Settings saved successfully.', 'success');
  }, [addToast]);

  // Export Newsletter CSV
  const exportNewsletterCSV = useCallback(() => {
    const headers = ['ID', 'Email', 'Date Joined', 'Status'];
    const rows = newsletterSubscribers.map((s) => [s.id, s.email, s.dateJoined, s.status]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `maharaj_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Newsletter subscribers exported as CSV.', 'success');
  }, [newsletterSubscribers, addToast]);

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        expandedGroups,
        toggleGroup,
        isAuthenticated,
        adminUser,
        login,
        logout,
        isSearchModalOpen,
        setIsSearchModalOpen,
        toasts,
        addToast,
        removeToast,
        confirmModalConfig,
        requestConfirmation,
        closeConfirmation,
        products,
        categories,
        orders,
        customers,
        corporateEnquiries,
        contactEnquiries,
        reviews,
        banners,
        newsletterSubscribers,
        collections,
        homepageCMS,
        aboutCMS,
        educationCMS,
        bridalCMS,
        settings,
        activityLogs,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addCollection,
        updateCollection,
        deleteCollection,
        updateOrderStatus,
        updateCorporateEnquiryStatus,
        deleteCorporateEnquiry,
        updateContactEnquiryStatus,
        updateReviewStatus,
        deleteReview,
        addBanner,
        updateBanner,
        deleteBanner,
        updateHomepageCMS,
        updateAboutCMS,
        updateEducationCMS,
        updateBridalCMS,
        updateSettings,
        exportNewsletterCSV,
        refreshDbData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
