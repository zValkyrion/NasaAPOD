// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Asegurarse que las variables de entorno estén cargadas

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Opciones de Mongoose para evitar warnings (pueden variar según versión)
      // useNewUrlParser: true, // Ya no son necesarias en Mongoose 6+
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Ya no es necesaria
      // useFindAndModify: false, // Ya no es necesaria
    });

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error conectando a MongoDB: ${error.message}`);
    process.exit(1); // Detener la aplicación si no se puede conectar a la DB
  }
};

module.exports = connectDB;