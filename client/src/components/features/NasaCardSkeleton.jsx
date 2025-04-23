// src/components/features/NasaCardSkeleton.jsx (CORREGIDO)
import React from 'react';
import Card from '../ui/Card';
import { motion } from 'framer-motion'; // Importar motion para animaciones

const NasaCardSkeleton = () => {
  return (
    // Usamos motion.div para la animación de salida controlada por AnimatePresence
    // No necesitamos la animación de entrada aquí, ya que el Card la tendrá.
    // El key es importante para AnimatePresence
    <motion.div key="skeleton" exit={{ opacity: 0, transition: { duration: 0.3 } }} className="w-full max-w-4xl mx-auto">
        <Card className="animate-pulse" animate={false}> {/* Base card sin animación de entrada */}
            {/* Placeholder para imagen/video CON ASPECT RATIO */}
            <div className="aspect-w-16 aspect-h-9 w-full bg-gray-300 dark:bg-gray-700"></div> {/* Contenedor con ratio */}
            <div className="p-4 md:p-6">
                {/* Placeholder para título */}
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                {/* Placeholder para fecha */}
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                {/* Placeholder para explicación */}
                <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
            </div>
        </Card>
    </motion.div>
  );
};

export default NasaCardSkeleton;