// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
// Ya no necesitamos el Spinner aquí, se maneja en AuthProvider

const ProtectedRoute = () => {
  const { token } = useAuth(); // Solo necesitamos el token aquí
  const location = useLocation(); // Para saber de dónde viene el usuario

  if (!token) {
    // Usuario no autenticado, redirigir a login
    console.log("ProtectedRoute: No token found, redirecting to login.");
    // Guardar la ubicación a la que intentaba acceder para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuario autenticado, permitir acceso a la ruta solicitada
  // console.log("ProtectedRoute: Token found, allowing access.");
  return <Outlet />; // Renderiza el componente hijo (DashboardPage, ProfileEditPage, etc.)
};

export default ProtectedRoute;