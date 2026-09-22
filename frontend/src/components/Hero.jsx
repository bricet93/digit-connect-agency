import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
    badge: 'Agence Digitale 360° & Support IT'
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
    badge: 'Ingénierie Web & Solutions Sur-Mesure'
  },
  {
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1920&q=80',
    badge: 'Design Graphique & Stratégie Digitale'
  }
];

export default function Hero() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50 pt-20 pb-16">
      
      {/* Arrière-plan animé avec orbes colorées */}
      <AnimatedBackground />

      {/* Slider d'images très claires avec fondu croisé */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 0.18, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url(${HERO_SLIDES[currentSlide].image})` }}
        />
      </AnimatePresence>

      {/* Masque dégradé blanc pour garantir une visibilité optimale */}
      <div className="absolute inset-0 bg-linear-to-b from-white/20 to-slate-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge Supérieur Soft */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold mb-6 shadow-sm backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-digitPink animate-pulse" />
            <span>{t('hero_badge', HERO_SLIDES[currentSlide].badge)}</span>
          </motion.div>

          {/* Titre Principal SOMBRE pour Light Theme */}
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

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <motion.a
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#quote-section"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-digitBlue hover:bg-digitPink text-white font-bold px-8 py-3.5 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
            >
              <span>{t('hero_btn_quote', 'Lancer mon projet')}</span>
              <ArrowRight size={16} />
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#portfolio"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold px-8 py-3.5 rounded-lg text-sm border border-slate-200/90 shadow-sm transition-all cursor-pointer"
            >
              <span>{t('hero_btn_portfolio', 'Découvrir nos travaux')}</span>
            </motion.a>
          </div>

          {/* En-tête des avantages / réassurance */}
          <div className="pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-semibold text-slate-600">
            <div className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-xs py-2.5 px-4 rounded-lg border border-slate-100 shadow-2xs">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>{t('hero_feat_1', 'Livraison rapide & Sécurisée')}</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-xs py-2.5 px-4 rounded-lg border border-slate-100 shadow-2xs">
              <Zap size={16} className="text-amber-500 shrink-0" />
              <span>{t('hero_feat_2', 'Architectures Scalables')}</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-xs py-2.5 px-4 rounded-lg border border-slate-100 shadow-2xs">
              <ShieldCheck size={16} className="text-digitBlue shrink-0" />
              <span>{t('hero_feat_3', 'Support Technologique 24/7')}</span>
            </div>
          </div>
        </motion.div>

        {/* Puces de suivi des slides */}
        <div className="flex justify-center gap-2 mt-10">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-digitPink' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}