import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { FaUserEdit, FaUserCircle, FaCalendarAlt, FaEnvelope, FaChartLine, FaStar, FaHistory, FaBookmark } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mb-3"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('es-MX', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto"
    >
      {/* Encabezado */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-1 mb-4 bg-blue-50 rounded-lg">
          <MdDashboard className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Gestiona tu información y explora recursos personalizados</p>
      </div>

      {/* Tarjeta de Bienvenida */}
      <Card className="p-6 md:p-8 mb-8 shadow-md rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50" animate={false}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                <FaUserCircle className="h-10 w-10" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              ¡Bienvenido de vuelta, {user.name || user.email.split('@')[0]}!
            </h2>
            <p className="mt-1 text-gray-600">
              Nos alegra verte de nuevo. Aquí tienes un resumen de tu cuenta.
            </p>
          </div>
        </div>
      </Card>

      {/* Grid de información y acciones */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Información de la cuenta */}
        <Card className="p-6 rounded-xl shadow-md bg-white" animate={false}>
          <div className="flex items-center mb-4">
            <div className="mr-3 p-2 rounded-md bg-blue-50">
              <FaUserCircle className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
          </div>
          
          <div className="space-y-3">

            
            <div className="flex items-center border-b border-gray-100 pb-3">
              <FaEnvelope className="h-4 w-4 text-gray-500 mr-3" />
              <span className="text-sm font-medium text-gray-500 w-24">Email:</span>
              <span className="text-sm text-gray-900">{user.email}</span>
            </div>
            
            <div className="flex items-center">
              <FaCalendarAlt className="h-4 w-4 text-gray-500 mr-3" />
              <span className="text-sm font-medium text-gray-500 w-24">Miembro desde:</span>
              <span className="text-sm text-gray-900">{joinDate}</span>
            </div>
          </div>
          
          <div className="mt-5">
            <Link to="/profile/edit">
              <Button 
                variant="primary" 
                size="sm"
                className="w-full flex items-center justify-center py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors duration-150"
              >
                <FaUserEdit className="mr-2" /> Editar Perfil
              </Button>
            </Link>
          </div>
        </Card>
        
        {/* Estadísticas o Actividad */}
        <Card className="p-6 rounded-xl shadow-md bg-white" animate={false}>
          <div className="flex items-center mb-4">
            <div className="mr-3 p-2 rounded-md bg-blue-50">
              <FaChartLine className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente (Solo visual)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1 rounded-md bg-green-50 mr-3">
                <FaStar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Has visto 12 imágenes APOD este mes</p>
                <p className="text-xs text-gray-500 mt-1">Última: hace 2 días</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1 rounded-md bg-purple-50 mr-3">
                <FaHistory className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Última búsqueda: "nebulosa"</p>
                <p className="text-xs text-gray-500 mt-1">Hace 5 días</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1 rounded-md bg-yellow-50 mr-3">
                <FaBookmark className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">3 imágenes guardadas en favoritos</p>
                <p className="text-xs text-gray-500 mt-1">Ver todas</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Sección explorar */}
      <Card className="p-6 rounded-xl shadow-md bg-gradient-to-r from-indigo-50 to-blue-50" animate={false}>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Explorar NASA API</h3>
        <p className="text-gray-600 mb-4">Descubre más recursos disponibles para explorar el cosmos.</p>
        
        <div className="grid grid-cols-2 gap-3">
          <Link to="/">
            <Button 
              variant="secondary" 
              className="w-full py-3 flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors duration-150"
            >
              Foto del día
            </Button>
          </Link>
          <Link to="/">
            <Button 
              variant="secondary" 
              className="w-full py-3 flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors duration-150"
            >
              Rovers de Marte (Solo visual)
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default DashboardPage;