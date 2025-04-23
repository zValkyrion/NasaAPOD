// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getApod } from '../services/nasaService';
import NasaCard from '../components/features/NasaCard';
import NasaCardSkeleton from '../components/features/NasaCardSkeleton';
import Alert from '../components/ui/Alert';
import DateControlPanel from '../components/features/DateControlPanel';
import FavoritesSection from '../components/features/FavoritesSection';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Importar utilidades de fecha centralizadas
import {
    getLocalDateString,
    getTodayLocalDateString,
    formatDate,
    getAdjustedDate
} from '../utils/dateUtils';

const HomePage = () => {
    // Estados
    const [apodData, setApodData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getTodayLocalDateString());
    const [recentDates, setRecentDates] = useState([]);
    const [viewHistory, setViewHistory] = useState(false);
    // Estado para forzar re-renderizado de la sección de favoritos
    const [favoritesKey, setFavoritesKey] = useState(0);
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('apod-favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Error reading favorites from localStorage", error);
            toast.error("No se pudieron cargar los favoritos guardados.");
            return [];
        }
    });

    // Efectos
    const fetchApodData = useCallback(async (dateString) => {
        console.log(`HomePage: Fetching APOD for date string: ${dateString}`);
        setIsLoading(true);
        setError(null);

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            // Manejo de formato inválido
            setError("Formato de fecha inválido");
            setIsLoading(false);
            return;
        }

        try {
            const response = await getApod(dateString);
            console.log("HomePage: APOD data received:", response.data);

            if (response.data && response.data.url && response.data.date) {
                setApodData(response.data);
                const apiDateString = response.data.date;
                setRecentDates(prev => {
                    if (!prev.includes(apiDateString)) {
                        const newDates = [apiDateString, ...prev.filter(d => d !== apiDateString)].slice(0, 7);
                        return newDates;
                    }
                    return prev;
                });
            } else if (response.data?.code === 404 || (response.data?.msg && response.data.msg.includes("No data available for date"))) {
                const infoMsg = `No se encontró imagen para ${formatDate(dateString)}. Puede que no esté disponible aún.`;
                setError(infoMsg);
                setApodData(null);
            } else {
                const infoMsg = `Respuesta inesperada para ${formatDate(dateString)}.`;
                setError(infoMsg);
                setApodData(null);
            }
        } catch (err) {
            console.error("HomePage: Error fetching APOD:", err);
            let errorMsg = `Error al obtener datos para ${formatDate(dateString)}. Inténtalo de nuevo.`;
            setError(errorMsg);
            setApodData(null);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
            fetchApodData(selectedDate);
        } else {
            setError("Formato de fecha inválido");
        }
    }, [selectedDate, fetchApodData]);

    useEffect(() => {
        try {
            localStorage.setItem('apod-favorites', JSON.stringify(favorites));
            console.log("Favoritos guardados en localStorage:", favorites.length);
        } catch (error) {
            console.error("Error guardando favoritos en localStorage:", error);
            toast.error("Error al guardar favoritos");
        }
    }, [favorites]);

    // Handlers
    const handleDateChange = useCallback((newDateObject) => {
        const dateString = getLocalDateString(newDateObject);
        if (dateString !== selectedDate) {
            setSelectedDate(dateString);
        }
    }, [selectedDate]);

    const navigateDay = useCallback((direction) => {
        const today = getTodayLocalDateString();
        if (direction > 0 && selectedDate >= today) {
            toast.error("No puedes seleccionar fechas futuras.");
            return;
        }
        const newDateString = getAdjustedDate(selectedDate, direction);
        if (newDateString > today) {
            if (selectedDate !== today) {
                toast.error("No puedes seleccionar fechas futuras.");
                setSelectedDate(today);
            }
            return;
        }
        setSelectedDate(newDateString);
    }, [selectedDate]);

    const goToToday = useCallback(() => {
        const today = getTodayLocalDateString();
        if (selectedDate !== today) {
            setSelectedDate(today);
            toast.success("Mostrando la imagen de hoy.");
        }
    }, [selectedDate]);

    const handleSelectHistory = useCallback((dateString) => {
        if (dateString !== selectedDate) {
            setSelectedDate(dateString);
        }
    }, [selectedDate]);

    // Función mejorada para toggle favoritos
    const toggleFavorite = useCallback(() => {
        if (!apodData) return;

        // Crear un nuevo array de favoritos en lugar de mutar el existente
        let newFavorites;
        const isCurrentlyFavorite = favorites.some(fav => fav.date === apodData.date);

        if (isCurrentlyFavorite) {
            // Eliminar de favoritos
            newFavorites = favorites.filter(fav => fav.date !== apodData.date);
            toast.success("Eliminado de favoritos");
        } else {
            // Añadir a favoritos
            const newFavorite = {
                date: apodData.date,
                title: apodData.title,
                thumbnail: apodData.url,
                media_type: apodData.media_type
            };
            // Crear nuevo array en vez de modificar el existente
            newFavorites = [newFavorite, ...favorites];
            toast.success("¡Guardado en favoritos!");
        }

        // Actualizar el estado con el nuevo array
        setFavorites(newFavorites);
        
        // Incrementar el key para forzar rerenderizado
        setFavoritesKey(prev => prev + 1);
        
        // Guardar inmediatamente en localStorage para evitar inconsistencias
        try {
            localStorage.setItem('apod-favorites', JSON.stringify(newFavorites));
        } catch (err) {
            console.error("Error al guardar favoritos:", err);
        }
    }, [apodData, favorites]);

    const isFavorite = apodData ? favorites.some(fav => fav.date === apodData.date) : false;

    // Variantes de Animación
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.6, 
                ease: "easeOut"
            } 
        },
        exit: { 
            opacity: 0, 
            y: 50, 
            transition: { 
                duration: 0.6, 
                ease: "easeIn" 
            } 
        }
    };
    
    const favoriteItemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.9, 
            y: -20,
            transition: { 
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    // Renderizado
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-primary-dark to-primary py-4 mb-8">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-black text-center">
                        Explorador Astronómico NASA
                    </h1>
                    <p className="text-center text-black text-opacity-90 mt-2">
                        Descubre la imagen o vídeo astronómico del día de la NASA
                    </p>
                </div>
            </div>

            <DateControlPanel
                selectedDate={selectedDate}
                todayString={getTodayLocalDateString()}
                recentDates={recentDates}
                viewHistory={viewHistory}
                formatDate={formatDate}
                onNavigateDay={navigateDay}
                onDateChange={handleDateChange}
                onGoToToday={goToToday}
                onToggleHistory={() => setViewHistory(!viewHistory)}
                onSelectHistoryDate={handleSelectHistory}
            />

            {/* Sección Principal APOD */}
            <div className="flex justify-center min-h-[500px] sm:min-h-[600px] relative px-4">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <NasaCardSkeleton key={`skeleton-${selectedDate}`} />
                    ) : error ? (
                        <motion.div
                            key={`error-${selectedDate}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-4xl"
                        >
                            <Alert
                                type="error"
                                title="Error"
                                message={error}
                                onRetry={() => fetchApodData(selectedDate)}
                            />
                        </motion.div>
                    ) : apodData ? (
                        <NasaCard
                            key={`nasa-card-${apodData.date}-${apodData.url}`}
                            apodData={apodData}
                            isFavorite={isFavorite}
                            onToggleFavorite={toggleFavorite}
                            formattedDate={formatDate(apodData.date)}
                        />
                    ) : (
                        <motion.div
                            key="no-data"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-4xl"
                        >
                            <Alert type="info" title="Sin Datos" message="No hay datos disponibles para mostrar para esta fecha." />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sección de Favoritos - Siempre presente pero condicionalmente visible */}
            <div key={`favorites-section-wrapper-${favoritesKey}`}>
                <FavoritesSection
                    favorites={favorites}
                    onSelectFavorite={handleSelectHistory}
                    favoriteItemVariants={favoriteItemVariants}
                />
            </div>
        </motion.div>
    );
};

export default HomePage;