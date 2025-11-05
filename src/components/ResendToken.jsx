// src/components/ResendToken.jsx 
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callResendApi } from '../services/authService.js'; // Importa la función de reenvio de token
import './ResendToken.css'; // Asegúrate de tener los estilos adecuados

const ResendToken = () => {
    // Para leer el estado de error de la URL (?status=invalid_token)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    // Estado para manejar los datos del formulario
    const [email, setEmail] = useState('');

    // Estado para mensajes de la API o errores por resend_token.php
    const [apiMessage, setApiMessage] = useState('null'); // { text: '...', type: 'success' | 'error' }
    const [isSubmitting, setIsSubmitting] = useState(false); // Para desactivar el botón mientras se envía

    // Inicializamos el estado booleano:
    const [isAlreadyVerified, setisAlreadyVerified] = useState(false);

    const navigate = useNavigate();


    // Muestra el mensaje de por qué el usuario está en esta página
    const getReasonMessage = (status) => {
        if (status === 'invalid_token') return "El enlace de verificacion ha expirado o es invalido. Introduce tu correo electronico, para recibir un nuevo enlace.";
        if (status === 'missing_token') return "La verificacion del token es invalido. Introduce tu correo electronico, para recibir un nuevo enlace.";
        return "Introduce tu correo electronico pata recibir un nuevo enlace, para activar tu cuenta.";
    };


    // Funcion de envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiMessage(null);
        setIsSubmitting(true);

        // PHP espera datos POST (application/x-www-form-urlencoded)
        const formData = new URLSearchParams();
        formData.append('email', email);


        {/** Llamada a la función de reenvio de token que esta en authService.js */ }
        try {
            const response = await callResendApi(formData);

            if (response.success) {
                const serverStatus = response.data.status;
                const serverMessage = response.data.message;
                const isVerifiedFromAPI = response.data.isverified;
                if (serverStatus === 'error') {
                    setApiMessage({ type: 'error', text: serverMessage });
                    setEmail(' ');
                } else if (isVerifiedFromAPI === true) {
                    setisAlreadyVerified(true);
                    setApiMessage({ type: 'info', text: serverMessage });
                } else {
                    setApiMessage({ type: 'success', text: serverMessage || "Reenvio exitoso. Verifica tu correo electronico" });
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            } else {
                setApiMessage({
                    type: 'error',
                    text: response.data.message || 'Error del servidor HTTP ${response.status}.'
                });
            }
        } catch (error) {
            setApiMessage({ type: 'error', text: error.message || "Error en el reenvio de token" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='auth-form-container'>
            <h2>
                {isAlreadyVerified
                    ? "Cuenta Activa"
                    : "Solicitar Nuevo Enlace de Activacion"
                }
            </h2>

            {/** Mensaje de la razon */}
            {apiMessage === 'null' && (
                <p className="reason-message alert alert-warning">
                    {getReasonMessage(status)}
                </p>
            )}


            {/** Mensaje de la API (Este mensaje remplaza al anterior) */}
            {apiMessage && apiMessage !== 'null' && (
                <div className={`api-message ${apiMessage.type}`}>
                    {apiMessage.text}
                </div>
            )}

            {/* Ocultar el formulario si el estado booleano es true */}
            {!isAlreadyVerified && (
                <form onSubmit={handleSubmit} className='resend-form'>
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
                        {isSubmitting ? "Reenviando..." : "Enviar enlace de activacion"}
                    </button>
                </form>
            )}
            <div className='return-link-container'>
                <Link to="/login" className='return-link-text'>Regresar a Inicio de Sesion</Link>
            </div>
        </div>
    );
};

export default ResendToken;
