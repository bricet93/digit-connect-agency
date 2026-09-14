import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Eye, Tag, ChevronRight, Newspaper } from 'lucide-react';
import Header from '../components/Header';

import SEO from '../components/SEO';

export default function SingleArticle() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'fr';

  const [article, setArticle] = useState(null);
  const [otherArticles, setOtherArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleAndOthers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/articles/${slug}`);
        if (res.data.success) {
          setArticle(res.data.data);
        }

        const postsRes = await axios.get(`http://localhost:5000/api/articles`);
        if (postsRes.data.success) {
          const list = Array.isArray(postsRes.data.data) ? postsRes.data.data : postsRes.data.data.posts || [];
          setOtherArticles(list.filter(p => p.slug !== slug && (p.is_published == 1 || p.is_published === true)));
        }
      } catch (err) {
        setError("Article introuvable ou erreur serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndOthers();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center">
        <p className="font-semibold text-slate-600 animate-pulse">Chargement de l’article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <SEO 
          title={article.title}
          description={article.summary || article.content.substring(0, 160)}
          image={article.image_url}
          type="article"
        />

        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(jsonLdData)}
          </script>
        </Helmet>
        
        {/* Conteneur Header sécurisé */}
        <div className="sticky top-0 z-50 bg-white">
          <Header />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{error || "Article introuvable"}</h2>
          <Link to="/" className="inline-flex items-center gap-2 text-digitBlue font-bold hover:underline">
            <ArrowLeft size={18} /> Retour à l’accueil
          </Link>
        </div>
      </div>
    );
  }

  const title = currentLang === 'en' && article.title_en ? article.title_en : article.title_fr;
  const content = currentLang === 'en' && article.content_en ? article.content_en : article.content_fr;

  // Schema sémantique JSON-LD pour les articles Google News / Search
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": article.image_url,
    "author": {
      "@type": "Organization",
      "name": "DIGIT-CONNECT"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DIGIT-CONNECT",
      "logo": {
        "@type": "ImageObject",
        "url": "https://digit-connect.cm/IconWhite.svg"
      }
    },
    "datePublished": article.created_at
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative">
      <Helmet>
        <title>{`${title} | DIGIT-CONNECT AGENCY`}</title>
        <meta name="description" content={article.excerpt_fr || title} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={article.excerpt_fr || title} />
        <meta property="og:image" content={article.cover_image} />
        <meta property="og:type" content="article" />
      </Helmet>
      
      {/* 1. Header placé au premier plan (z-50) */}
      <div className="sticky top-0 z-50 bg-white">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 text-left relative z-0">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-digitBlue mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> {currentLang === 'en' ? 'Back to home' : 'Retour à l’accueil'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-sm border border-slate-200 shadow-sm">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mb-3">
                <span className="bg-digitBlue/10 text-digitBlue px-3 py-1 rounded-full uppercase flex items-center gap-1 font-bold">
                  <Tag size={12} /> {article.category ? article.category.replace('_', ' ') : 'Blog'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(article.created_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'fr-FR')}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={13} /> {article.views_count} {currentLang === 'en' ? 'views' : 'vues'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                {title}
              </h1>
            </div>

            {article.cover_image && (
              <div className="rounded-sm overflow-hidden shadow-xs mb-8 border border-slate-200">
                <img 
                  src={article.cover_image} 
                  alt={title} 
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
            )}

            <div 
              className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-digitBlue text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* 2. Sidebar ajustée avec z-10 pour ne pas gêner le Header */}
          <aside className="lg:col-span-1 space-y-6 sticky top-28 z-10">
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                <Newspaper className="text-digitBlue" size={20} />
                <h3 className="text-base font-extrabold text-slate-900">
                  {currentLang === 'en' ? 'Other Articles' : 'Autres Articles'}
                </h3>
              </div>

              {otherArticles.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  {currentLang === 'en' ? 'No other articles available.' : 'Aucun autre article disponible pour le moment.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {otherArticles.slice(0, 5).map((item) => {
                    const itemTitle = currentLang === 'en' && item.title_en ? item.title_en : item.title_fr;

                    return (
                      <Link
                        key={item.id}
                        to={`/blog/${item.slug}`}
                        className="group flex gap-3.5 items-start p-2.5 rounded-sm hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                      >
                        {item.cover_image && (
                          <img
                            src={item.cover_image}
                            alt={itemTitle}
                            className="w-16 h-16 rounded-sm object-cover shrink-0 border border-slate-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-digitBlue transition-colors line-clamp-2 leading-snug">
                            {itemTitle}
                          </h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                            <Calendar size={10} />
                            {new Date(item.created_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'fr-FR')}
                          </span>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-digitBlue shrink-0 self-center transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}