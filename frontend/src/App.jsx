import React, { useState, useEffect, useRef } from 'react';
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
import { ArrowUp } from 'lucide-react';

import introVideo from './media/intro-logo.mp4';

import SEO from './components/SEO.jsx';

export default function App() {
  const [pageLoading, setPageLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    setPageLoading(false);
  };

  useEffect(() => {
    // Sécurité : si la vidéo dure au max 10s ou met du temps à charger, on débloque après 10s
    const maxTimer = setTimeout(() => {
      setPageLoading(false);
    }, 10000);

    return () => clearTimeout(maxTimer);
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
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={introVideo}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover"
        />
        {/* Bouton Passer */}
        <button
          onClick={() => setPageLoading(false)}
          className="absolute bottom-6 right-6 text-white/70 hover:text-white text-xs font-semibold uppercase tracking-widest bg-black/40 hover:bg-black/70 px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer border border-white/20 z-10"
        >
          Passer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-digitBlue selection:text-white animate-fade-in">
      <SEO 
        title="Accueil"
        description="DIGIT-CONNECT est votre partenaire technologique à Douala. Agence spécialisée en développement sur-mesure, branding et transformation digitale."
        keywords="agence web douala, devis gratuit site web, entreprise IT cameroun"
      />
      
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