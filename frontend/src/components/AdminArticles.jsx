import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Eye, Globe } from 'lucide-react';

const CATEGORIES = [
  { value: 'strat_comm', label: 'Stratégie de Communication' },
  { value: 'community_mgmt', label: 'Community Management' },
  { value: 'influence_mkt', label: 'Marketing d\'Influence' },
  { value: 'content_creation', label: 'Création de Contenu' },
  { value: 'event_coverage', label: 'Couverture Événementielle' },
  { value: 'visual_identity', label: 'Identité Visuelle' },
  { value: 'web_ecommerce', label: 'Web & E-Commerce' },
  { value: 'it_support', label: 'Support IT & Sécurité' },
  { value: 'print_design', label: 'Design Impression' },
  { value: 'digital_consulting', label: 'Conseil Digital' },
];

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [langTab, setLangTab] = useState('fr'); // 'fr' ou 'en'

  const [formData, setFormData] = useState({
    slug: '',
    title_fr: '',
    title_en: '',
    excerpt_fr: '',
    excerpt_en: '',
    content_fr: '',
    content_en: '',
    category: 'digital_marketing',
    cover_image: '',
    is_published: 1
  });

  const getAuthToken = () => {
    const stored = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      // Gère le cas où l'objet contient { token: "ey..." } ou si c'est directement la chaîne
      return typeof parsed === 'object' && parsed.token ? parsed.token : parsed;
    } catch (e) {
      return stored; // Si c'est un string brut non-JSON
    }
  };

  const fetchArticles = async () => {
    try {
      const stored = localStorage.getItem('adminToken') || localStorage.getItem('token');
      let token = null;

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Si c'est l'objet complet sauvegardé au login, on prend .token, sinon la valeur directe
          token = parsed.token || (typeof parsed === 'string' ? parsed : null);
        } catch (e) {
          token = stored;
        }
      }

      console.log("🔑 Vrai Token JWT envoyé :", token);

      const res = await axios.get('http://localhost:5000/api/articles/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) setArticles(res.data.data);
    } catch (err) {
      console.error("Erreur chargement articles :", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenModal = (art = null) => {
    setLangTab('fr');
    if (art) {
      setSelectedArticle(art.id);
      setFormData({
        slug: art.slug,
        title_fr: art.title_fr,
        title_en: art.title_en || '',
        excerpt_fr: art.excerpt_fr || '',
        excerpt_en: art.excerpt_en || '',
        content_fr: art.content_fr || '',
        content_en: art.content_en || '',
        category: art.category,
        cover_image: art.cover_image || '',
        is_published: art.is_published ? 1 : 0
      });
    } else {
      setSelectedArticle(null);
      setFormData({
        slug: '',
        title_fr: '',
        title_en: '',
        excerpt_fr: '',
        excerpt_en: '',
        content_fr: '',
        content_en: '',
        category: 'digital_marketing',
        cover_image: '',
        is_published: 1
      });
    }
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (selectedArticle) {
        await axios.put(`http://localhost:5000/api/articles/admin/${selectedArticle}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/articles/admin', formData, config);
      }
      setIsEditing(false);
      fetchArticles();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du traitement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement cet article ?')) return;
    const token = JSON.parse(localStorage.getItem('adminToken'))?.token;

    try {
      await axios.delete(`http://localhost:5000/api/articles/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchArticles();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Gestion des Articles du Blog</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-digitBlue text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-digitBlue/90 transition-all cursor-pointer"
        >
          <Plus size={16} /> Nouvel Article
        </button>
      </div>

      {/* Liste des articles */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="p-4">Titre (FR / EN)</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Vues</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-50/50">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{art.title_fr}</div>
                  <div className="text-xs text-slate-400 font-medium">{art.title_en}</div>
                </td>
                <td className="p-4 text-xs font-semibold text-digitBlue">
                  {CATEGORIES.find(c => c.value === art.category)?.label || art.category}
                </td>
                <td className="p-4 font-semibold text-slate-600 flex items-center gap-1">
                  <Eye size={14} /> {art.views_count}
                </td>
                <td className="p-4">
                  {art.is_published ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle size={12} /> Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      <XCircle size={12} /> Brouillon
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenModal(art)}
                    className="p-2 text-slate-600 hover:text-digitBlue transition-colors cursor-pointer"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="p-2 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Révisé avec Commutation de Langue */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {selectedArticle ? 'Éditer l’article' : 'Créer un nouvel article'}
              </h3>
              
              {/* Selecteur de langue */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLangTab('fr')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    langTab === 'fr' ? 'bg-white text-digitBlue shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Globe size={12} /> Français (FR)
                </button>
                <button
                  type="button"
                  onClick={() => setLangTab('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    langTab === 'en' ? 'bg-white text-digitBlue shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Globe size={12} /> Anglais (EN)
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Paramètres Généraux */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="mon-article-2026"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL de l'image de couverture</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              {/* Contenu selon la langue sélectionnée */}
              {langTab === 'fr' ? (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-extrabold uppercase text-digitBlue tracking-wider">Contenu en Français</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Titre (FR) *</label>
                    <input
                      type="text"
                      required
                      value={formData.title_fr}
                      onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Extrait (FR)</label>
                    <textarea
                      rows="2"
                      value={formData.excerpt_fr}
                      onChange={(e) => setFormData({ ...formData, excerpt_fr: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contenu HTML/Texte (FR) *</label>
                    <textarea
                      rows="6"
                      required
                      value={formData.content_fr}
                      onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-extrabold uppercase text-digitBlue tracking-wider">Contenu en Anglais</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Titre (EN) *</label>
                    <input
                      type="text"
                      required
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Extrait (EN)</label>
                    <textarea
                      rows="2"
                      value={formData.excerpt_en}
                      onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contenu HTML/Texte (EN) *</label>
                    <textarea
                      rows="6"
                      required
                      value={formData.content_en}
                      onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published === 1}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                  className="rounded text-digitBlue focus:ring-digitBlue cursor-pointer"
                />
                <label htmlFor="is_published" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Publier directement cet article
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-lg cursor-pointer hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-digitBlue text-white font-bold text-sm rounded-lg hover:bg-digitBlue/90 cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}