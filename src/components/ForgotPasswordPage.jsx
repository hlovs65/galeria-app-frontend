// src/components/ForgotPasswordPage.jsx 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/authService.js'; // Importa la función de envio de token por olvido de contraseña
import './ForgotPasswordPage.css'; // Asegúrate de tener los estilos adecuados

const ForgotPasswordPage = () => {

    // Estado para manejar los datos del formulario
    const [email, setEmail] = useState('');

    // Estado para mensajes de la API o errores por resend_token.php
    const [apiMessage, setApiMessage] = useState('null'); // { text: '...', type: 'success' | 'error' }
    const [isSubmitting, setIsSubmitting] = useState(false); // Para desactivar el botón mientras se envía

    // Inicializamos el estado booleano:
    const [isSuccessSent, setSuccessSent] = useState(false);


    // Funcion de envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiMessage(null);
        setIsSubmitting(true);

        // PHP espera datos POST (application/x-www-form-urlencoded)
        const formData = new FormData();
        formData.append('email', email);


        {/** Llamada a la función de envio de token de reseteo de contraseña que esta en authService.js */ }
        try {
            const response = await requestPasswordReset(formData);

            if (response.success) {
                const serverStatus = response.data.status;
                const serverMessage = response.data.message;
                if (serverStatus === 'error') {
                    setApiMessage({ type: 'error', text: serverMessage });
                    setSuccessSent(false);
                } else {
                    setApiMessage({ type: 'success', text: serverMessage || "Envio exitoso. Verifica tu correo electronico" });
                    setSuccessSent(true);
                    setEmail(' ');
                }
            } else {
                setApiMessage({
                    type: 'error',
                    text: response.data.message || "Error del servidor HTTP ${response.status}."
                });
            }
        } catch (error) {
            setApiMessage({ type: 'error', text: error.message || "Error en el envio de token de reseteo de contraseña" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='auth-form-container'>
            <h2>
                {isSuccessSent
                    ? "Enlace Enviado con Exito"
                    : "¿Olvidaste tu Contraseña?"
                }
            </h2>

            {/** Mensaje de la API (Este mensaje remplaza al anterior) */}
            {apiMessage && apiMessage !== 'null' && (
                <div className={`api-message ${apiMessage.type}`}>
                    {apiMessage.text}
                </div>
            )}

            {/* Ocultar el formulario si el estado booleano es true */}
            {!isSuccessSent && (
                <form onSubmit={handleSubmit} className='forgot-form'>
                    <div className='form-group'>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu Correo Electrónico"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Reenviando..." : "Enviar enlace de reseteo de contraseña"}
                    </button>
                </form>
            )}
            <div className='return-link-container'>
                <Link to="/login" className='return-link-text'>Regresar a Inicio de Sesion</Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
