import { useState, useEffect } from 'react';
import GiftingHero from '@/components/gifting/GiftingHero';
import GiftingArtOfGiving from '@/components/gifting/GiftingArtOfGiving';
import GiftingOccasions from '@/components/gifting/GiftingOccasions';
import GiftingCuratedCollection from '@/components/gifting/GiftingCuratedCollection';
import GiftingPersonalization from '@/components/gifting/GiftingPersonalization';
import GiftingExperience from '@/components/gifting/GiftingExperience';
import GiftingEnquiryForm from '@/components/gifting/GiftingEnquiryForm';
import GiftingFinalCTA from '@/components/gifting/GiftingFinalCTA';

// Global Modals & Drawers
import CartDrawer from '@/components/shop/CartDrawer';
import SearchModal from '@/components/shop/SearchModal';
import QuickViewModal from '@/components/shop/QuickViewModal';
import PearlGuideModal from '@/components/shop/PearlGuideModal';

export default function CorporateGiftingPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Corporate Gifting | Maharaj Jewellery — Luxury Pearl Gifting';
  }, []);

  const scrollToEnquiry = (occasionName?: string, productName?: string) => {
    if (occasionName) setSelectedOccasion(occasionName);
    if (productName) setSelectedProduct(productName);

    const formElement = document.getElementById('corporate-enquiry');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full bg-[#F7F3EC] min-h-screen flex flex-col font-sans selection:bg-[#C8A96B] selection:text-[#29231F]">
      
      {/* 01 — CINEMATIC CORPORATE GIFTING HERO */}
      <GiftingHero
        onEnquireClick={() => scrollToEnquiry()}
        onExploreClick={() => scrollToSection('art-of-giving')}
      />

      {/* 02 — THE ART OF CORPORATE GIVING */}
      <GiftingArtOfGiving />

      {/* 03 — OCCASIONS WORTH CELEBRATING */}
      <GiftingOccasions
        onSelectOccasion={(occ) => scrollToEnquiry(occ)}
      />

      {/* 04 — CURATED GIFTING COLLECTION */}
      <GiftingCuratedCollection
        onEnquireProduct={(prod) => scrollToEnquiry(undefined, prod)}
      />

      {/* 05 — PERSONALIZED CORPORATE GIFTING */}
      <GiftingPersonalization />

      {/* 06 — THE GIFTING EXPERIENCE */}
      <GiftingExperience />

      {/* 07 — CORPORATE GIFTING ENQUIRY */}
      <GiftingEnquiryForm
        initialOccasion={selectedOccasion}
        initialProduct={selectedProduct}
      />

      {/* 08 — FINAL CINEMATIC CTA */}
      <GiftingFinalCTA
        onStartConversation={() => scrollToEnquiry()}
      />

      {/* GLOBAL MODALS & DRAWERS */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <PearlGuideModal />

    </div>
  );
}
