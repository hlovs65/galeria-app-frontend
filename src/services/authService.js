// src/services/authService.js
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
      body: formData.toString(), // Envía los datos del email
    });

    if (!response.ok) {
      // Asumiendo que PHP devuelve JSON en el cuerpo incluso en el error 400/405
      const errorBody = await response.json();
      // Lanzamos un Error que será capturado por el 'catch'
      throw new Error(errorBody.message || `Error del servidor: ${response.status}`);
    }

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

// Función para enviar el token de reseteo de contraseña
export const requestPasswordReset = async (formData) => {

  const API_FORGET_PASSWORD_URL = `${AUTH_SERVICE_URL}/controllers/forgot_password_handler.php`;
  try {
    const response = await fetch(API_FORGET_PASSWORD_URL, {
      method: 'POST',
      body: formData, // Envía los datos del email
    });

    if (!response.ok) {
      // Asumiendo que PHP devuelve JSON en el cuerpo incluso en el error 400/405
      const errorBody = await response.json();
      // Lanzamos un Error que será capturado por el 'catch'
      throw new Error(errorBody.message || `Error del servidor: ${response.status}`);
    }

    const apiData = await response.json();
    return {
      success: response.ok,
      data: apiData,
      status: response.status
    };
  } catch (error) {
    console.error('Error en la función requestPasswordReset:', error);
    return {
      success: false,
      data: { message: "Falla al conectar el servicio." },
      status: 0
    };
  }
};

// Función para finalizar el reseteo de contraseña con el token
export const finalizePasswordReset = async (formData) => {

  const API_RESET_PASSWORD_URL = `${AUTH_SERVICE_URL}/controllers/reset_password_handler.php`;
  try {
    const response = await fetch(API_RESET_PASSWORD_URL, {
      method: 'POST',
      body: formData, // Envía los datos del token y la nueva contraseña
    });

    // INICIO Código Temporal para Debug:
    const responseText = await response.text(); // Lee el cuerpo como texto plano
    console.log("Respuesta CRUDA (Longitud):", responseText.length);
    console.log("Respuesta CRUDA (Primeros 10 caracteres):", responseText.substring(0, 10));

    // Intenta analizar el JSON para confirmar si es la falla:
    let apiData;
    try {
      apiData = JSON.parse(responseText);
      console.log("Parseo Exitoso:", apiData);
    } catch (e) {
      // ⚠️ ESTO SE EJECUTARÁ SI EL JSON ESTÁ CONTAMINADO ⚠️
      console.log("Error al parsear JSON:", e);
      console.log("FALLO DE JSON.PARSE: El servidor envió datos contaminados. Cuerpo:", responseText);
      throw new Error(`Error de comunicación: El servidor envió datos contaminados. Código: ${response.status}`);
    }    
    // FIN Código Temporal para Debug:

    if (!response.ok) {
      // Asumiendo que PHP devuelve JSON en el cuerpo incluso en el error 400/405
      const errorBody = await response.json();
      // Lanzamos un Error que será capturado por el 'catch'
      throw new Error(errorBody.message || `Error del servidor: ${response.status}`);
    }

    // INICIO COMENTARIZAR codigo temporal para debug
    //const apiData = await response.json();
    // FIN COMENTARIZAR codigo temporal para debug
    return {
      success: response.ok,
      data: apiData,
      status: response.status
    };
  } catch (error) {
    console.error('Error en la función finalizePasswordReset:', error);
    return {
      success: false,
      data: { message: "Falla al conectar el servicio." },
      status: 0
    };
  }
};
