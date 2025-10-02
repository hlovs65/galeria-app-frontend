// src/config/apiConfig.js

/**
 * Define la URL base de la API.
 * Usa la variable de entorno VITE_API_BASE_URL (para producción)
 * o usa localhost:3001 como fallback (para desarrollo).
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";