import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AnimatedBackground from './AnimatedBackground';

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
    <section id="contact" className="relative overflow-hidden py-20 px-6 bg-slate-900 text-white">
      {/* Background Image Overlay + Animated Orbs */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')` }}
      />
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto text-left relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Colonne Infos de Contact */}
          <div className="space-y-6">
            <span className="text-digitPink font-bold text-xs uppercase tracking-wider block bg-digitPink/10 w-fit px-3 py-1 rounded-full border border-digitPink/20">
              {t('contact_us', 'Contactez-nous')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {t('contact_title', 'Un projet en tête ?')}{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-digitBlue to-sky-400">
                {t('contact_talk', 'Parlons-en.')}
              </span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {t('contact_description', 'Notre équipe est à votre disposition pour concrétiser vos idées et propulser la présence numérique de votre marque.')}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <div className="p-3 bg-sky-400/20 text-sky-400 rounded-lg">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{t('contact_location', 'Localisation')}</p>
                  <p className="text-sm font-bold text-white">Douala, Cameroun</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <div className="p-3 bg-digitPink/20 text-digitPink rounded-lg">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{t('contact_email', 'Adresse Email')}</p>
                  <p className="text-sm font-bold text-white">contact@digit-connect.agency</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <div className="p-3 bg-sky-400/20 text-sky-400 rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{t('contact_phone', 'Téléphone / WhatsApp')}</p>
                  <p className="text-sm font-bold text-white">+237 600 00 00 00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de Contact */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20 shadow-2xl text-slate-800">
            {status.success ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle size={52} className="text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-900">{t('contact_success_title', 'Message envoyé avec succès !')}</h3>
                <p className="text-slate-600 text-sm">
                  {t('contact_success_message', 'Merci pour votre message. Nous vous répondrons dans les plus brefs délais.')}
                </p>
                <button
                  onClick={() => setStatus({ loading: false, success: false, error: null })}
                  className="mt-4 px-6 py-2.5 bg-digitBlue text-white font-bold text-sm rounded-lg hover:bg-digitPink transition-all cursor-pointer"
                >
                  {t('contact_another_message', 'Envoyer un autre message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status.error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg">
                    {status.error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-white mb-2">{t('contact_full_name', 'Nom complet')}*</label>
                  <input
                    type="text"
                    required
                    placeholder={t('contact_full_name_placeholder', 'Votre nom ou le nom de votre entreprise')}
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full p-3 bg-none border border-slate-200 rounded-lg text-slate-800 focus:border-digitBlue focus:bg-white placeholder:text-white outline-none transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">{t('contact_email', 'Email')}*</label>
                    <input
                      type="email"
                      required
                      placeholder={t('contact_email_placeholder', 'nom@domaine.com')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 bg-none border border-slate-200 rounded-lg text-slate-800 focus:border-digitBlue focus:bg-white placeholder:text-white outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">{t('contact_phone', 'Téléphone')}</label>
                    <input
                      type="tel"
                      placeholder="+237 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-none border border-slate-200 rounded-lg text-slate-800 focus:border-digitBlue focus:bg-white placeholder:text-white outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-2">{t('contact_subject', 'Sujet')}</label>
                  <input
                    type="text"
                    placeholder={t('contact_subject_placeholder', 'De quoi s\'agit-il ?')}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 bg-none border border-slate-200 rounded-lg text-slate-800 focus:border-digitBlue focus:bg-white placeholder:text-white outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-2">{t('contact_message', 'Message')}*</label>
                  <textarea
                    required
                    rows="4"
                    placeholder={t('contact_message_placeholder', 'Décrivez votre besoin...')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 bg-none border border-slate-200 rounded-lg text-slate-800 focus:border-digitBlue focus:bg-white placeholder:text-white outline-none transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full py-3.5 bg-digitBlue hover:bg-digitPink text-white font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {status.loading ? t('contact_sending', 'Envoi en cours...') : t('contact_send', 'Envoyer le message')} <Send size={16} />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}