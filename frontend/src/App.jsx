import React, { useState, useEffect } from 'react';
import './i18n/i18n.js';
import Header from './components/Header';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import QuoteStepper from './components/QuoteStepper';
import PortfolioSection from './components/PortfolioSection';
import TrustSlider from './components/TrustSlider.jsx';
import BlogSection from './components/BlogSection';
import TeamSection from './components/TeamSection.jsx';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer.jsx';
import { ArrowUp, Loader2 } from 'lucide-react';

export default function App() {
  const [pageLoading, setPageLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Écran de chargement doux au premier rendu
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Écoute du défilement pour le bouton "Retour en haut"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-opacity duration-500">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-digitBlue animate-spin flex items-center justify-center">
            <Loader2 className="animate-spin text-digitPink" size={20} />
          </div>
          <span className="text-xs font-black tracking-widest uppercase text-digitBlue">
            DIGIT-CONNECT AGENCY
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-digitBlue selection:text-white animate-fade-in">
      {/* En-tête Fixe */}
      <Header />

      {/* Sections Principales */}
      <Hero />
      <Services />

      {/* Section Générateur de Devis */}
      <QuoteStepper />
      
     {/* Réalisations & Partenaires */}
      <PortfolioSection />
      <TrustSlider />

      {/* Équipe & Blog */}
      <TeamSection />
      <BlogSection />

      {/* Contact & Pied de Page */}
      <ContactSection />
      <Footer />

      {/* Bouton Flottant Fixe : Retour au Hero (Smooth) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Retour en haut"
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-digitBlue hover:bg-digitPink text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-110 cursor-pointer border border-white/20 flex items-center justify-center active:scale-95"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}