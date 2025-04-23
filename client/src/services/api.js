// src/services/api.js (CORREGIDO para Vite)
import axios from 'axios';
import toast from 'react-hot-toast';

// Leer la variable de entorno de Vite
const apiBaseUrl = import.meta.env.VITE_API_URL;

// Añadir un log para verificar que se está leyendo correctamente al iniciar
console.log("API Base URL configurada:", apiBaseUrl);

// Verificar si la variable existe
if (!apiBaseUrl) {
    console.error("¡Error Crítico! La variable VITE_API_URL no está definida.");
    console.error("Asegúrate de tener un archivo .env en la raíz de 'client' con VITE_API_URL=http://localhost:5000/api");
    toast.error("Error de configuración: La URL del servidor API no está definida.");
    // Podríamos lanzar un error aquí para detener la carga si es preferible
}

const api = axios.create({
  // Usar la variable leída de import.meta.env
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Los Interceptors (request y response) permanecen IGUAL ---

// Request Interceptor: Añadir token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Manejo global de errores
api.interceptors.response.use(
  (response) => response, // Devuelve la respuesta si todo está bien
  (error) => {
     // ... (Lógica de manejo de errores 401, 500, red, etc. se mantiene igual) ...
    console.error("[API Error]", error.response || error.message);
    // ... (resto del interceptor de respuesta) ...
    if (error.response && error.response.status === 401) {
        // ... (lógica 401) ...
    } else if (error.response && error.response.status >= 500) {
        // ... (lógica 500) ...
    } else if (error.request) {
        // ... (lógica error de red) ...
    }
    return Promise.reject(error);
  }
);


export default api;