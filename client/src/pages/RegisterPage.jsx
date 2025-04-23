// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Para validación frontend
  });
  const [formError, setFormError] = useState(''); // Error de validación del formulario
  const { register, isLoading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  // Limpiar errores al desmontar o cambiar de página
  useEffect(() => {
    return () => {
      setAuthError(null);
    };
  }, [setAuthError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Limpiar error de formulario al empezar a escribir
    if (formError) setFormError('');
    // Limpiar error de API al empezar a escribir
    if (authError) setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Limpiar error previo
    setAuthError(null); // Limpiar error de API previo

    // Validación básica de frontend
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }
    if (formData.password.length < 6) {
        setFormError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    // Si la validación pasa, llamar a la función de registro del contexto
    // Enviamos solo los datos que espera el backend
    await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
    });
    // La navegación ocurre dentro de la función 'register' si tiene éxito
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-textPrimary mb-6">Crear una cuenta</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Mostrar error de validación o de API */}
        {(formError || authError) && (
          <Alert type="error" message={formError || authError} className="mb-4" />
        )}

        <Input
          id="name"
          label="Nombre"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu Nombre"
          required
          disabled={isLoading}
        />
        <Input
          id="email"
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@correo.com"
          required
          disabled={isLoading}
        />
        <Input
          id="password"
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          required
          disabled={isLoading}
          error={formError && (formError.includes('contraseña') || formError.includes('coinciden')) ? formError : undefined} // Mostrar error si es relevante
        />
         <Input
          id="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
          required
          disabled={isLoading}
           error={formError && formError.includes('coinciden') ? formError : undefined} // Mostrar error si es relevante
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Registrarse
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-textSecondary">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
          Inicia sesión aquí
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterPage;