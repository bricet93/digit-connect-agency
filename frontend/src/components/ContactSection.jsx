import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ContactSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await axios.post('http://localhost:5000/api/contacts', formData);
      if (res.data.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ full_name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || "Erreur lors de l'envoi du message." 
      });
    }
  };

  return (
    <section id="contact" className="py-16 max-w-7xl mx-auto px-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Colonne Infos de Contact */}
        <div className="space-y-6">
          <span className="text-digitPink font-bold text-sm uppercase tracking-wider block">
            {t('contact_us', 'Contactez-nous')}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {t('contact_title', 'Un projet en tête ?')} <span className="text-digitBlue">{t('contact_talk', 'Parlons-en.')}</span>
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {t('contact_description', 'Notre équipe est à votre disposition pour concrétiser vos idées et propulser la présence numérique de votre marque.')}
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-sm border border-slate-200 shadow-xs">
              <div className="p-3 bg-digitBlue/10 text-digitBlue rounded-sm">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{t('contact_location', 'Localisation')}</p>
                <p className="text-sm font-bold text-slate-800">Douala, Cameroun</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-sm border border-slate-200 shadow-xs">
              <div className="p-3 bg-digitPink/10 text-digitPink rounded-sm">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{t('contact_email', 'Adresse Email')}</p>
                <p className="text-sm font-bold text-slate-800">contact@digit-connect.agency</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-sm border border-slate-200 shadow-xs">
              <div className="p-3 bg-digitCyan/10 text-digitBlue rounded-sm">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{t('contact_phone', 'Téléphone / WhatsApp')}</p>
                <p className="text-sm font-bold text-slate-800">+237 600 00 00 00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de Contact */}
        <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-xl hover:shadow-md transition-shadow">
          {status.success ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle size={52} className="text-emerald-500 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-900">{t('contact_success_title', 'Message envoyé avec succès !')}</h3>
              <p className="text-slate-600 text-sm">
                {t('contact_success_message', 'Merci pour votre message. Nous vous répondrons dans les plus brefs délais.')}
              </p>
              <button
                onClick={() => setStatus({ loading: false, success: false, error: null })}
                className="mt-4 px-6 py-2.5 bg-digitBlue text-white font-bold text-sm rounded-sm hover:bg-digitBlue/90 transition-all cursor-pointer"
              >
                {t('contact_another_message', 'Envoyer un autre message')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status.error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-sm">
                  {status.error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contact_full_name', 'Nom complet')}*</label>
                <input
                  type="text"
                  required
                  placeholder={t('contact_full_name_placeholder', 'Votre nom ou le nom de votre entreprise')}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm text-slate-800 focus:border-digitBlue focus:bg-white outline-none transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contact_email', 'Email')}*</label>
                  <input
                    type="email"
                    required
                    placeholder={t('contact_email_placeholder', 'nom@domaine.com')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm text-slate-800 focus:border-digitBlue focus:bg-white outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contact_phone', 'Téléphone')}</label>
                  <input
                    type="tel"
                    placeholder="+237 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm text-slate-800 focus:border-digitBlue focus:bg-white outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contact_subject', 'Sujet')}</label>
                <input
                  type="text"
                  placeholder={t('contact_subject_placeholder', 'De quoi s\'agit-il ?')}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm text-slate-800 focus:border-digitBlue focus:bg-white outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contact_message', 'Message')}*</label>
                <textarea
                  required
                  rows="4"
                  placeholder={t('contact_message_placeholder', 'Décrivez votre besoin...')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-sm text-slate-800 focus:border-digitBlue focus:bg-white outline-none transition-all text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full py-3.5 bg-digitBlue hover:bg-digitBlue/90 text-white font-bold rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status.loading ? t('contact_sending', 'Envoi en cours...') : t('contact_send', 'Envoyer le message')} <Send size={16} />
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}