// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const useAuth = () => {
  const token = localStorage.getItem('token');
  const adminData = localStorage.getItem('adminUser');
  
  let admin = null;
  try {
    admin = adminData ? JSON.parse(adminData) : null;
  } catch (e) {
    admin = null;
  }

  return {
    isAuthenticated: !!token && !!admin,
    role: admin?.role || 'admin', // Utilise le rôle exact du backend (ex: 'superadmin')
  };
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification flexible : accepte 'admin', 'superadmin' ou tout rôle dans allowedRoles
  const isAuthorized = !allowedRoles || allowedRoles.includes(role) || role === 'superadmin';

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;