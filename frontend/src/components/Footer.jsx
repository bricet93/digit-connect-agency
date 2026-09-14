import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

// Import de votre logo SVG depuis assets
import logoSvg from '../assets/inlineLight.svg';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
        
        {/* Colonne 1 : Présentation & Branding */}
        <div className="lg:col-span-2 space-y-4">
          <a href="#home" className="inline-block">
            <span className="text-2xl font-bold italic text-white tracking-tight">
              DIGIT-<span className="text-digitPink">CONNECT</span> AGENCY
            </span>
          </a>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {t('footer_about', "Agence 360° spécialisée dans la transformation digitale, la création de solutions Web & Mobile sur-mesure, le marketing d'influence, le design graphique et le conseil IT.")}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-800 hover:bg-slate-300 text-slate-300 hover:text-slate-800 rounded-sm transition-all duration-500">
              <FaLinkedinIn />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-800 hover:bg-slate-300 text-slate-300 hover:text-slate-800 rounded-sm transition-all duration-500">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 bg-slate-800 hover:bg-slate-300 text-slate-300 hover:text-slate-800 rounded-sm transition-all duration-500">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Colonne 2 : Liens Rapides */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{t('footer_navigation', 'Navigation')}</h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-400">
            <li><a href="#home" className="hover:text-slate-100 transition-colors">{t('nav_home', 'Accueil')}</a></li>
            <li><a href="#services" className="hover:text-slate-100 transition-colors">{t('nav_services', 'Nos Services')}</a></li>
            <li><a href="#portfolio" className="hover:text-slate-100 transition-colors">{t('nav_portfolio', 'Réalisations / Portfolio')}</a></li>
            <li><a href="#team" className="hover:text-slate-100 transition-colors">{t('nav_team', 'L\'Équipe DIGIT-CONNECT')}</a></li>
            <li><a href="#blog" className="hover:text-slate-100 transition-colors">{t('nav_blog', 'Blog & Actualités')}</a></li>
            <li><a href="#quote" className="hover:text-digitPink transition-colors">{t('nav_quote', 'Générateur de Devis')}</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Domaines d'Expertise */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{t('footer_expertise', 'Nos Expertises')}</h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-400">
            <li>{t('exp_web', 'Développement Web & E-commerce')}</li>
            <li>{t('exp_design', 'Identité Visuelle & Design')}</li>
            <li>{t('exp_marketing', 'Community Management & SMM')}</li>
            <li>{t('exp_it', 'Support IT & Cybersécurité')}</li>
            <li>{t('exp_consulting', 'Consulting & Stratégie Digitale')}</li>
          </ul>
        </div>

        {/* Colonne 4 : Coordonnées Directes */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{t('footer_contact', 'Contact Direct')}</h3>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="shrink-0" />
              <a href="https://maps.google.com/?q=Douala,+Cameroun" target="_blank" rel="noreferrer" className="hover:text-slate-100 transition-colors">
                <span>Douala, Cameroun</span>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0" />
              <a href="tel:+237600000000" className="hover:text-slate-100 transition-colors">
                <span>+237 600 00 00 00</span>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0" />
              <a href="mailto:contact@digit-connect.cm" className="hover:text-slate-100 transition-colors">
                <span>contact@digit-connect.cm</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Barre Inférieure Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p className='text-slate-500'>© {new Date().getFullYear()} DIGIT-CONNECT AGENCY. {t('footer_rights', 'Tous droits réservés.')}</p>
        <p className="flex items-center gap-1">
          {t('footer_crafted', 'Conçu avec')} <Heart size={16} className="fill-current" /> {t('footer_by', 'par l\'équipe DIGIT-CONNECT')}
        </p>
      </div>
    </footer>
  );
}