import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { enquiryOptions } from '@/data/giftingData';
import { Send, CheckCircle, ShieldCheck } from 'lucide-react';

interface GiftingEnquiryFormProps {
  initialOccasion?: string;
  initialProduct?: string;
}

export default function GiftingEnquiryForm({ initialOccasion, initialProduct }: GiftingEnquiryFormProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    phoneNumber: '',
    numberOfGifts: '25-50',
    occasion: initialOccasion || 'Employee Recognition',
    preferredJewellery: initialProduct || 'Jewellery Set',
    budgetRange: '₹ 50,000 - ₹ 1,00,000 per gift',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <section
      id="corporate-enquiry"
      ref={ref}
      className="w-full bg-[#F7F3EC] py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-b border-[rgba(41,35,31,0.08)] overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="w-6 h-px bg-[#C8A96B]" />
            <span className="text-[11px] lg:text-[12px] tracking-[0.3em] font-medium uppercase text-[#B8A99A]">
              CORPORATE GIFTING ENQUIRY
            </span>
            <span className="w-6 h-px bg-[#C8A96B]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight mb-4"
          >
            LET'S CREATE SOMETHING MEANINGFUL.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#29231F]/80 text-base sm:text-lg font-light leading-relaxed"
          >
            Tell us about your gifting requirements and our team will help curate the right jewellery experience.
          </motion.p>
        </div>

        {/* ELEGANT FORM CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FFFDF8] border border-[rgba(41,35,31,0.14)] p-8 sm:p-12 lg:p-16 rounded-xs shadow-[0_15px_40px_rgba(41,35,31,0.04)]"
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center py-12 px-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#F7F3EC] border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] mb-6">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-serif text-3xl text-[#29231F] font-normal mb-3">
                  Enquiry Received
                </h3>
                <p className="text-[#29231F]/80 text-base font-light max-w-md mb-8 leading-relaxed">
                  Thank you, <span className="font-medium text-[#29231F]">{formData.fullName}</span>. Our Corporate Concierge team has received your enquiry and will respond within 24 business hours with a tailored lookbook and pricing proposal.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      fullName: '',
                      companyName: '',
                      workEmail: '',
                      phoneNumber: '',
                      numberOfGifts: '25-50',
                      occasion: 'Employee Recognition',
                      preferredJewellery: 'Jewellery Set',
                      budgetRange: '₹ 50,000 - ₹ 1,00,000 per gift',
                      message: '',
                    });
                  }}
                  className="px-8 py-3 bg-[#29231F] text-[#FFFDF8] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C8A96B] hover:text-[#29231F] transition-colors duration-300"
                >
                  Submit Another Enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                      Full Name <span className="text-[#C8A96B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Vikramaditya Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] px-4 py-3.5 text-sm text-[#29231F] font-light placeholder:text-[#B8A99A]/60 focus:outline-none focus:border-[#C8A96B] transition-colors duration-300"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                      Company Name <span className="text-[#C8A96B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="e.g. Oberoi Enterprises"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] px-4 py-3.5 text-sm text-[#29231F] font-light placeholder:text-[#B8A99A]/60 focus:outline-none focus:border-[#C8A96B] transition-colors duration-300"
                    />
                  </div>

                  {/* Work Email */}
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                      Work Email <span className="text-[#C8A96B]">*</span>
                    </label>
                    <input
                      type="email"
                      name="workEmail"
                      required
                      placeholder="name@company.com"
                      value={formData.workEmail}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] px-4 py-3.5 text-sm text-[#29231F] font-light placeholder:text-[#B8A99A]/60 focus:outline-none focus:border-[#C8A96B] transition-colors duration-300"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                      Phone Number <span className="text-[#C8A96B]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] px-4 py-3.5 text-sm text-[#29231F] font-light placeholder:text-[#B8A99A]/60 focus:outline-none focus:border-[#C8A96B] transition-colors duration-300"
                    />
                  </div>

                  {/* Number of Gifts */}
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                      Number of Gifts
                    </label>
                    <input
                      type="text"
                      name="numberOfGifts"
                      placeholder="e.g. 50 pieces"
                      value={formData.numberOfGifts}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] px-4 py-3.5 text-sm text-[#29231F] font-light placeholder:text-[#B8A99A]/60 focus:outline-none focus:border-[#C8A96B] transition-colors duration-300"
                    />
                  </div>

                  {/* Occasion Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                      Occasion
                    </label>
                    <select
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] px-4 py-3.5 text-sm text-[#29231F] font-light focus:outline-none focus:border-[#C8A96B] transition-colors duration-300"
                    >
                      {enquiryOptions.occasions.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Jewellery Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                      Preferred Jewellery
                    </label>
                    <select
                      name="preferredJewellery"
                      value={formData.preferredJewellery}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] px-4 py-3.5 text-sm text-[#29231F] font-light focus:outline-none focus:border-[#C8A96B] transition-colors duration-300"
                    >
                      {enquiryOptions.jewelleryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Range Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                      Budget Range
                    </label>
                    <select
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] px-4 py-3.5 text-sm text-[#29231F] font-light focus:outline-none focus:border-[#C8A96B] transition-colors duration-300"
                    >
                      {enquiryOptions.budgets.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message / Special Instructions */}
                <div className="flex flex-col">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#29231F] mb-2.5">
                    Message / Custom Requirements
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Share any details about delivery dates, customization requests, or recipient profiles..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#FFFDF8] border border-[rgba(41,35,31,0.2)] p-4 text-sm text-[#29231F] font-light placeholder:text-[#B8A99A]/60 focus:outline-none focus:border-[#C8A96B] transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Privacy note & Submit CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-[rgba(41,35,31,0.1)]">
                  <div className="flex items-center gap-2 text-xs text-[#B8A99A] font-light">
                    <ShieldCheck size={16} className="text-[#C8A96B]" />
                    <span>Your corporate information is strictly confidential.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#29231F] text-[#FFFDF8] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#C8A96B] hover:text-[#29231F] transition-all duration-300 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>SUBMITTING...</span>
                    ) : (
                      <>
                        <span>SUBMIT ENQUIRY</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
