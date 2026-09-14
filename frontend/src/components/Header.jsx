import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import de votre logo SVG depuis assets
import logoSvg from '../assets/inlineColor.svg';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Liens standards (sans Contact)
  const navLinks = [
    { href: '#home', label: t('nav_home', 'Accueil') },
    { href: '#services', label: t('nav_services', 'Services') },
    { href: '#portfolio', label: t('nav_portfolio', 'Portfolio') },
    { href: '#team', label: t('nav_team', 'Notre Équipe') },
    { href: '#blog', label: t('nav_blog', 'Actualités') }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        
        {/* Logo SVG */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <img 
            src={logoSvg} 
            alt="DIGIT-CONNECT LOGO" 
            className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
          />
        </a>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-extrabold uppercase tracking-wider text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-digitBlue transition-colors duration-200 relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-digitBlue hover:after:w-full after:transition-all after:duration-500 cursor-pointer"
            >
              {link.label}
            </a>
          ))}

          {/* Bouton Contact mis en évidence */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="bg-digitPink hover:bg-digitPink/90 text-white px-4 py-2 rounded-sm shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer font-bold tracking-normal text-xs uppercase"
          >
            {t('nav_contact', 'Contact')}
          </a>
        </nav>

        {/* Boutons d'action */}
        <div className="hidden lg:flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 px-3.5 py-2 rounded-sm border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
          >
            <Globe size={14} className="text-digitBlue" />
            <span>{i18n.language.toUpperCase()}</span>
          </motion.button>
          
          <motion.a 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#quote-section" 
            onClick={(e) => handleNavClick(e, '#quote-section')}
            className="flex items-center gap-2 bg-digitBlue hover:bg-digitPink text-white px-5 py-2.5 rounded-sm text-xs font-bold transition-colors duration-500 shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>{t('nav_quote', 'Demander un Devis')}</span>
            <ArrowRight size={14} />
          </motion.a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Animé */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 space-y-3 overflow-hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block text-sm font-bold text-slate-700 hover:text-digitBlue py-1.5 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="block text-center bg-digitPink text-white py-2.5 rounded-sm text-sm font-bold shadow-xs cursor-pointer"
            >
              {t('nav_contact', 'Contact')}
            </a>
            <a 
              href="#quote-section" 
              onClick={(e) => handleNavClick(e, '#quote-section')}
              className="flex items-center justify-center gap-2 bg-digitBlue text-white w-full py-3 rounded-sm text-xs font-bold shadow-md cursor-pointer"
            >
              <span>{t('nav_quote', 'Demander un Devis')}</span>
              <ArrowRight size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}