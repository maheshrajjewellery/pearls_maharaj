import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CuratedCategories from '@/components/CuratedCategories';
import ProductGrid from '@/components/ProductGrid';
import BrandIntro from '@/components/BrandIntro';
import Craftsmanship from '@/components/Craftsmanship';
import BridalCampaign from '@/components/BridalCampaign';
import PearlEducation from '@/components/PearlEducation';
import CorporateGiftingSection from '@/components/CorporateGiftingSection';
import EditorialGallery from '@/components/EditorialGallery';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

import ShopPage from '@/pages/ShopPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PearlEducationPage from '@/pages/PearlEducationPage';
import CorporateGiftingPage from '@/pages/CorporateGiftingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import QuickViewModal from '@/components/shop/QuickViewModal';
import CartDrawer from '@/components/shop/CartDrawer';
import SearchModal from '@/components/shop/SearchModal';
import PearlGuideModal from '@/components/shop/PearlGuideModal';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { DashboardTab } from '@/types/customer';

// ADMIN PANEL IMPORT
import { AdminProvider } from '@/admin/context/AdminContext';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

function AppContent() {
  const { currentPage, setCurrentPage, user, setActiveDashboardTab } = useShop();

  // Route protection and browser popstate navigation (Back / Forward / Initial Load)
  useEffect(() => {
    const handleLocation = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase();

      if (path.includes('admin')) {
        setCurrentPage('admin');
      } else if (path.includes('callback') || path.includes('auth/callback')) {
        setCurrentPage('callback');
      } else if (path.includes('dashboard')) {
        const hasOAuthParams =
          typeof window !== 'undefined' &&
          (window.location.hash.includes('access_token') ||
            window.location.search.includes('code') ||
            window.location.hash.includes('error'));

        if (!user && !hasOAuthParams) {
          // Route Protection: Unauthenticated access to /dashboard redirects to /login
          setCurrentPage('login');
          window.history.replaceState({}, '', '/login');
        } else {
          setCurrentPage('dashboard');
          if (path.includes('/dashboard/orders')) setActiveDashboardTab('orders');
          else if (path.includes('/dashboard/wishlist')) setActiveDashboardTab('wishlist');
          else if (path.includes('/dashboard/profile')) setActiveDashboardTab('profile');
          else if (path.includes('/dashboard/addresses')) setActiveDashboardTab('addresses');
          else if (path.includes('/dashboard/payments')) setActiveDashboardTab('payments');
          else if (path.includes('/dashboard/settings')) setActiveDashboardTab('settings');
          else setActiveDashboardTab('overview');
        }
      } else if (path === '/' || path === '') {
        setCurrentPage('home');
      } else if (path.includes('login')) {
        if (user && !user.email.toLowerCase().includes('admin')) {
          // Requirement 9: Already authenticated customer visiting /login redirects automatically to /dashboard
          setCurrentPage('dashboard');
          window.history.replaceState({}, '', '/dashboard');
        } else {
          setCurrentPage('login');
        }
      } else if (path.includes('checkout/success') || path.includes('checkout-success')) {
        setCurrentPage('checkout-success');
      } else if (path.includes('checkout')) {
        setCurrentPage('checkout');
      } else if (path.includes('gifting') || path.includes('corporate')) {
        setCurrentPage('gifting');
      } else if (path.includes('education')) {
        setCurrentPage('education');
      } else if (path.includes('contact')) {
        setCurrentPage('contact');
      } else if (path.includes('about')) {
        setCurrentPage('about');
      } else if (path.includes('shop')) {
        setCurrentPage('shop');
      }
    };

    handleLocation();

    const handlePopState = () => handleLocation();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentPage, user, setActiveDashboardTab]);

  // PROTECTED SEPARATE ADMIN AREA
  if (currentPage === 'admin' || (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin'))) {
    return <AdminLayout />;
  }

  return (
    <div className="relative bg-[#F7F3EB] min-h-screen overflow-x-hidden flex flex-col font-sans text-[#171310] selection:bg-[#C5A15A] selection:text-[#171310]">
      {/* GLOBAL LUXURY NAVBAR */}
      <Navbar />

      <main className="flex-1">
        {currentPage === 'callback' ? (
          /* THE GOOGLE OAUTH CALLBACK HANDLER */
          <AuthCallbackPage />
        ) : currentPage === 'dashboard' ? (
          /* THE CUSTOMER DASHBOARD PAGE (PROTECTED) */
          user ? (
            <DashboardPage />
          ) : (
            <LoginPage />
          )
        ) : currentPage === 'checkout' ? (
          /* THE COMPLETE SECURE CHECKOUT PAGE */
          <CheckoutPage />
        ) : currentPage === 'checkout-success' ? (
          /* THE ORDER CONFIRMATION / SUCCESS PAGE */
          <OrderConfirmationPage />
        ) : currentPage === 'login' ? (
          /* THE CLEAN MINIMAL LUXURY LOGIN PAGE */
          <LoginPage />
        ) : currentPage === 'gifting' ? (
          /* THE COMPLETE CORPORATE GIFTING PAGE */
          <CorporateGiftingPage />
        ) : currentPage === 'education' ? (
          /* THE COMPLETE PEARL EDUCATION PAGE */
          <PearlEducationPage />
        ) : currentPage === 'contact' ? (
          /* THE COMPLETE CONTACT US / PRIVATE CONSULTATION PAGE */
          <ContactPage />
        ) : currentPage === 'about' ? (
          /* THE COMPLETE ABOUT US PAGE */
          <AboutPage />
        ) : currentPage === 'shop' ? (
          /* THE COMPLETE LUXURY SHOP PAGE */
          <ShopPage />
        ) : (
          /* HOME PAGE VISUAL FLOW */
          <>
            {/* SECTION 01: CINEMATIC AUTO-SCROLL HERO */}
            <Hero />

            {/* SECTION 02: DYNAMIC CURATED CATEGORIES */}
            <CuratedCategories />

            {/* SECTION 03: NEW ARRIVALS & FEATURED PRODUCTS */}
            <ProductGrid />

            {/* SECTION 03: THE WORLD OF PEARLS */}
            <BrandIntro />

            {/* SECTION 04: CRAFTED TO LAST */}
            <Craftsmanship />

            {/* SECTION 05: BRIDAL */}
            <BridalCampaign />

            {/* SECTION 06: PEARL EDUCATION */}
            <PearlEducation />

            {/* SECTION 07: CORPORATE GIFTING */}
            <CorporateGiftingSection />

            {/* EDITORIAL GALLERY & NEWSLETTER */}
            <EditorialGallery />
            <Newsletter />
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
