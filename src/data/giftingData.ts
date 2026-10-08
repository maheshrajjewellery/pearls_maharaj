export interface GiftingOccasion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface CuratedGiftingItem {
  id: string;
  category: 'earrings' | 'bracelets' | 'pendants' | 'necklaces' | 'sets';
  categoryLabel: string;
  name: string;
  description: string;
  price: string;
  image: string;
  hoverImage: string;
  specs: {
    pearlType: string;
    material: string;
    packaging: string;
  };
}

export interface CustomizationStep {
  number: string;
  title: string;
  description: string;
  detail: string;
}

export interface ExperienceStep {
  number: string;
  title: string;
  description: string;
}

export const giftingHeroData = {
  eyebrow: 'CORPORATE GIFTING',
  headingLine1: 'Gifts That Leave',
  headingLine2: 'A Lasting Impression.',
  supportingCopy:
    'Thoughtfully crafted pearl jewellery for meaningful milestones, celebrations, and corporate occasions.',
  primaryCta: 'ENQUIRE FOR CORPORATE GIFTING',
  secondaryCta: 'EXPLORE GIFTING',
  heroImage: 'https://images.pexels.com/photos/10835519/pexels-photo-10835519.jpeg?auto=compress&cs=tinysrgb&w=1400',
  boxImage: 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export const artOfGivingData = {
  eyebrow: 'THE ART OF GIVING',
  statement: 'Make Every Milestone Memorable.',
  copyParagraph1:
    'In the world of corporate relationships, a gesture of appreciation should speak to enduring values. Fine pearl jewellery transcends conventional gifts, serving as an eloquent symbol of gratitude, milestone achievements, and partnership.',
  copyParagraph2:
    'Each piece from MAHESHRAJ Jewellery is handcrafted with natural luster, refined gold, and immaculate attention to detail—ensuring your gift is cherished for decades.',
  image: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export const giftingOccasions: GiftingOccasion[] = [
  {
    id: 'employee-recognition',
    title: 'Employee Recognition',
    subtitle: 'Milestones & Excellence',
    description: 'Thoughtful gifts for achievements and milestones.',
    image: 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'client-appreciation',
    title: 'Client Appreciation',
    subtitle: 'Enduring Partnerships',
    description: 'Elegant gestures for valued relationships.',
    image: 'https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'corporate-celebrations',
    title: 'Corporate Celebrations',
    subtitle: 'Anniversaries & Events',
    description: 'Jewellery for anniversaries, events, and special occasions.',
    image: 'https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'festive-gifting',
    title: 'Festive Gifting',
    subtitle: 'Seasonal & Diwali Expressions',
    description: 'Refined gifts for festive and seasonal celebrations.',
    image: 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
];

export const curatedGiftingCollection: CuratedGiftingItem[] = [
  {
    id: 'cg-01',
    category: 'earrings',
    categoryLabel: 'Pearl Earrings',
    name: 'Akoya Luster Studs',
    description: 'Luminous 8mm Akoya cultured pearls mounted on 18K solid yellow gold posts.',
    price: '₹ 28,000',
    image: 'https://images.pexels.com/photos/36553500/pexels-photo-36553500.jpeg?auto=compress&cs=tinysrgb&w=900',
    hoverImage: 'https://images.pexels.com/photos/7743086/pexels-photo-7743086.jpeg?auto=compress&cs=tinysrgb&w=900',
    specs: {
      pearlType: 'Japanese Akoya',
      material: '18K Yellow Gold',
      packaging: 'Signature Ivory Gift Box',
    },
  },
  {
    id: 'cg-02',
    category: 'bracelets',
    categoryLabel: 'Pearl Bracelets',
    name: 'South Sea Pearl Bracelet',
    description: 'Hand-strung Australian South Sea pearls with a handcrafted filigree gold clasp.',
    price: '₹ 56,000',
    image: 'https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=900',
    hoverImage: 'https://images.pexels.com/photos/29149181/pexels-photo-29149181.jpeg?auto=compress&cs=tinysrgb&w=900',
    specs: {
      pearlType: 'Australian South Sea',
      material: '18K Yellow Gold Clasp',
      packaging: 'Silk Velvet Pouch & Rigid Box',
    },
  },
  {
    id: 'cg-03',
    category: 'pendants',
    categoryLabel: 'Pearl Pendants',
    name: 'Solitaire Drop Pendant',
    description: 'Teardrop South Sea pearl suspended on a delicate 18K gold chain with diamond accent.',
    price: '₹ 45,000',
    image: 'https://images.pexels.com/photos/19525066/pexels-photo-19525066.jpeg?auto=compress&cs=tinysrgb&w=900',
    hoverImage: 'https://images.pexels.com/photos/38940766/pexels-photo-38940766.jpeg?auto=compress&cs=tinysrgb&w=900',
    specs: {
      pearlType: 'Freshwater Teardrop',
      material: '18K Yellow Gold & Diamond',
      packaging: 'Custom Embossed Wooden Box',
    },
  },
  {
    id: 'cg-04',
    category: 'necklaces',
    categoryLabel: 'Pearl Necklaces',
    name: 'Heritage Classic Strand',
    description: 'Graduated round pearls selected for superior mirror luster and smooth surface.',
    price: '₹ 1,25,000',
    image: 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=900',
    hoverImage: 'https://images.pexels.com/photos/10835519/pexels-photo-10835519.jpeg?auto=compress&cs=tinysrgb&w=900',
    specs: {
      pearlType: 'Cultured Pearl Strand',
      material: 'Hand-knotted Silk & 18K Clasp',
      packaging: 'Grand Luxury Presentation Case',
    },
  },
  {
    id: 'cg-05',
    category: 'sets',
    categoryLabel: 'Jewellery Sets',
    name: 'Imperial Empress Gift Set',
    description: 'Coordinated single-strand pearl necklace and matching drop earrings in royal velvet presentation.',
    price: '₹ 1,85,000',
    image: 'https://images.pexels.com/photos/7743044/pexels-photo-7743044.jpeg?auto=compress&cs=tinysrgb&w=900',
    hoverImage: 'https://images.pexels.com/photos/29522527/pexels-photo-29522527.jpeg?auto=compress&cs=tinysrgb&w=900',
    specs: {
      pearlType: 'South Sea & Akoya',
      material: '18K Yellow Gold',
      packaging: 'Custom Monogrammed Box Set',
    },
  },
];

export const customizationSteps: CustomizationStep[] = [
  {
    number: '01',
    title: 'Curated Jewellery',
    description: 'Select from our signature pearl collections or collaborate to create custom gift silhouettes.',
    detail: 'From delicate solitaire studs to regal multi-row strands tailored to your corporate tiering.',
  },
  {
    number: '02',
    title: 'Personalized Packaging',
    description: 'Bespoke presentation boxes crafted in warm taupe leatherette and soft velvet linings.',
    detail: 'Customized box sizes, ribbon colors, and interior plush inserts designed for high-impact opening.',
  },
  {
    number: '03',
    title: 'Corporate Branding',
    description: 'Subtle, elegant branding integration that respects the quiet luxury aesthetic.',
    detail: 'Custom calligraphed insert cards, wax-sealed certificates of authenticity, and foil-stamped sleeves.',
  },
  {
    number: '04',
    title: 'Bulk Gifting',
    description: 'Streamlined logistics for single or multi-destination corporate distributions.',
    detail: 'Dedicated corporate account manager overseeing dispatch tracking and white-glove delivery.',
  },
  {
    number: '05',
    title: 'Occasion-Based Curation',
    description: 'Tailored gift assortments specifically designed for festive seasons, board retreats, and executive galas.',
    detail: 'Curated price-point tiers paired with personalized recipient messaging.',
  },
];

export const experienceSteps: ExperienceStep[] = [
  {
    number: '01',
    title: 'Share Your Requirement',
    description: 'Connect with our corporate concierges to detail your quantity, budget parameters, and delivery timeline.',
  },
  {
    number: '02',
    title: 'Choose Your Jewellery',
    description: 'Review physical samples or digital lookbooks tailored specifically to your organization’s milestone.',
  },
  {
    number: '03',
    title: 'Personalize Your Gifting',
    description: 'Select packaging accents, custom calligraphed cards, wax seals, and bespoke presentation details.',
  },
  {
    number: '04',
    title: 'Deliver With Care',
    description: 'Receive seamlessly packaged, insured shipments directly to your office or recipient addresses worldwide.',
  },
];

export const enquiryOptions = {
  occasions: [
    'Employee Recognition',
    'Client Appreciation',
    'Corporate Event',
    'Festive Gifting',
    'Anniversary',
    'Other',
  ],
  jewelleryTypes: [
    'Earrings',
    'Bracelet',
    'Pendant',
    'Necklace',
    'Jewellery Set',
    'Need Guidance',
  ],
  budgets: [
    '₹ 25,000 - ₹ 50,000 per gift',
    '₹ 50,000 - ₹ 1,00,000 per gift',
    '₹ 1,00,000 - ₹ 2,50,000 per gift',
    '₹ 2,50,000+ per gift',
    'Custom Bulk Budget',
  ],
};

export const finalCtaData = {
  headingLine1: 'GIVE THEM SOMETHING',
  headingLine2: "THEY'LL REMEMBER.",
  smallText: 'Discover thoughtful pearl jewellery for your next corporate occasion.',
  ctaText: 'START A CONVERSATION',
  pearlImage: 'https://images.pexels.com/photos/9429420/pexels-photo-9429420.jpeg?auto=compress&cs=tinysrgb&w=800',
};
