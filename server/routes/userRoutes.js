// routes/userRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/profile (Ruta existente)
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile (NUEVA RUTA para actualizar)
router.put(
  '/profile',
  protect, // Proteger la ruta
  [ // Array de validaciones opcionales
    body('name')
      .optional() // El nombre es opcional
      .trim() // Quitar espacios
      .not().isEmpty().withMessage('El nombre no puede estar vacío si se proporciona'), // Pero si se da, no puede ser solo espacios
    body('password')
      .optional() // La contraseña es opcional
      .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    // No validamos email aquí, ya que no permitimos cambiarlo por esta vía
  ],
  updateUserProfile // El controlador que manejará la actualización
);

module.exports = router;