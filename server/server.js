// server.js (Backend - Modificado)

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Asegúrate que esté importado
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();
const app = express();

// --- Configuración Explícita de CORS ---
const whitelist = [
    'http://localhost:5173', // Origen de tu frontend Vite
    'http://localhost:3000'  // Origen común de Create React App (por si acaso)
    // Añade la URL de tu frontend desplegado aquí cuando lo tengas
    // 'https://tu-frontend.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permite peticiones sin origen (como Postman, apps móviles) Y las de la whitelist
        // ¡Importante! 'origin' puede ser undefined en peticiones del mismo origen o sin origen
        if (!origin || whitelist.indexOf(origin) !== -1) {
            console.log(`CORS check passed for origin: ${origin || 'N/A'}`);
            callback(null, true); // Permitir
        } else {
            console.warn(`CORS check FAILED for origin: ${origin}`);
            callback(new Error('Not allowed by CORS')); // Bloquear
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
    credentials: true, // Si planeas usar cookies/sesiones con JWT más adelante
    optionsSuccessStatus: 200 // OK en lugar de 204 para compatibilidad
};

// Aplicar el middleware CORS con las opciones configuradas
app.use(cors(corsOptions));
// ------------------------------------

// Middlewares básicos (después de CORS)
app.use(express.json());

// --- Rutas ---
// (Tu código de rutas existente)
app.get('/', (req, res) => {
    res.send('API Funcionando Correctamente!'); // Quita el throw new Error si ya no lo necesitas
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/nasa', require('./routes/nasaRoutes'));

// --- MANEJADOR DE ERRORES GLOBAL ---
app.use(errorHandler);

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en modo ${process.env.NODE_ENV || 'development'} en el puerto ${PORT}`);
    console.log(`CORS Habilitado para orígenes en whitelist: ${whitelist.join(', ')}`);
});