import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Briefcase, Users, TrendingUp, 
  MessageSquare, Newspaper, Wrench, LogOut, Layers 
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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Chargement des statistiques globales du dashboard
    Promise.allSettled([
      axios.get('http://localhost:5000/api/quotes/admin/all', { headers }),
      axios.get('http://localhost:5000/api/contacts/admin/all', { headers }),
      axios.get('http://localhost:5000/api/articles/admin/all', { headers }),
      axios.get('http://localhost:5000/api/portfolio'),
      axios.get('http://localhost:5000/api/team'),
      axios.get('http://localhost:5000/api/services')
    ]).then(([qRes, cRes, aRes, pRes, tRes, sRes]) => {
      setStats({
        quotes: qRes.status === 'fulfilled' && qRes.value.data.success ? qRes.value.data.data.length : 0,
        messages: cRes.status === 'fulfilled' && cRes.value.data.success ? cRes.value.data.data.length : 0,
        articles: aRes.status === 'fulfilled' && aRes.value.data.success ? aRes.value.data.data.length : 0,
        projects: pRes.status === 'fulfilled' && pRes.value.data.success ? pRes.value.data.data.length : 0,
        team: tRes.status === 'fulfilled' && tRes.value.data.success ? tRes.value.data.data.length : 0,
        services: sRes.status === 'fulfilled' && sRes.value.data.success ? sRes.value.data.data.length : 0,
      });
    });
  }, []);

  // Déconnexion complète : suppression du Token et des infos Admin
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

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-left">
      {/* Sidebar Latérale Gauche */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 sticky top-0 h-screen border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
            <div className="p-2 bg-digitBlue rounded-lg">
              <img 
                src={logoSvg} 
                alt="DIGIT-CONNECT LOGO" 
                className="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

        {/* Bouton de déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer border border-rose-500/20"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </aside>

      {/* Contenu principal à droite */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Tableau de bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Catalogue Services', value: stats.services, color: 'text-cyan-600', bg: 'bg-cyan-500/10', icon: Wrench },
                { label: 'Devis Générés', value: stats.quotes, color: 'text-digitBlue', bg: 'bg-digitBlue/10', icon: FileText },
                { label: 'Messages Reçus', value: stats.messages, color: 'text-indigo-600', bg: 'bg-indigo-500/10', icon: MessageSquare },
                { label: 'Articles', value: stats.articles, color: 'text-purple-600', bg: 'bg-purple-500/10', icon: Newspaper },
                { label: 'Projets Réalisés', value: stats.projects, color: 'text-digitPink', bg: 'bg-digitPink/10', icon: Briefcase },
                { label: 'Membres Équipe', value: stats.team, color: 'text-amber-600', bg: 'bg-amber-500/10', icon: Users },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">{item.label}</span>
                      <h3 className={`text-2xl font-black mt-1 ${item.color}`}>{item.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${item.bg}`}><Icon className={item.color} size={20} /></div>
                  </div>
                );
              })}
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