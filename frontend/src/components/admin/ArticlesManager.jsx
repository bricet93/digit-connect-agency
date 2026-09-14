import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Eye, X, Globe, Upload } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const initialFormState = {
    slug: '',
    title_fr: '', title_en: '',
    excerpt_fr: '', excerpt_en: '',
    content_fr: '', content_en: '',
    category: 'community_mgmt',
    cover_image: '',
    is_published: 1
  };

  const [formData, setFormData] = useState(initialFormState);

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
    setLangTab('fr');
    setSelectedFile(null);
    if (article) {
      setEditingArticle(article);
      setFormData(article);
      setImagePreview(article.cover_image || '');
    } else {
      setEditingArticle(null);
      setFormData(initialFormState);
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      return;
    }

    let finalCoverImage = formData.cover_image;

    // Si un fichier local a été sélectionné, on l'uploade en premier
    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);

      try {
        const uploadRes = await axios.post('http://localhost:5000/api/upload', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        if (uploadRes.data && uploadRes.data.url) {
          finalCoverImage = uploadRes.data.url;
        }
      } catch (uploadErr) {
        console.error("Erreur d'upload de l'image :", uploadErr);
        alert("Échec de l'envoi de l'image.");
        return;
      }
    }

    const payload = { ...formData, cover_image: finalCoverImage };

    const url = editingArticle 
      ? `http://localhost:5000/api/articles/admin/${editingArticle.id}` 
      : 'http://localhost:5000/api/articles/admin';
    
    const method = editingArticle ? 'put' : 'post';
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios[method](url, payload, config)
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
      if (!token) return;

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
    <div className="bg-white rounded-sm border border-slate-200 p-6 text-left shadow-xs">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Gestion des Articles & Publications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Rédigez et gérez vos publications bilingues (Français / Anglais).</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 bg-digitBlue hover:bg-digitBlue/90 text-white font-bold text-xs px-4 py-2.5 rounded-sm shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} /> Nouvel Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((art) => (
          <motion.div key={art.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-slate-200 rounded-sm p-4 bg-slate-50/50 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="relative mb-3">
                <img src={art.cover_image || 'https://via.placeholder.com/400x200'} alt={art.title_fr} className="h-40 w-full object-cover rounded-sm border border-slate-200" />
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${art.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                  {art.is_published ? 'Publié' : 'Brouillon'}
                </span>
                <span className="absolute top-2 left-2 bg-slate-900/80 text-white backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {art.category?.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{art.title_fr}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{art.excerpt_fr || 'Pas de résumé'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
              <div className="flex items-center gap-1"><Eye size={14} /> {art.views_count || 0} vues</div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(art)} className="p-2 text-slate-600 bg-white hover:text-digitBlue rounded-sm border border-slate-200 shadow-2xs transition-all cursor-pointer" title="Éditer"><Edit3 size={14} /></button>
                <button onClick={() => handleDeleteClick(art)} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-sm transition-all cursor-pointer" title="Supprimer"><Trash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Rédaction Bilingue Harmonisée */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-extrabold text-slate-900 text-lg">{editingArticle ? 'Éditer l\'Article' : 'Nouvel Article'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-sm cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setLangTab('fr')}
                  className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    langTab === 'fr' 
                      ? 'border-digitBlue text-digitBlue bg-digitBlue/5' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Globe size={14} /> Français (FR)
                </button>
                <button
                  type="button"
                  onClick={() => setLangTab('en')}
                  className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    langTab === 'en' 
                      ? 'border-digitBlue text-digitBlue bg-digitBlue/5' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Globe size={14} /> English (EN)
                </button>
              </div>

              {langTab === 'fr' ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de l'Article (FR) *</label>
                    <input type="text" value={formData.title_fr} onChange={e => setFormData({...formData, title_fr: e.target.value})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Résumé (FR)</label>
                    <textarea value={formData.excerpt_fr} onChange={e => setFormData({...formData, excerpt_fr: e.target.value})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue" rows={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contenu Complet (FR) *</label>
                    <textarea value={formData.content_fr} onChange={e => setFormData({...formData, content_fr: e.target.value})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue" rows={5} required />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Article Title (EN) *</label>
                    <input type="text" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Excerpt (EN)</label>
                    <textarea value={formData.excerpt_en} onChange={e => setFormData({...formData, excerpt_en: e.target.value})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue" rows={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Content (EN) *</label>
                    <textarea value={formData.content_en} onChange={e => setFormData({...formData, content_en: e.target.value})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue" rows={5} required />
                  </div>
                </div>
              )}

              <hr className="border-slate-100 my-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL *</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue" required placeholder="nom-de-l-article" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie *</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue bg-white">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Statut *</label>
                  <select value={formData.is_published} onChange={e => setFormData({...formData, is_published: parseInt(e.target.value)})} className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue bg-white">
                    <option value={1}>Publié</option>
                    <option value={0}>Brouillon</option>
                  </select>
                </div>

                {/* Upload et URL d'image */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Image de Couverture</label>
                  
                  <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                    <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-sm text-xs font-semibold cursor-pointer border border-slate-300 transition-colors">
                      <Upload size={14} /> Importer un fichier
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <span className="text-xs text-slate-400 font-semibold">ou renseignez l'URL ci-dessous :</span>
                  </div>

                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={formData.cover_image} 
                    onChange={e => {
                      setFormData({...formData, cover_image: e.target.value});
                      setImagePreview(e.target.value);
                    }} 
                    className="w-full border border-slate-300 p-3 rounded-sm text-xs outline-none focus:border-digitBlue" 
                  />

                  {imagePreview && (
                    <div className="mt-2 relative w-32 h-20 rounded-sm overflow-hidden border border-slate-200">
                      <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Annuler</button>
                <button type="submit" className="px-5 py-2.5 bg-digitBlue hover:bg-digitBlue/90 text-white rounded-sm text-xs font-bold cursor-pointer transition-all shadow-xs">Enregistrer l'Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

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