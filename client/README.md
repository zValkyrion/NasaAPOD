# NASA App - Frontend

[![NASA API](https://img.shields.io/badge/NASA-API-blue)](https://api.nasa.gov/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3%2B-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

Este es el frontend para la aplicación NASA App, un proyecto Full Stack diseñado para mostrar la "Foto Astronómica del Día" (APOD) de la NASA y gestionar la autenticación de usuarios. Esta interfaz está construida con React y se comunica con un backend dedicado (Node.js/Express) para la gestión de usuarios y como proxy para la API de la NASA.

![NASA APOD](/api/placeholder/800/400)

## ✨ Características Principales

* **Visualización de APOD:** Muestra la Foto Astronómica del Día de la NASA.
* **Selección de Fecha:** Permite al usuario seleccionar una fecha para ver el APOD correspondiente.
* **Registro de Usuarios:** Permite a nuevos usuarios crear una cuenta con nombre, email y contraseña.
* **Inicio de Sesión (Login):** Autenticación de usuarios existentes.
* **Gestión de Sesión:** Usa JSON Web Tokens (JWT) para mantener la sesión del usuario.
* **Rutas Protegidas:** Ciertas secciones (Dashboard, Editar Perfil) solo son accesibles para usuarios autenticados.
* **Dashboard Personal:** Da la bienvenida al usuario autenticado.
* **Seleccion de favoritos:** Apartado de imagenes favoritas.
* **Historial de imagenes:** Historial de fechas recientes consultadas.
* **Edición de Perfil:** Permite a los usuarios actualizar su nombre y contraseña.
* **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla (móvil, tablet, escritorio).
* **Experiencia de Usuario Mejorada:**
    * Indicadores de carga (Spinners, Skeletons).
    * Feedback visual claro (Notificaciones Toast, Alertas).
    * Animaciones suaves para transiciones y cambios de estado.
    * Manejo de texto largo ("Ver más").

## 🚀 Tecnologías Utilizadas

* **React (v18+):** Biblioteca principal para construir la interfaz de usuario. Uso extensivo de Functional Components y Hooks.
* **Vite:** Herramienta de construcción y servidor de desarrollo rápido para el frontend.
* **JavaScript:** Lenguaje de programación principal.
* **React Router DOM (v6+):** Para el manejo de rutas del lado del cliente y navegación.
* **Axios:** Cliente HTTP basado en promesas para realizar peticiones a la API backend. Incluye interceptores para inyección de JWT y manejo básico de errores.
* **Tailwind CSS (v3+):** Framework CSS utility-first para un diseño rápido, moderno y responsivo. Incluye configuración de tema personalizado.
    * **`@tailwindcss/aspect-ratio`:** Plugin para mantener fácilmente la relación de aspecto en elementos multimedia.
    * **(Implícito/Nativo en v3+) `line-clamp`:** Para truncar texto basado en número de líneas.
* **Framer Motion:** Biblioteca para crear animaciones fluidas y declarativas en React.
* **React Hot Toast:** Para mostrar notificaciones (toasts) no intrusivas al usuario.
* **React Icons:** Para incluir fácilmente iconos SVG populares (Fa icons).

## 📂 Estructura del Proyecto

El código fuente está organizado siguiendo una estructura modular y orientada a funcionalidades:

```
client/
├── public/             # Archivos estáticos públicos
├── src/                # Código fuente principal
│   ├── assets/         # Imágenes, fuentes, etc.
│   ├── components/     # Componentes reutilizables
│   │   ├── ui/         # Componentes UI básicos (Button, Input, Card...)
│   │   ├── common/     # Componentes comunes (Navbar, Footer...)
│   │   └── features/   # Componentes específicos (NasaCard, ProfileForm...)
│   ├── context/        # React Context API (AuthContext)
│   ├── hooks/          # Hooks personalizados (useAuth)
│   ├── layouts/        # Estructuras de página (MainLayout, AuthLayout)
│   ├── pages/          # Componentes de página (HomePage, LoginPage...)
│   ├── routes/         # Configuración de enrutamiento (index, ProtectedRoute)
│   ├── services/       # Lógica de llamadas API (api, authService...)
│   ├── styles/         # Estilos globales adicionales (si aplica)
│   ├── utils/          # Funciones de utilidad
│   ├── App.jsx         # Componente raíz de la aplicación
│   └── main.jsx        # Punto de entrada (Vite - reemplaza index.js)
├── .env                # Variables de entorno (NO versionar con valores reales)
├── .gitignore          # Archivos ignorados por Git
├── index.html          # Plantilla HTML principal (Vite)
├── package.json        # Dependencias y scripts
├── postcss.config.js   # Configuración de PostCSS (para Tailwind)
├── tailwind.config.js  # Configuración de Tailwind CSS
└── vite.config.js      # Configuración de Vite
```

## 💡 Conceptos y Buenas Prácticas Implementadas

* **Arquitectura Basada en Componentes:** Foco en crear componentes UI reutilizables, pequeños y cohesivos.
* **Gestión de Estado:** Uso de React Context (`AuthContext`) para el estado global de autenticación y estado derivado. `useState` para el estado local de componentes.
* **Enrutamiento Declarativo:** Configuración centralizada de rutas públicas y privadas usando React Router v6.
* **Comunicación API Centralizada:** El servicio `api.js` configura Axios con una `baseURL` (leída desde variables de entorno) e interceptores para manejar la inyección automática del token JWT y errores comunes. Los servicios específicos (`authService`, `userService`, `nasaService`) encapsulan las llamadas a endpoints.
* **Estilo Utility-First:** Tailwind CSS permite un desarrollo rápido y consistente, manteniendo los estilos cerca del marcado. Se configura un tema base.
* **Flujo de Autenticación JWT:** Manejo del ciclo de vida del token (login, almacenamiento en `localStorage`, inyección en cabeceras, verificación inicial, logout).
* **Experiencia de Usuario (UX):** Se prioriza el feedback claro mediante estados de carga visuales (Spinners en botones, Skeleton Loaders para contenido), notificaciones (Toasts) para acciones y errores, animaciones fluidas (Framer Motion) para transiciones y apariciones, y manejo de contenido extenso (truncamiento "Ver más").
* **Diseño Responsivo:** Uso de las utilidades responsivas de Tailwind (`sm:`, `md:`, `lg:`) para adaptar la interfaz a diferentes dispositivos.
* **Manejo de Errores:** El interceptor de Axios maneja errores globales (ej. 401, 500, red). A nivel de componente, se capturan errores de API específicos y se muestra feedback al usuario (`Alert`, `toast`).
* **Separación de Responsabilidades:** Clara distinción entre componentes de UI, páginas, layouts, servicios, hooks y contexto.

## 🛠️ Instalación y Puesta en Marcha Local

Sigue estos pasos para ejecutar el frontend localmente:

### Pre-requisitos:

* Node.js (v16 o superior recomendado)
* npm o yarn
* Git
* **Backend Corriendo:** Asegúrate de que el servidor backend del proyecto esté configurado y ejecutándose (normalmente en `http://localhost:5000`).

### Pasos:

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/yourusername/nasa-auth-app.git
   cd nasa-auth-app
   ```

2. **Navegar a la Carpeta del Frontend:**
   ```bash
   cd client
   ```

3. **Instalar Dependencias:**
   ```bash
   npm install
   # o si usas yarn:
   # yarn install
   ```

4. **Configurar Variables de Entorno:**
   * Crea un archivo llamado `.env` en la raíz de la carpeta `client`.
   * Añade la siguiente línea, asegurándote de que la URL apunta a tu servidor backend:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```
   * *(Nota: Este archivo `.env` no debe subirse a Git si contiene claves sensibles en el futuro).*

5. **Ejecutar el Servidor de Desarrollo:**
   ```bash
   npm run dev
   # o si usas yarn:
   # yarn dev
   ```

6. Abre tu navegador y visita `http://localhost:5173` (o el puerto que indique Vite).

## 📜 Scripts Disponibles

En el directorio `client`, puedes ejecutar varios scripts:

* `npm run dev` o `yarn dev`: Inicia el servidor de desarrollo de Vite con Hot Module Replacement (HMR).
* `npm run build` o `yarn build`: Compila la aplicación para producción en la carpeta `dist/`.
* `npm run preview` o `yarn preview`: Sirve localmente la build de producción desde `dist/`.
* `npm run lint` o `yarn lint`: (Si tienes ESLint configurado) Ejecuta el linter.

## ⚙️ Variables de Entorno

Para ejecutar este proyecto, necesitas definir la siguiente variable de entorno en un archivo `.env` en la raíz de `/client`:

* `VITE_API_URL`: La URL base completa de tu API backend.
    * *Ejemplo:* `VITE_API_URL=http://localhost:5000/api`

## ☁️ Despliegue

Este proyecto frontend (construido con Vite/React) es una aplicación estática después del proceso de `build`. Puedes desplegar fácilmente la carpeta `dist` generada por `npm run build` en plataformas como:

* [Vercel](https://vercel.com/)
* [Netlify](https://www.netlify.com/)
* [GitHub Pages](https://pages.github.com/)
* Servidores de archivos estáticos como AWS S3, Google Cloud Storage, etc.

Asegúrate de configurar las variables de entorno necesarias (como `VITE_API_URL` apuntando a tu backend desplegado) en la plataforma de despliegue.

## 📄 Archivo .env.example

Se recomienda crear un archivo `.env.example` con la estructura de las variables de entorno pero sin valores sensibles:

```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

## 📧 Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/yourusername/nasa-auth-app](https://github.com/yourusername/nasa-auth-app)
