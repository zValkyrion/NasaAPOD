// controllers/userController.js
const User = require('../models/User'); // Necesitamos el modelo para buscar al usuario
const { validationResult } = require('express-validator');

// @desc    Obtener perfil del usuario logueado
// @route   GET /api/users/profile
// @access  Private (Protegido por JWT)
exports.getUserProfile = async (req, res, next) => {
  try {
    // 1. Obtener el usuario usando el ID adjuntado por el middleware 'protect'
    //    req.userId fue establecido en el middleware protect
    //    Usamos .select('-password') para asegurarnos de NUNCA devolver el hash.
    const user = await User.findById(req.userId).select('-password');

    // 2. Verificar si el usuario fue encontrado
    //    (Aunque el middleware 'protect' podría haberlo hecho, es una buena doble verificación)
    if (!user) {
      // Este caso es improbable si el token es válido y la verificación opcional
      // en el middleware está activa, pero es defensivo incluirlo.
      console.warn(`Usuario no encontrado para ID en token válido: ${req.userId}`);
      return res.status(404).json({ msg: 'Usuario no encontrado' }); // 404 Not Found
    }

    // 3. Enviar los datos del perfil del usuario
    res.status(200).json({
      id: user._id, // o user.id
      email: user.email,
      createdAt: user.createdAt, 
      name: user.name, // Asegúrate de que el modelo User tenga este campo
    });

  } catch (error) {
    console.error("Error en getUserProfile:", error.message);
    // Error genérico del servidor si algo sale mal (ej. error de DB)
    res.status(500).json({ msg: 'Error del servidor al obtener el perfil' });
    next(error); 
  }
};

exports.updateUserProfile = async (req, res, next) => {
    // 1. Validar entrada usando express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, password } = req.body;
    const updateData = {}; // Objeto para guardar los campos que SÍ se van a actualizar
  
    // Construir objeto de actualización solo con los campos proporcionados
    if (name !== undefined) { // Verificar que 'name' fue enviado (incluso si es "" después de trim)
       updateData.name = name;
    }
    if (password) { // Solo si se proporcionó una nueva contraseña
       updateData.password = password;
    }
  
     // Si no se envió nada para actualizar
     if (Object.keys(updateData).length === 0) {
         return res.status(400).json({ msg: 'No se proporcionaron datos para actualizar' });
     }
  
  
    try {
      // 2. Buscar al usuario actual
      //    NO usamos select('-password') aquí porque si actualizamos la contraseña,
      //    el hook pre('save') necesita el estado completo del documento.
      const user = await User.findById(req.userId);
  
      if (!user) {
        // Improbable si el token es válido, pero buena verificación
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }
  
      // 3. Actualizar los campos en el documento Mongoose
      if (updateData.name !== undefined) {
        user.name = updateData.name;
         console.log(`Actualizando nombre para ${user.email}`);
      }
      if (updateData.password) {
        user.password = updateData.password;
        // El hook pre('save') se encargará del hashing automáticamente
         console.log(`Contraseña marcada para actualizar para ${user.email}. El hook pre-save la hasheará.`);
      }
  
      // 4. Guardar los cambios en la base de datos
      //    Esto disparará las validaciones del schema y el hook pre('save') si es necesario
      const updatedUser = await user.save();
       console.log(`Perfil actualizado exitosamente para ${updatedUser.email}`);
  
      // 5. Enviar la respuesta con los datos actualizados (SIN contraseña)
      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        msg: 'Perfil actualizado exitosamente' // Mensaje de éxito opcional
      });
  
    } catch (error) {
      console.error("Error en updateUserProfile:", error.message);
      // Podría ser un error de validación de Mongoose (ej. si name fuera unique)
      // o un error de base de datos. Pasarlo al manejador global.
      next(error);
    }
  };

  exports.deleteUser = async (req, res, next) => {
    try {
      // 1. Obtener el ID del usuario desde req.user (añadido por el middleware 'protect')
      const userId = req.user.id;
  
      // 2. Buscar y eliminar al usuario por su ID
      // findByIdAndDelete busca por _id y elimina el documento si lo encuentra
      const deletedUser = await User.findByIdAndDelete(userId);
  
      // 3. Verificar si el usuario fue encontrado y eliminado
      if (!deletedUser) {
        // Esto podría pasar si el token es válido pero el usuario ya fue eliminado
        // por otro medio, o si el ID en el token es incorrecto (menos probable si jwt.verify funcionó)
        console.warn(`Intento de eliminar usuario no encontrado: ID ${userId}`);
        return res.status(404).json({ errors: [{ msg: 'Usuario no encontrado.' }] }); // 404 Not Found
      }
  
      // 4. Respuesta Exitosa
      console.log(`Usuario eliminado exitosamente: ID ${userId}, Email: ${deletedUser.email}`); // Loguear email si es útil
      // Puedes devolver 200 OK con un mensaje o 204 No Content si no necesitas devolver nada.
      res.status(200).json({ msg: 'Usuario eliminado exitosamente.' });
  
    } catch (error) {
      console.error("Error en deleteUser:", error.message);
      // Error genérico del servidor
      res.status(500).json({ errors: [{ msg: 'Error del servidor al eliminar usuario.' }] });
      next(error); // Pasar el error al manejador de errores de Express si tienes uno
    }
  };