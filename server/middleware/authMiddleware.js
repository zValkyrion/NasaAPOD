// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User'); // Opcional: para verificar si el usuario aún existe

dotenv.config(); // Asegurar acceso a process.env

const protect = async (req, res, next) => {
  let token;

  // 1. Buscar el token en el header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extraer el token (quitando 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token usando el secreto
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Adjuntar el usuario al request (payload decodificado)
      //    El payload tiene la forma { user: { id: '...' } } según lo definimos
      //    Guardamos el id en req.userId para fácil acceso
      req.userId = decoded.user.id;

      // --- Mejora Opcional ---
      // Verificar si el usuario asociado a ese token todavía existe en la DB.
      // Esto previene que tokens válidos de usuarios eliminados sigan funcionando.
      const userExists = await User.findById(req.userId).select('_id'); // Solo necesitamos saber si existe
      if (!userExists) {
          console.warn(`Token válido para usuario no existente: ${req.userId}`);
          return res.status(401).json({ msg: 'Usuario no encontrado, autorización denegada' });
      }
      
      next();

    } catch (error) {
      // Capturar errores de verificación (token inválido, expirado, etc.)
      console.error('Error de autenticación:', error.name, error.message); // Loguear el error específico
      if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ msg: 'Token expirado, autorización denegada' });
      }
       // Para otros errores de JWT (firma inválida, malformado) o si el usuario no existe (si descomentaste el bloque)
      return res.status(401).json({ msg: 'Token no válido, autorización denegada' });
    }
  }

  // Si no hay header Authorization o no empieza con 'Bearer'
  if (!token) {
    console.warn('Intento de acceso sin token');
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }
};

module.exports = { protect }; // Exportarlo dentro de un objeto es útil si añades más middleware aquí