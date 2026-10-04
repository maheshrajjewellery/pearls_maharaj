import React, { useEffect } from 'react';
import PearlHero from '@/components/education/PearlHero';
import WhatIsAPearl from '@/components/education/WhatIsAPearl';
import HowAPearlIsBorn from '@/components/education/HowAPearlIsBorn';
import PearlTypes from '@/components/education/PearlTypes';
import PearlAnatomy from '@/components/education/PearlAnatomy';
import PearlShapes from '@/components/education/PearlShapes';
import PearlColors from '@/components/education/PearlColors';
import PearlLuster from '@/components/education/PearlLuster';
import PearlSize from '@/components/education/PearlSize';
import PearlQuality from '@/components/education/PearlQuality';
import PearlComparison from '@/components/education/PearlComparison';
import PearlBuyingGuide from '@/components/education/PearlBuyingGuide';
import PearlCareGuide from '@/components/education/PearlCareGuide';
import PearlMyths from '@/components/education/PearlMyths';
import PearlEducationCTA from '@/components/education/PearlEducationCTA';

// Global Shop & Interactive Modals
import CartDrawer from '@/components/shop/CartDrawer';
import SearchModal from '@/components/shop/SearchModal';
import QuickViewModal from '@/components/shop/QuickViewModal';
import PearlGuideModal from '@/components/shop/PearlGuideModal';

export default function PearlEducationPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Pearl Education & Connoisseur Guide | Maharaj Jewellery';
  }, []);

  return (
    <div className="w-full bg-[#F8F5F0] min-h-screen flex flex-col font-sans selection:bg-champagne-300 selection:text-cocoa-300">
      
      {/* 01 — CINEMATIC PEARL HERO */}
      <PearlHero />

      {/* 02 — WHAT IS A PEARL? */}
      <WhatIsAPearl />

      {/* 03 — HOW A PEARL IS BORN (INTERACTIVE 4-STAGE NACRE CONCENTRIC GROWTH) */}
      <HowAPearlIsBorn />

      {/* 04 — KNOW YOUR PEARLS (FRESHWATER, AKOYA, SOUTH SEA, TAHITIAN) */}
      <PearlTypes />

      {/* 05 — PEARL ANATOMY (INTERACTIVE CROSS-SECTION HOTSPOTS) */}
      <PearlAnatomy />

      {/* 06 — PEARL SHAPES (FROM SYMMETRICAL TO ORGANIC BAROQUE) */}
      <PearlShapes />

      {/* 07 — PEARL COLORS (INTERACTIVE CHROMATIC CROSSFADE) */}
      <PearlColors />

      {/* 08 — UNDERSTANDING LUSTER (BEFORE / AFTER COMPARISON SLIDER) */}
      <PearlLuster />

      {/* 09 — PEARL SIZE (PROPORTIONAL MILLIMETER SCALE) */}
      <PearlSize />

      {/* 10 — PEARL QUALITY (WHAT MAKES A PEARL BEAUTIFUL) */}
      <PearlQuality />

      {/* 11 — INTERACTIVE PEARL COMPARISON (DUAL VARIETY SELECTOR) */}
      <PearlComparison />

      {/* 12 — HOW TO CHOOSE A PEARL (BUYING GUIDE) */}
      <PearlBuyingGuide />

      {/* 13 — PEARL CARE GUIDE (DARK EDITORIAL PRESERVATION PROTOCOL) */}
      <PearlCareGuide />

      {/* 14 — PEARL MYTHS & FACTS (INTERACTIVE ACCORDION) */}
      <PearlMyths />

      {/* 15 — FINAL BRAND CTA */}
      <PearlEducationCTA />

    </div>
  );
}
