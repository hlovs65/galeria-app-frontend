// src/config/apiConfig.js

/**
 * Define la URL base de la API.
 * Usa la variable de entorno VITE_API_BASE_URL (para producción)
 * 2. Usa http://localhost:80/api-base como fallback local (Desarrollo).
 * 3. Usa la URL de Render como fallback final (o de demo).
 */
/**
 * Define la URL base principal de la API de Imágenes/Datos.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://galeria-api-server.onrender.com";

//---------------------------------------------------------------------

/**
 * Define la URL base para el servicio de AUTENTICACIÓN (Login, Logout, Token Check).
 * "https://galeria-user-api.onrender.com"
 * Apunta a la nueva carpeta renombrada.
 */
export const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

/**
 * Define la URL base para el servicio de USUARIOS/REGISTRO (Creación de cuenta, register.php).
 * "https://galeria-user-api.onrender.com" 
 * Apunta al mismo lugar, pero con un nombre de variable específico.
 */
export const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;