import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Edit2, Trash2, Upload, Link as LinkIcon, 
  Mail, Phone, Share2, Eye, EyeOff, Hash, User, Briefcase, X 
} from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadMode, setUploadMode] = useState('url');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const initialFormState = {
    full_name: '',
    role_fr: '',
    role_en: '',
    email: '',
    phone: '',
    photo_url: '',
    social_link: '',
    display_order: 0,
    is_active: 1
  };

  const [formData, setFormData] = useState(initialFormState);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/team');
      if (res.data.success) setMembers(res.data.data);
    } catch (err) {
      console.error("Erreur lors du chargement de l'équipe", err);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        full_name: member.full_name || '',
        role_fr: member.role_fr || '',
        role_en: member.role_en || '',
        email: member.email || '',
        phone: member.phone || '',
        photo_url: member.photo_url || '',
        social_link: member.social_link || '',
        display_order: member.display_order ?? 0,
        is_active: member.is_active ?? 1
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setUploadMode('url');
    setShowModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/team/admin/${editingId}`, formData, { headers });
      } else {
        await axios.post('http://localhost:5000/api/team/admin', formData, { headers });
      }
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      alert("Erreur lors de la sauvegarde du membre d'équipe");
    }
  };

  const handleDeleteClick = (member) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer ce membre',
      message: `Êtes-vous sûr de vouloir retirer ${member.full_name} de l'équipe ?`,
      onConfirm: () => executeDelete(member.id)
    });
  };

  const executeDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/team/admin/${id}`, { headers });
      fetchMembers();
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div className="bg-white rounded-sm border border-slate-200 p-8 text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Gestion de l'Équipe</h2>
          <p className="text-xs text-slate-500">Gérez les profils de l'équipe affichés sur la plateforme.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 bg-digitBlue hover:bg-digitPink text-white font-bold text-xs px-4 py-2.5 rounded-sm transition-colors cursor-pointer"
        >
          <Plus size={16} /> Ajouter un Membre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(item => (
          <div key={item.id} className="border border-slate-200 rounded-sm p-4 flex gap-4 items-center bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
            <img 
              src={item.photo_url || 'https://via.placeholder.com/150'} 
              alt={item.full_name} 
              className="w-16 h-16 rounded-sm object-cover border border-slate-200" 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 truncate">{item.full_name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {item.is_active ? 'Actif' : 'Masqué'}
                </span>
              </div>
              <p className="text-xs text-digitBlue font-medium truncate">{item.role_fr}</p>
              <p className="text-[11px] text-slate-400 truncate">{item.email || 'Pas d\'email'}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-600 bg-white border border-slate-200 hover:text-digitBlue rounded-sm transition-colors cursor-pointer">
                <Edit2 size={14} />
              </button>
              <button onClick={() => handleDeleteClick(item)} className="p-2 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-sm transition-colors cursor-pointer">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingId ? 'Modifier le membre d\'équipe' : 'Ajouter un nouveau membre'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom complet*</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="ex: Carine NGUEMO" 
                    value={formData.full_name} 
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-digitBlue outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rôle (Français)*</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      placeholder="ex: Directrice de Stratégie" 
                      value={formData.role_fr} 
                      onChange={e => setFormData({ ...formData, role_fr: e.target.value })} 
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-digitBlue outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rôle (Anglais)*</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      placeholder="ex: Head of Digital Strategy" 
                      value={formData.role_en} 
                      onChange={e => setFormData({ ...formData, role_en: e.target.value })} 
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-digitBlue outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adresse Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="ex: carine@digit-connect.agency" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-digitBlue outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Numéro de Téléphone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="ex: +237 600 00 00 00" 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-digitBlue outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-sm bg-slate-50/70 space-y-3">
                <label className="block font-bold text-slate-700">Photo de profil</label>
                
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setUploadMode('url')} 
                    className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-sm transition-colors ${uploadMode === 'url' ? 'bg-digitBlue text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                  >
                    <LinkIcon size={14}/> URL distante
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setUploadMode('file')} 
                    className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-sm transition-colors ${uploadMode === 'file' ? 'bg-digitBlue text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                  >
                    <Upload size={14}/> Fichier Local
                  </button>
                </div>

                {uploadMode === 'url' ? (
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/photo-..." 
                    value={formData.photo_url} 
                    onChange={e => setFormData({ ...formData, photo_url: e.target.value })} 
                    className="w-full p-2.5 border border-slate-200 rounded-sm bg-white focus:border-digitBlue outline-none" 
                  />
                ) : (
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-digitBlue file:text-white file:font-bold cursor-pointer" 
                  />
                )}

                {formData.photo_url && (
                  <div className="flex items-center gap-3 pt-2">
                    <img src={formData.photo_url} alt="Aperçu" className="w-12 h-12 rounded-sm object-cover border" />
                    <span className="text-[11px] text-slate-500">Aperçu de la photo chargée</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lien Réseau Social / Portfolio</label>
                <div className="relative">
                  <Share2 size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="https://linkedin.com/in/username" 
                    value={formData.social_link} 
                    onChange={e => setFormData({ ...formData, social_link: e.target.value })} 
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-digitBlue outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ordre d'affichage</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="number" 
                      value={formData.display_order} 
                      onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} 
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:border-digitBlue outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visibilité sur le site</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: formData.is_active === 1 ? 0 : 1 })}
                    className={`w-full py-2.5 px-4 rounded-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      formData.is_active === 1 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {formData.is_active === 1 ? <Eye size={16} /> : <EyeOff size={16} />}
                    <span>{formData.is_active === 1 ? 'Membre Actif (Visible)' : 'Membre Masqué'}</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-sm transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-digitBlue hover:bg-digitPink text-white font-bold rounded-sm transition-colors shadow-md cursor-pointer"
                >
                  {editingId ? 'Mettre à jour' : 'Enregistrer'}
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