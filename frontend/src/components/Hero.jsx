import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative pt-20 pb-24 overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/60">
      
      {/* Halos de lumière décoratifs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-linear-to-tr from-digitBlue/10 via-digitPink/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge Supérieur */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-digitBlue/10 border border-digitBlue/20 text-digitBlue text-xs font-bold mb-6 backdrop-blur-xs cursor-default"
          >
            <Sparkles size={14} className="animate-pulse text-digitPink" />
            <span>{t('hero_badge', 'Agence Digitale 360° & Support IT au Cameroun')}</span>
          </motion.div>

          {/* Titre Principal */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6 text-slate-900">
            {t('hero_title_1', 'Propulsez votre marque vers ')}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-digitBlue via-sky-500 to-digitPink">
              {t('hero_title_gradient', 'l\'excellence numérique')}
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            {t('hero_subtitle', 'Développement Web sur-mesure, Design Graphique, Community Management et Infrastructure IT. Nous transformons vos idées en solutions performantes.')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#quote-section"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-digitBlue hover:bg-digitPink text-white font-bold px-8 py-4 rounded-sm text-sm transition-colors duration-500 shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{t('hero_btn_quote', 'Lancer mon projet')}</span>
              <ArrowRight size={18} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#portfolio"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-8 py-4 rounded-sm text-sm border border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              <span>{t('hero_btn_portfolio', 'Découvrir nos travaux')}</span>
            </motion.a>
          </div>

          {/* Points Forts */}
          <div className="pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-semibold text-slate-600">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <span>{t('hero_feat_1', 'Livraison rapide & Sécurisée')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap size={16} className="text-amber-500 shrink-0" />
              <span>{t('hero_feat_2', 'Architectures Scalables')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-digitBlue shrink-0" />
              <span>{t('hero_feat_3', 'Support Technologique 24/7')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}