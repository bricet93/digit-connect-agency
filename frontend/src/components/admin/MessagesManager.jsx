import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Mail, Phone, Calendar } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const fetchMessages = () => {
    axios.get('http://localhost:5000/api/contacts/admin/all', { headers })
      .then(res => { if (res.data.success) setMessages(res.data.data); })
      .catch(console.error);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDeleteClick = (msg) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer le message',
      message: `Êtes-vous sûr de vouloir supprimer le message de ${msg.full_name} ("${msg.subject || 'Sans objet'}") ?`,
      onConfirm: () => executeDelete(msg.id)
    });
  };

  const executeDelete = (id) => {
    axios.delete(`http://localhost:5000/api/contacts/admin/${id}`, { headers })
      .then(() => fetchMessages())
      .catch(console.error)
      .finally(() => setConfirmModal(prev => ({ ...prev, isOpen: false })));
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs text-left">
      <h2 className="text-xl font-extrabold text-slate-900 mb-4">Messages Reçus</h2>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-slate-900 text-sm">{m.full_name}</h4>
                <span className="text-[10px] text-slate-400">{new Date(m.created_at).toLocaleString('fr-FR')}</span>
              </div>
              <p className="text-xs text-digitBlue font-semibold">{m.subject || 'Sans objet'}</p>
              <p className="text-xs text-slate-600 mt-2">{m.message}</p>
              <div className="flex gap-4 text-[11px] text-slate-400 pt-2">
                <span className="flex items-center gap-1"><Mail size={12}/> {m.email}</span>
                {m.phone && <span className="flex items-center gap-1"><Phone size={12}/> {m.phone}</span>}
              </div>
            </div>
            <button onClick={() => handleDeleteClick(m)} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 cursor-pointer"><Trash2 size={14} /></button>
          </div>
        ))}
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