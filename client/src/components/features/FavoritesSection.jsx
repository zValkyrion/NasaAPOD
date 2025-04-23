// src/components/features/FavoritesSection.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatShortDate } from '../../utils/dateUtils';

const FavoritesSection = ({ favorites, onSelectFavorite, favoriteItemVariants }) => {
    console.log("Renderizando FavoritesSection con", favorites?.length || 0, "favoritos");

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/400x225?text=Imagen+no+disponible';
    };

    // Si no hay favoritos, seguimos renderizando pero con mensaje
    if (!favorites || favorites.length === 0) {
        return (
            <motion.div
                key="empty-favorites-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="mt-12 max-w-6xl mx-auto px-4"
            >
                <h2 className="text-2xl font-bold text-primary-dark mb-5 text-center sm:text-left">
                    Tus Favoritos Guardados
                </h2>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-600">
                        Aún no tienes imágenes favoritas guardadas. 
                        Guarda tus descubrimientos astronómicos favoritos haciendo clic en el corazón. (Los veras una vez que actualices la pagina)
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            key="favorites-section-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="mt-12 max-w-6xl mx-auto px-4"
        >
            <h2 className="text-2xl font-bold text-primary-dark mb-5 text-center sm:text-left">
                Tus Favoritos Guardados ({favorites.length})
            </h2>
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence initial={false}>
                    {favorites.map(fav => (
                        <motion.div
                            key={`fav-${fav.date}`}
                            layout="position"
                            variants={favoriteItemVariants}
                            initial="hidden" 
                            animate="visible"
                            exit="exit"
                            whileHover={{ y: -6, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer flex flex-col group"
                            onClick={() => onSelectFavorite(fav.date)}
                            title={`Ver imagen del ${formatShortDate(fav.date)}`}
                        >
                            <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                <img
                                    src={fav.thumbnail}
                                    alt={fav.title || `Favorito del ${formatShortDate(fav.date)}`}
                                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                    onError={handleImageError}
                                />
                                {fav.media_type === 'video' && (
                                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded shadow">
                                        Video
                                    </div>
                                )}
                            </div>
                            <div className="p-3 flex-grow">
                                <p className="text-xs text-gray-500 mb-1">
                                    {formatShortDate(fav.date)}
                                </p>
                                <h3
                                    className="font-semibold text-sm leading-snug text-gray-800 line-clamp-2"
                                    title={fav.title}
                                >
                                    {fav.title || "Sin título"}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default FavoritesSection;