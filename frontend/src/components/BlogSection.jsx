import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { BookOpen, Calendar, Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from './SEO.jsx';

export default function BlogSection() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'fr';

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/articles');
        if (res.data.success) {
          const fetchedArticles = Array.isArray(res.data.data) 
            ? res.data.data 
            : res.data.data.articles || [];
          
          const recentArticles = fetchedArticles
            .filter(p => Number(p.is_published) === 1 || p.is_published === true)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 6);

          setArticles(recentArticles);
        }
      } catch (err) {
        console.error("Erreur chargement articles :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section id="blog" className="py-20 px-4 bg-slate-50 text-left border-y border-slate-200/60">
      <SEO 
        title="Accueil"
        description="DIGIT-CONNECT est votre partenaire technologique à Douala. Agence spécialisée en développement sur-mesure, branding et transformation digitale."
        keywords="agence web douala, devis gratuit site web, entreprise IT cameroun"
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2 text-digitPink font-bold text-xs uppercase tracking-wider bg-digitPink/10 px-3.5 py-1.5 rounded-full w-fit border border-digitPink/20">
          <BookOpen size={16} /> 
          <span>{t('blog_badge', 'Actualités & Insights')}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-10">
          {t('blog_title_1', 'Derniers articles de ')}
          <span className="text-digitBlue">DIGIT-CONNECT</span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div 
                key={n} 
                className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 animate-pulse flex flex-col justify-between h-96"
              >
                <div>
                  <div className="w-full h-48 bg-slate-200 rounded-lg mb-4" />
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-20 h-5 bg-slate-200 rounded-full" />
                    <div className="w-24 h-4 bg-slate-200 rounded-lg" />
                  </div>
                  <div className="w-3/4 h-6 bg-slate-200 rounded-lg mb-2" />
                  <div className="w-full h-4 bg-slate-100 rounded-lg mb-1" />
                  <div className="w-2/3 h-4 bg-slate-100 rounded-lg" />
                </div>
                <div className="w-28 h-5 bg-slate-200 rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-lg">
            <p className="text-xs font-semibold text-slate-500 italic">
              {t('blog_empty', 'Aucun article publié pour le moment.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
            {articles.map((article) => {
              const title = currentLang === 'en' && article.title_en ? article.title_en : article.title_fr;
              const excerpt = currentLang === 'en' && article.excerpt_en ? article.excerpt_en : article.excerpt_fr;

              return (
                <article 
                  key={article.id} 
                  className="bg-white rounded-lg overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-digitBlue/30 transition-all duration-500 flex flex-col justify-between group"
                >
                  <div>
                    {article.cover_image && (
                      <div className="overflow-hidden h-52 relative">
                        <img 
                          src={article.cover_image} 
                          alt={title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                        <span className="bg-digitBlue/10 text-digitBlue font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-wider">
                          {article.category ? article.category.replace('_', ' ') : 'Blog'}
                        </span>
                        <div className="flex items-center gap-4 font-medium text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Eye size={13} /> {article.views_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {new Date(article.created_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'fr-FR')}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-digitBlue transition-colors duration-200">
                        <Link to={`/blog/${article.slug}`}>
                          {title}
                        </Link>
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link 
                      to={`/blog/${article.slug}`} 
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-digitPink hover:text-digitBlue transition-colors group-hover:translate-x-1 duration-200"
                    >
                      <span>{currentLang === 'en' ? 'Read article' : 'Lire l’article'}</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}