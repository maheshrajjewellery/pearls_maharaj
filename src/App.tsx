import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CollectionShowcase from "@/components/CollectionShowcase";
import ProductGrid from "@/components/ProductGrid";
import BrandIntro from "@/components/BrandIntro";
import Craftsmanship from "@/components/Craftsmanship";
import BridalCampaign from "@/components/BridalCampaign";
import Footer from "@/components/Footer";

import ShopPage from "@/pages/ShopPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PearlEducationPage from "@/pages/PearlEducationPage";
import CorporateGiftingPage from "@/pages/CorporateGiftingPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import QuickViewModal from "@/components/shop/QuickViewModal";
import CartDrawer from "@/components/shop/CartDrawer";
import SearchModal from "@/components/shop/SearchModal";
import PearlGuideModal from "@/components/shop/PearlGuideModal";
import { ShopProvider, useShop } from "@/context/ShopContext";
import { DashboardTab } from "@/types/customer";

// ADMIN PANEL IMPORT
import { AdminProvider, useAdmin } from "@/admin/context/AdminContext";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";

function AppContent() {
  const { currentPage, setCurrentPage, user, setActiveDashboardTab } =
    useShop();
  const {
    isAuthenticated: isAdminAuthenticated,
    isAuthChecking: isAdminAuthChecking,
  } = useAdmin();

  // Route protection and browser popstate navigation (Back / Forward / Initial Load)
  useEffect(() => {
    const handleLocation = () => {
      if (typeof window === "undefined") return;
      const path = window.location.pathname.toLowerCase();

      const isAdminActive =
        localStorage.getItem("MAHESHRAJ_admin_session") === "active" ||
        (localStorage.getItem("MAHESHRAJ_admin_token") &&
          localStorage.getItem("MAHESHRAJ_admin_token")!.length > 10);

      const isUserAdmin =
        user && user.email.toLowerCase().trim() === "maheshtadakalle@gmail.com";
      const isAdmin = isAdminActive || isAdminAuthenticated || isUserAdmin;

      // 1. Redirect /admin/login to single /login page
      if (path === "/admin/login" || path === "/admin/login/") {
        setCurrentPage("login");
        window.history.replaceState({}, "", "/login");
        return;
      }

      // 2. Protect /admin/* routes: Only authenticated admins can access
      if (path.startsWith("/admin")) {
        if (isAdmin || isAdminAuthChecking) {
          setCurrentPage("admin");
          if (path === "/admin" || path === "/admin/") {
            window.history.replaceState({}, "", "/admin/dashboard");
          }
        } else {
          // Unauthenticated user or customer trying to access /admin -> Redirect to /login
          setCurrentPage("login");
          window.history.replaceState({}, "", "/login");
        }
        return;
      }

      // 3. OAuth Callback handler
      if (path.includes("callback") || path.includes("auth/callback")) {
        setCurrentPage("callback");
        return;
      }

      // 4. Customer Dashboard route (/customer/dashboard or /dashboard)
      if (path.includes("dashboard")) {
        const hasOAuthParams =
          window.location.hash.includes("access_token") ||
          window.location.search.includes("code") ||
          window.location.hash.includes("error");

        if (!user && !hasOAuthParams) {
          // Route Protection: Unauthenticated access to customer dashboard redirects to /login
          setCurrentPage("login");
          window.history.replaceState({}, "", "/login");
        } else {
          setCurrentPage("dashboard");
          if (path === "/dashboard" || path === "/dashboard/") {
            window.history.replaceState({}, "", "/customer/dashboard");
          }
          if (path.includes("orders")) setActiveDashboardTab("orders");
          else if (path.includes("wishlist")) setActiveDashboardTab("wishlist");
          else if (path.includes("profile")) setActiveDashboardTab("profile");
          else if (path.includes("addresses"))
            setActiveDashboardTab("addresses");
          else if (path.includes("payments")) setActiveDashboardTab("payments");
          else if (path.includes("settings")) setActiveDashboardTab("settings");
          else setActiveDashboardTab("overview");
        }
        return;
      }

      // 5. Home page
      if (path === "/" || path === "") {
        setCurrentPage("home");
        return;
      }

      // 6. Single Login route (/login)
      if (path.includes("login")) {
        if (isAdmin) {
          // Authenticated admin visiting /login redirects to /admin/dashboard
          setCurrentPage("admin");
          window.history.replaceState({}, "", "/admin/dashboard");
        } else if (user) {
          // Authenticated customer visiting /login redirects to /customer/dashboard
          setCurrentPage("dashboard");
          window.history.replaceState({}, "", "/customer/dashboard");
        } else {
          setCurrentPage("login");
        }
        return;
      }

      // 7. Store content pages
      if (
        path.includes("checkout/success") ||
        path.includes("checkout-success")
      ) {
        setCurrentPage("checkout-success");
      } else if (path.includes("checkout")) {
        setCurrentPage("checkout");
      } else if (path.includes("gifting") || path.includes("corporate")) {
        setCurrentPage("gifting");
      } else if (path.includes("education")) {
        setCurrentPage("education");
      } else if (path.includes("contact")) {
        setCurrentPage("contact");
      } else if (path.includes("about")) {
        setCurrentPage("about");
      } else if (path.includes("shop")) {
        setCurrentPage("shop");
      }
    };

    handleLocation();

    const handlePopState = () => handleLocation();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    setCurrentPage,
    user,
    isAdminAuthenticated,
    isAdminAuthChecking,
    setActiveDashboardTab,
  ]);

  // PROTECTED SEPARATE ADMIN AREA (ONLY WHEN URL PATH STARTS WITH /admin)
  if (
    typeof window !== "undefined" &&
    window.location.pathname.toLowerCase().startsWith("/admin") &&
    !window.location.pathname.toLowerCase().startsWith("/admin/login")
  ) {
    const isAdminActive =
      localStorage.getItem("MAHESHRAJ_admin_session") === "active" ||
      (localStorage.getItem("MAHESHRAJ_admin_token") &&
        localStorage.getItem("MAHESHRAJ_admin_token")!.length > 10);
    const isUserAdmin =
      user && user.email.toLowerCase().trim() === "maheshtadakalle@gmail.com";
    const isAdmin = isAdminActive || isAdminAuthenticated || isUserAdmin;

    if (isAdmin || isAdminAuthChecking) {
      return <AdminLayout />;
    }
  }

  return (
    <div className="relative bg-[#F7F3EB] min-h-screen overflow-x-hidden flex flex-col font-sans text-[#171310] selection:bg-[#C5A15A] selection:text-[#171310]">
      {/* GLOBAL LUXURY NAVBAR */}
      <Navbar />

      <main className="flex-1">
        {currentPage === "callback" ? (
          /* THE GOOGLE OAUTH CALLBACK HANDLER */
          <AuthCallbackPage />
        ) : currentPage === "dashboard" ? (
          /* THE CUSTOMER DASHBOARD PAGE (PROTECTED) */
          user ? (
            <DashboardPage />
          ) : (
            <LoginPage />
          )
        ) : currentPage === "checkout" ? (
          /* THE COMPLETE SECURE CHECKOUT PAGE */
          <CheckoutPage />
        ) : currentPage === "checkout-success" ? (
          /* THE ORDER CONFIRMATION / SUCCESS PAGE */
          <OrderConfirmationPage />
        ) : currentPage === "login" ? (
          /* THE CLEAN MINIMAL LUXURY LOGIN PAGE */
          <LoginPage />
        ) : currentPage === "gifting" ? (
          /* THE COMPLETE CORPORATE GIFTING PAGE */
          <CorporateGiftingPage />
        ) : currentPage === "education" ? (
          /* THE COMPLETE PEARL EDUCATION PAGE */
          <PearlEducationPage />
        ) : currentPage === "contact" ? (
          /* THE COMPLETE CONTACT US / PRIVATE CONSULTATION PAGE */
          <ContactPage />
        ) : currentPage === "about" ? (
          /* THE COMPLETE ABOUT US PAGE */
          <AboutPage />
        ) : currentPage === "shop" ? (
          /* THE COMPLETE LUXURY SHOP PAGE */
          <ShopPage />
        ) : (
          /* HOME PAGE VISUAL FLOW */
          <>
            {/* SECTION 01: CINEMATIC AUTO-SCROLL HERO */}
            <Hero />

            {/* SECTION 02: DISCOVER CATEGORIES VISUAL CARDS */}
            <CollectionShowcase />

            {/* SECTION 03: CURATED CATEGORIES PRODUCT CATALOG */}
            <ProductGrid />

            {/* SECTION 04: THE WORLD OF PEARLS */}
            <BrandIntro />

            {/* SECTION 05: CRAFTED TO LAST */}
            <Craftsmanship />

            {/* SECTION 06: BRIDAL CAMPAIGN */}
            <BridalCampaign />
          </>
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer />

      {/* GLOBAL MODALS & DRAWERS */}
      <QuickViewModal />
      <CartDrawer />
      <SearchModal />
      <PearlGuideModal />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </ShopProvider>
  );
}
