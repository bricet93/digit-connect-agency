import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
  { value: 'print_design', label: 'Design Impression' },
  { value: 'digital_consulting', label: 'Conseil Digital' },
];

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [formData, setFormData] = useState({
    category: ['strat_comm'],
    title_fr: '',
    title_en: '',
    description_fr: '',
    description_en: '',
    is_active: 1
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      if (res.data.success) setServices(res.data.data);
    } catch (err) {
      console.error('Erreur chargement services:', err);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleOpenModal = (service = null) => {
    setEditingService(service);
    if (service) {
      const cats = Array.isArray(service.category) ? service.category : [service.category];
      setFormData({
        category: cats,
        title_fr: service.title_fr,
        title_en: service.title_en || service.title_fr,
        description_fr: service.description_fr || '',
        description_en: service.description_en || '',
        is_active: service.is_active
      });
    } else {
      setFormData({
        category: ['strat_comm'],
        title_fr: '',
        title_en: '',
        description_fr: '',
        description_en: '',
        is_active: 1
      });
    }
    setShowModal(true);
  };

  const handleCategoryToggle = (catValue) => {
    setFormData(prev => {
      const current = prev.category;
      if (current.includes(catValue)) {
        return { ...prev, category: current.filter(c => c !== catValue) };
      } else {
        return { ...prev, category: [...current, catValue] };
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`http://localhost:5000/api/services/admin/${editingService.id}`, formData, { headers });
      } else {
        await axios.post('http://localhost:5000/api/services/admin', formData, { headers });
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      alert("Erreur lors de l'enregistrement du service");
    }
  };

  const handleDeleteClick = (service) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer ce service ?',
      message: `Voulez-vous vraiment supprimer le service "${service.title_fr}" de la plateforme ?`,
      onConfirm: () => executeDelete(service.id)
    });
  };

  const executeDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/admin/${id}`, { headers });
      fetchServices();
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div className="bg-white rounded-sm border border-slate-200 p-8 shadow-xs text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Gestion des Services</h2>
          <p className="text-xs text-slate-500 mt-1">Gérez les services affichés dans votre vitrine</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-digitBlue hover:bg-digitBlue/90 text-white font-bold text-xs px-4 py-2.5 rounded-sm shadow-md cursor-pointer"
        >
          <Plus size={16} /> Ajouter un Service
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
            <tr>
              <th className="p-4">Titre (FR)</th>
              <th className="p-4">Catégories liées (JSON)</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((item) => {
              const cats = Array.isArray(item.category) ? item.category : [item.category];
              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{item.title_fr}</td>
                  <td className="p-4 text-slate-500 font-medium">
                    <div className="flex flex-wrap gap-1">
                      {cats.map(c => (
                        <span key={c} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border text-[10px]">
                          {CATEGORIES.find(cat => cat.value === c)?.label || c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    {item.is_active === 1 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle size={12} /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-500 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        <XCircle size={12} /> Inactif
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-600 hover:text-digitBlue bg-slate-100 rounded-sm mr-2 cursor-pointer">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDeleteClick(item)} className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 rounded-sm cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-sm max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{editingService ? 'Modifier le Service' : 'Nouveau Service'}</h3>
              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-2">Catégories Associées (JSON)</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-sm border">
                    {CATEGORIES.map(cat => (
                      <label key={cat.value} className="flex items-center gap-2 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.category.includes(cat.value)}
                          onChange={() => handleCategoryToggle(cat.value)}
                        />
                        {cat.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Titre (FR)</label>
                  <input type="text" required value={formData.title_fr} onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Titre (EN)</label>
                  <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Description (FR)</label>
                  <textarea value={formData.description_fr} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-sm" rows={2} />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Description (EN)</label>
                  <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-sm" rows={2} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_active" checked={formData.is_active === 1} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })} />
                  <label htmlFor="is_active" className="font-semibold text-slate-700">Service Actif</label>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-sm">Annuler</button>
                  <button type="submit" className="px-5 py-2 bg-digitBlue text-white font-bold rounded-sm">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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