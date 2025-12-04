// src/components/ForgotPasswordPage.jsx 
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { finalizePasswordReset } from '../services/authService.js'; // Importa la función de envio de token por olvido de contraseña
import './ResetPasswordPage.css'; // Asegúrate de tener los estilos adecuados
import './validarPassword.css'; // Asegúrate de tener los estilos adecuados
import { validarPassword, ocultarRequisitos } from './validarPassword.js';

const ResetPasswordPage = () => {

    // Estado para manejar los datos del formulario
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');

    // Estado para mensajes de la API o errores por reset_password_handler.php
    const [apiMessage, setApiMessage] = useState('null'); // { text: '...', type: 'success' | 'error' }
    const [isSubmitting, setIsSubmitting] = useState(false); // Para desactivar el botón mientras se envía

    // Inicializamos el estado booleano:
    const [isSuccessReset, setSuccessReset] = useState(false);
    const [searchParams] = useSearchParams();

    // Obtener el token de los parámetros de la URL al cargar el componente
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);


    // Funcion de envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiMessage(null);
        setIsSubmitting(true);

        // PHP espera datos POST (application/x-www-form-urlencoded)
        const formData = new FormData();
        formData.append('token', token);
        formData.append('password', password);
        formData.append('confirm-password', confirmPassword);


        {/** Llamada a la función de envio de token de reseteo de contraseña que esta en authService.js */ }
        try {
            const response = await finalizePasswordReset(formData);

            if (response.success) {
                const serverStatus = response.data.status;
                const serverMessage = response.data.message;
                if (serverStatus === 'error') {
                    setApiMessage({ type: 'error', text: serverMessage });
                    setSuccessReset(false);
                } else {
                    setApiMessage({ type: 'success', text: serverMessage || "Cambio exitoso de contraseña" });
                    setSuccessReset(true);
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
                {isSuccessReset
                    ? "Contraseña Actualizada con Éxito"
                    : "Establece una Nueva Contraseña"
                }
            </h2>


            {/** Mensaje de la API (Este mensaje remplaza al anterior) */}
            {apiMessage && apiMessage !== 'null' && (
                <div className={`api-message ${apiMessage.type}`}>
                    {apiMessage.text}
                </div>
            )}

            {/* Ocultar el formulario si el estado booleano es true */}
            {!isSuccessReset && (
                <form onSubmit={handleSubmit} className='forgot-form'>
                    <div className='form-group'>
                        <input
                            type="hidden"
                            name="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">Nueva Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                                const nuevoValor = e.target.value;
                                setConfirmPassword(nuevoValor);
                                validarPassword(nuevoValor)
                            }}
                            onBlur={ocultarRequisitos}
                            placeholder="Ingresa tu Nueva Contraseña"
                            required
                        />
                    </div>
                    <div id="requisitosPassword" className="requisitos-password">
                        <p>La contraseña debe cumplir con los siguientes requisitos:</p>
                        <ul>
                            <li id="req-longitud" className="invalido">❌ Al menos 8 caracteres</li>
                            <li id="req-mayuscula" className="invalido">❌ Al menos una letra mayúscula</li>
                            <li id="req-numero" className="invalido">❌ Al menos un número</li>
                            <li id="req-especial" className="invalido">❌ Al menos un carácter especial (!@#$%^&*)</li>
                        </ul>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Nueva Contraseña</label>
                        <input
                            type="password"
                            name="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Confirma tu Nueva Contraseña"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
                    </button>
                </form>
            )}
            <div className='return-link-container'>
                <Link to="/login" className='return-link-text'>Regresar a Inicio de Sesion</Link>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
