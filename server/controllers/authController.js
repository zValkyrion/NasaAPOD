// controllers/authController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// --- registerUser (Sin Cambios) ---
exports.registerUser = async (req, res, next) => {
  // ... (tu código original)
  // 1. Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    // 2. Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'El correo electrónico ya está registrado' }] });
    }
    // 3. Crear nueva instancia
    user = new User({ email, password });
    // 4. Guardar usuario
    await user.save();
    // 5. Respuesta Exitosa
    res.status(201).json({ msg: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error("Error en registerUser:", error.message);
    res.status(500).json({ errors: [{ msg: 'Error del servidor al registrar usuario' }] });
    next(error);
  }
};

// --- loginUser (Sin Cambios) ---
exports.loginUser = async (req, res, next) => {
  // ... (tu código original)
  // 1. Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    // 2. Buscar al usuario
    const user = await User.findOne({ email }).select('+password');
    // 3. Verificar si el usuario existe Y si la contraseña es correcta
    if (!user || !(await user.comparePassword(password))) {
       console.warn(`Intento de login fallido para: ${email}`);
       return res.status(401).json({ errors: [{ msg: 'Credenciales inválidas' }] });
    }
    // 4. Generar JWT
    const payload = {
      user: {
        id: user.id // Tu payload original está bien
      }
    };
    // 5. Firmar el token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      (err, token) => {
        if (err) { console.error("Error al firmar el token JWT:", err); throw err; }
        // 6. Enviar el token
        console.log(`Login exitoso: ${email}`);
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error("Error en loginUser:", error.message);
    res.status(500).json({ errors: [{ msg: 'Error del servidor durante el login' }] });
    next(error);
  }
};

// --- deleteUser (AJUSTADO para usar req.userId) ---
exports.deleteUser = async (req, res, next) => {
  try {
    // 1. Obtener el ID del usuario desde req.userId (proporcionado por TU middleware original)
    const userId = req.userId; // <--- ¡CAMBIO AQUÍ!

    // Verificar si userId realmente existe en req (por si acaso)
    if (!userId) {
        console.error('Error en deleteUser: No se encontró userId en el request después del middleware protect.');
        return res.status(401).json({ errors: [{ msg: 'No autorizado (ID de usuario no encontrado)' }] });
    }

    // 2. Buscar y eliminar al usuario por su ID
    const deletedUser = await User.findByIdAndDelete(userId);

    // 3. Verificar si se encontró y eliminó
    if (!deletedUser) {
      // Middleware ya verificó existencia, pero esto puede pasar si se elimina entre la verificación y esta operación
      console.warn(`Intento de eliminar usuario no encontrado (posiblemente ya eliminado): ID ${userId}`);
      return res.status(404).json({ errors: [{ msg: 'Usuario no encontrado.' }] });
    }

    // 4. Respuesta Exitosa
    console.log(`Usuario eliminado exitosamente: ID ${userId}, Email: ${deletedUser.email}`);
    res.status(200).json({ msg: 'Tu cuenta ha sido eliminada exitosamente.' });

  } catch (error) {
    console.error("Error en deleteUser:", error.message);
    res.status(500).json({ errors: [{ msg: 'Error del servidor al eliminar la cuenta.' }] });
    next(error);
  }
};