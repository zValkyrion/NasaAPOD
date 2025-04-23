// src/routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages (Importa todas tus páginas)
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage'; // Asegúrate de crearla
import DashboardPage from '../pages/DashboardPage';
import ProfileEditPage from '../pages/ProfileEditPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas con MainLayout (Navbar/Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* Rutas protegidas que también usan MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
        </Route>
      </Route>

      {/* Rutas con AuthLayout (Centrado, sin Navbar/Footer) */}
      {/* Estas NO deben estar protegidas */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>


      {/* Ruta para páginas no encontradas (404) */}
      {/* Puedes ponerla dentro o fuera de MainLayout según prefieras */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default AppRoutes;