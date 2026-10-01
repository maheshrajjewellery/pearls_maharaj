import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function Newsletter() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section ref={ref} className="bg-pearl-100 py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[#171412] text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.08] tracking-[0.01em]"
        >
          Enter The World
          <br />
          Of Maharaj.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#171412]/80 text-sm font-sans font-normal max-w-md mx-auto mt-6 leading-[1.6]"
        >
          Discover new collections, jewellery stories and exclusive launches.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-12 max-w-lg mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email Address"
            required
            className="flex-1 w-full bg-transparent border-b border-[#171412]/30 px-2 py-3 text-sm font-sans font-normal text-[#171412] placeholder:text-[#171412]/40 focus:outline-none focus:border-[#B79A5A] transition-colors duration-300"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#171412] text-[#F7F3EB] text-xs font-sans tracking-[0.1em] uppercase font-medium hover:bg-[#B79A5A] hover:text-[#171412] transition-colors duration-500 whitespace-nowrap group min-touch-target"
          >
            Subscribe
            <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-400" />
          </button>
        </motion.form>

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-champagne-500 text-xs tracking-widest uppercase font-light mt-6"
          >
            Thank you for subscribing.
          </motion.p>
        )}
      </div>
    </section>
  );
}
