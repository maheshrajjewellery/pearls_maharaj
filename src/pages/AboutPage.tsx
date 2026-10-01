import { useEffect } from 'react';
import AboutHero from '@/components/about/AboutHero';
import AboutPhilosophy from '@/components/about/AboutPhilosophy';
import AboutPearlStory from '@/components/about/AboutPearlStory';
import AboutHeritageCraft from '@/components/about/AboutHeritageCraft';
import AboutTransformation from '@/components/about/AboutTransformation';
import AboutSignature from '@/components/about/AboutSignature';
import AboutValues from '@/components/about/AboutValues';
import AboutBrandStatement from '@/components/about/AboutBrandStatement';
import AboutCTA from '@/components/about/AboutCTA';
import CartDrawer from '@/components/shop/CartDrawer';
import SearchModal from '@/components/shop/SearchModal';
import QuickViewModal from '@/components/shop/QuickViewModal';
import PearlGuideModal from '@/components/shop/PearlGuideModal';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'About Us | Maharaj Jewellery — The Art of Timeless Pearls';
  }, []);

  return (
    <div className="w-full bg-[#F8F5F0] min-h-screen flex flex-col font-sans">
      {/* 01 — CINEMATIC BRAND HERO */}
      <AboutHero />

      {/* 02 — BRAND PHILOSOPHY */}
      <AboutPhilosophy />

      {/* 03 — THE PEARL STORY */}
      <AboutPearlStory />

      {/* 04 — HERITAGE & CRAFT */}
      <AboutHeritageCraft />

      {/* 05 — FROM PEARL TO JEWELLERY */}
      <AboutTransformation />

      {/* 06 — MAHARAJ SIGNATURE */}
      <AboutSignature />

      {/* 07 — VALUES */}
      <AboutValues />

      {/* 08 — EDITORIAL BRAND STATEMENT */}
      <AboutBrandStatement />

      {/* 09 — FINAL CTA */}
      <AboutCTA />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <PearlGuideModal />
    </div>
  );
}
