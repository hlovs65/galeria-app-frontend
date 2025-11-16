// src/services/apiService.js
import { USER_SERVICE_URL } from '../config/apiConfig'; // importa la URL base de tu API PHP

// Función para registrar un nuevo usuario
export const registerUser = async (jsonData) => {

    const API_REGISTER_URL = `${USER_SERVICE_URL}/api/register.php`;
  try {
    const response = await fetch(API_REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData), // Envía los datos del formulario
    });

    const data = await response.json(); // Parsea la respuesta JSON

    if (!response.ok) {
      throw new Error( data.message || 'Error desconocido del servidor');
    }

    return data; // Devuelve los datos de la respuesta de exito.
    
  } catch (error) {
    console.error('Error en la función registerUser:', error);
    throw error;
  }
};
