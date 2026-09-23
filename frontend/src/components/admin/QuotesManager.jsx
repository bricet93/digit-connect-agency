import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Download, Mail, Phone } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function QuotesManager() {
  const [quotes, setQuotes] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const fetchQuotes = () => {
    axios.get('http://localhost:5000/api/quotes/admin/all', { headers })
      .then(res => { if (res.data.success) setQuotes(res.data.data); })
      .catch(console.error);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleDeleteClick = (quote, displayCode) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer ce devis ?',
      message: `Voulez-vous vraiment supprimer le devis ${displayCode} adressé à ${quote.client_name} ?`,
      onConfirm: () => executeDelete(quote.id)
    });
  };

  const executeDelete = (id) => {
    axios.delete(`http://localhost:5000/api/quotes/admin/${id}`, { headers })
      .then(() => fetchQuotes())
      .catch(console.error)
      .finally(() => setConfirmModal(prev => ({ ...prev, isOpen: false })));
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs text-left">
      <h2 className="text-xl font-extrabold text-slate-900 mb-4">Gestion des Devis Client</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b">
            <tr>
              <th className="p-3">Référence</th>
              <th className="p-3">Client</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Montant Estimé</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => {
              const displayCode = q.quote_code || `DC-${String(q.id).padStart(4, '0')}`;
              return (
                <tr key={q.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-bold text-digitBlue">{displayCode}</td>
                  <td className="p-3 font-semibold text-slate-900">{q.client_name}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1"><Mail size={12}/> {q.client_email}</span>
                      <span className="flex items-center gap-1 text-slate-400"><Phone size={12}/> {q.client_phone}</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-emerald-600">{Number(q.estimated_total).toLocaleString('fr-FR')} FCFA</td>
                  <td className="p-3">{new Date(q.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`http://localhost:5000/api/quotes/${displayCode}/pdf`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 text-digitBlue bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <Download size={14} />
                      </a>
                      <button 
                        onClick={() => handleDeleteClick(q, displayCode)} 
                        className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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