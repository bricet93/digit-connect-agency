import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Eye } from 'lucide-react';
import ConfirmModal from '../ConfirmModal'; // Ajustez le chemin selon votre structure

const CATEGORIES = [
  { value: 'strat_comm', label: 'Stratégie de Communication' },
  { value: 'community_mgmt', label: 'Community Management' },
  { value: 'influence_mkt', label: 'Marketing d\'Influence' },
  { value: 'content_creation', label: 'Création de Contenu' },
  { value: 'event_coverage', label: 'Couverture Événementielle' },
  { value: 'visual_identity', label: 'Identité Visuelle' },
  { value: 'web_ecommerce', label: 'Web & E-Commerce' },
  { value: 'it_support', label: 'Support IT & Sécurité' },
  { value: 'print_design', label: 'Design & Impression' },
  { value: 'digital_consulting', label: 'Conseil Digital' }
];

export default function ArticlesManager() {
  const [articles, setArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [langTab, setLangTab] = useState('fr');

  // État du modal de confirmation customisé
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [formData, setFormData] = useState({
    slug: '',
    title_fr: '', title_en: '',
    excerpt_fr: '', excerpt_en: '',
    content_fr: '', content_en: '',
    category: 'community_mgmt',
    cover_image: '',
    is_published: 1
  });

  const fetchArticles = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    axios.get('http://localhost:5000/api/articles/admin/all', config)
      .then(res => { 
        if (res.data.success) {
          setArticles(res.data.data); 
        }
      })
      .catch(err => {
        console.error("Erreur de chargement des articles admin :", err);
      });
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData(article);
    } else {
      setEditingArticle(null);
      setFormData({
        slug: '', title_fr: '', title_en: '', excerpt_fr: '', excerpt_en: '',
        content_fr: '', content_en: '', category: 'community_mgmt', cover_image: '', is_published: 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      return;
    }

    const url = editingArticle 
      ? `http://localhost:5000/api/articles/admin/${editingArticle.id}` 
      : 'http://localhost:5000/api/articles/admin';
    
    const method = editingArticle ? 'put' : 'post';
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios[method](url, formData, config)
      .then(res => {
        if (res.data.success) {
          fetchArticles();
          setIsModalOpen(false);
        }
      })
      .catch(err => {
        console.error("Erreur enregistrement article :", err);
        alert(err.response?.data?.message || "Erreur lors de l'enregistrement de l'article");
      });
  };

  // Remplacement de window.confirm par le ConfirmModal customisé
  const handleDeleteClick = (article) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer cet article ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement l'article "${article.title_fr || article.slug}" ? Cette action est irréversible.`,
      onConfirm: () => executeDelete(article.id)
    });
  };

  const executeDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Vous n'êtes pas connecté ou votre session a expiré.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(`http://localhost:5000/api/articles/admin/${id}`, config);

      if (res.data.success) {
        fetchArticles();
      }
    } catch (err) {
      console.error("Erreur suppression article :", err);
      alert(err.response?.data?.message || "Erreur lors de la suppression de l'article");
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Gestion des Articles & Publications</h2>
          <p className="text-xs text-slate-500 mt-1">Rédigez et gérez vos publications bilingues (Français / Anglais).</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 bg-digitBlue hover:bg-digitBlue/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} /> Nouvel Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <motion.div key={art.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="relative h-40 w-full bg-slate-200">
                <img src={art.cover_image || 'https://via.placeholder.com/400x200'} alt={art.title_fr} className="w-full h-full object-cover" />
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${art.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                  {art.is_published ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <div className="p-5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-digitPink">{art.category}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">{art.title_fr}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{art.excerpt_fr}</p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200/60 bg-white flex justify-between items-center text-xs text-slate-500">
              <div className="flex items-center gap-1"><Eye size={14} /> {art.views_count || 0} vues</div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(art)} className="p-2 text-slate-600 hover:text-digitBlue bg-slate-100 rounded-lg"><Edit3 size={14} /></button>
                <button onClick={() => handleDeleteClick(art)} className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Rédaction Bilingue */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-extrabold text-slate-900">{editingArticle ? 'Modifier l\'article' : 'Rédiger un article'}</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => setLangTab('fr')} className={`px-3 py-1 rounded-lg text-xs font-bold ${langTab === 'fr' ? 'bg-digitBlue text-white' : 'bg-slate-100 text-slate-600'}`}>FR 🇫🇷</button>
                <button type="button" onClick={() => setLangTab('en')} className={`px-3 py-1 rounded-lg text-xs font-bold ${langTab === 'en' ? 'bg-digitBlue text-white' : 'bg-slate-100 text-slate-600'}`}>EN 🇬🇧</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slug URL</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" required placeholder="mon-article-2026" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {langTab === 'fr' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Titre (Français)</label>
                    <input type="text" value={formData.title_fr} onChange={e => setFormData({...formData, title_fr: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Résumé (Français)</label>
                    <textarea value={formData.excerpt_fr} onChange={e => setFormData({...formData, excerpt_fr: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" rows={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contenu Complet (Français)</label>
                    <textarea value={formData.content_fr} onChange={e => setFormData({...formData, content_fr: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" rows={6} required />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Title (English)</label>
                    <input type="text" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Excerpt (English)</label>
                    <textarea value={formData.excerpt_en} onChange={e => setFormData({...formData, excerpt_en: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" rows={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Content (English)</label>
                    <textarea value={formData.content_en} onChange={e => setFormData({...formData, content_en: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" rows={6} required />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Image de Couverture</label>
                  <input type="url" value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut</label>
                  <select value={formData.is_published} onChange={e => setFormData({...formData, is_published: parseInt(e.target.value)})} className="w-full border rounded-xl p-2.5 text-xs">
                    <option value={1}>Publié</option>
                    <option value={0}>Brouillon</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-digitBlue text-white rounded-xl text-xs font-bold">Enregistrer</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}