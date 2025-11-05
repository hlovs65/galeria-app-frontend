// src/api/api.js o src/api/axiosConfig.js

import axios from 'axios';
// Asegúrate de importar la URL base si la tienes en un archivo de configuración
import { AUTH_SERVICE_URL } from '../config/apiConfig'; 

// 1. Crear la instancia base
const api = axios.create({
    baseURL: AUTH_SERVICE_URL, 
    // Por defecto, Axios usa 'application/json'
    // 'Content-Type': 'application/json',
});

// 2. Definir el Interceptor de Solicitud (ESTO ES LO CRUCIAL)
api.interceptors.request.use(
    (config) => {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem('jwt_token'); 

        // Si el token existe, lo adjuntamos a la cabecera de la solicitud
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;