// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FaMapSigns, FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    // Usamos flex para centrar verticalmente dentro del <main> del MainLayout
    <div className="flex flex-col items-center justify-center text-center flex-grow py-12">
       <motion.div
         initial={{ scale: 0.5, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
       >
         <FaMapSigns className="text-6xl md:text-8xl text-secondary mb-6 mx-auto" />
       </motion.div>

       <motion.h1
         className="text-4xl md:text-6xl font-bold text-textPrimary mb-4"
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.3 }}
       >
         404
       </motion.h1>

       <motion.p
         className="text-lg md:text-xl text-textSecondary mb-8 max-w-md mx-auto"
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.5 }}
       >
         ¡Ups! Parece que te has perdido. La página que buscas no existe o fue movida.
       </motion.p>

       <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.7 }}
       >
         <Link to="/">
           <Button variant="primary" size="lg">
              <FaHome className="mr-2" /> Volver al Inicio
           </Button>
         </Link>
       </motion.div>
    </div>
  );
};

// Nota: Asegúrate de que esta ruta esté definida en src/routes/index.jsx como catch-all (*)
// y que el MainLayout permita que el contenido crezca con flex-grow (ya lo hace).

export default NotFoundPage;