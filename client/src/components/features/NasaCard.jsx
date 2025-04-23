// src/components/features/NasaCard.jsx (MEJORADO)
import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaHeart,
  FaRegHeart,
  FaDownload,
  FaShareAlt,
  FaExternalLinkAlt,
  FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const NasaCard = ({ apodData }) => {
    // Estados para controlar la UI interactiva
    const [isExpanded, setIsExpanded] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const TRUNCATION_CHAR_LIMIT = 300;

    if (!apodData || !apodData.url) return null;

    const { title, date, explanation, url, hdurl, media_type, copyright } = apodData;
    const isLongText = explanation && explanation.length > TRUNCATION_CHAR_LIMIT;

    //Medir y contralar alturas de texto e imagen
    const textRef = useRef(null);
    const [collapsedHeight, setCollapsedHeight] = useState("5.5rem"); // Altura por defecto
    const [expandedHeight, setExpandedHeight] = useState("auto");

    // Formatear fecha en español
    const formattedDate = date 
        ? new Date(date + 'T00:00:00').toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          }) 
        : 'Fecha desconocida';

    // Comprobar si esta APOD está en favoritos al cargar
    useEffect(() => {
        try {
            const favorites = JSON.parse(localStorage.getItem('apod-favorites') || '[]');
            setIsFavorite(favorites.some(fav => fav.date === date));
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    }, [date]);

    // Medir alturas exactas al cargar
useEffect(() => {
    if (textRef.current && isLongText) {
      // Para la altura contraída (4 líneas)
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight) || 1.5 * 16;
      setCollapsedHeight(`${lineHeight * 4}px`);
      
      // Para la altura expandida, temporalmente eliminamos la limitación
      const originalClassName = textRef.current.className;
      textRef.current.className = originalClassName.replace('line-clamp-4', '');
      setExpandedHeight(`${textRef.current.scrollHeight}px`);
      
      // Restaurar clase original
      textRef.current.className = originalClassName;
    }
  }, [isLongText, explanation]);

    

    // Toggle para expandir/colapsar
    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    

    // Toggle para favoritos
    const toggleFavorite = () => {
        try {
            const favorites = JSON.parse(localStorage.getItem('apod-favorites') || '[]');
            
            if (isFavorite) {
                // Eliminar de favoritos
                const updatedFavorites = favorites.filter(fav => fav.date !== date);
                localStorage.setItem('apod-favorites', JSON.stringify(updatedFavorites));
                setIsFavorite(false);
                toast.success('Eliminado de favoritos');
            } else {
                // Añadir a favoritos
                const newFavorite = {
                    date,
                    title,
                    url,
                    thumbnail: url, // Podríamos usar una versión en miniatura si la API la proporcionara
                };
                localStorage.setItem('apod-favorites', JSON.stringify([...favorites, newFavorite]));
                setIsFavorite(true);
                toast.success('Añadido a favoritos');
            }
        } catch (error) {
            console.error('Error al gestionar favoritos:', error);
            toast.error('Error al gestionar favoritos');
        }
    };

    // Descargar la imagen si está disponible
    const handleDownload = () => {
        if (media_type !== 'image') {
            toast.error('Solo se pueden descargar imágenes');
            return;
        }

        const imageUrl = hdurl || url;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `NASA-APOD-${date}-${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Descargando imagen...');
    };

    // Compartir la APOD
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `NASA APOD: ${title}`,
                    text: `Mira la foto astronómica del día de la NASA: ${title}`,
                    url: window.location.href,
                });
            } else {
                // Fallback para navegadores que no soportan Web Share API
                navigator.clipboard.writeText(window.location.href);
                toast.success('URL copiada al portapapeles');
            }
        } catch (error) {
            console.error('Error al compartir:', error);
            toast.error('Error al compartir');
        }
    };

    // Variants para animaciones
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
    };

    const imageVariants = {
        normal: { scale: 1 },
        zoomed: { scale: 1.5, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            key={apodData.url || apodData.date}
            className="w-full max-w-4xl mx-auto"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
        >
            <Card className="overflow-hidden rounded-xl shadow-lg" animate={false}>
                {/* Barra superior con título y acciones */}
                <div className="bg-gradient-to-r from-primary/90 to-primary-dark/90 p-4 flex justify-between items-center">
                    <h3 className="text-xl md:text-2xl font-bold truncate">{title || 'Sin Título'}</h3>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setShowInfo(!showInfo)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Mostrar información"
                        >
                            <FaInfoCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                {/* Panel de información desplegable */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-50 border-b border-gray-200 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-center text-sm text-textSecondary mb-2">
                                    <FaCalendarAlt className="mr-2" />
                                    <span>{formattedDate}</span>
                                </div>
                                {copyright && (
                                    <p className="text-sm text-textSecondary">
                                        © {copyright}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    {media_type === 'image' ? 'Imagen astronómica del día' : 'Video astronómico del día'}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Contenedor de Media con Loading State */}
                <div className="relative bg-black">
                    {/* Estado de carga para imágenes */}
                    {media_type === 'image' && !isImageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                            <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                        </div>
                    )}
                    
                    <div className={`aspect-w-16 aspect-h-9 w-full overflow-hidden 
                                    max-h-[70vh] md:max-h-[50vh] lg:max-h-[60vh]`}>
                        {media_type === 'video' ? (
                            <iframe
                                src={url}
                                title={title || 'NASA APOD Video'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                            <motion.div 
                                className="w-full h-full cursor-zoom-in"
                                onClick={() => setIsZoomed(!isZoomed)}
                                variants={imageVariants}
                                animate={isZoomed ? "zoomed" : "normal"}
                            >
                                <img
                                    src={url}
                                    alt={title || 'Imagen Astronómica del Día de la NASA'}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                    onLoad={() => setIsImageLoaded(true)}
                                />
                            </motion.div>
                        )}
                    </div>
                    
                    {/* Barra de acciones sobre la imagen */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 md:p-4 flex justify-between items-center text-white opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <div className="flex space-x-3">
                            <button
                                onClick={toggleFavorite}
                                className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                                aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                                {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                <span className="text-sm hidden md:inline">
                                    {isFavorite ? "Guardado" : "Guardar"}
                                </span>
                            </button>
                            
                            {media_type === 'image' && (
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center space-x-1 hover:text-blue-300 transition-colors"
                                    aria-label="Descargar imagen"
                                >
                                    <FaDownload />
                                    <span className="text-sm hidden md:inline">Descargar</span>
                                </button>
                            )}
                            
                            <button
                                onClick={handleShare}
                                className="flex items-center space-x-1 hover:text-green-300 transition-colors"
                                aria-label="Compartir"
                            >
                                <FaShareAlt />
                                <span className="text-sm hidden md:inline">Compartir</span>
                            </button>
                        </div>
                        
                        {media_type === 'image' && hdurl && (
                            <a 
                                href={hdurl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 hover:text-blue-300 transition-colors"
                                aria-label="Ver en alta resolución"
                            >
                                <span className="text-sm hidden md:inline">HD</span>
                                <FaExternalLinkAlt />
                            </a>
                        )}
                    </div>
                </div>

                {/* Contenido y descripción */}
                <div className="p-4 md:p-6">
                    {/* Texto con efecto de expansión */}
                    <motion.div
    className="overflow-hidden"
    animate={{ 
      height: isExpanded ? expandedHeight : collapsedHeight 
    }}
    transition={{ duration: 0.4, ease: 'easeInOut' }}
>
    <p 
      ref={textRef}
      className={`text-base text-textPrimary leading-relaxed ${!isExpanded && isLongText ? 'line-clamp-4' : ''}`}
    >
        {explanation || 'Descripción no disponible.'}
    </p>
</motion.div>

                    {/* Botón "Ver más / Ver menos" */}
                    {isLongText && (
                        <button
                            onClick={toggleExpansion}
                            className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                            aria-expanded={isExpanded}
                        >
                            {isExpanded ? 'Ver menos' : 'Ver más'}
                            {isExpanded ? 
                                <FaChevronUp className="ml-1 h-3 w-3" /> : 
                                <FaChevronDown className="ml-1 h-3 w-3" />
                            }
                        </button>
                    )}
                </div>
                
                {/* Footer con datos adicionales o acciones secundarias */}
                <div className="px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                        {media_type === 'image' ? 'Imagen' : 'Video'} • {date}
                    </div>
                    
                    <div className="flex space-x-4">
                        <a 
                            href={`https://apod.nasa.gov/apod/ap${date?.replace(/-/g, '').substring(2)}.html`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:text-primary-dark transition-colors"
                        >
                            Ver en NASA.gov
                        </a>
                    </div>
                </div>
            </Card>
            
            {/* Overlay para modo zoom */}
            {isZoomed && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-zoom-out"
                    onClick={() => setIsZoomed(false)}
                >
                    <img 
                        src={hdurl || url} 
                        alt={title} 
                        className="max-w-full max-h-full object-contain"
                    />
                    <button 
                        className="absolute top-4 right-4 text-white text-xl font-bold p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        onClick={() => setIsZoomed(false)}
                    >
                        ✕
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default NasaCard;