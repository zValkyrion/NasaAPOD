import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoading, authError, setAuthError } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    return () => {
      setAuthError(null);
    };
  }, [setAuthError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (authError) setAuthError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!formData.email || !formData.password) {
      setAuthError("Por favor, introduce tu correo y contraseña.");
      return;
    }
    login(formData);
  };

  const fromMessage = location.state?.from?.pathname
    ? `Inicia sesión para acceder a ${location.state.from.pathname}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <FaSignInAlt className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="mt-3 text-xl font-semibold text-gray-900">Iniciar Sesión</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Mostrar error de API o mensaje de redirección */}
        {(authError || fromMessage) && (
          <Alert 
            type="error" 
            message={authError || fromMessage} 
            className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200" 
          />
        )}

        <div className="space-y-4">
          <Input
            id="email"
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@correo.com"
            required
            disabled={isLoading}
            autoComplete="email"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          
          <Input
            id="password"
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            required
            disabled={isLoading}
            autoComplete="current-password"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
              Recordarme
            </label>
          </div>
          <div className="text-sm">

          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6 rounded-md bg-blue-600 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">O continúa con</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Google (Deshabilitado)
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Microsoft (Deshabilitado)
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-150">
          Regístrate gratis
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginPage;