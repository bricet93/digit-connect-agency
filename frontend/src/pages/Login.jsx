import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

import logoSvg from '../assets/ColorLabel.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Récupère la page d'origine interceptée par ProtectedRoute, sinon va sur /admin
  // Dans Login.jsx
  const from = (location.state?.from?.pathname && location.state.from.pathname !== '/') ? location.state.from.pathname : '/admin';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      console.log("Réponse de l'API :", res.data); // <-- Vérifie ce qui est renvoyé

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);

        // S'assurer que le rôle est bien stocké
        const userToStore = res.data.admin || { role: 'superadmin' };
        localStorage.setItem('adminUser', JSON.stringify(userToStore));

        navigate('/admin', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans text-left">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-md font-bold text-slate-800 uppercase mb-2">Back Office</h2>
          <div className="flex items-center justify-center gap-2">
            <img 
              src={logoSvg} 
              alt="DIGIT-CONNECT LOGO" 
              className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                required
                placeholder="admin@digit-connect.agency"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs focus:border-digitBlue focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs focus:border-digitBlue focus:bg-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-digitBlue hover:bg-digitPink text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50"
          >
            {loading ? 'Vérification...' : 'Se connecter'} <ArrowRight size={16} />
          </button>

          {/* Lien de retour au site public sous le formulaire */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-digitBlue transition-colors"
            >
              <ArrowLeft size={14} /> Retourner au Front Office
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}