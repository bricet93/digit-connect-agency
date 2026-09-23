import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

// const TRUST_LOGOS = [
//   { name: 'Partenaire 1', logo: 'https://www.logotouse.com/images/logos/nairobi-colored.svg' },
//   { name: 'Partenaire 2', logo: 'https://www.logotouse.com/images/logos/hudson-colored.svg' },
//   { name: 'Partenaire 3', logo: 'https://www.logotouse.com/images/logos/basel-colored.svg' },
//   { name: 'Partenaire 4', logo: 'https://www.logotouse.com/images/logos/malta-colored.svg' },
// ];

export default function PortfolioSection() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'fr';

  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/portfolio')
      .then(res => {
        if (res.data && res.data.success) {
          const sortedProjects = [...res.data.data]
            .sort((a, b) => b.id - a.id)
            .slice(0, 6);
          setProjects(sortedProjects);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section id="portfolio" className="py-20 border-t border-slate-200/60">
      {/* <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
          {TRUST_LOGOS.map((item, index) => (
            <img key={index} src={item.logo} alt={item.name} className="h-8 md:h-10 object-contain hover:scale-105 grayscale hover:grayscale-0 transition-all duration-500" />
          ))}
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-digitPink bg-digitPink/10 px-3.5 py-1.5 rounded-full border border-digitPink/20">
            {t('nav_portfolio', 'Nos Réalisations')}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            {t('portfolio_title', 'Projets Récents')}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { id: 'all', label: t('cat_all', 'Tous') },
            { id: 'strat_comm', label: t('strat_comm', 'Stratégies de Communication') },
            { id: 'community_mgmt', label: t('community_mgmt', 'Community Management MP') },
            { id: 'influence_mkt', label: t('influence_mkt', 'Marketing d’Influence') },
            { id: 'content_creation', label: t('content_creation', 'Création de Contenu') },
            { id: 'event_coverage', label: t('event_coverage', 'Couverture d’Événements') },
            { id: 'visual_identity', label: t('visual_identity', 'Identité Visuelle') },
            { id: 'web_ecommerce', label: t('web_ecommerce', 'Création de Sites Web') },
            { id: 'it_support', label: t('it_support', 'Support Informatique') },
            { id: 'print_design', label: t('print_design', 'Conception & Impression') },
            { id: 'digital_consulting', label: t('digital_consulting', 'Consulting Digital') },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-digitBlue text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => {
            const title = currentLang === 'en' && p.title_en ? p.title_en : p.title_fr;
            const description = currentLang === 'en' && p.description_en ? p.description_en : p.description_fr;

            // Déterminer si la carte correspond au filtre sélectionné
            const isMatch = filter === 'all' || p.category === filter;

            return (
              <motion.div 
                layout
                key={p.id} 
                className={`bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs transition-all duration-500 group flex flex-col justify-between ${
                  isMatch 
                    ? 'opacity-100 scale-100 grayscale-0 hover:shadow-xl hover:-translate-y-1' 
                    : 'opacity-50 scale-95 grayscale hover:grayscale-0 hover:opacity-80'
                }`}
              >
                <div>
                  <div className="relative overflow-hidden h-50 md:h-56 lg:h-48 xl:h-52 2xl:h-56">
                    <img
                      src={p.image_url}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-slate-900/80 text-white backdrop-blur-xs rounded-lg">
                      {p.category ? p.category.replace('_', ' ') : 'Projet'}
                    </span>
                  </div>
                  <div className="p-5 text-left">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{p.client_name || 'Projet Client'}</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{description}</p>
                  </div>
                </div>

                {p.project_url && (
                  <div className="p-5 pt-0 text-left">
                    <a
                      href={p.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-digitBlue hover:text-digitPink transition-colors"
                    >
                      {t('see_project', 'Voir le projet')} <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}