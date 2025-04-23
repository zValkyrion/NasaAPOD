import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo y Título */}
        <div className="text-center mb-6">
          <svg
            className="mx-auto h-12 w-12 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
          >
            <circle fill="#0B3D91" cx="18" cy="18" r="18"/>
            <path fill="#FFF" d="M18,3.2c-8.2,0-14.8,6.6-14.8,14.8c0,8.2,6.6,14.8,14.8,14.8s14.8-6.6,14.8-14.8 C32.8,9.8,26.2,3.2,18,3.2z M25.5,21.9c0,0.2-0.1,0.3-0.3,0.3h-1.2c-0.2,0-0.3-0.1-0.3-0.3v-1.9h-1.2v1.9c0,0.2-0.1,0.3-0.3,0.3 h-1.2c-0.2,0-0.3-0.1-0.3-0.3v-1.9h-6.6c-0.2,0-0.3-0.1-0.3-0.3v-3.6c0-0.2,0.1-0.3,0.3-0.3h1.5v-1.6c0-0.2,0.1-0.3,0.3-0.3 h1.2c0.2,0,0.3,0.1,0.3,0.3v1.6h1.5v-1.6c0-0.2,0.1-0.3,0.3-0.3h1.2c0.2,0,0.3,0.1,0.3,0.3v1.6h1.5v-1.6c0-0.2,0.1-0.3,0.3-0.3 h1.2c0.2,0,0.3,0.1,0.3,0.3v1.6h1.5c0.2,0,0.3,0.1,0.3,0.3V21.9z"/>
          </svg>
          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
            NASA App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a la plataforma de recursos NASA
          </p>
        </div>
        
        {/* Tarjeta principal */}
        <Card className="overflow-hidden rounded-xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-gray-200">
          <Outlet /> {/* Aquí se renderizan LoginPage y RegisterPage */}
        </Card>
        
        {/* Footer con texto legal o información */}
        <p className="mt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} NASA App Authentication.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;