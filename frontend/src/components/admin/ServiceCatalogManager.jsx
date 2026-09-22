import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function ServiceCatalogManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '', group_fr: '', group_en: '', name_fr: '', name_en: '', price: '', display_order: 0
  });

  const [idStatus, setIdStatus] = useState({ checking: false, available: null, message: '' });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/service-catalog');
      if (res.data.success) setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCatalog(); }, []);

  useEffect(() => {
    if (editingId || !formData.id.trim()) {
      setIdStatus({ checking: false, available: null, message: '' });
      return;
    }

    const timer = setTimeout(async () => {
      setIdStatus({ checking: true, available: null, message: 'Vérification...' });
      try {
        const res = await axios.get(`http://localhost:5000/api/service-catalog/check/${formData.id.trim()}`);
        if (res.data.exists) {
          setIdStatus({
            checking: false,
            available: false,
            message: `L'ID "${formData.id}" est déjà utilisé.`
          });
        } else {
          setIdStatus({
            checking: false,
            available: true,
            message: 'Identifiant disponible !'
          });
        }
      } catch (err) {
        setIdStatus({ checking: false, available: null, message: '' });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.id, editingId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!editingId && idStatus.available === false) {
      setFormError('Veuillez corriger l\'identifiant avant d\'enregistrer.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/service-catalog/${editingId}`, formData);
        setFormSuccess('Service mis à jour avec succès !');
      } else {
        await axios.post('http://localhost:5000/api/service-catalog', formData);
        setFormSuccess('Nouveau service ajouté et catalogue synchronisé !');
      }

      setEditingId(null);
      setFormData({ id: '', group_fr: '', group_en: '', name_fr: '', name_en: '', price: '', display_order: 0 });
      setIdStatus({ checking: false, available: null, message: '' });
      fetchCatalog();
    } catch (err) {
      if (err.response?.status === 409) {
        setFormError(err.response.data.message || 'Cet identifiant existe déjà.');
      } else {
        setFormError(err.response?.data?.error || 'Erreur serveur lors de l\'enregistrement.');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setFormError(null);
    setFormSuccess(null);
    setIdStatus({ checking: false, available: null, message: '' });
  };

  const handleDeleteClick = (item) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer du catalogue',
      message: `Voulez-vous vraiment supprimer le service "${item.name_fr}" (ID: ${item.id}) ? Cela pourrait affecter le générateur de devis.`,
      onConfirm: () => executeDelete(item.id)
    });
  };

  const executeDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/service-catalog/${id}`);
      fetchCatalog();
      setFormSuccess('Service supprimé avec succès.');
    } catch (err) {
      setFormError('Erreur lors de la suppression.');
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900">Gestion du Catalogue Services</h2>
          <p className="text-xs text-slate-500">Ajoutez, modifiez ou supprimez les prestations synchronisées avec l'application.</p>
        </div>
        <button onClick={fetchCatalog} className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-all cursor-pointer">
          <RefreshCw size={16} />
        </button>
      </div>

      {formError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {formError}
        </div>
      )}

      {formSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} />
          {formSuccess}
        </div>
      )}

      <form onSubmit={handleSave} className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-digitBlue">{editingId ? 'Modifier le service' : 'Ajouter un nouveau service'}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                type="text"
                required
                disabled={!!editingId}
                placeholder="ID unique (ex: strat_comm)"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className={`w-full p-2.5 bg-slate-50 border rounded-lg text-xs outline-none transition-all disabled:opacity-50 ${
                  idStatus.available === true ? 'border-emerald-500 focus:border-emerald-600' :
                  idStatus.available === false ? 'border-rose-500 focus:border-rose-600' :
                  'border-slate-200 focus:border-digitBlue'
                }`}
              />
              {idStatus.checking && (
                <Loader2 className="absolute right-3 top-3 animate-spin text-slate-400" size={14} />
              )}
            </div>

            {idStatus.message && (
              <span className={`text-[11px] font-semibold flex items-center gap-1 mt-0.5 ${
                idStatus.available === true ? 'text-emerald-600' :
                idStatus.available === false ? 'text-rose-600' : 'text-slate-400'
              }`}>
                {idStatus.available === true && <CheckCircle2 size={12} />}
                {idStatus.available === false && <AlertCircle size={12} />}
                {idStatus.message}
              </span>
            )}
          </div>

          <input
            type="text"
            required
            placeholder="Groupe FR (ex: Solutions IT & Design)"
            value={formData.group_fr}
            onChange={(e) => setFormData({ ...formData, group_fr: e.target.value })}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-digitBlue"
          />
          <input
            type="text"
            required
            placeholder="Groupe EN (ex: IT & Design Solutions)"
            value={formData.group_en}
            onChange={(e) => setFormData({ ...formData, group_en: e.target.value })}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-digitBlue"
          />
          <input
            type="text"
            required
            placeholder="Nom du Service (FR)"
            value={formData.name_fr}
            onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-digitBlue"
          />
          <input
            type="text"
            required
            placeholder="Nom du Service (EN)"
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-digitBlue"
          />
          <input
            type="number"
            required
            placeholder="Prix (FCFA)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-digitBlue"
          />
        </div>

        <div className="flex gap-2 justify-end">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ id: '', group_fr: '', group_en: '', name_fr: '', name_en: '', price: '', display_order: 0 });
                setIdStatus({ checking: false, available: null, message: '' });
                setFormError(null);
              }}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={!editingId && idStatus.available === false}
            className="px-5 py-2 bg-digitBlue hover:bg-digitBlue/90 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer transition-all"
          >
            <Save size={14} /> {editingId ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Groupe FR / EN</th>
              <th className="p-3">Nom FR / EN</th>
              <th className="p-3">Prix</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="p-3 font-mono text-slate-500 font-bold">{item.id}</td>
                <td className="p-3">
                  <div className="font-bold text-slate-800">{item.group_fr}</div>
                  <div className="text-[10px] text-slate-400">{item.group_en}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-slate-800">{item.name_fr}</div>
                  <div className="text-[10px] text-slate-400">{item.name_en}</div>
                </td>
                <td className="p-3 font-black text-digitBlue">
                  {Number(item.price).toLocaleString('fr-FR')} FCFA
                </td>
                <td className="p-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDeleteClick(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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