import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  Phone,
  MessageSquare,
  Instagram,
  Facebook,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import {
  contactConfig,
  interestOptions,
  budgetOptions,
  InterestType,
} from '@/data/contactData';
import { useInView } from '@/hooks/useInView';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  interest: InterestType;
  budget: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  message?: string;
  general?: string;
}

interface ConsultationFormSectionProps {
  selectedInterest?: string;
  onResetSelectedInterest?: () => void;
}

export default function ConsultationFormSection({
  selectedInterest,
  onResetSelectedInterest,
}: ConsultationFormSectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    interest: 'Jewellery Enquiry',
    budget: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync incoming interest selection from external cards/buttons
  useEffect(() => {
    if (selectedInterest) {
      const match = interestOptions.find(
        (opt) => opt.toLowerCase() === selectedInterest.toLowerCase()
      );
      if (match) {
        setFormData((prev) => ({ ...prev, interest: match }));
      }
    }
  }, [selectedInterest]);

  const validateField = (name: keyof FormState, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Please provide your full name.';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters.';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Please provide your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        return undefined;
      case 'message':
        if (!value.trim()) return 'Please tell us about your enquiry.';
        if (value.trim().length < 10) return 'Message should be at least 10 characters.';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name as keyof FormState, value);
      setErrors((prev) => ({ ...prev, [name]: error, general: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateField('fullName', formData.fullName);
    const emailError = validateField('email', formData.email);
    const messageError = validateField('message', formData.message);

    const newErrors: FormErrors = {
      fullName: nameError,
      email: emailError,
      message: messageError,
    };

    setTouched({
      fullName: true,
      email: true,
      message: true,
    });

    if (nameError || emailError || messageError) {
      newErrors.general = 'Please check the highlighted fields below.';
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate luxury API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onResetSelectedInterest) {
        onResetSelectedInterest();
      }
    }, 800);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      interest: 'Jewellery Enquiry',
      budget: '',
      message: '',
    });
    setErrors({});
    setTouched({});
    setIsSuccess(false);
  };

  return (
    <section
      id="consultation-form"
      ref={ref}
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#F7F3EC] border-b border-[#30372F]/10 scroll-mt-24"
      aria-label="Consultation Form and Contact Information"
    >
      <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-3"
          >
            <span className="h-px w-6 bg-[#C5A15A]" />
            <span className="text-[#C5A15A] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase">
              PRIVATE CONSULTATION
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(30px,4.5vw,48px)] font-normal text-[#30372F] tracking-[-0.01em] mb-3"
          >
            START A CONVERSATION
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[15px] sm:text-[16px] text-[#30372F]/75 font-light leading-relaxed"
          >
            Tell us a little about what you're looking for and our team will get back to you.
          </motion.p>
        </div>

        {/* Grid: Left Form (58%) & Right Contact Info (42%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
          
          {/* ========================================================= */}
          {/* LEFT: MINIMAL LUXURY CONSULTATION FORM                    */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-[#FFFDF8] p-8 sm:p-12 border border-[#30372F]/10 shadow-[0_4px_24px_rgba(41,35,31,0.04)] relative"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                /* SUCCESS STATE */
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="py-12 sm:py-16 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#E8DCD5]/60 border border-[#C5A15A]/50 flex items-center justify-center mb-6 text-[#C5A15A]">
                    <Sparkles size={24} strokeWidth={1.5} />
                  </div>

                  <span className="text-[11px] font-sans font-medium tracking-[0.25em] text-[#C5A15A] uppercase mb-2">
                    ENQUIRY CONFIRMATION
                  </span>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#30372F] font-normal tracking-tight mb-4">
                    THANK YOU.
                  </h3>

                  <p className="font-sans text-[15px] sm:text-[16px] text-[#30372F]/75 font-light max-w-[440px] leading-relaxed mb-8">
                    Your enquiry has been received. Our team will get back to you shortly.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={handleResetForm}
                      className="px-6 py-3 bg-[#30372F] hover:bg-[#C5A15A] text-[#FFFDF8] hover:text-[#30372F] text-[11px] font-sans font-medium tracking-[0.2em] uppercase transition-colors duration-300"
                    >
                      SEND ANOTHER ENQUIRY
                    </button>
                    <a
                      href={`mailto:${contactConfig.conciergeEmail}`}
                      className="text-[12px] font-sans text-[#30372F]/70 hover:text-[#C5A15A] transition-colors duration-300 underline underline-offset-4"
                    >
                      Contact Concierge directly
                    </a>
                  </div>
                </motion.div>
              ) : (
                /* CONSULTATION FORM */
                <form key="active-form" onSubmit={handleSubmit} noValidate className="space-y-7">
                  
                  {/* General error notification */}
                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#E8DCD5]/70 border border-[#30372F]/15 flex items-center gap-3 text-[#30372F] text-[13px] font-sans"
                    >
                      <AlertCircle size={17} className="text-[#C5A15A] flex-shrink-0" />
                      <span>{errors.general}</span>
                    </motion.div>
                  )}

                  {/* Field 1: FULL NAME */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-[11px] font-sans font-medium tracking-[0.12em] uppercase text-[#30372F] mb-2"
                    >
                      FULL NAME <span className="text-[#C5A15A]">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="e.g. Eleanor Vance"
                      aria-required="true"
                      aria-invalid={touched.fullName && !!errors.fullName}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      className={`w-full min-h-[48px] bg-transparent border-b ${
                        touched.fullName && errors.fullName
                          ? 'border-red-600/70'
                          : 'border-[#30372F]/20 focus:border-[#C5A15A]'
                      } text-[#30372F] text-[15px] font-sans placeholder-[#30372F]/35 focus:outline-none transition-colors duration-300 pb-2`}
                    />
                    {touched.fullName && errors.fullName && (
                      <p id="fullName-error" className="mt-1.5 text-[12px] text-red-700 font-sans">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* 2 Column Row: EMAIL & PHONE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    {/* Field 2: EMAIL ADDRESS */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[11px] font-sans font-medium tracking-[0.12em] uppercase text-[#30372F] mb-2"
                      >
                        EMAIL ADDRESS <span className="text-[#C5A15A]">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="e.g. eleanor@example.com"
                        aria-required="true"
                        aria-invalid={touched.email && !!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`w-full min-h-[48px] bg-transparent border-b ${
                          touched.email && errors.email
                            ? 'border-red-600/70'
                            : 'border-[#30372F]/20 focus:border-[#C5A15A]'
                        } text-[#30372F] text-[15px] font-sans placeholder-[#30372F]/35 focus:outline-none transition-colors duration-300 pb-2`}
                      />
                      {touched.email && errors.email && (
                        <p id="email-error" className="mt-1.5 text-[12px] text-red-700 font-sans">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Field 3: PHONE NUMBER */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[11px] font-sans font-medium tracking-[0.12em] uppercase text-[#30372F] mb-2"
                      >
                        PHONE NUMBER <span className="text-[#30372F]/40 font-normal">(OPTIONAL)</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full min-h-[48px] bg-transparent border-b border-[#30372F]/20 focus:border-[#C5A15A] text-[#30372F] text-[15px] font-sans placeholder-[#30372F]/35 focus:outline-none transition-colors duration-300 pb-2"
                      />
                    </div>
                  </div>

                  {/* 2 Column Row: INTEREST & BUDGET */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    {/* Field 4: WHAT ARE YOU INTERESTED IN? */}
                    <div>
                      <label
                        htmlFor="interest"
                        className="block text-[11px] font-sans font-medium tracking-[0.12em] uppercase text-[#30372F] mb-2"
                      >
                        WHAT ARE YOU INTERESTED IN?
                      </label>
                      <div className="relative">
                        <select
                          id="interest"
                          name="interest"
                          value={formData.interest}
                          onChange={handleChange}
                          className="w-full min-h-[48px] bg-transparent border-b border-[#30372F]/20 focus:border-[#C5A15A] text-[#30372F] text-[15px] font-sans appearance-none focus:outline-none transition-colors duration-300 pb-2 pr-8 cursor-pointer"
                        >
                          {interestOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#FFFDF8] text-[#30372F] py-2">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-1 bottom-3 text-[#30372F]/50 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Field 5: BUDGET RANGE (OPTIONAL) */}
                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-[11px] font-sans font-medium tracking-[0.12em] uppercase text-[#30372F] mb-2"
                      >
                        BUDGET RANGE <span className="text-[#30372F]/40 font-normal">(OPTIONAL)</span>
                      </label>
                      <div className="relative">
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full min-h-[48px] bg-transparent border-b border-[#30372F]/20 focus:border-[#C5A15A] text-[#30372F] text-[15px] font-sans appearance-none focus:outline-none transition-colors duration-300 pb-2 pr-8 cursor-pointer"
                        >
                          <option value="" className="bg-[#FFFDF8] text-[#30372F]/50">
                            Select budget preference...
                          </option>
                          {budgetOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#FFFDF8] text-[#30372F] py-2">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-1 bottom-3 text-[#30372F]/50 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Field 6: MESSAGE */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[11px] font-sans font-medium tracking-[0.12em] uppercase text-[#30372F] mb-2"
                    >
                      MESSAGE <span className="text-[#C5A15A]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={() => handleBlur('message')}
                      placeholder="Share details about the piece you desire, occasion, or any specific requirements..."
                      aria-required="true"
                      aria-invalid={touched.message && !!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={`w-full min-h-[100px] bg-transparent border-b ${
                        touched.message && errors.message
                          ? 'border-red-600/70'
                          : 'border-[#30372F]/20 focus:border-[#C5A15A]'
                      } text-[#30372F] text-[15px] font-sans placeholder-[#30372F]/35 focus:outline-none transition-colors duration-300 py-2 resize-y`}
                    />
                    {touched.message && errors.message && (
                      <p id="message-error" className="mt-1.5 text-[12px] text-red-700 font-sans">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-4 px-9 py-4 bg-[#30372F] hover:bg-[#C5A15A] text-[#FFFDF8] hover:text-[#30372F] text-[12px] font-sans font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(41,35,31,0.08)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span>{isSubmitting ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}</span>
                      <ArrowRight
                        size={15}
                        strokeWidth={1.8}
                        className="group-hover:translate-x-1.5 transition-transform duration-300"
                      />
                    </button>
                    <p className="mt-3 text-[11px] font-sans text-[#30372F]/50">
                      Your privacy is sacred. We never share your personal information.
                    </p>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT: CONNECT WITH MAHARAJ                               */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col space-y-8"
          >
            {/* Direct Channels Card */}
            <div className="p-8 sm:p-10 bg-[#FFFDF8] border border-[#30372F]/10">
              <span className="text-[11px] font-sans font-medium tracking-[0.25em] text-[#C5A15A] uppercase block mb-3">
                DIRECT CHANNELS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#30372F] font-normal mb-6">
                CONNECT WITH MAHARAJ
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F7F3EC] flex items-center justify-center text-[#30372F] flex-shrink-0 mt-0.5">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#30372F]/50 block">
                      EMAIL
                    </span>
                    <a
                      href={`mailto:${contactConfig.email}`}
                      className="font-sans text-[15px] font-normal text-[#30372F] hover:text-[#C5A15A] transition-colors duration-300"
                    >
                      {contactConfig.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F7F3EC] flex items-center justify-center text-[#30372F] flex-shrink-0 mt-0.5">
                    <Phone size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#30372F]/50 block">
                      PHONE
                    </span>
                    <span className="font-sans text-[15px] font-normal text-[#30372F]">
                      {contactConfig.phone}
                    </span>
                  </div>
                </div>

                {/* Hours / Schedule */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F7F3EC] flex items-center justify-center text-[#30372F] flex-shrink-0 mt-0.5">
                    <Clock size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#30372F]/50 block">
                      CONCIERGE HOURS
                    </span>
                    <p className="font-sans text-[13px] text-[#30372F]/80 leading-relaxed">
                      {contactConfig.hoursWeekday}
                      <br />
                      <span className="text-[#C5A15A]">{contactConfig.hoursWeekend}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* WHATSAPP BUTTON (Maharaj Palette, not bright green) */}
              <div className="mt-8 pt-8 border-t border-[#30372F]/10">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#30372F]/50 block mb-3">
                  INSTANT ADVISORY
                </span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(contactConfig.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between w-full p-4 bg-[#F7F3EC] hover:bg-[#E8DCD5] border border-[#30372F]/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-[#30372F]/20 flex items-center justify-center text-[#30372F]">
                      <MessageSquare size={15} strokeWidth={1.6} />
                    </div>
                    <div>
                      <span className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-[#30372F] block">
                        CHAT ON WHATSAPP
                      </span>
                      <span className="text-[12px] font-sans text-[#30372F]/60">
                        Immediate assistance & pearl curations
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                    className="text-[#30372F] group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </a>
              </div>

              {/* Social Channels */}
              <div className="mt-6 pt-6 border-t border-[#30372F]/10 flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#30372F]/50">
                  FOLLOW THE MAISON
                </span>
                <div className="flex items-center gap-4">
                  <a
                    href={contactConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#F7F3EC] hover:bg-[#C5A15A] text-[#30372F] hover:text-[#FFFDF8] flex items-center justify-center transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} strokeWidth={1.6} />
                  </a>
                  <a
                    href={contactConfig.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#F7F3EC] hover:bg-[#C5A15A] text-[#30372F] hover:text-[#FFFDF8] flex items-center justify-center transition-colors duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook size={16} strokeWidth={1.6} />
                  </a>
                </div>
              </div>
            </div>

            {/* Private Guarantee Note */}
            <div className="p-6 bg-[#E8DCD5]/40 border border-[#30372F]/10 flex items-start gap-4">
              <CheckCircle2 size={18} className="text-[#C5A15A] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-[17px] text-[#30372F] font-normal mb-1">
                  Private & Bespoke Consultation
                </h4>
                <p className="font-sans text-[13px] text-[#30372F]/75 leading-relaxed">
                  Every enquiry is attended to personally by a senior pearl gemologist. We value discretion, heritage integrity, and lasting relationships.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
