// controllers/nasaController.js
const axios = require('axios'); // Para hacer peticiones HTTP
const dotenv = require('dotenv'); // Para acceder a process.env

dotenv.config(); // Cargar variables de entorno

// @desc    Obtener datos de NASA APOD (Astronomy Picture of the Day)
// @route   GET /api/nasa/apod?date=YYYY-MM-DD
// @access  Public
exports.getNasaApod = async (req, res, next) => {
  try {
    const apiKey = process.env.NASA_API_KEY;

    // 1. Verificar si tenemos la API Key de NASA
    if (!apiKey || apiKey === 'DEMO_KEY') {
        // Advertencia si se usa DEMO_KEY (tiene límites más estrictos)
        if (apiKey === 'DEMO_KEY'){
            console.warn('Usando DEMO_KEY para la API de NASA. Considera obtener una clave gratuita para evitar límites.');
        } else {
            console.error('Error: Falta la variable de entorno NASA_API_KEY.');
            // No exponer detalles internos, error genérico del servidor
            return res.status(500).json({ msg: 'Error de configuración del servidor [NASA]' });
        }
    }

    // 2. Construir la URL base de la API de NASA
    let nasaApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    // 3. Añadir la fecha si se proporciona en los query params
    const requestedDate = req.query.date; // Ej: '2024-10-26'

    // Validación simple de formato (YYYY-MM-DD) - Opcional pero recomendado
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (requestedDate && dateRegex.test(requestedDate)) {
      nasaApiUrl += `&date=${requestedDate}`;
      console.log(`Solicitando APOD para la fecha: ${requestedDate}`);
    } else if (requestedDate) {
        // Si se proporcionó una fecha pero no es válida, informar 
         console.warn(`Fecha proporcionada inválida (${requestedDate}), solicitando APOD de hoy.`);
        // No añadimos el parámetro date, NASA devolverá la de hoy por defecto.
        // Alternativamente, podríamos devolver un error 400 aquí:
        // return res.status(400).json({ msg: 'Formato de fecha inválido. Usa YYYY-MM-DD.' });
    } else {
         console.log('Solicitando APOD para la fecha de hoy.');
        // No se proporcionó fecha, NASA usará la de hoy
    }


    // 4. Hacer la petición a la API de NASA usando axios
     console.log(`Llamando a NASA API: ${nasaApiUrl.replace(apiKey, '********')}`); // No loguear la API key
    const response = await axios.get(nasaApiUrl);

    // 5. Enviar la respuesta de NASA a nuestro cliente frontend
    //    response.data contiene el JSON devuelto por NASA
     console.log(`Respuesta exitosa de NASA API para fecha: ${response.data.date}`);
    res.status(200).json(response.data);

  } catch (error) {
    // 6. Manejar errores de la petición a NASA
    console.error("Error al contactar la API de NASA:", error.message);

    // Analizar el error de Axios para dar una respuesta más específica si es posible
    if (error.response) {
      // La petición se hizo y el servidor de NASA respondió con un status code != 2xx
      console.error('Respuesta de error de NASA - Status:', error.response.status);
      console.error('Respuesta de error de NASA - Data:', error.response.data);
      // Reenviar el status code y mensaje de error de NASA puede ser útil,
      // pero cuidado de no exponer demasiada información interna.
      // Por ejemplo, si NASA devuelve 404 por una fecha sin imagen:
      if (error.response.status === 404) {
           return res.status(404).json({ msg: `No se encontró imagen para la fecha solicitada. Detalles: ${error.response.data.msg || 'No encontrado'}` });
      }
      // Para otros errores de NASA (400, 429, 500...)
       return res.status(error.response.status || 500).json({
            msg: `Error de la API de NASA: ${error.response.data?.msg || error.message}`,
            nasa_status: error.response.status
        });

    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta (ej. problema de red)
      console.error('Error de red o sin respuesta de NASA API:', error.request);
       return res.status(502).json({ msg: 'No se pudo comunicar con el servicio de NASA (Bad Gateway)' }); // 502 Bad Gateway es apropiado
    } else {
      // Algo más salió mal al configurar la petición
      console.error('Error configurando la petición a NASA:', error.message);
       return res.status(500).json({ msg: 'Error interno del servidor al procesar la solicitud a NASA' });
    }

    next(error);
  }
};