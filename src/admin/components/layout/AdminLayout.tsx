import React, { useState, useEffect } from 'react';
import { useAdmin, AdminTab } from '../../context/AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminToastContainer } from './AdminToastContainer';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';
import { Loader2 } from 'lucide-react';

// View Components
import { DashboardView } from '../views/DashboardView';
import { ProductsView } from '../views/ProductsView';
import { CategoriesView } from '../views/CategoriesView';
import { CollectionsView } from '../views/CollectionsView';
import { OrdersView } from '../views/OrdersView';
import { CustomersView } from '../views/CustomersView';
import { CorporateGiftingView } from '../views/CorporateGiftingView';
import { HomepageCMSView } from '../views/HomepageCMSView';
import { AboutCMSView } from '../views/AboutCMSView';
import { PearlEducationCMSView } from '../views/PearlEducationCMSView';
import { BridalCMSView } from '../views/BridalCMSView';
import { ContactCMSView } from '../views/ContactCMSView';
import { ReviewsView } from '../views/ReviewsView';
import { AnalyticsView } from '../views/AnalyticsView';
import { SettingsView } from '../views/SettingsView';

export function getTabFromPath(path: string): AdminTab {
  const p = path.toLowerCase().replace(/\/$/, '');
  if (p === '/admin/catalogue/products' || p === '/admin/products') return 'products';
  if (p === '/admin/catalogue/categories' || p === '/admin/categories') return 'categories';
  if (p === '/admin/catalogue/collections' || p === '/admin/collections') return 'collections';
  if (p === '/admin/orders') return 'orders';
  if (p === '/admin/customers') return 'customers';
  if (p === '/admin/settings') return 'settings';
  if (p === '/admin/analytics') return 'analytics';
  if (p === '/admin/reviews') return 'reviews';
  if (p === '/admin/homepage-cms') return 'homepage-cms';
  if (p === '/admin/about-cms') return 'about-cms';
  if (p === '/admin/education-cms') return 'education-cms';
  if (p === '/admin/bridal-cms') return 'bridal-cms';
  if (p === '/admin/contact-cms') return 'contact-cms';
  if (p === '/admin/corporate-gifting') return 'corporate-enquiries';
  return 'dashboard';
}

export function getPathFromTab(tab: AdminTab): string {
  switch (tab) {
    case 'products': return '/admin/catalogue/products';
    case 'categories': return '/admin/catalogue/categories';
    case 'collections': return '/admin/catalogue/collections';
    case 'orders': return '/admin/orders';
    case 'customers': return '/admin/customers';
    case 'settings': return '/admin/settings';
    default: return `/admin/${tab}`;
  }
}

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAuthChecking, activeTab, setActiveTab } = useAdmin();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronize URL path with active tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.toLowerCase();
    
    // Sync tab from URL path
    if (path.startsWith('/admin')) {
      if (path === '/admin/login' || path === '/admin/login/') {
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', '/login');
        }
      } else {
        const expectedTab = getTabFromPath(path);
        if (expectedTab !== activeTab) {
          setActiveTab(expectedTab);
        }
      }
    }
  }, [setActiveTab, activeTab]);

  // Update browser URL when activeTab changes
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetPath = getPathFromTab(tab);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  };

  // If server authentication check is pending, show high quality loading indicator
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex flex-col justify-center items-center p-4 text-[#30372F]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A15A] mb-3" />
        <p className="font-sans text-xs tracking-widest uppercase font-medium text-[#30372F]/70">
          Verifying Admin Authorization...
        </p>
      </div>
    );
  }

  // Requirement 2 & 4: If not authenticated, redirect to /login
  if (!isAuthenticated) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.history.replaceState({}, '', '/login');
    }
    return null;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <ProductsView />;
      case 'categories':
        return <CategoriesView />;
      case 'collections':
        return <CollectionsView />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;
      case 'corporate-enquiries':
      case 'corporate-orders':
        return <CorporateGiftingView />;
      case 'homepage-cms':
        return <HomepageCMSView />;
      case 'about-cms':
        return <AboutCMSView />;
      case 'education-cms':
        return <PearlEducationCMSView />;
      case 'bridal-cms':
        return <BridalCMSView />;
      case 'contact-cms':
        return <ContactCMSView />;
      case 'reviews':
        return <ReviewsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#30372F] font-sans flex flex-col md:flex-row selection:bg-[#C5A15A] selection:text-[#30372F]">
      {/* LEFT SIDEBAR (250px) */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onTabSelect={handleTabChange}
      />

      {/* MOBILE BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-[#30372F]/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* MAIN CONTAINER (DESKTOP OFFSET 250px) */}
      <div className="flex-1 md:pl-[250px] flex flex-col min-h-screen">
        {/* TOP HEADER */}
        <AdminHeader onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* MAIN VIEW CONTENT CONTAINER */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* GLOBAL MODALS & NOTIFICATIONS */}
      <AdminToastContainer />
      <AdminConfirmModal />
      <AdminGlobalSearchModal />
    </div>
  );
};
