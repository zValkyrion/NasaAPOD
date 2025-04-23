import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaTimes,
  FaHome,
  FaTachometerAlt,
} from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const isAuthenticated = !!token;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- EFECTOS ---
  // Detectar scroll para cambiar la apariencia de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset'; // Limpieza al desmontar
    };
  }, [isMobileMenuOpen]);

  // --- CLASES CSS DINÁMICAS ---
  // Clases para NavLink de escritorio
  const navLinkClasses = ({ isActive }) =>
    `flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white/10 text-white'
        : 'text-white/80 hover:bg-white/5 hover:text-white'
    }`;

  // Clases para NavLink de menú móvil
  const mobileNavLinkClasses = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-slate-700 text-white'
        : 'text-slate-200 hover:bg-slate-700/70 hover:text-white'
    }`;

  // --- MANEJADORES DE EVENTOS ---
  // Cerrar sesión
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Abrir/cerrar menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Cerrar menú móvil
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <>
      {/* Hacemos esto como un header en vez de nav para mejor semántica */}
      <header className="h-14"> {/* Espacio para el navbar fijo */}
        <motion.nav
          // Barra de navegación principal con z-index alto
          className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-200 ${
            scrolled
              ? 'bg-slate-700/95 backdrop-blur-md shadow-lg'
              : 'bg-slate-700'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Contenedor principal de la barra */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Logo/Brand */}
              <div className="flex-shrink-0">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-lg font-bold"
                  onClick={closeMobileMenu}
                >
                  <svg
                    className="h-6 w-6 text-blue-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="text-blue-200">NASA APOD</span>
                </Link>
              </div>
              {/* Links Desktop (ocultos en móvil) */}
              <div className="hidden md:flex items-center space-x-1">
                <NavLink to="/" className={navLinkClasses} end>
                  <FaHome className="text-lg" />
                  <span>Inicio</span>
                </NavLink>
                {/* Links si está autenticado */}
                {isAuthenticated && (
                  <>
                    <NavLink to="/dashboard" className={navLinkClasses}>
                      <FaTachometerAlt className="text-lg" />
                      <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/profile/edit" className={navLinkClasses}>
                      <FaUserCircle className="text-lg" />
                      <span>Perfil</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-all duration-200"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Salir</span>
                    </button>
                    <div className="flex items-center ml-2 px-3 py-1 rounded-md bg-indigo-600/20 text-sm text-blue-100">
                      <span className="mr-1">•</span>
                      <span>{user?.name || "Usuario"}</span>
                    </div>
                  </>
                )}
                {/* Links si NO está autenticado */}
                {!isAuthenticated && (
                  <>
                    <NavLink to="/login" className={navLinkClasses}>
                      <FaUserCircle className="text-lg" />
                      <span>Iniciar sesión</span>
                    </NavLink>
                    <NavLink to="/register" className={navLinkClasses}>
                      <FaUserCircle className="text-lg" />
                      <span>Registrar</span>
                    </NavLink>
                  </>
                )}
              </div>
              {/* Botón Menú Móvil (visible solo en móvil) */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="Abrir menú principal"
                >
                  <IoMenu className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.nav>
      </header>
      
      {/* --- Panel Menú Móvil --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay (fondo semitransparente) */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            {/* Panel lateral que desliza */}
            <motion.div
              className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-slate-800 z-50 md:hidden overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Header del menú móvil */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-lg font-bold"
                  onClick={closeMobileMenu}
                >
                  <svg
                    className="h-6 w-6 text-blue-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="text-blue-200">NASA APOD</span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md text-white/80 hover:text-white hover:bg-slate-700"
                  aria-label="Cerrar menú"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              {/* Contenido/Links del menú móvil */}
              <div className="p-2 space-y-1">
                {isAuthenticated && (
                  <div className="flex items-center px-3 py-2 mb-2 rounded-md bg-indigo-900/30 text-sm text-blue-100">
                    <span className="mr-2 text-blue-300">•</span>
                    <span>{user?.name || "Usuario"}</span>
                  </div>
                )}
                <NavLink to="/" className={mobileNavLinkClasses} end onClick={closeMobileMenu}>
                  <FaHome className="text-xl text-blue-300" />
                  <span>Inicio</span>
                </NavLink>
                {isAuthenticated ? (
                  <>
                    <NavLink to="/dashboard" className={mobileNavLinkClasses} onClick={closeMobileMenu}>
                      <FaTachometerAlt className="text-xl text-blue-300" />
                      <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/profile/edit" className={mobileNavLinkClasses} onClick={closeMobileMenu}>
                      <FaUserCircle className="text-xl text-blue-300" />
                      <span>Perfil</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-all duration-200 text-left"
                    >
                      <FaSignOutAlt className="text-xl" />
                      <span>Salir</span>
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className={mobileNavLinkClasses} onClick={closeMobileMenu}>
                      <FaUserCircle className="text-xl text-blue-300" />
                      <span>Iniciar sesión</span>
                    </NavLink>
                    <NavLink to="/register" className={mobileNavLinkClasses} onClick={closeMobileMenu}>
                      <FaUserCircle className="text-xl text-blue-300" />
                      <span>Registrar</span>
                    </NavLink>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;