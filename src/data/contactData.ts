export interface ContactOption {
  number: string;
  title: string;
  description: string;
  interestValue: string;
  actionText: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactConfig {
  email: string;
  conciergeEmail: string;
  phone: string;
  formattedPhone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle: string;
  instagramUrl: string;
  facebookUrl: string;
  storeStatus: string;
  storeNote: string;
  hoursWeekday: string;
  hoursWeekend: string;
  consultationNotice: string;
}

export const contactConfig: ContactConfig = {
  email: 'hello@maharajjewellery.com',
  conciergeEmail: 'concierge@maharajjewellery.com',
  phone: '+91 XXXXX XXXXX',
  formattedPhone: '+91 (0) XX-XXXX-XXXX',
  whatsappNumber: '+91 XXXXX XXXXX',
  whatsappMessage: 'Hello Maharaj Jewellery, I would like to enquire about a private consultation.',
  instagramHandle: '@maharajjewellery',
  instagramUrl: 'https://instagram.com/maharajjewellery',
  facebookUrl: 'https://facebook.com/maharajjewellery',
  storeStatus: 'Store location details coming soon.',
  storeNote: 'Private atelier viewings and one-on-one appointments will be hosted at our upcoming flagship studio.',
  hoursWeekday: 'Monday – Saturday: 10:30 AM – 7:30 PM IST',
  hoursWeekend: 'Sunday: By Private Appointment',
  consultationNotice: 'Our pearl specialists and master jewellers reply to all enquiries within 2–4 business hours.',
};

export const contactOptions: ContactOption[] = [
  {
    number: '01',
    title: 'JEWELLERY ENQUIRY',
    description: 'Questions about a product or collection?',
    interestValue: 'Jewellery Enquiry',
    actionText: 'EXPLORE →',
  },
  {
    number: '02',
    title: 'CUSTOM JEWELLERY',
    description: 'Looking for something designed especially for you?',
    interestValue: 'Custom Jewellery',
    actionText: 'DISCUSS DESIGN →',
  },
  {
    number: '03',
    title: 'BRIDAL & EVENTS',
    description: 'Planning jewellery for a special occasion?',
    interestValue: 'Bridal Jewellery',
    actionText: 'PLAN YOUR LOOK →',
  },
];

export const interestOptions = [
  'Jewellery Enquiry',
  'Custom Jewellery',
  'Bridal Jewellery',
  'Pearl Consultation',
  'Order Assistance',
  'Corporate Gifting',
  'Other',
] as const;

export type InterestType = (typeof interestOptions)[number];

export const budgetOptions = [
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000+',
] as const;

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How can I enquire about a product?',
    answer:
      'You can enquire directly using our consultation form above, reach our concierge team via WhatsApp, or email us at hello@maharajjewellery.com. If you have a specific piece in mind, please include its name or reference code. Our pearl specialists typically respond within 2 to 4 business hours.',
  },
  {
    id: 'faq-2',
    question: 'Can I request a custom jewellery piece?',
    answer:
      'Yes, bespoke creations are the hallmark of Maharaj Jewellery. From selecting individual rare South Sea and Tahitian pearls to collaborating on hand-drawn sketches and choosing precious metals (18K/22K gold, platinum, or sterling silver), our master artisans will bring your vision to life.',
  },
  {
    id: 'faq-3',
    question: 'Do you offer bridal consultations?',
    answer:
      'We offer private, complimentary bridal consultations for brides, grooms, and families. Our specialists work closely with you to curate harmonious pearl necklaces, chokers, maang tikkas, and heirloom suites tailored to your wedding wardrobe and ceremony aesthetic.',
  },
  {
    id: 'faq-4',
    question: 'Can I get help choosing a pearl?',
    answer:
      'Choosing the right pearl is an intimate experience. Our certified pearl experts guide you through luster grades, nacre thickness, surface purity, overtone nuances, and pearl origins (South Sea, Tahitian, Akoya, and Freshwater) to ensure your choice aligns with your style and budget.',
  },
  {
    id: 'faq-5',
    question: 'How can I track my order?',
    answer:
      'Upon dispatch from our atelier, you will receive a secure tracking link via email and SMS. Every Maharaj Jewellery order is fully insured and delivered via high-security courier services with signature confirmation required upon delivery.',
  },
  {
    id: 'faq-6',
    question: 'How can I contact customer support?',
    answer:
      'Our dedicated Client Care team is available Monday through Saturday from 10:30 AM to 7:30 PM IST. You can reach us via our online consultation form, email at concierge@maharajjewellery.com, or directly through our WhatsApp concierge service for immediate assistance.',
  },
];
