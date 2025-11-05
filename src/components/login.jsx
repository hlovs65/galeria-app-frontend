// src/components/Login.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useSearchParams } from 'react-router-dom';

const Login = () => {
    // 1. Estado local para los inouts del formulario
    const [identificador, setIdentificador] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2.- Obtener la funcion de login del contexto
    const { login } = useAuth();

    // 3.- Manejar parámetros de búsqueda para mensajes
    const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito
    const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');
    useEffect(() => {
        if (status === 'verified') {
            setSuccessMessage('Registro exitoso. Por favor, inicia sesión.');
        } else if (status === 'invalid_token') {
            setErrorMessage('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        } else if (status === 'missing_token') {
            setErrorMessage('Token faltante. Por favor, inicia sesión de nuevo.');
        } else if (status === 'update_error') {
            setErrorMessage('Error al actualizar la información. Por favor, intenta de nuevo.');
        } else if (status === 'logged_out') {
            setSuccessMessage('Has cerrado la sesion exitosamente.')
        } else if (status === 'logout_failed') {
            setErrorMessage('Ocurrio un error al intentar cerrar la sesion. Intenta de nuevo.')
        } else if (status === 'session_expired') {
            setErrorMessage('Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.')
        }
    }, [status]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null); // Limpiar errores previos

        if (!identificador || !contrasena) {
            setError('El nombre de usuario o correo electronico y la contraseña son obligatorios.');
            setIsSubmitting(false);
            return;
        }
        // 4.- Llamar a la función de login del contexto
        const credentials = await login({ identificador, contraseña: contrasena });

        setIsSubmitting(false);

        if (credentials.success) {
            // Inicio de sesión exitoso, puedes redirigir o mostrar un mensaje
            console.log('Inicio de sesión exitoso:', credentials.message);
        } else {
            setError(credentials.message || 'Credenciales inválidas. Por favor, intenta de nuevo.');
        }
    };

    return (
        <div className="login-container">
            <div className="messages">
                {successMessage && <p className="success-message" style={{color: 'green', border: '1px solid green', padding: '10px'}}>{successMessage}</p>}
                {errorMessage && <p className="error-message" style={{color: 'red', border: '1px solid red', padding: '10px'}}>{errorMessage}</p>}
            </div>
            <h2>Iniciar Sesión en Galería</h2>
            <form onSubmit={handleSubmit} className='form-group'>
                <div className='form-group'>
                    <label htmlFor="identificador">Nombre de usuario o correo electrónico:</label>
                    <input
                        type="text"
                        id="identificador"
                        value={identificador}
                        onChange={(e) => setIdentificador(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="contrasena">Contraseña:</label>
                    <input
                        type="password"
                        id="contrasena"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                {error && <p className="error-message" style={{color: 'red', border: '1px solid red', padding: '10px'}}>{error}</p>}
                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
            </form>
            <div className="register-link">
                <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
            </div>
        </div>
    );
};

export default Login;