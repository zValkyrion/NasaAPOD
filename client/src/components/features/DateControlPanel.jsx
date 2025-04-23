import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDaysIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

const DateControlPanel = ({
    selectedDate,
    todayString,
    recentDates,
    viewHistory,
    formatDate,
    onNavigateDay,
    onDateChange, // Asegúrate de que esta función ahora espera un objeto Date
    onGoToToday,
    onToggleHistory,
    onSelectHistoryDate,
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dateInputRef = useRef(null);

    const handleDateInputChange = (e) => {
        const dateString = e.target.value; // p.ej., "2024-05-05"

        // --- INICIO DE LA CORRECCIÓN ---
        if (dateString) {
            // Dividimos el string para obtener año, mes y día como números
            const parts = dateString.split('-').map(Number);
            const year = parts[0];
            const month = parts[1]; // El mes del input es 1-12
            const day = parts[2];

            // Creamos la fecha usando los componentes en la zona horaria local.
            // ¡Importante! El constructor Date usa mes 0-11, por eso restamos 1.
            const localDate = new Date(year, month - 1, day);

            // Llamamos a la función del padre con el objeto Date corregido
            onDateChange(localDate);
        }
        // --- FIN DE LA CORRECCIÓN ---
    };

    const openNativeDatePicker = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker(); // Abre el selector nativo
        }
    };

    // Helper para obtener YYYY-MM-DD en local, necesario para el input value
    const getLocalDateString = (date) => {
        // Creamos una fecha temporal para evitar modificar la original
        const tempDate = new Date(date);
        // Obtenemos el offset en minutos y lo convertimos a milisegundos
        const timezoneOffset = tempDate.getTimezoneOffset() * 60000;
        // Creamos una nueva fecha ajustada al UTC local restando el offset
        // Esto es para que toISOString() devuelva la fecha correcta en formato YYYY-MM-DD local
        const localISODate = new Date(tempDate.getTime() - timezoneOffset);
        return localISODate.toISOString().split('T')[0];
    }


    return (
        <motion.div
            className="bg-white rounded-xl shadow-md p-4 max-w-4xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Navegación y fecha actual */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={() => onNavigateDay(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Ver día anterior"
                    >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={openNativeDatePicker}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                            {/* Asegúrate que formatDate funcione bien con el objeto Date */}
                            <span className="font-medium">{formatDate(selectedDate)}</span>
                        </button>

                        {/* Input oculto que abre el datepicker nativo */}
                        <input
                            type="date"
                            ref={dateInputRef}
                            // Usamos la función helper para asegurar el formato YYYY-MM-DD local
                            value={getLocalDateString(selectedDate)}
                            onChange={handleDateInputChange}
                            max={todayString} // Asegúrate que todayString también esté en YYYY-MM-DD
                            className="absolute opacity-0 pointer-events-none w-0 h-0"
                            style={{ top: '-10px', left: '-10px' }} // Moverlo fuera de la vista
                        />
                    </div>

                    <button
                        onClick={() => onNavigateDay(1)}
                        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                           // La comparación puede necesitar ajuste si todayString es YYYY-MM-DD y selectedDate es Date
                           getLocalDateString(selectedDate) === todayString ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
                        }`}
                        disabled={getLocalDateString(selectedDate) === todayString}
                        aria-label="Ver día siguiente"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-2">
                    <button
                        onClick={onGoToToday}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                        <ArrowPathIcon className="h-4 w-4" />
                        <span>Hoy</span>
                    </button>

                    <button
                        onClick={onToggleHistory}
                        className="px-3 py-1.5 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                        {viewHistory ? 'Ocultar historial' : 'Ver historial'}
                    </button>
                </div>
            </div>

            {/* Historial de fechas recientes */}
            <AnimatePresence>
                {viewHistory && recentDates.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 overflow-hidden"
                    >
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Historial reciente:</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentDates.map(dateStr => { // Asumiendo que recentDates son strings YYYY-MM-DD
                                // Convertimos el string a Date para comparación y display
                                const dateParts = dateStr.split('-').map(Number);
                                const historyDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
                                const selectedDateStr = getLocalDateString(selectedDate); // Para comparación

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => onSelectHistoryDate(dateStr)} // Pasar el string como antes
                                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                            dateStr === selectedDateStr
                                                ? 'bg-primary text-black bg-blue-200'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        {historyDate.toLocaleDateString('es-MX', { // Usamos el objeto Date local para mostrar
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DateControlPanel;