import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Briefcase, Users, TrendingUp, 
  MessageSquare, Newspaper, Wrench, LogOut, Layers,
  ChevronLeft, ChevronRight, Download, Mail, Phone, ExternalLink
} from 'lucide-react';

import QuotesManager from '../components/admin/QuotesManager';
import MessagesManager from '../components/admin/MessagesManager';
import ArticlesManager from '../components/admin/ArticlesManager';
import PortfolioManager from '../components/admin/PortfolioManager';
import TeamManager from '../components/admin/TeamManager';
import ServicesManager from '../components/admin/ServicesManager';
import ServiceCatalogManager from '../components/admin/ServiceCatalogManager';

import logoSvg from '../assets/IconWhite.svg';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ quotes: 0, messages: 0, articles: 0, projects: 0, team: 0, services: 0 });
  
  // États pour les listes d'aperçu de la vue d'ensemble
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  
  // États de pagination (5 par page)
  const [quotesPage, setQuotesPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Chargement des données globales
    Promise.allSettled([
      axios.get('http://localhost:5000/api/quotes/admin/all', { headers }),
      axios.get('http://localhost:5000/api/contacts/admin/all', { headers }),
      axios.get('http://localhost:5000/api/articles/admin/all', { headers }),
      axios.get('http://localhost:5000/api/portfolio'),
      axios.get('http://localhost:5000/api/team'),
      axios.get('http://localhost:5000/api/services')
    ]).then(([qRes, cRes, aRes, pRes, tRes, sRes]) => {
      const quotesData = qRes.status === 'fulfilled' && qRes.value.data.success ? qRes.value.data.data : [];
      const messagesData = cRes.status === 'fulfilled' && cRes.value.data.success ? cRes.value.data.data : [];
      
      setRecentQuotes(quotesData);
      setRecentMessages(messagesData);

      setStats({
        quotes: quotesData.length,
        messages: messagesData.length,
        articles: aRes.status === 'fulfilled' && aRes.value.data.success ? aRes.value.data.data.length : 0,
        projects: pRes.status === 'fulfilled' && pRes.value.data.success ? pRes.value.data.data.length : 0,
        team: tRes.status === 'fulfilled' && tRes.value.data.success ? tRes.value.data.data.length : 0,
        services: sRes.status === 'fulfilled' && sRes.value.data.success ? sRes.value.data.data.length : 0,
      });
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    navigate('/login', { replace: true });
  };

  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'catalog', label: 'Catalogue Services', icon: Layers },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'quotes', label: 'Devis', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'articles', label: 'Articles', icon: Newspaper },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'team', label: 'Équipe', icon: Users },
  ];

  // Calcul des données paginées
  const paginatedQuotes = recentQuotes.slice((quotesPage - 1) * ITEMS_PER_PAGE, quotesPage * ITEMS_PER_PAGE);
  const totalQuotesPages = Math.ceil(recentQuotes.length / ITEMS_PER_PAGE) || 1;

  const paginatedMessages = recentMessages.slice((messagesPage - 1) * ITEMS_PER_PAGE, messagesPage * ITEMS_PER_PAGE);
  const totalMessagesPages = Math.ceil(recentMessages.length / ITEMS_PER_PAGE) || 1;

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-left">
      {/* Sidebar Latérale Gauche */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 sticky top-0 h-screen border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
            <div className="p-2 bg-digitBlue rounded-sm">
              <img 
                src={logoSvg} 
                alt="DIGIT-CONNECT LOGO" 
                className="h-9 w-auto object-contain transition-transform duration-500 hover:scale-105" 
              />
            </div>
            <div>
              <h1 className="font-bold italic text-sm tracking-tight">DIGIT-CONNECT</h1>
              <span className="text-digitPink font-normal text-[10px] uppercase">Back-Office</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-digitBlue text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer border border-rose-500/20"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </aside>

      {/* Contenu principal à droite */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Vue d'ensemble</h2>
              <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-sm border border-slate-200 font-semibold">
                Activité en temps réel
              </span>
            </div>

            {/* Cartes de statistiques interactives avec badge de notification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: 'Catalogue Services', value: stats.services, color: 'text-cyan-600', bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500/40', dotColor: 'bg-cyan-500', icon: Wrench, targetTab: 'catalog' },
                { label: 'Devis Générés', value: stats.quotes, color: 'text-digitBlue', bg: 'bg-digitBlue/10', border: 'hover:border-digitBlue/40', dotColor: 'bg-digitBlue', icon: FileText, targetTab: 'quotes' },
                { label: 'Messages Reçus', value: stats.messages, color: 'text-indigo-600', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/40', dotColor: 'bg-indigo-500', icon: MessageSquare, targetTab: 'messages' },
                { label: 'Articles Publiés', value: stats.articles, color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/40', dotColor: 'bg-purple-500', icon: Newspaper, targetTab: 'articles' },
                { label: 'Projets Réalisés', value: stats.projects, color: 'text-digitPink', bg: 'bg-digitPink/10', border: 'hover:border-digitPink/40', dotColor: 'bg-digitPink', icon: Briefcase, targetTab: 'portfolio' },
                { label: 'Membres Équipe', value: stats.team, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/40', dotColor: 'bg-amber-500', icon: Users, targetTab: 'team' },
              ].map((item, idx) => {
                const Icon = item.icon;
                const hasData = item.value > 0;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setActiveTab(item.targetTab)}
                    className={`relative bg-white p-5 rounded-sm border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer group ${item.border}`}
                  >
                    {/* Badge / Point Notification en haut à droite */}
                    {hasData && (
                      <span className="absolute top-3 right-3 flex h-1.5 w-1.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${item.dotColor} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${item.dotColor}`}></span>
                      </span>
                    )}

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                      <h3 className={`text-3xl font-black mt-1 ${item.color}`}>{item.value}</h3>
                    </div>
                    <div className={`p-3.5 rounded-sm ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={item.color} size={22} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section Aperçu : Devis et Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              
              {/* Card Aperçu des Devis (Max 5 + Pagination) */}
              <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="text-digitBlue" size={18} />
                      <h3 className="text-base font-extrabold text-slate-900">Derniers Devis</h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('quotes')} 
                      className="text-xs font-bold text-digitBlue hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Voir tout <ExternalLink size={12} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {paginatedQuotes.length > 0 ? (
                      paginatedQuotes.map((q) => {
                        const displayCode = q.quote_code || `DC-${String(q.id).padStart(4, '0')}`;
                        return (
                          <div key={q.id} className="p-3 border border-slate-100 rounded-sm bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between transition-colors">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-digitBlue">{displayCode}</span>
                              <h4 className="text-xs font-extrabold text-slate-900">{q.client_name}</h4>
                              <p className="text-[11px] text-slate-400">{q.client_email}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-600 block">
                                {Number(q.estimated_total).toLocaleString('fr-FR')} FCFA
                              </span>
                              <a 
                                href={`http://localhost:5000/api/quotes/${displayCode}/pdf`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-digitBlue mt-1"
                              >
                                <Download size={11} /> PDF
                              </a>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 py-6 text-center">Aucun devis disponible.</p>
                    )}
                  </div>
                </div>

                {/* Controls Pagination Devis */}
                {recentQuotes.length > ITEMS_PER_PAGE && (
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Page {quotesPage} sur {totalQuotesPages}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setQuotesPage(p => Math.max(p - 1, 1))}
                        disabled={quotesPage === 1}
                        className="p-1.5 rounded-sm border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={() => setQuotesPage(p => Math.min(p + 1, totalQuotesPages))}
                        disabled={quotesPage === totalQuotesPages}
                        className="p-1.5 rounded-sm border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Aperçu des Messages (Max 5 + Pagination) */}
              <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="text-indigo-600" size={18} />
                      <h3 className="text-base font-extrabold text-slate-900">Derniers Messages</h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('messages')} 
                      className="text-xs font-bold text-digitBlue hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Voir tout <ExternalLink size={12} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {paginatedMessages.length > 0 ? (
                      paginatedMessages.map((m) => (
                        <div key={m.id} className="p-3 border border-slate-100 rounded-sm bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-extrabold text-slate-900">{m.full_name}</h4>
                            <span className="text-[10px] text-slate-400">
                              {new Date(m.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-digitBlue line-clamp-1">{m.subject || 'Sans objet'}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{m.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-6 text-center">Aucun message reçu.</p>
                    )}
                  </div>
                </div>

                {/* Controls Pagination Messages */}
                {recentMessages.length > ITEMS_PER_PAGE && (
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Page {messagesPage} sur {totalMessagesPages}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setMessagesPage(p => Math.max(p - 1, 1))}
                        disabled={messagesPage === 1}
                        className="p-1.5 rounded-sm border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={() => setMessagesPage(p => Math.min(p + 1, totalMessagesPages))}
                        disabled={messagesPage === totalMessagesPages}
                        className="p-1.5 rounded-sm border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {activeTab === 'catalog' && <ServiceCatalogManager />}
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'quotes' && <QuotesManager />}
        {activeTab === 'messages' && <MessagesManager />}
        {activeTab === 'articles' && <ArticlesManager />}
        {activeTab === 'portfolio' && <PortfolioManager />}
        {activeTab === 'team' && <TeamManager />}
      </main>
    </div>
  );
}