// src/hooks/useAuth.js

import { createContext, useContext } from 'react';

// 1. Crear el Contexto
// Lo creamos aquí para que el proveedor y el hook lo compartan
export const AuthContext = createContext();

// 2. Hook Personalizado para usar la autenticación fácilmente
export const useAuth = () => {
    // Si el componente llama a useAuth() fuera de un AuthProvider, lanzamos un error claro
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};