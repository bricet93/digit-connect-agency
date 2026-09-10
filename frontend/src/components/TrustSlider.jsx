import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TRUST_LOGOS = [
  { name: 'Entreprise A', logo: 'https://www.logotouse.com/images/logos/delaware-colored.svg' },
  { name: 'Entreprise B', logo: 'https://www.logotouse.com/images/logos/springfield-colored.svg' },
  { name: 'Entreprise C', logo: 'https://www.logotouse.com/images/logos/aiken-colored.svg' },
  { name: 'Entreprise D', logo: 'https://www.logotouse.com/images/logos/manila-colored.svg' },
];

export default function TrustSlider() {
  const { t, i18n } = useTranslation();
  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('trust_title', 'Ils nous font confiance')}</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex gap-12 justify-center items-center opacity-70"
      >
        {TRUST_LOGOS.map((item, index) => (
          <motion.img 
            key={index} 
            src={item.logo} 
            alt={item.name} 
            whileHover={{ scale: 1.1, filter: "grayscale(0%)" }}
            transition={{ duration: 0.2 }}
            className="h-10 object-contain grayscale cursor-pointer" 
          />
        ))}
      </motion.div>
    </section>
  );
}