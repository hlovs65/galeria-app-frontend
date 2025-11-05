// src/services/apiService.js
import { USER_SERVICE_URL } from '../config/apiConfig'; // importa la URL base de tu API PHP

// Función para registrar un nuevo usuario
export const registerUser = async (formData) => {

    const API_REGISTER_URL = `${USER_SERVICE_URL}/api/register`;
  try {
    const response = await fetch(API_REGISTER_URL, {
      method: 'POST',
      body: formData, // Envía los datos del formulario
    });

    if (!response.ok) {
      throw new Error('Error al registrar el usuario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la función registerUser:', error);
    throw error;
  }
};
