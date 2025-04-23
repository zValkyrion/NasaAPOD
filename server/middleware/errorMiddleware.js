// middleware/errorMiddleware.js
const dotenv = require('dotenv');

dotenv.config();

const errorHandler = (err, req, res, next) => {
  // Determinar el statusCode
  // Si el error tiene un statusCode definido (ej. de un error personalizado), usarlo.
  // Si la respuesta ya tiene un statusCode < 400 (improbable aquí, pero defensivo), usar 500.
  // De lo contrario, usar 500 por defecto.
  const statusCode = err.statusCode || (res.statusCode < 400 ? 500 : res.statusCode) || 500;

  // Loguear el error completo en el servidor (siempre)
  console.error('--- ERROR NO MANEJADO ---');
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  // Loguear el stack completo para tener todos los detalles
  console.error(err.stack);
  console.error('--- FIN ERROR ---');


  // Preparar la respuesta para el cliente
  const responseBody = {
    msg: err.message || 'Error interno del servidor', // Mensaje del error o genérico
    // Incluir el stack trace SOLO en desarrollo
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack, // '🥞' como placeholder en prod
    // Podrías añadir un código de error interno si lo usas: errorCode: err.code
  };

  // Enviar la respuesta JSON
  res.status(statusCode).json(responseBody);

  // No necesitamos llamar a next() aquí, ya que estamos finalizando la respuesta.
};

module.exports = { errorHandler };