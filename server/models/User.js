// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true // Quitar espacios en blanco al inicio/final
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, introduce un correo electrónico válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
});

// Middleware (hook) de Mongoose: Hashear contraseña ANTES de guardar
// IMPORTANTE: Este hook se ejecuta en user.save(), perfecto para el update
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña ha sido modificada (o es nueva)
  // Esta condición es CLAVE para que no se re-hashee en cada save() si no cambió.
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`Contraseña hasheada para ${this.email} antes de guardar.`); // Log para depuración
    next();
  } catch (error) {
    console.error(`Error hasheando contraseña para ${this.email}:`, error);
    next(error);
  }
});

// Método para comparar contraseña
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;