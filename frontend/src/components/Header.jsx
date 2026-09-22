import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import logoSvg from '../assets/inlineColor.svg';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.getElementById(href.replace('#', ''));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '#home', label: t('nav_home', 'Accueil') },
    { href: '#services', label: t('nav_services', 'Services') },
    { href: '#portfolio', label: t('nav_portfolio', 'Portfolio') },
    { href: '#team', label: t('nav_team', 'Notre Équipe') },
    { href: '#blog', label: t('nav_blog', 'Actualités') }
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/85 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3' 
          : 'bg-white/60 backdrop-blur-xs border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Agency */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <img 
            src={logoSvg} 
            alt="DIGIT-CONNECT LOGO" 
            className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </a>

        {/* Navigation Desktop Moderne & Soft */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-digitBlue px-4 py-2 rounded-full transition-all duration-200 hover:bg-white hover:shadow-2xs cursor-pointer"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="bg-digitPink hover:bg-digitPink/90 text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer font-bold text-xs uppercase shadow-2xs hover:shadow-sm"
          >
            {t('nav_contact', 'Contact')}
          </a>
        </nav>

        {/* Actions Droite */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Selective Switcher FR/EN */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-100 px-3.5 py-2 rounded-full border border-slate-200 text-slate-700 font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Globe size={14} className="text-digitBlue" />
            <span>{i18n.language.toUpperCase()}</span>
          </button>
          
          {/* Demande de Devis */}
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#quote-section" 
            onClick={(e) => handleNavClick(e, '#quote-section')}
            className="flex items-center gap-2 bg-digitBlue hover:bg-digitPink text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors duration-300 shadow-sm cursor-pointer"
          >
            <span>{t('nav_quote', 'Demander un Devis')}</span>
            <ArrowRight size={14} />
          </motion.a>
        </div>

        {/* Trigger Mobile */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-5 space-y-3 overflow-hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block text-sm font-bold text-slate-700 hover:text-digitBlue py-2 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="block text-center bg-digitPink text-white py-2.5 rounded-full text-xs font-bold shadow-xs cursor-pointer uppercase"
              >
                {t('nav_contact', 'Contact')}
              </a>
              
              <div className="flex gap-2">
                <button 
                  onClick={toggleLanguage}
                  className="w-1/3 flex items-center justify-center gap-1.5 text-xs bg-slate-100 py-2.5 rounded-full font-bold text-slate-700 cursor-pointer"
                >
                  <Globe size={14} className="text-digitBlue" />
                  <span>{i18n.language.toUpperCase()}</span>
                </button>

                <a 
                  href="#quote-section" 
                  onClick={(e) => handleNavClick(e, '#quote-section')}
                  className="w-2/3 flex items-center justify-center gap-2 bg-digitBlue text-white py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer"
                >
                  <span>{t('nav_quote', 'Devis')}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}