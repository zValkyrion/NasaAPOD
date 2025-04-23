// src/hooks/useAuth.js (Verificar que siga así)
import { useContext } from 'react';
// Asegúrate que la importación SÓLO sea del contexto, NO del provider
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  // La comprobación sigue siendo válida e importante
  if (context === undefined) {
     // El valor por defecto ahora es un objeto, no null, así que verificamos undefined
     // que significa que no hay Provider en el árbol superior.
    console.error("AuthContext value is undefined - Provider missing?");
    throw new Error('useAuth debe ser usado dentro de un AuthProvider.');
  }

  // Ya no necesitamos comprobar contra null porque el valor por defecto no es null
  // y el Provider siempre está presente.

  return context;
};

export default useAuth;