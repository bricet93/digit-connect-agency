import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit3, Trash2, X, ExternalLink, Globe, Upload } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function PortfolioManager() {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState('fr');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const initialFormState = {
    title_fr: '',
    title_en: '',
    category: 'web_ecommerce',
    client_name: '',
    image_url: '',
    project_url: '',
    description_fr: '',
    description_en: ''
  };

  const [form, setForm] = useState(initialFormState);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const categories = [
    { value: 'strat_comm', label: 'Stratégie de Communication' },
    { value: 'community_mgmt', label: 'Community Management' },
    { value: 'influence_mkt', label: 'Marketing d’Influence' },
    { value: 'content_creation', label: 'Création de Contenu' },
    { value: 'event_coverage', label: 'Couverture Événementielle' },
    { value: 'visual_identity', label: 'Identité Visuelle' },
    { value: 'web_ecommerce', label: 'Web & E-Commerce' },
    { value: 'it_support', label: 'Support Informatique' },
    { value: 'print_design', label: 'Design Impression' },
    { value: 'digital_consulting', label: 'Conseil Digital' }
  ];

  const fetchPortfolio = () => {
    axios.get('http://localhost:5000/api/portfolio/admin/all', { headers })
      .then(res => {
        if (res.data.success) {
          setItems(res.data.data);
        }
      })
      .catch(err => {
        axios.get('http://localhost:5000/api/portfolio')
          .then(res => { if (res.data.success) setItems(res.data.data); })
          .catch(console.error);
      });
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleOpen = (item = null) => {
    setEditItem(item);
    setActiveTab('fr');
    setSelectedFile(null);

    if (item) {
      setForm({
        title_fr: item.title_fr || '',
        title_en: item.title_en || '',
        category: item.category || 'web_ecommerce',
        client_name: item.client_name || '',
        image_url: item.image_url || '',
        project_url: item.project_url || '',
        description_fr: item.description_fr || '',
        description_en: item.description_en || ''
      });
      setImagePreview(item.image_url || '');
    } else {
      setForm(initialFormState);
      setImagePreview('');
    }
    
    setIsOpen(true);
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

    let finalImageUrl = form.image_url;

    // Si un fichier local a été sélectionné, on procède d'abord à l'upload
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
          finalImageUrl = uploadRes.data.url;
        }
      } catch (uploadErr) {
        console.error("Erreur d'upload de l'image :", uploadErr);
        alert("Échec de l'envoi de l'image.");
        return;
      }
    }

    const payload = { ...form, image_url: finalImageUrl };

    const url = editItem 
      ? `http://localhost:5000/api/portfolio/admin/${editItem.id}` 
      : 'http://localhost:5000/api/portfolio/admin';
    const method = editItem ? 'put' : 'post';

    axios[method](url, payload, { headers })
      .then(res => {
        if (res.data.success) {
          fetchPortfolio();
          setIsOpen(false);
        }
      })
      .catch(err => {
        console.error("Erreur enregistrement portfolio :", err);
        alert(err.response?.data?.message || "Erreur lors de l'enregistrement du projet");
      });
  };

  const handleDeleteClick = (item) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer du portfolio',
      message: `Voulez-vous vraiment retirer le projet "${item.title_fr}" de la vitrine portfolio ?`,
      onConfirm: () => executeDelete(item.id)
    });
  };

  const executeDelete = (id) => {
    axios.delete(`http://localhost:5000/api/portfolio/admin/${id}`, { headers })
      .then(() => fetchPortfolio())
      .catch(console.error)
      .finally(() => setConfirmModal(prev => ({ ...prev, isOpen: false })));
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 text-left shadow-xs">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Portfolio & Réalisations</h2>
          <p className="text-xs text-slate-500 mt-0.5">Gérez les projets affichés dans la vitrine bilingue.</p>
        </div>
        <button 
          onClick={() => handleOpen()} 
          className="flex items-center gap-2 bg-digitBlue hover:bg-digitBlue/90 text-white font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-xs"
        >
          <Plus size={16}/> Ajouter Un Projet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(item => (
          <div key={item.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="relative mb-3">
                <img src={item.image_url} alt={item.title_fr} className="h-40 w-full object-cover rounded-lg border border-slate-200" />
                <span className="absolute top-2 left-2 bg-slate-900/80 text-white backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {item.category?.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title_fr}</h3>
                <p className="text-xs text-slate-500 italic line-clamp-1">{item.title_en || 'Pas de titre anglais'}</p>
                {item.client_name && (
                  <p className="text-xs text-digitBlue font-semibold pt-1">
                    Client : <span className="text-slate-700">{item.client_name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200/60">
              {item.project_url ? (
                <a href={item.project_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-digitBlue transition-colors flex items-center gap-1 text-xs">
                  <ExternalLink size={14} /> Voir le lien
                </a>
              ) : <span />}

              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpen(item)} 
                  className="p-2 text-slate-600 bg-white hover:text-digitBlue rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
                  title="Éditer"
                >
                  <Edit3 size={14}/>
                </button>
                <button 
                  onClick={() => handleDeleteClick(item)} 
                  className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editItem ? 'Éditer le Projet' : 'Nouveau Projet'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('fr')}
                  className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    activeTab === 'fr' 
                      ? 'border-digitBlue text-digitBlue bg-digitBlue/5' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Globe size={14} /> Français (FR)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    activeTab === 'en' 
                      ? 'border-digitBlue text-digitBlue bg-digitBlue/5' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Globe size={14} /> English (EN)
                </button>
              </div>

              {activeTab === 'fr' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Titre du Projet (FR) *</label>
                    <input 
                      type="text" 
                      placeholder="ex: Refonte Identité & Plateforme Web" 
                      value={form.title_fr} 
                      onChange={e => setForm({...form, title_fr: e.target.value})} 
                      className="w-full border border-slate-300 p-3 rounded-lg text-xs outline-none focus:border-digitBlue" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description du Projet (FR)</label>
                    <textarea 
                      placeholder="Présentation synthétique du projet réalisé..." 
                      value={form.description_fr} 
                      onChange={e => setForm({...form, description_fr: e.target.value})} 
                      className="w-full border border-slate-300 p-3 rounded-lg text-xs outline-none focus:border-digitBlue" 
                      rows={4} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'en' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title (EN) *</label>
                    <input 
                      type="text" 
                      placeholder="ex: Brand Redesign & Web Platform" 
                      value={form.title_en} 
                      onChange={e => setForm({...form, title_en: e.target.value})} 
                      className="w-full border border-slate-300 p-3 rounded-lg text-xs outline-none focus:border-digitBlue" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Project Description (EN)</label>
                    <textarea 
                      placeholder="Summary of the completed project..." 
                      value={form.description_en} 
                      onChange={e => setForm({...form, description_en: e.target.value})} 
                      className="w-full border border-slate-300 p-3 rounded-lg text-xs outline-none focus:border-digitBlue" 
                      rows={4} 
                    />
                  </div>
                </div>
              )}

              <hr className="border-slate-100 my-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie *</label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})} 
                    className="w-full border border-slate-300 p-3 rounded-lg text-xs outline-none focus:border-digitBlue bg-white"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Client</label>
                  <input 
                    type="text" 
                    placeholder="ex: Baastel, Kaffo Foods..." 
                    value={form.client_name} 
                    onChange={e => setForm({...form, client_name: e.target.value})} 
                    className="w-full border border-slate-300 p-3 rounded-lg text-xs outline-none focus:border-digitBlue" 
                  />
                </div>

                {/* Upload / URL Image */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Image de Couverture</label>
                  
                  <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                    <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-slate-300 transition-colors">
                      <Upload size={14} /> Importer un fichier
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <span className="text-xs text-slate-400 font-semibold">ou renseignez l'URL ci-dessous :</span>
                  </div>

                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={form.image_url} 
                    onChange={e => {
                      setForm({...form, image_url: e.target.value});
                      setImagePreview(e.target.value);
                    }} 
                    className="w-full border border-slate-300 p-3 rounded-lg text-xs outline-none focus:border-digitBlue" 
                  />

                  {imagePreview && (
                    <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                      <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lien Externe du Projet (Optionnel)</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={form.project_url} 
                    onChange={e => setForm({...form, project_url: e.target.value})} 
                    className="w-full border border-slate-300 p-3 rounded-lg text-xs outline-none focus:border-digitBlue" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-digitBlue hover:bg-digitBlue/90 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  Enregistrer le Projet
                </button>
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