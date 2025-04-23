// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');

// Importamos TODOS los controladores necesarios
const { registerUser, loginUser, deleteUser } = require('../controllers/authController');

// Importamos el middleware de autenticación
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register - Ruta de Registro
router.post(
  '/register',
  [
    body('email', 'Introduce un correo electrónico válido').isEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
  ],
  registerUser
);

// POST /api/auth/login - Ruta de Inicio de Sesión
router.post(
  '/login',
  [
    body('email', 'Introduce un correo electrónico válido').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty()
  ],
  loginUser
);

// DELETE /api/auth/user - Ruta para Eliminar la cuenta del usuario autenticado
// Se requiere autenticación (protegida por el middleware 'protect')
router.delete(
    '/user',      // Endpoint para la acción sobre el propio usuario autenticado
    protect,      // 1. Ejecuta el middleware de autenticación
    deleteUser    // 2. Si la autenticación es exitosa, ejecuta el controlador deleteUser
);

module.exports = router;