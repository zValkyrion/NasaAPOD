// src/components/features/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { FaSave, FaUserEdit } from 'react-icons/fa';

const ProfileForm = ({ user, onSubmit, isLoading, apiError }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState(''); // Error de validación local

  // Prellenar el nombre cuando el componente se monta o el usuario cambia
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]); // Dependencia: user

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Limpiar errores al escribir
    if (formError) setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(''); // Resetear error local

    const { name, password, confirmPassword } = formData;

    // Validación: Contraseñas coinciden si se ingresaron ambas
    if (password && password !== confirmPassword) {
      setFormError('Las nuevas contraseñas no coinciden.');
      return;
    }
    // Validación: Longitud mínima si se ingresó contraseña
    if (password && password.length < 6) {
      setFormError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Preparar datos para enviar: solo lo que cambió o es nuevo
    const updateData = {};
    // Solo incluir nombre si es diferente al original (o si no había nombre antes)
    if (name.trim() && name !== user?.name) {
        updateData.name = name.trim();
    }
    // Incluir contraseña solo si se proporcionó una nueva
    if (password) {
        updateData.password = password;
    }

    // Llamar a la función onSubmit pasada por ProfileEditPage solo si hay datos para actualizar
    if (Object.keys(updateData).length > 0) {
       onSubmit(updateData);
    } else {
        setFormError("No hay cambios para guardar."); // O mostrar un toast info
    }

  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
       <h3 className="text-lg font-semibold text-textPrimary flex items-center mb-4">
           <FaUserEdit className="mr-2 text-primary" /> Editar Información Personal
       </h3>

      {/* Mostrar error de validación local o error de API */}
      {(formError || apiError) && (
         <Alert type="error" message={formError || apiError} className="mb-4" />
      )}

      <Input
        id="name"
        label="Nombre"
        type="text"
        value={formData.name}
        onChange={handleChange}
        placeholder="Tu nombre"
        disabled={isLoading}
      />

      {/* Sección para cambiar contraseña */}
      <div className="border-t border-gray-200 pt-5 mt-6">
         <h4 className="text-md font-semibold text-textSecondary mb-3">Cambiar Contraseña (Opcional)</h4>
         <p className="text-xs text-gray-500 mb-3">Deja estos campos en blanco si no deseas cambiar tu contraseña.</p>
         <Input
            id="password"
            label="Nueva Contraseña"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
            autoComplete="new-password"
             error={formError && (formError.includes('contraseña') || formError.includes('coinciden')) ? formError : undefined}
         />
         <Input
            id="confirmPassword"
            label="Confirmar Nueva Contraseña"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite la nueva contraseña"
            disabled={isLoading}
            autoComplete="new-password"
             error={formError && formError.includes('coinciden') ? formError : undefined}
         />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full sm:w-auto" // Ancho completo en móvil, auto en grande
        isLoading={isLoading}
        disabled={isLoading}
      >
         <FaSave className="mr-2" /> Guardar Cambios
      </Button>
    </form>
  );
};

export default ProfileForm;