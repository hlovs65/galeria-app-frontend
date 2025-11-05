// src/context/AuthProvider.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth'; // Importa el contexto
import { AUTH_SERVICE_URL } from '../config/apiConfig'; // importa la URL base de tu API PHP
import api from '../api/api'; // Importa tu instancia de Axios si la usas

// El Componente Proveedor
export const AuthProvider = ({ children }) => {
    // Estado que manejará el token, el nombre de usuario y el estado de conexión
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Para manejar la carga inicial

    // Hook de navegación
    const navigate = useNavigate();

    // Estado derivado para verificar si está logueado
    const isLoggedIn = !!token;

    // ----------------------------------------------------
    // LÓGICA DE PERSISTENCIA (almacenar sesión en el navegador)
    // ----------------------------------------------------

    // Efecto para cargar el token al iniciar la aplicación (solo se ejecuta una vez)
    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');
        const storedUserJSON = localStorage.getItem('user_data');
        if (storedToken && storedUserJSON) {
            // Si hay un token y datos de usuario, restauramos el estado
            setToken(storedToken);
            setUser(JSON.parse(storedUserJSON));
        }
        setIsLoading(false);
    }, []);

    // ----------------------------------------------------
    // FUNCIÓN DE LOGIN (Conexión a login.php)
    // ----------------------------------------------------

    const login = async (credentials) => {
        // Se usa el objeto de credenciales directamente
        const body = {
            'username-or-email': credentials.identificador,
            'password': credentials.contraseña
        };

        try {
            // Petición POST a tu API de PHP
            const response = await fetch(`${AUTH_SERVICE_URL}/api/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body), // Envía los datos del formulario
            });

            const apiData = await response.json();

            if (response.ok) {
                // ÉXITO (Código 200) - Respuesta con el JWT
                const { token: receivedToken, message } = apiData;

                // Construye el objeto de usuario con la información decodificada del token
                const userData = {
                    username: apiData.username,
                    email: apiData.email,
                    user_id: apiData.user_id, // Necesario para permisos
                    role: apiData.role // Necesario para la autorización
                };

                // 1. Almacenar el token y user en el estado local
                setToken(receivedToken);
                setUser(userData);

                // 2. Persistir en el navegador (LocalStorage)
                localStorage.setItem('jwt_token', receivedToken);
                localStorage.setItem('user_data', JSON.stringify(userData));

                // Devolver el mensaje de éxito para mostrarlo en el formulario
                return { success: true, message };

            } else {
                // ERROR (Códigos 400, 401, 403, 500) - Respuesta JSON de error
                // Devolver el mensaje de error para que Login.jsx lo muestre
                return { success: false, message: apiData.message || 'Error desconocido.' };
            }

        } catch (error) {
            console.error("Error al conectar con la API:", error);
            return { success: false, message: 'Fallo la conexión con el servidor.' };
        }
    };

    // ----------------------------------------------------
    // FUNCIÓN DE CLEAR SESIÓN LOCAL. Limpia el estado y el almacenamiento local
    // ----------------------------------------------------

    const clearLocalSession = () => {
        // 1. Limpiar el estado
        setToken(null);
        setUser(null);
        // 2. Limpiar el almacenamiento local
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        console.log("Sesión cerrada y datos eliminados del almacenamiento local.");
    };

    // ----------------------------------------------------
    // FUNCIÓN DE  LOGOUT CON PETICIÓN A LA API
    // ----------------------------------------------------

    const handleLogout = async () => {
        // 1. Limpiar el estado

        // 2. Hacer una petición a la API para invalidar el token (si es necesario)
        try {
            const response = await api.post('/api/logout.php'); // Ajusta la URL según tu API

            // 3. Limpiar la sesión local independientemente del resultado de la API
            clearLocalSession();

            if (response.status === 200) {
                console.log("Sesión cerrada en el servidor.");
            }

            // 4. Redirigir al login después del logout y mostrar un mensaje
            navigate('/login?status=logged_out');
            return { success: true, message: response?.data?.message || 'Sesión cerrada correctamente.' };
        } catch (error) {
            clearLocalSession();
            if (error.response?.status === 401) {
                navigate('/login?status=session_expired');
            } else {
                console.error("Error al cerrar sesión en el servidor:", error);
                navigate('/login?status=logout_failed'); // Redirigir al login después del logout
            }
            return { success: false, message: error?.response?.data?.message || 'Error al cerrar sesión en el servidor.' };
        }
    };

    // ----------------------------------------------------
    // Proveer los valores
    // ----------------------------------------------------

    const contextValue = {
        token,
        user,
        isLoggedIn,
        isLoading,
        login,
        logout: handleLogout,
    };

    // Renderizar los componentes hijos con el contexto
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};