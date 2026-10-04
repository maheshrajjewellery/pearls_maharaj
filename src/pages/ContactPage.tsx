import { useState, useEffect } from 'react';
import ContactHero from '@/components/contact/ContactHero';
import ContactOptions from '@/components/contact/ContactOptions';
import ConsultationFormSection from '@/components/contact/ConsultationFormSection';
import ConsultationBanner from '@/components/contact/ConsultationBanner';
import StoreLocation from '@/components/contact/StoreLocation';
import ContactFAQ from '@/components/contact/ContactFAQ';
import ContactCTA from '@/components/contact/ContactCTA';
import CartDrawer from '@/components/shop/CartDrawer';
import SearchModal from '@/components/shop/SearchModal';
import QuickViewModal from '@/components/shop/QuickViewModal';
import PearlGuideModal from '@/components/shop/PearlGuideModal';

export default function ContactPage() {
  const [selectedInterest, setSelectedInterest] = useState<string | undefined>(undefined);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Contact Us | Maharaj Jewellery — Private Jewellery Consultation';
  }, []);

  const scrollToForm = (interestValue?: string) => {
    if (interestValue) {
      setSelectedInterest(interestValue);
    }
    const formElement = document.getElementById('consultation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full bg-[#F8F5F0] min-h-screen flex flex-col font-sans">
      {/* 01 — CONTACT HERO */}
      <ContactHero onScrollToForm={() => scrollToForm()} />

      {/* 02 — CONTACT OPTIONS */}
      <ContactOptions onSelectOption={(interest) => scrollToForm(interest)} />

      {/* 03 & 04 — CONSULTATION FORM & CONTACT INFORMATION */}
      <ConsultationFormSection
        selectedInterest={selectedInterest}
        onResetSelectedInterest={() => setSelectedInterest(undefined)}
      />

      {/* 05 — JEWELLERY CONSULTATION BANNER */}
      <ConsultationBanner onBookConsultation={() => scrollToForm('Pearl Consultation')} />

      {/* 06 — STORE / LOCATION */}
      <StoreLocation />

      {/* 07 — FAQ */}
      <ContactFAQ />

      {/* 08 — FINAL CTA */}
      <ContactCTA onContactClick={() => scrollToForm()} />

    </div>
  );
}
