import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, ArrowLeft, CheckCircle, Download, Calculator, Sparkles, Building2, User, Landmark, Check, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SERVICES_CATALOG } from '../../constants/categories';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteStepper() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [quoteId, setQuoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_segment: 'pme',
    selected_services: []
  });

  const isEn = i18n.language?.startsWith('en');

  // Réinitialisation du formulaire et retour à la première étape
  const handleReset = () => {
    setStep(1);
    setQuoteId(null);
    setFormData({
      client_name: '',
      client_email: '',
      client_phone: '',
      client_segment: 'pme',
      selected_services: []
    });
  };

  const toggleService = (id) => {
    setFormData(prev => {
      const exists = prev.selected_services.includes(id);
      return {
        ...prev,
        selected_services: exists
          ? prev.selected_services.filter(s => s !== id)
          : [...prev.selected_services, id]
      };
    });
  };

  const calculateTotal = () => {
    return formData.selected_services.reduce((acc, serviceId) => {
      const found = SERVICES_CATALOG.find(s => s.id === serviceId);
      return acc + (found ? found.price : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/quotes', {
        ...formData,
        estimated_total: calculateTotal()
      });
      if (response.data.success) {
        setQuoteId(response.data.quoteId);
        setStep(4);
      }
    } catch (err) {
      console.error("Détails de l'erreur :", err.response?.data || err.message);
      alert("Erreur lors de la création du devis : " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Regroupement dynamique par catégorie selon la langue courante
  const groupedServices = SERVICES_CATALOG.reduce((acc, service) => {
    const groupName = isEn ? service.group_en : service.group_fr;
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push({
      ...service,
      displayName: isEn ? service.name_en : service.name_fr
    });
    return acc;
  }, {});

  const segments = [
    {
      id: 'pme',
      title: t('client_pme', 'PME / Start-up'),
      desc: isEn ? 'Agile digital solutions for growing companies' : 'Solutions digitales agiles pour structures en croissance',
      icon: <Building2 className="text-digitBlue" size={24} />
    },
    {
      id: 'artist',
      title: t('client_artist', 'Artiste / Créatif / Influenceur'),
      desc: isEn ? 'Branding & content creation for personal image' : 'Branding et création de contenu pour image personnelle',
      icon: <User className="text-digitPink" size={24} />
    },
    {
      id: 'brand',
      title: t('client_brand', 'Marque / Entreprise établie'),
      desc: isEn ? '360° support, IT & global strategy' : 'Accompagnement 360°, IT et stratégie globale',
      icon: <Landmark className="text-indigo-600" size={24} />
    }
  ];

  return (
    <section id="quote-section" className="py-20 px-4 bg-slate-50 border-y border-slate-200/60">
      <div id="quote" className="max-w-7xl mx-auto bg-white rounded-lg border border-slate-200 shadow-xl hover:shadow-md transition-shadow overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-left">

        {/* Formulaire Stepper à Droite */}
        <div className="lg:col-span-8 p-8 flex flex-col justify-between bg-white">
          {/* Stepper Header */}
          <div>
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((num) => (
                  <React.Fragment key={num}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      step === num 
                        ? 'bg-digitBlue text-white shadow-md ring-4 ring-digitBlue/10' 
                        : step > num 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > num ? <Check size={14} /> : num}
                    </div>
                    {num < 3 && <div className={`w-8 h-0.5 ${step > num ? 'bg-emerald-500' : 'bg-slate-100'}`} />}
                  </React.Fragment>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                {t('step', 'Étape')} {step < 4 ? step : 3} / 3
              </span>
            </div>

            {/* Stepper Content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    {t('client_segment', 'Sélectionnez votre profil :')}
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {segments.map((seg) => (
                      <div
                        key={seg.id}
                        onClick={() => setFormData({ ...formData, client_segment: seg.id })}
                        className={`p-4 rounded-lg border cursor-pointer flex items-center gap-4 transition-all ${
                          formData.client_segment === seg.id
                            ? 'border-digitBlue bg-digitBlue/5 shadow-md ring-2 ring-digitBlue/20'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="p-3 bg-white rounded-lg shadow-xs border border-slate-100">
                          {seg.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-900">{seg.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{seg.desc}</p>
                        </div>
                        <input
                          type="radio"
                          name="client_segment"
                          checked={formData.client_segment === seg.id}
                          onChange={() => {}}
                          className="h-4 w-4 text-digitBlue focus:ring-digitBlue"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 max-h-95 overflow-y-auto pr-2"
                >
                  {Object.entries(groupedServices).map(([groupTitle, services]) => (
                    <div key={groupTitle} className="space-y-2.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-digitBlue bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-digitBlue">
                        {groupTitle}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {services.map(s => {
                          const isSelected = formData.selected_services.includes(s.id);
                          return (
                            <div
                              key={s.id}
                              onClick={() => toggleService(s.id)}
                              className={`p-3.5 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${
                                isSelected
                                  ? 'border-digitBlue bg-digitBlue/5 shadow-xs'
                                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white'
                              }`}
                            >
                              <span className="text-xs font-bold text-slate-800 pr-3">{s.displayName}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-digitBlue whitespace-nowrap">
                                  {s.price.toLocaleString('fr-FR').replace(/\s/g, '.')} FCFA
                                </span>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-digitBlue rounded border-slate-300 focus:ring-digitBlue"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('client_name', 'Nom complet / Structure')}</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Paul Mbida / Sinergii Sarl"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-digitBlue focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('client_email', 'Adresse Email')}</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: contact@entreprise.cm"
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-digitBlue focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('client_phone', 'Téléphone / WhatsApp')}</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +237 600 00 00 00"
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-digitBlue focus:bg-white outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-6 space-y-5"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle size={36} />
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900">{t('quote_success', 'Devis Enregistré avec Succès !')}</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    {t('quote_ready', 'Votre devis portant la référence')} <strong className="text-digitBlue font-bold">DC-{quoteId}</strong> {t('quote_ready_msg', 'est prêt.')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={`http://localhost:5000/api/quotes/${quoteId}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-digitPink hover:bg-digitPink/90 text-white font-bold text-xs px-6 py-3.5 rounded-lg shadow-lg transition-all"
                    >
                      <Download size={16} /> {t('download_quote', 'Télécharger mon Devis PDF')}
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3.5 rounded-lg transition-all cursor-pointer border border-slate-200"
                    >
                      <RotateCcw size={15} /> {t('new_quote', 'Nouveau devis')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controller Buttons */}
          {step <= 3 && (
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> {t('back', 'Retour')}
                </button>
              ) : <div />}
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-digitBlue text-white text-xs font-bold rounded-lg hover:bg-digitBlue/90 transition-all shadow-md ml-auto cursor-pointer"
                >
                  {t('next', 'Suivant')} <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || formData.selected_services.length === 0 || !formData.client_name || !formData.client_email}
                  className="flex items-center gap-2 px-6 py-2.5 bg-digitPink text-white text-xs font-bold rounded-lg hover:bg-digitPink/90 transition-all shadow-md ml-auto disabled:opacity-50 cursor-pointer"
                >
                  {loading ? t("processing", "Traitement...") : t("generate_quote", "Générer mon Devis")} <CheckCircle size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Panneau d'Illustration & Récapitulatif à Gauche */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-digitBlue/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-digitPink/20 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 text-digitPink font-black text-xs uppercase tracking-widest mb-6 bg-digitPink/10 px-3 py-1.5 rounded-full w-fit border border-digitPink/20">
              <Sparkles size={14} className='animate-pulse' />
              {t('quote_generator_badge', 'Devis Instantané')}
            </div>
            <h3 className="text-2xl font-extrabold text-white leading-snug">
              {t('quote_generator', 'Générateur de Devis Intelligent')}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {isEn 
                ? 'Estimate your project cost in a few steps with custom services.' 
                : 'Estimez le coût de votre projet en quelques étapes avec des prestations sur-mesure.'}
            </p>
          </div>

          {/* Card Total Estimé Dynamique */}
          <div className="my-8 p-5 bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-700/80 shadow-lg">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
              {t('total_estimated', 'Total Estimé :')}
            </span>
            <span className="text-3xl font-black text-white">
              {calculateTotal().toLocaleString('fr-FR').replace(/\s/g, '.')} <span className="text-sm font-bold text-digitPink">FCFA</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <Calculator size={12} />
              {formData.selected_services.length} {isEn ? 'service(s) selected' : 'service(s) sélectionné(s)'}
            </p>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-4">
            DIGIT-CONNECT AGENCY • {isEn ? 'Immediate PDF Generation' : 'Génération PDF immédiate'}
          </div>
        </div>
      </div>
    </section>
  );
}