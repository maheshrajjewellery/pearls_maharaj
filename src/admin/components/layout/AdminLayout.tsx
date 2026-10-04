import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminToastContainer } from './AdminToastContainer';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';
import { AdminLoginPage } from '../../pages/AdminLoginPage';

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
import { BannersView } from '../views/BannersView';
import { ReviewsView } from '../views/ReviewsView';
import { NewsletterView } from '../views/NewsletterView';
import { AnalyticsView } from '../views/AnalyticsView';
import { SettingsView } from '../views/SettingsView';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, activeTab } = useAdmin();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <AdminLoginPage />;
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
      case 'banners':
        return <BannersView />;
      case 'reviews':
        return <ReviewsView />;
      case 'newsletter':
        return <NewsletterView />;
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
