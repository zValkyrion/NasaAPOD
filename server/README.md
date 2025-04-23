# 🚀 Proyecto Full Stack - Autenticación y NASA APOD (Backend)

[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x-success.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-yellow.svg)](https://jwt.io/)

Este repositorio contiene el código fuente del **backend** para la aplicación web Full Stack. Proporciona una API RESTful para la autenticación de usuarios, gestión de perfiles y actúa como un proxy seguro para la API "Astronomy Picture of the Day" (APOD) de la NASA.

## 📋 Descripción

El backend está construido con Node.js y Express. Se encarga de:

* Registrar nuevos usuarios de forma segura
* Autenticar usuarios existentes usando correo y contraseña
* Eliminar usuarios existentes una vez iniciada su respectiva sesion
* Gestionar sesiones mediante JSON Web Tokens (JWT)
* Proteger rutas específicas para que solo usuarios autenticados puedan accederlas
* Permitir a los usuarios ver y actualizar su información de perfil (nombre, contraseña)
* Interactuar con la API de la NASA APOD para obtener la imagen astronómica del día, ocultando la clave API de NASA al cliente
* Proporcionar una API clara y estructurada para ser consumida por un frontend (React en este caso)

## 🛠️ Tecnologías Utilizadas

* **[Node.js](https://nodejs.org/):** Entorno de ejecución de JavaScript del lado del servidor
* **[Express](https://expressjs.com/):** Framework web minimalista y flexible para Node.js
* **[MongoDB](https://www.mongodb.com/):** Base de datos NoSQL orientada a documentos
* **[Mongoose](https://mongoosejs.com/):** ODM (Object Data Modeling) para MongoDB y Node.js
* **[JSON Web Tokens (JWT)](https://jwt.io/):** Estándar abierto (RFC 7519) para crear tokens de acceso basados en JSON
* **[bcrypt.js](https://github.com/dcodeIO/bcrypt.js):** Librería para hashear contraseñas de forma segura
* **[Axios](https://axios-http.com/):** Cliente HTTP basado en promesas para realizar peticiones
* **[dotenv](https://github.com/motdotla/dotenv):** Módulo para cargar variables de entorno
* **[cors](https://github.com/expressjs/cors):** Middleware de Express para habilitar CORS
* **[express-validator](https://express-validator.github.io/):** Middleware para la validación de datos
* **[Nodemon](https://nodemon.io/):** Herramienta para reiniciar automáticamente el servidor durante desarrollo

## ⚙️ Configuración del Entorno Local

Sigue estos pasos para configurar y ejecutar el backend en tu máquina local.

### Prerrequisitos

* **Node.js:** Versión 16.x o superior (puedes verificar con `node -v`)
* **npm:** Gestor de paquetes de Node.js (verifica con `npm -v`)
* **MongoDB:** Una instancia de MongoDB corriendo localmente (o una URI de conexión a MongoDB Atlas)

### 1. Clonar Repositorio

```bash
git clone <url-del-repositorio-git>
cd <nombre-del-directorio>/server
```

### 2. Instalar Dependencias

Dentro del directorio server, ejecuta:

```bash
npm install
```

### 3. Variables de Entorno (.env)

Crea un archivo llamado `.env` en la raíz del directorio server. Usa la siguiente plantilla:

```
# Configuración del Servidor
PORT=5000
NODE_ENV=development # Cambiar a 'production' en despliegue

# Conexión a MongoDB
MONGO_URI=mongodb://localhost:27017/nasa-auth-app # Reemplaza con tu URI de MongoDB

# Configuración de JWT
JWT_SECRET=TU_SECRETO_JWT_SUPER_SEGURO_Y_LARGO # ¡CAMBIA ESTO!
JWT_EXPIRES_IN=1h # Tiempo de expiración del token (ej. 1h, 7d)

# Configuración API de NASA
NASA_API_KEY=TU_API_KEY_DE_NASA # Obtén una clave en https://api.nasa.gov/
```

> ⚠️ **¡Importante!** Asegúrate de que el archivo `.env` esté en tu `.gitignore`

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

El servidor estará disponible en http://localhost:5000.

### Modo Producción

```bash
npm start
```

## 📚 Documentación de la API

La API base es `http://localhost:5000/api`.

### 🔐 Autenticación (Auth)

#### `POST /api/auth/register`

- **Acceso:** Público
- **Descripción:** Registra un nuevo usuario
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Opcional Nombre"
  }
  ```
- **Respuesta Exitosa (201):**
  ```json
  {
    "msg": "Usuario registrado exitosamente"
  }
  ```
- **Errores:** 400 (Datos inválidos, email ya existe), 500 (Error del servidor)

#### `POST /api/auth/login`

- **Acceso:** Público
- **Descripción:** Autentica un usuario y devuelve un JWT
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Respuesta Exitosa (200):**
  ```json
  {
    "token": "ey..."
  }
  ```
- **Errores:** 400 (Datos inválidos), 401 (Credenciales inválidas), 500 (Error del servidor)

### 👤 Usuarios (Users)

#### `GET /api/users/profile`

- **Acceso:** Privado (Requiere `Authorization: Bearer <token>` header)
- **Descripción:** Obtiene el perfil del usuario autenticado
- **Respuesta Exitosa (200):**
  ```json
  {
    "id": "...",
    "name": "...",
    "email": "...",
    "createdAt": "..."
  }
  ```
- **Errores:** 401 (No autorizado), 404 (Usuario no encontrado), 500

#### `PUT /api/users/profile`

- **Acceso:** Privado (Requiere `Authorization: Bearer <token>` header)
- **Descripción:** Actualiza el perfil del usuario autenticado
- **Body (JSON, Opcional):**
  ```json
  {
    "name": "Nuevo Nombre",
    "password": "nuevaPassword123"
  }
  ```
- **Respuesta Exitosa (200):**
  ```json
  {
    "id": "...",
    "name": "...",
    "email": "...",
    "createdAt": "...",
    "msg": "Perfil actualizado exitosamente"
  }
  ```
- **Errores:** 400 (Datos inválidos), 401, 404, 500

### 🔭 NASA APOD

#### `GET /api/nasa/apod`

- **Acceso:** Público
- **Descripción:** Obtiene la "Astronomy Picture of the Day" de la NASA
- **Query Params (Opcional):** `?date=YYYY-MM-DD`
- **Respuesta Exitosa (200):** JSON con los datos de APOD (title, explanation, url, etc.)
- **Errores:** 404 (No hay imagen para esa fecha), 500, 502 (Error al contactar NASA)

## 🔒 Buenas Prácticas Implementadas

### Seguridad:

- **Hashing de Contraseñas:** Uso de bcrypt.js con salt adecuado
- **Autenticación JWT:** Implementación stateless con secretos y expiración configurables
- **Middleware de Autenticación:** Verificación de JWTs en rutas protegidas
- **Variables de Entorno:** Gestión de información sensible fuera del código fuente
- **Validación de Entrada:** Uso de express-validator para validar datos
- **Ocultación de Clave API Externa:** La clave API de NASA nunca se expone al frontend
- **CORS Configurado:** Control de qué orígenes pueden acceder a la API
- **Mensajes de Error Genéricos:** Se evita dar información detallada sobre errores de autenticación

> 💡 **Mejora Potencial:** Añadir rate limiting a endpoints sensibles

### Calidad de Código y Estructura:

- **Modularidad:** Organización en carpetas por funcionalidad
- **Controladores y Rutas Separados:** Separación de rutas y lógica de negocio
- **Async/Await:** Código asíncrono limpio y legible
- **Mongoose ORM:** Esquemas, validaciones e interacción con MongoDB

### Manejo de Errores:

- **Middleware Global:** Manejador de errores centralizado
- **Captura Específica:** Bloques try...catch en operaciones asíncronas

## 🔑 Variables de Entorno Requeridas

- `PORT`: Puerto del servidor (ej. 5000)
- `NODE_ENV`: Entorno (development/production)
- `MONGO_URI`: String de conexión MongoDB
- `JWT_SECRET`: Clave secreta para firmar JWT
- `JWT_EXPIRES_IN`: Tiempo de vida JWT (ej. 1h, 7d)
- `NASA_API_KEY`: Clave API para la NASA

## 🌐 Despliegue

Puedes desplegar este backend en plataformas como:

- [Heroku](https://heroku.com)
- [Render](https://render.com)
- [Fly.io](https://fly.io)
- [AWS](https://aws.amazon.com) (EC2, Beanstalk, Fargate)
- [Google Cloud](https://cloud.google.com) (App Engine, Cloud Run)
- [DigitalOcean](https://digitalocean.com) (App Platform)

### Consideraciones Clave para el Despliegue:

- **Variables de Entorno:** Configura todas las variables requeridas en la plataforma
- **Base de Datos:** Asegura conexión a MongoDB (ej. MongoDB Atlas)
- **NODE_ENV:** Establece a `production` en el servidor
- **CORS:** Ajusta la configuración para permitir solo el origen de tu frontend:

```javascript
// server.js
const corsOptions = {
  origin: 'https://tu-frontend-desplegado.com'
};
app.use(cors(corsOptions));
```

- **Build/Start Script:** Asegúrate de que tu plataforma ejecute `npm install` y luego `npm start`

---
