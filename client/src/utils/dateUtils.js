// src/utils/dateUtils.js

/**
 * Convierte un objeto Date a un string en formato YYYY-MM-DD en la zona horaria local.
 * Maneja fechas inválidas devolviendo la fecha de hoy como fallback.
 * @param {Date} date - El objeto Date a convertir.
 * @returns {string} La fecha en formato YYYY-MM-DD.
 */
export const getLocalDateString = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
       console.error("getLocalDateString received invalid date:", date);
       // Fallback a hoy si la fecha es inválida
       const today = new Date();
       const offsetFallback = today.getTimezoneOffset();
       const localDateFallback = new Date(today.getTime() - (offsetFallback * 60 * 1000));
       return localDateFallback.toISOString().split('T')[0];
    }
    const offset = date.getTimezoneOffset();
    // Clona la fecha para no modificar la original
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

/**
 * Obtiene la fecha de hoy como un string YYYY-MM-DD en la zona horaria local.
 * @returns {string} La fecha de hoy en formato YYYY-MM-DD.
 */
export const getTodayLocalDateString = () => {
    return getLocalDateString(new Date());
};

/**
 * Helper interno para parsear un string YYYY-MM-DD a un objeto Date UTC.
 * Lanza un error si el formato es inválido.
 * @param {string} dateString - El string de fecha en formato YYYY-MM-DD.
 * @returns {Date} Un objeto Date representando la medianoche UTC del día dado.
 * @throws {Error} Si el string no tiene el formato YYYY-MM-DD.
 */
const parseDateStringUTC = (dateString) => {
    if (!dateString || typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
       throw new Error(`Invalid date string format. Expected YYYY-MM-DD, received: ${dateString}`);
    }
   // Interpreta YYYY-MM-DD como fecha UTC para consistencia en formateo y cálculos
    return new Date(dateString + 'T00:00:00Z');
}

/**
 * Formatea una fecha (string YYYY-MM-DD) a un formato largo legible en español.
 * @param {string} dateString - La fecha a formatear (YYYY-MM-DD).
 * @returns {string} La fecha formateada (ej: "martes, 22 de abril de 2025").
 */
export const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    try {
        const dateObj = parseDateStringUTC(dateString);
        return dateObj.toLocaleDateString('es-MX', options);
    } catch(error) {
        console.error("Error formatting date:", error.message);
        return "Fecha inválida";
    }
};

/**
* Formatea una fecha (string YYYY-MM-DD) a un formato corto legible en español.
* @param {string} dateString - La fecha a formatear (YYYY-MM-DD).
* @returns {string} La fecha formateada (ej: "22 abr 2025").
*/
export const formatShortDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' };
    try {
        const dateObj = parseDateStringUTC(dateString);
        // Para meses cortos, a veces toLocaleDateString no usa abreviaturas estándar ('may.' vs 'mayo').
        // Podríamos construirlo manualmente si es necesario, pero probemos esto primero.
        return dateObj.toLocaleDateString('es-MX', options).replace('.', ''); // Quita puntos si los añade (ej. 'may.')
    } catch (error) {
        console.error("Error formatting short date:", error.message);
        return dateString; // Devuelve el string original si falla
    }
};

/**
 * Calcula una nueva fecha sumando/restando días a una fecha dada (en formato YYYY-MM-DD).
 * Opera internamente con UTC para evitar problemas de DST.
 * @param {string} currentDateString - La fecha actual en formato YYYY-MM-DD.
 * @param {number} days - El número de días a sumar (positivo) o restar (negativo).
 * @returns {string} La nueva fecha en formato YYYY-MM-DD.
 */
export const getAdjustedDate = (currentDateString, days) => {
   try {
        // Parseamos la fecha string a Date UTC
        const currentDate = parseDateStringUTC(currentDateString);

        // Suma/resta los días en UTC
        currentDate.setUTCDate(currentDate.getUTCDate() + days);

        // Convierte la nueva fecha UTC de vuelta a string YYYY-MM-DD
        return currentDate.toISOString().split('T')[0];
    } catch (error) {
        console.error("Error adjusting date:", error.message);
        return currentDateString; // Devuelve la fecha original en caso de error
    }
};