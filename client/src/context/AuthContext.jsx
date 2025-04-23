// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
// ASUME que tienes un servicio para la llamada DELETE
import { loginUser, registerUser, deleteAccountService } from '../services/authService'; // <-- AÑADIR deleteAccountService
import { getUserProfile, updateUserProfile } from '../services/userService';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import apiClient from '../services/api'; // Necesario si usas el interceptor para el token

// Estado inicial descriptivo para el contexto
const initialContextState = {
    user: null,
    token: null,
    isLoading: true,
    isInitialLoading: true,
    isAuthLoading: false,
    isProfileLoading: false,
    isDeletingLoading: false, // <--- AÑADIR estado de carga para eliminar
    authError: null,
    login: () => Promise.reject(new Error("AuthProvider not initialized")),
    register: () => Promise.reject(new Error("AuthProvider not initialized")),
    logout: () => { console.error("AuthProvider not initialized"); },
    updateUserContext: () => Promise.reject(new Error("AuthProvider not initialized")),
    deleteUserAccountContext: () => Promise.reject(new Error("AuthProvider not initialized")), // <--- AÑADIR función placeholder
    setAuthError: () => { console.error("AuthProvider not initialized"); },
};

// Crear el Contexto
const AuthContext = createContext(initialContextState);

// Crear el Componente Provider
export const AuthProvider = ({ children }) => {
    // --- Estados Internos ---
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isDeletingLoading, setIsDeletingLoading] = useState(false); // <--- AÑADIR estado
    const [authError, setAuthError] = useState(null);

    // Hooks
    const navigate = useNavigate();
    const location = useLocation();

    // --- Función para cargar datos del usuario (Sin cambios) ---
    const loadUser = useCallback(async () => {
        if (!token) {
            console.log("AuthProvider: No token found, cleaning up.");
            setUser(currentUser => currentUser === null ? null : null);
            setIsInitialLoading(currentLoading => currentLoading ? false : false);
            return;
        }
        console.log("AuthProvider: Attempting user load...");
        try {
            // *** IMPORTANTE: Asegúrate que tu apiClient/interceptor esté configurado ***
            // para añadir el token a esta petición GET automáticamente
            const response = await apiClient.get('/users/profile'); // Usar apiClient aquí también
            // Original: const response = await getUserProfile();
            setUser(response.data);
            setAuthError(currentError => currentError === null ? null : null);
            console.log("AuthProvider: User loaded:", response.data.email);
        } catch (err) {
            console.error("AuthProvider: Failed loading user:", err);
             // El interceptor debería manejar 401 (limpiar token, redirigir)
             // Si el error es otro (ej. 500), limpiar localmente podría ser una opción,
             // pero cuidado con no interferir con el interceptor.
            if (err.response?.status !== 401) {
               console.error("AuthProvider: Non-401 error during user load. Check backend/network.");
               // Considera si realmente quieres limpiar todo aquí o solo mostrar un error.
               // Limpiar podría ocultar problemas persistentes.
               // localStorage.removeItem('authToken');
               // setToken(null);
               // setUser(null);
               setAuthError("Error al verificar sesión.");
            }
        } finally {
            setIsInitialLoading(currentLoading => currentLoading ? false : false);
            console.log("AuthProvider: loadUser finally.");
        }
    }, [token]); // Depender SÓLO de 'token'

    // Efecto para ejecutar loadUser (Sin cambios)
    useEffect(() => {
        console.log("AuthProvider: useEffect for loadUser triggered.");
        loadUser();
    }, [loadUser]);

    // --- Funciones de Acción ---

    // login (Sin Cambios)
    const login = async (credentials) => {
        setAuthError(null);
        setIsAuthLoading(true);
        console.log("AuthProvider: login started");
        try {
            const { data } = await loginUser(credentials);
            localStorage.setItem('authToken', data.token);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; // Actualiza apiClient
            setToken(data.token);
            toast.success('¡Bienvenido de nuevo!');
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.msg || 'Credenciales inválidas.';
            console.error("AuthProvider: Login failed:", errorMsg);
            setAuthError(errorMsg);
            toast.error(`Error: ${errorMsg}`);
            localStorage.removeItem('authToken');
            delete apiClient.defaults.headers.common['Authorization']; // Limpia apiClient
            setToken(null);
            setUser(null);
        } finally {
            console.log("AuthProvider: login finished");
            setIsAuthLoading(false);
        }
    };

    // register (Sin Cambios)
    const register = async (userData) => {
        setAuthError(null);
        setIsAuthLoading(true);
        console.log("AuthProvider: register started");
        try {
            await registerUser(userData);
            toast.success('¡Registro exitoso! Por favor, inicia sesión.');
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.msg || 'Error durante el registro.';
            console.error("AuthProvider: Registration failed:", errorMsg);
            setAuthError(errorMsg);
            toast.error(`Error: ${errorMsg}`);
        } finally {
            console.log("AuthProvider: register finished");
            setIsAuthLoading(false);
        }
    };

    // logout (Ajustado para limpiar apiClient)
    const logout = useCallback(() => { // Envuelto en useCallback si se pasa como dependencia
        console.log("AuthProvider: logout");
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        delete apiClient.defaults.headers.common['Authorization']; // Limpia cabecera en apiClient
        setAuthError(null);
        toast.success('Has cerrado sesión.');
        navigate('/login', { replace: true }); // Usar replace para no poder volver atrás
    }, [navigate]); // Añadir navigate como dependencia

    // updateUserContext (Sin Cambios)
    const updateUserContext = async (profileData) => {
        setAuthError(null);
        setIsProfileLoading(true);
        console.log("AuthProvider: updateUser started");
        try {
            // Asumiendo que updateUserProfile usa el apiClient configurado con token
            const { data } = await updateUserProfile(profileData);
            setUser(currentUser => ({ ...currentUser, ...data.user })); // Mejor práctica: Fusionar con datos existentes
            toast.success(data.msg || 'Perfil actualizado correctamente.');
            return true;
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.msg || 'Error al actualizar el perfil.';
            console.error("AuthProvider: Profile update failed:", errorMsg);
            setAuthError(errorMsg);
            toast.error(`Error: ${errorMsg}`);
            return false;
        } finally {
            console.log("AuthProvider: updateUser finished");
            setIsProfileLoading(false);
        }
    };


    // *** NUEVA FUNCIÓN PARA ELIMINAR CUENTA ***
    const deleteUserAccountContext = useCallback(async () => {
        setAuthError(null);
        setIsDeletingLoading(true); // Iniciar carga específica
        console.log("AuthProvider: deleteUserAccount started");
        try {
            // Llama al servicio API - Asegúrate de que usa el token (via apiClient o manualmente)
            // Si no tienes un servicio 'deleteAccountService':
            // await apiClient.delete('/auth/user');
            await deleteAccountService(); // Llama a la función importada del servicio

            console.log("AuthProvider: Account deleted via API successfully.");
            // La API tuvo éxito, ahora limpiar estado y redirigir llamando a logout
            logout(); // Logout se encarga de limpiar todo y redirigir
            // No mostramos toast aquí porque logout ya lo hace
            return true; // Indicar éxito

        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.msg || 'Error al eliminar la cuenta.';
            console.error("AuthProvider: Delete account failed:", errorMsg);
            setAuthError(errorMsg);
            toast.error(`Error: ${errorMsg}`);
            return false; // Indicar fallo
        } finally {
            console.log("AuthProvider: deleteUserAccount finished");
            setIsDeletingLoading(false); // Terminar carga específica
        }
    }, [logout, setAuthError]); // Dependencias: logout y setAuthError


    // --- Valor del Contexto Memoizado ---
    const contextValue = useMemo(() => {
        const combinedLoading = isAuthLoading || isProfileLoading; // No incluir isDeletingLoading aquí
        console.log("AuthProvider Providing Value:", { hasUser: !!user, token: !!token, isInitialLoading, isAuthLoading, isProfileLoading, isDeletingLoading }); // Log mejorado
        return {
            user,
            token,
            isLoading: combinedLoading, // Loading general (acciones principales)
            isInitialLoading,
            isAuthLoading,
            isProfileLoading,
            isDeletingLoading, // <--- AÑADIR estado de carga para eliminar
            authError,
            // Funciones
            login,
            register,
            logout,
            updateUserContext,
            deleteUserAccountContext, // <--- AÑADIR la función aquí
            setAuthError
        };
    // Actualizar dependencias de useMemo
    }, [user, token, isInitialLoading, isAuthLoading, isProfileLoading, isDeletingLoading, authError, logout, deleteUserAccountContext]); 


    // --- Renderizado ---
    return (
        <AuthContext.Provider value={contextValue}>
            {isInitialLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-background z-[100]">
                    <Spinner size="lg" />
                    {/* <p className="ml-3 text-lg text-textSecondary">Verificando sesión...</p> */}
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

// Exportar el contexto
export { AuthContext };