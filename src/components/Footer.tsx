import { Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useShop } from '@/context/ShopContext';
import { ShopCategory } from '@/types/shop';

const footerColumns = [
  {
    title: 'SHOP',
    links: [
      { label: 'New In', category: 'new-arrivals' },
      { label: 'Necklaces', category: 'necklaces' },
      { label: 'Earrings', category: 'earrings' },
      { label: 'Bracelets & Rings', category: 'bracelets' },
      { label: 'Bridal Collection', category: 'bridal' },
      { label: 'Corporate Gifting', action: 'gifting' },
    ],
  },
  {
    title: 'ABOUT',
    links: [
      { label: 'Our Story', action: 'about' },
      { label: 'Craftsmanship', action: 'about' },
      { label: 'Pearl Education', action: 'education' },
      { label: 'Sustainability', action: 'about' },
    ],
  },
  {
    title: 'CUSTOMER CARE',
    links: [
      { label: 'Private Concierge', action: 'contact' },
      { label: 'Bespoke Consultation', action: 'contact' },
      { label: 'Shipping & Delivery', action: 'contact' },
      { label: 'Care & Maintenance', action: 'education' },
      { label: 'FAQs', action: 'contact' },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Youtube, label: 'YouTube' },
  { icon: MessageCircle, label: 'WhatsApp' },
];

export default function Footer() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { setCurrentPage, setCategory } = useShop();

  const handleLinkClick = (link: { label: string; category?: string; action?: string }) => {
    if (link.action === 'gifting') {
      setCurrentPage('gifting');
      window.history.pushState({}, '', '/gifting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.action === 'about') {
      setCurrentPage('about');
      window.history.pushState({}, '', '/about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.category) {
      setCurrentPage('shop');
      setCategory(link.category as ShopCategory);
      window.history.pushState({}, '', `/shop?category=${link.category}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.action === 'education') {
      setCurrentPage('education');
      window.history.pushState({}, '', '/education');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.action === 'contact') {
      setCurrentPage('contact');
      window.history.pushState({}, '', '/contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={ref}
      className="bg-[#F4F0E8] text-[#171412] pt-16 sm:pt-20 lg:pt-28 pb-10 px-6 lg:px-14 border-t border-[#171412]/10"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Top 4-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
          {/* Column 1: MAHARAJ JEWELLERY */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex flex-col leading-none mb-4">
                <span className="font-serif text-2xl lg:text-3xl font-normal tracking-[0.18em] text-[#171412]">
                  MAHARAJ
                </span>
                <span className="font-sans text-[9.5px] font-normal tracking-[0.25em] uppercase text-[#171412]/70 mt-1">
                  JEWELLERY
                </span>
                <span className="mt-3 h-[1.5px] w-8 bg-[#B79A5A]" />
              </div>
              <p className="font-sans text-[#171412]/75 text-xs tracking-wider uppercase font-normal leading-relaxed max-w-xs mt-4">
                Exceptional Pearls.
                <br />
                Crafted into Timeless Jewellery.
              </p>
            </motion.div>
          </div>

          {/* Link Columns: SHOP, ABOUT, CUSTOMER CARE */}
          {footerColumns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="font-sans text-xs tracking-[0.12em] uppercase font-medium text-[#B79A5A] mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-[#171412]/80 text-sm font-sans font-normal hover:text-[#B79A5A] transition-colors duration-300 text-left min-touch-target flex items-center"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Connect & Privacy Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-[#171412]/10"
        >
          <div className="flex items-center gap-6">
            <span className="font-sans text-xs tracking-[0.1em] uppercase font-medium text-[#171412]/70">
              Connect
            </span>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-[#171412]/75 hover:text-[#B79A5A] transition-colors duration-300 min-touch-target flex items-center justify-center p-1"
                >
                  <Icon size={19} strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-sans text-xs tracking-wider uppercase font-normal text-[#171412]/70 hover:text-[#B79A5A] transition-colors duration-300 min-touch-target flex items-center"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-sans text-xs tracking-wider uppercase font-normal text-[#171412]/70 hover:text-[#B79A5A] transition-colors duration-300 min-touch-target flex items-center"
            >
              Terms of Concierge
            </a>
            <button
              onClick={() => setCurrentPage('admin')}
              className="font-sans text-xs tracking-wider uppercase font-medium text-[#B79A5A] hover:underline transition-colors duration-300 min-touch-target flex items-center"
            >
              Admin Portal
            </button>
          </div>
        </motion.div>

        {/* Copyright Footer Line */}
        <div className="text-center pt-6 border-t border-[#171412]/10">
          <p className="font-sans text-[#171412]/60 text-xs tracking-[0.1em] uppercase font-normal">
            © 2026 MAHARAJ JEWELLERY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
