import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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
} from "@/types/admin";
import { ShopProduct } from "@/types/shop";
import {
  fetchCategoriesFromDb,
  createCategoryInDb,
  updateCategoryInDb,
  deleteCategoryFromDb,
  dbToAdminCategory,
} from "@/services/categoryService";
import {
  fetchProductsFromDb,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb,
  deleteAllProductsFromDb,
} from "@/services/productService";
import {
  fetchCollectionsFromDb,
  createCollectionInDb,
  updateCollectionInDb,
  deleteCollectionFromDb,
} from "@/services/collectionService";
import {
  fetchOrdersFromDb,
  updateOrderStatusInDb,
  cancelOrderInDb,
  refundOrderInDb,
  subscribeToOrdersRealtime,
} from "@/services/orderService";
import {
  fetchCustomersFromDb,
  updateCustomerStatusInDb,
  subscribeToCustomersRealtime,
} from "@/services/customerService";
import {
  fetchAllCMSData,
  updateCMSContent,
  ContactCMS,
  CorporateCMS,
  FooterCMS,
  defaultContactCMS,
  defaultCorporateCMS,
  defaultFooterCMS,
} from "@/services/cmsService";
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
} from "../data/adminMockData";

export type AdminTab =
  | "dashboard"
  | "products"
  | "categories"
  | "collections"
  | "orders"
  | "customers"
  | "corporate-enquiries"
  | "corporate-orders"
  | "homepage-cms"
  | "about-cms"
  | "education-cms"
  | "bridal-cms"
  | "contact-cms"
  | "reviews"
  | "analytics"
  | "settings";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
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
  isAuthChecking: boolean;
  adminUser: AdminUser | null;
  login: (
    email: string,
    pass: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  verifyServerSession: () => Promise<boolean>;

  // Global Search
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Notification / Toast
  toasts: ToastMessage[];
  addToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
  ) => void;
  removeToast: (id: string) => void;

  // Confirmation Modal
  confirmModalConfig: ConfirmModalConfig;
  requestConfirmation: (config: Omit<ConfirmModalConfig, "isOpen">) => void;
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
  contactCMS: ContactCMS;
  corporateCMS: CorporateCMS;
  footerCMS: FooterCMS;
  settings: AdminSettings;
  activityLogs: ActivityLog[];
  isLoading: boolean;

  // CRUD & Actions
  addProduct: (
    product: Partial<ShopProduct> & { images?: string[]; sku?: string },
  ) => Promise<boolean>;
  updateProduct: (
    product: Partial<ShopProduct> & {
      id: string;
      images?: string[];
      sku?: string;
    },
  ) => Promise<boolean>;
  deleteProduct: (id: string, softDelete?: boolean) => Promise<boolean>;
  deleteAllProducts: () => Promise<boolean>;
  duplicateProduct: (product: ShopProduct) => Promise<boolean>;

  addCategory: (category: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    enabled?: boolean;
    displayOrder?: number;
  }) => Promise<boolean>;
  updateCategory: (category: {
    id: string;
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    enabled?: boolean;
    displayOrder?: number;
  }) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  productCategoryFilter: string;
  setProductCategoryFilter: (slug: string) => void;

  addCollection: (collection: AdminCollection) => Promise<boolean>;
  updateCollection: (collection: AdminCollection) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;

  updateOrderStatus: (
    orderId: string,
    status: AdminOrder["orderStatus"],
    note?: string,
  ) => Promise<boolean>;
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>;
  refundOrder: (orderId: string, reason?: string) => Promise<boolean>;
  refreshOrders: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  updateCustomerStatus: (
    email: string,
    status: "Active" | "Inactive",
  ) => Promise<boolean>;
  updateCorporateEnquiryStatus: (
    id: string,
    status: CorporateEnquiry["status"],
    internalNotes?: string,
  ) => void;
  deleteCorporateEnquiry: (id: string) => void;

  updateContactEnquiryStatus: (
    id: string,
    status: ContactEnquiry["status"],
  ) => void;

  updateReviewStatus: (id: string, status: AdminReview["status"]) => void;
  deleteReview: (id: string) => void;

  addBanner: (banner: Banner) => void;
  updateBanner: (banner: Banner) => void;
  deleteBanner: (id: string) => void;

  updateHomepageCMS: (cms: Partial<HomepageCMS>) => void;
  updateAboutCMS: (cms: Partial<AboutCMS>) => void;
  updateEducationCMS: (cms: Partial<PearlEducationCMS>) => void;
  updateBridalCMS: (cms: Partial<BridalCMS>) => void;
  updateContactCMS: (cms: Partial<ContactCMS>) => void;
  updateCorporateCMS: (cms: Partial<CorporateCMS>) => void;
  updateFooterCMS: (cms: Partial<FooterCMS>) => void;

  updateSettings: (settings: Partial<AdminSettings>) => void;
  exportNewsletterCSV: () => void;
  refreshDbData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [productCategoryFilter, setProductCategoryFilter] =
    useState<string>("all");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      catalogue: true,
      corporate: false,
      content: false,
    },
  );

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "success",
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Confirmation Modal
  const [confirmModalConfig, setConfirmModalConfig] =
    useState<ConfirmModalConfig>({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
    });

  const requestConfirmation = useCallback(
    (config: Omit<ConfirmModalConfig, "isOpen">) => {
      setConfirmModalConfig({ ...config, isOpen: true });
    },
    [],
  );

  const closeConfirmation = useCallback(() => {
    setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Database Driven Collections
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  // Other collections
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [customers, setCustomers] = useState<AdminCustomer[]>(initialCustomers);
  const [corporateEnquiries, setCorporateEnquiries] = useState<
    CorporateEnquiry[]
  >(initialCorporateEnquiries);
  const [contactEnquiries, setContactEnquiries] = useState<ContactEnquiry[]>(
    initialContactEnquiries,
  );
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [newsletterSubscribers] = useState<NewsletterSubscriber[]>(
    initialNewsletterSubscribers,
  );
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [homepageCMS, setHomepageCMS] =
    useState<HomepageCMS>(initialHomepageCMS);
  const [aboutCMS, setAboutCMS] = useState<AboutCMS>(initialAboutCMS);
  const [educationCMS, setEducationCMS] = useState<PearlEducationCMS>(
    initialPearlEducationCMS,
  );
  const [bridalCMS, setBridalCMS] = useState<BridalCMS>(initialBridalCMS);
  const [contactCMS, setContactCMS] = useState<ContactCMS>(defaultContactCMS);
  const [corporateCMS, setCorporateCMS] =
    useState<CorporateCMS>(defaultCorporateCMS);
  const [footerCMS, setFooterCMS] = useState<FooterCMS>(defaultFooterCMS);
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [activityLogs, setActivityLogs] =
    useState<ActivityLog[]>(initialActivityLogs);

  // Load Database Categories, Products, Orders, and Customers
  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetchOrdersFromDb({ pageSize: 1000 });
      setOrders(res.orders);
    } catch (err) {
      console.error("Error fetching database orders:", err);
    }
  }, []);

  const refreshCustomers = useCallback(async () => {
    try {
      const res = await fetchCustomersFromDb({ pageSize: 1000 });
      setCustomers(res.customers);
    } catch (err) {
      console.error("Error fetching database customers:", err);
    }
  }, []);

  const updateCustomerStatus = useCallback(
    async (email: string, status: "Active" | "Inactive") => {
      const res = await updateCustomerStatusInDb(email, status);
      if (res.success) {
        addToast(
          `Customer account (${email}) status updated to ${status}.`,
          "success",
        );
        await refreshCustomers();
        return true;
      } else {
        addToast(
          res.errorMessage || "Failed to update customer status.",
          "error",
        );
        return false;
      }
    },
    [addToast, refreshCustomers],
  );

  const refreshDbData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dbCats, dbProdsData, dbCols, ordersRes, custRes, cmsData] =
        await Promise.all([
          fetchCategoriesFromDb(false),
          fetchProductsFromDb({}),
          fetchCollectionsFromDb(),
          fetchOrdersFromDb({ pageSize: 1000 }),
          fetchCustomersFromDb({ pageSize: 1000 }),
          fetchAllCMSData(),
        ]);

      const prods = dbProdsData.products;

      // Calculate associated items count per category
      const adminCats = dbCats.map((cat) => {
        const count = prods.filter(
          (p) => p.category === cat.slug || (p as any).category_id === cat.id,
        ).length;
        return dbToAdminCategory(cat, count);
      });

      setCategories(adminCats);
      setProducts(prods);
      setCollections(dbCols);
      setOrders(ordersRes.orders);
      setCustomers(custRes.customers);

      // CMS State Update
      if (cmsData) {
        if (cmsData.homepage) setHomepageCMS(cmsData.homepage);
        if (cmsData.about) setAboutCMS(cmsData.about);
        if (cmsData.education) setEducationCMS(cmsData.education);
        if (cmsData.bridal) setBridalCMS(cmsData.bridal);
        if (cmsData.contact) setContactCMS(cmsData.contact);
        if (cmsData.corporate) setCorporateCMS(cmsData.corporate);
        if (cmsData.footer) setFooterCMS(cmsData.footer);
      }
    } catch (err) {
      console.error(
        "Error fetching database products/categories/collections/orders/customers/CMS:",
        err,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDbData();

    // Subscribe to realtime orders & customers updates
    const unsubOrders = subscribeToOrdersRealtime(() => {
      refreshOrders();
      refreshCustomers();
    });

    const unsubCustomers = subscribeToCustomersRealtime(() => {
      refreshCustomers();
      refreshOrders();
    });

    return () => {
      unsubOrders();
      unsubCustomers();
    };
  }, [refreshDbData, refreshOrders, refreshCustomers]);

  // Server-side & Fallback Auth Verification
  const verifyServerSession = useCallback(async (): Promise<boolean> => {
    setIsAuthChecking(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("MAHESHRAJ_admin_token")
          : null;
      const sessionActive =
        typeof window !== "undefined"
          ? localStorage.getItem("MAHESHRAJ_admin_session") === "active"
          : false;

      if (token || sessionActive) {
        try {
          const headers: Record<string, string> = {};
          if (token) headers["Authorization"] = `Bearer ${token}`;

          const res = await fetch("/api/admin/verify", {
            method: "GET",
            headers,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setIsAuthenticated(true);
              setAdminUser({
                id: data.user.id || "admin-1",
                name: data.user.name || "MAHESHRAJ Executive",
                email: data.user.email || "maheshtadakalle@gmail.com",
                role: "Super Admin",
                avatarUrl:
                  "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=150",
              });
              setIsAuthChecking(false);
              return true;
            }
          }
        } catch {}

        // Active local admin session retention
        if (sessionActive || (token && token.length > 10)) {
          const savedEmail =
            (typeof window !== "undefined"
              ? localStorage.getItem("MAHESHRAJ_admin_email")
              : null) || "maheshtadakalle@gmail.com";
          setIsAuthenticated(true);
          setAdminUser({
            id: "admin-1",
            name: "MAHESHRAJ Executive",
            email: savedEmail,
            role: "Super Admin",
            avatarUrl:
              "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=150",
          });
          setIsAuthChecking(false);
          return true;
        }
      }
    } catch (err) {
      console.error("[ADMIN AUTH] Server session verification error:", err);
    }

    setIsAuthenticated(false);
    setAdminUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("MAHESHRAJ_admin_token");
      localStorage.removeItem("MAHESHRAJ_admin_session");
      localStorage.removeItem("MAHESHRAJ_admin_email");
    }
    setIsAuthChecking(false);
    return false;
  }, []);

  useEffect(() => {
    verifyServerSession();
  }, [verifyServerSession]);

  // Auth functions
  const login = useCallback(
    async (
      email: string,
      pass: string,
    ): Promise<{ success: boolean; error?: string }> => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = pass.trim();

      const isEmailValid = cleanEmail === "maheshtadakalle@gmail.com";

      const isPassValid =
        cleanPass === "MAHESHRAJAdmin#2026!" || cleanPass === "MAHESHRAJ123";

      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.token) {
            setIsAuthenticated(true);
            setAdminUser({
              id: data.user.id || "admin-1",
              name: data.user.name || "MAHESHRAJ Executive",
              email: data.user.email || cleanEmail,
              role: "Super Admin",
              avatarUrl:
                "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=150",
            });
            if (typeof window !== "undefined") {
              localStorage.setItem("MAHESHRAJ_admin_token", data.token);
              localStorage.setItem("MAHESHRAJ_admin_session", "active");
              localStorage.setItem(
                "MAHESHRAJ_admin_email",
                data.user.email || cleanEmail,
              );
            }
            addToast(
              "Welcome back to MAHESHRAJ Jewellery Admin Panel",
              "success",
            );
            return { success: true };
          }
        } else if (res.status === 401) {
          setIsAuthenticated(false);
          setAdminUser(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("MAHESHRAJ_admin_token");
            localStorage.removeItem("MAHESHRAJ_admin_session");
            localStorage.removeItem("MAHESHRAJ_admin_email");
          }
          return { success: false, error: "Invalid credentials." };
        }
      } catch (err) {
        console.warn("[ADMIN AUTH] API login endpoint fallback check:", err);
      }

      // Check credentials against authorized admin account (static / network fallback)
      if (isEmailValid && isPassValid) {
        const fallbackToken = `admin_session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        setIsAuthenticated(true);
        setAdminUser({
          id: "admin-1",
          name: "MAHESHRAJ Executive",
          email: cleanEmail,
          role: "Super Admin",
          avatarUrl:
            "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=150",
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("MAHESHRAJ_admin_token", fallbackToken);
          localStorage.setItem("MAHESHRAJ_admin_session", "active");
          localStorage.setItem("MAHESHRAJ_admin_email", cleanEmail);
        }
        addToast("Welcome back to MAHESHRAJ Jewellery Admin Panel", "success");
        return { success: true };
      }

      setIsAuthenticated(false);
      setAdminUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("MAHESHRAJ_admin_token");
        localStorage.removeItem("MAHESHRAJ_admin_session");
        localStorage.removeItem("MAHESHRAJ_admin_email");
      }
      return { success: false, error: "Invalid credentials." };
    },
    [addToast],
  );

  const logout = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("MAHESHRAJ_admin_token")
          : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      await fetch("/api/admin/logout", {
        method: "POST",
        headers,
      });
    } catch (err) {
      console.error("[ADMIN AUTH] Logout error:", err);
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("MAHESHRAJ_admin_token");
        localStorage.removeItem("MAHESHRAJ_admin_session");
      }
      addToast("Logged out successfully", "info");
    }
  }, [addToast]);

  const toggleGroup = useCallback((group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }, []);

  // PRODUCT DB ACTIONS
  const addProduct = useCallback(
    async (
      input: Partial<ShopProduct> & { images?: string[]; sku?: string },
    ) => {
      try {
        // Find category_id for selected category slug
        const selectedCat = categories.find(
          (c) => c.slug === input.category || c.id === input.category,
        );
        const category_id = selectedCat
          ? (selectedCat as any).dbId || selectedCat.id
          : undefined;

        const created = await createProductInDb({
          name: input.name || "",
          sku:
            input.sku ||
            input.specs?.hallmark ||
            `MJ-SKU-${Date.now().toString().slice(-4)}`,
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
          images:
            input.images ||
            (input.image ? [input.image, input.hoverImage || input.image] : []),
        });

        addToast(`Product "${created.name}" created successfully.`, "success");
        setActivityLogs((prev) => [
          {
            id: Math.random().toString(),
            type: "Product",
            title: "Product Created",
            description: `Added ${created.name}`,
            timestamp: "Just now",
            severity: "success",
          },
          ...prev,
        ]);
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to create product.", "error");
        return false;
      }
    },
    [categories, addToast, refreshDbData],
  );

  const updateProduct = useCallback(
    async (
      input: Partial<ShopProduct> & {
        id: string;
        images?: string[];
        sku?: string;
      },
    ) => {
      try {
        const selectedCat = categories.find(
          (c) => c.slug === input.category || c.id === input.category,
        );
        const category_id = selectedCat
          ? (selectedCat as any).dbId || selectedCat.id
          : undefined;

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

        addToast(`Product "${updated.name}" updated successfully.`, "success");
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to update product.", "error");
        return false;
      }
    },
    [categories, addToast, refreshDbData],
  );

  const deleteProduct = useCallback(
    async (id: string, softDelete: boolean = false) => {
      try {
        const target = products.find((p) => p.id === id);
        await deleteProductFromDb(id, softDelete);
        addToast(
          `Product "${target?.name || id}" ${softDelete ? "deactivated" : "deleted"}.`,
          "info",
        );
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to delete product.", "error");
        return false;
      }
    },
    [products, addToast, refreshDbData],
  );

  const deleteAllProducts = useCallback(async () => {
    try {
      await deleteAllProductsFromDb();
      addToast("All products removed from database.", "info");
      await refreshDbData();
      return true;
    } catch (err: any) {
      addToast(err.message || "Failed to remove all products.", "error");
      return false;
    }
  }, [addToast, refreshDbData]);

  const duplicateProduct = useCallback(
    async (product: ShopProduct) => {
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
          images:
            product.images && product.images.length > 0
              ? product.images
              : [product.image],
        });
        addToast(
          `Duplicated "${product.name}" as new product "${duplicated.name}".`,
          "success",
        );
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to duplicate product.", "error");
        return false;
      }
    },
    [addToast, refreshDbData],
  );

  // CATEGORY DB ACTIONS
  const addCategory = useCallback(
    async (cat: {
      name: string;
      slug?: string;
      description?: string;
      image?: string;
      enabled?: boolean;
      displayOrder?: number;
    }) => {
      try {
        const created = await createCategoryInDb({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image_url: cat.image,
          display_order: cat.displayOrder,
          is_active: cat.enabled ?? true,
        });
        addToast(`Category "${created.name}" created in database.`, "success");
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to create category.", "error");
        return false;
      }
    },
    [addToast, refreshDbData],
  );

  const updateCategory = useCallback(
    async (cat: {
      id: string;
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      enabled?: boolean;
      displayOrder?: number;
    }) => {
      try {
        const updated = await updateCategoryInDb(cat.id, {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image_url: cat.image,
          display_order: cat.displayOrder,
          is_active: cat.enabled,
        });
        addToast(`Category "${updated.name}" updated successfully.`, "success");
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to update category.", "error");
        return false;
      }
    },
    [addToast, refreshDbData],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteCategoryFromDb(id);
        addToast("Category deleted successfully.", "info");
        await refreshDbData();
        return true;
      } catch (err: any) {
        // Show explicit clear error message if products belong to category!
        addToast(err.message || "Cannot delete category.", "error");
        return false;
      }
    },
    [addToast, refreshDbData],
  );

  // Collections CRUD
  const addCollection = useCallback(
    async (col: AdminCollection) => {
      try {
        const created = await createCollectionInDb({
          name: col.name,
          slug: col.slug,
          description: col.description,
          coverImage: col.coverImage,
          bannerImage: col.bannerImage,
          status: col.status,
          displayOrder: col.displayOrder,
          productIds: col.productIds,
        });
        addToast(
          `Collection "${created.name}" created in database.`,
          "success",
        );
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to create collection.", "error");
        return false;
      }
    },
    [addToast, refreshDbData],
  );

  const updateCollection = useCallback(
    async (col: AdminCollection) => {
      try {
        const updated = await updateCollectionInDb(col.id, {
          name: col.name,
          slug: col.slug,
          description: col.description,
          coverImage: col.coverImage,
          bannerImage: col.bannerImage,
          status: col.status,
          displayOrder: col.displayOrder,
          productIds: col.productIds,
        });
        addToast(
          `Collection "${updated.name}" updated in database.`,
          "success",
        );
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to update collection.", "error");
        return false;
      }
    },
    [addToast, refreshDbData],
  );

  const deleteCollection = useCallback(
    async (id: string) => {
      try {
        await deleteCollectionFromDb(id);
        addToast("Collection deleted from database.", "info");
        await refreshDbData();
        return true;
      } catch (err: any) {
        addToast(err.message || "Failed to delete collection.", "error");
        return false;
      }
    },
    [addToast, refreshDbData],
  );

  // Orders DB Actions
  const updateOrderStatus = useCallback(
    async (
      orderId: string,
      status: AdminOrder["orderStatus"],
      note?: string,
    ) => {
      const res = await updateOrderStatusInDb(orderId, status, note);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === res.order!.id ? res.order! : ord)),
        );
        addToast(
          `Order ${res.order.orderNumber} status updated to ${status}.`,
          "success",
        );
        return true;
      } else {
        addToast(res.errorMessage || "Failed to update order status.", "error");
        return false;
      }
    },
    [addToast],
  );

  const cancelOrder = useCallback(
    async (orderId: string, reason?: string) => {
      const res = await cancelOrderInDb(orderId, reason);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === res.order!.id ? res.order! : ord)),
        );
        addToast(
          `Order ${res.order.orderNumber} cancelled successfully.`,
          "warning",
        );
        await refreshDbData(); // Refresh product inventory after stock restoration
        return true;
      } else {
        addToast(res.errorMessage || "Failed to cancel order.", "error");
        return false;
      }
    },
    [addToast, refreshDbData],
  );

  const refundOrder = useCallback(
    async (orderId: string, reason?: string) => {
      const res = await refundOrderInDb(orderId, reason);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === res.order!.id ? res.order! : ord)),
        );
        addToast(
          `Payment for Order ${res.order.orderNumber} refunded successfully.`,
          "info",
        );
        return true;
      } else {
        addToast(
          res.errorMessage || "Failed to refund order payment.",
          "error",
        );
        return false;
      }
    },
    [addToast],
  );

  // Corporate Enquiries
  const updateCorporateEnquiryStatus = useCallback(
    (
      id: string,
      status: CorporateEnquiry["status"],
      internalNotes?: string,
    ) => {
      setCorporateEnquiries((prev) =>
        prev.map((enq) =>
          enq.id === id
            ? {
                ...enq,
                status,
                ...(internalNotes !== undefined ? { internalNotes } : {}),
              }
            : enq,
        ),
      );
      addToast(`Corporate Enquiry updated to status: ${status}`, "success");
    },
    [addToast],
  );

  const deleteCorporateEnquiry = useCallback(
    (id: string) => {
      setCorporateEnquiries((prev) => prev.filter((e) => e.id !== id));
      addToast("Corporate Enquiry archived/deleted.", "info");
    },
    [addToast],
  );

  // Contact Enquiries
  const updateContactEnquiryStatus = useCallback(
    (id: string, status: ContactEnquiry["status"]) => {
      setContactEnquiries((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c)),
      );
      addToast(`Contact Enquiry status updated to ${status}`, "success");
    },
    [addToast],
  );

  // Reviews
  const updateReviewStatus = useCallback(
    (id: string, status: AdminReview["status"]) => {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
      addToast(`Review status changed to ${status}`, "success");
    },
    [addToast],
  );

  const deleteReview = useCallback(
    (id: string) => {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      addToast("Review deleted.", "info");
    },
    [addToast],
  );

  // Banners
  const addBanner = useCallback(
    (banner: Banner) => {
      setBanners((prev) => [...prev, banner]);
      addToast("New Banner created.", "success");
    },
    [addToast],
  );

  const updateBanner = useCallback(
    (banner: Banner) => {
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
      addToast("Banner updated.", "success");
    },
    [addToast],
  );

  const deleteBanner = useCallback(
    (id: string) => {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      addToast("Banner removed.", "info");
    },
    [addToast],
  );

  // CMS Updates
  const updateHomepageCMS = useCallback(
    async (cms: Partial<HomepageCMS>) => {
      setHomepageCMS((prev) => {
        const updated = { ...prev, ...cms };
        updateCMSContent("homepage", updated);
        return updated;
      });
      addToast("Homepage CMS updated successfully.", "success");
    },
    [addToast],
  );

  const updateAboutCMS = useCallback(
    async (cms: Partial<AboutCMS>) => {
      setAboutCMS((prev) => {
        const updated = { ...prev, ...cms };
        updateCMSContent("about", updated);
        return updated;
      });
      addToast("About Us CMS updated successfully.", "success");
    },
    [addToast],
  );

  const updateEducationCMS = useCallback(
    async (cms: Partial<PearlEducationCMS>) => {
      setEducationCMS((prev) => {
        const updated = { ...prev, ...cms };
        updateCMSContent("education", updated);
        return updated;
      });
      addToast("Pearl Education CMS updated.", "success");
    },
    [addToast],
  );

  const updateBridalCMS = useCallback(
    async (cms: Partial<BridalCMS>) => {
      setBridalCMS((prev) => {
        const updated = { ...prev, ...cms };
        updateCMSContent("bridal", updated);
        return updated;
      });
      addToast("Bridal Content CMS updated.", "success");
    },
    [addToast],
  );

  const updateContactCMS = useCallback(
    async (cms: Partial<ContactCMS>) => {
      setContactCMS((prev) => {
        const updated = { ...prev, ...cms };
        updateCMSContent("contact", updated);
        return updated;
      });
      addToast("Contact Us CMS updated.", "success");
    },
    [addToast],
  );

  const updateCorporateCMS = useCallback(
    async (cms: Partial<CorporateCMS>) => {
      setCorporateCMS((prev) => {
        const updated = { ...prev, ...cms };
        updateCMSContent("corporate", updated);
        return updated;
      });
      addToast("Corporate Gifting CMS updated.", "success");
    },
    [addToast],
  );

  const updateFooterCMS = useCallback(
    async (cms: Partial<FooterCMS>) => {
      setFooterCMS((prev) => {
        const updated = { ...prev, ...cms };
        updateCMSContent("footer", updated);
        return updated;
      });
      addToast("Footer & Brand CMS updated.", "success");
    },
    [addToast],
  );

  // Settings
  const updateSettings = useCallback(
    (newSettings: Partial<AdminSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      addToast("Store Settings saved successfully.", "success");
    },
    [addToast],
  );

  // Export Newsletter CSV
  const exportNewsletterCSV = useCallback(() => {
    const headers = ["ID", "Email", "Date Joined", "Status"];
    const rows = newsletterSubscribers.map((s) => [
      s.id,
      s.email,
      s.dateJoined,
      s.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `MAHESHRAJ_newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Newsletter subscribers exported as CSV.", "success");
  }, [newsletterSubscribers, addToast]);

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        expandedGroups,
        toggleGroup,
        isAuthenticated,
        isAuthChecking,
        adminUser,
        login,
        logout,
        verifyServerSession,
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
        contactCMS,
        corporateCMS,
        footerCMS,
        settings,
        activityLogs,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteAllProducts,
        duplicateProduct,
        productCategoryFilter,
        setProductCategoryFilter,
        addCategory,
        updateCategory,
        deleteCategory,
        addCollection,
        updateCollection,
        deleteCollection,
        updateOrderStatus,
        cancelOrder,
        refundOrder,
        refreshOrders,
        refreshCustomers,
        updateCustomerStatus,
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
        updateContactCMS,
        updateCorporateCMS,
        updateFooterCMS,
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
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
