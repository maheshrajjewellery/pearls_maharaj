import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
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
import { ShopProvider, useShop } from '@/context/ShopContext';

// ADMIN PANEL IMPORT
import { AdminProvider } from '@/admin/context/AdminContext';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

function AppContent() {
  const { currentPage, setCurrentPage } = useShop();

  // Handle browser popstate navigation (Back / Forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('admin')) {
        setCurrentPage('admin');
      } else if (path === '/' || path === '') {
        setCurrentPage('home');
      } else if (path.includes('login')) {
        setCurrentPage('login');
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
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentPage]);

  // PROTECTED SEPARATE ADMIN AREA
  if (currentPage === 'admin' || (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin'))) {
    return <AdminLayout />;
  }

  return (
    <div className="relative bg-[#F7F3EB] min-h-screen overflow-x-hidden flex flex-col font-sans text-[#171310] selection:bg-[#B79A5A] selection:text-[#171310]">
      {/* GLOBAL LUXURY NAVBAR */}
      <Navbar />

      <main className="flex-1">
        {currentPage === 'login' ? (
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

            {/* SECTION 02: NEW ARRIVALS */}
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
