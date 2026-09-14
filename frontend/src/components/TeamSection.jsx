import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Share2, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function TeamSection() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'fr';
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/team')
      .then(res => { 
        if (res.data && res.data.success) {
          // 1. Filtrer les membres actifs
          const activeMembers = res.data.data.filter(
            m => m.is_active === 1 || m.is_active === true
          );

          // 2. Trier selon l'ordre défini au back-office (order ou display_order)
          const sortedMembers = activeMembers.sort((a, b) => {
            const orderA = a.order ?? a.display_order ?? 0;
            const orderB = b.order ?? b.display_order ?? 0;
            return orderA - orderB;
          });

          // 3. Limiter à une seule ligne (4 éléments max)
          setTeam(sortedMembers.slice(0, 4));
        }
      })
      .catch(err => {
        console.error('Erreur chargement équipe:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="team" className="py-20 bg-white min-h-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-digitBlue bg-digitBlue/10 px-3.5 py-1.5 rounded-full border border-digitBlue/20">
          {t('nav_team', 'Notre Équipe')}
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-3 mb-12">
          {t('team_subtitle', 'Les Experts derrière DIGIT-CONNECT')}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-digitBlue" size={32} />
          </div>
        ) : team.length === 0 ? (
          <p className="text-slate-500 text-sm">
            {t('no_team_members', 'Aucun membre d\'équipe disponible pour le moment.')}
          </p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((m) => {
              const role = currentLang === 'en' && m.role_en ? m.role_en : m.role_fr;

              return (
                <motion.div 
                  key={m.id} 
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-slate-50 border border-slate-200 rounded-sm p-6 text-center shadow-xs hover:shadow-xl transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-digitBlue bg-slate-200 flex items-center justify-center">
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-slate-400" size={40} />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{m.full_name}</h3>
                    <p className="text-xs font-semibold text-digitPink mt-1">{role}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2 text-xs text-slate-600">
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="flex items-center justify-center gap-1.5 hover:text-digitBlue transition-colors">
                        <Mail size={14} /> {m.email}
                      </a>
                    )}
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="flex items-center justify-center gap-1.5 hover:text-digitBlue transition-colors">
                        <Phone size={14} /> {m.phone}
                      </a>
                    )}
                    {m.social_link && (
                      <a href={m.social_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-digitBlue font-bold mt-2 hover:underline">
                        <Share2 size={14} /> {t('view_profile', 'Voir Profil')}
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}