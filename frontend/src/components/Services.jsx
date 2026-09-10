import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Code, Palette, Share2, Shield, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_ICONS = {
  web_ecommerce: <Code size={24} className="text-digitBlue" />,
  visual_identity: <Palette size={24} className="text-digitPink" />,
  print_design: <Palette size={24} className="text-digitPink" />,
  community_mgmt: <Share2 size={24} className="text-emerald-500" />,
  it_support: <Shield size={24} className="text-amber-500" />,
  digital_consulting: <Lightbulb size={24} className="text-rose-500" />
};

export default function Services() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/services')
      .then(res => {
        if (res.data.success) {
          const activeServices = res.data.data
            .filter(s => Number(s.is_active) === 1 || s.is_active === true)
            .sort((a, b) => b.id - a.id)
            .slice(0, 6);
          setServices(activeServices);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentLang = i18n.language || 'fr';

  return (
    <section id="services" className="py-24 px-6 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-digitPink bg-digitPink/10 px-3.5 py-1.5 rounded-full border border-digitPink/20">
            {t('services_badge', 'Nos Expertises')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
            {t('services_title', 'Solutions digitales complètes pour votre entreprise')}
          </h2>
        </div>

        {!loading && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((srv) => {
              const mainCategory = Array.isArray(srv.category) ? srv.category[0] : srv.category;
              const icon = CATEGORY_ICONS[mainCategory] || <CheckCircle2 size={24} className="text-digitBlue" />;
              
              const title = currentLang.startsWith('en') ? (srv.title_en || srv.title_fr) : srv.title_fr;
              const description = currentLang.startsWith('en') ? (srv.description_en || srv.description_fr) : srv.description_fr;

              return (
                <motion.div
                  key={srv.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-white hover:border-digitBlue/30 hover:shadow-xl transition-all group"
                >
                  <div className="p-3 bg-white rounded-xl w-fit mb-6 border border-slate-200/80 shadow-xs group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-digitBlue transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}