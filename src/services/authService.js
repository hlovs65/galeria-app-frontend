// src/services/apiService.js
import { AUTH_SERVICE_URL } from '../config/apiConfig'; // importa la URL base de tu API PHP

// Función para registrar un nuevo usuario
export const callResendApi = async (formData) => {

    const API_RESEND_URL = `${AUTH_SERVICE_URL}/controllers/resend_token.php`;
  try {
    const response = await fetch(API_RESEND_URL, {
      method: 'POST',
      headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
      body: formData, // Envía los datos del email
    });
/*
    if (!response.ok) {
      throw new Error('Error al reenviar el correo al usuario');
    }
*/
    const apiData = await response.json();
    return {
        success: response.ok,
        data: apiData,
        status: response.status
    };
  } catch (error) {
    console.error('Error en la función callResendApi:', error);
    return {
        success: false,
        data: { message: "Falla al conectar el servicio." },
        status: 0
    };
  }
};
