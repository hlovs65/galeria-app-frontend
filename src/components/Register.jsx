// src/components/Register.jsx 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService.js'; // Importa la función de registro
import './Register.css'; // Asegúrate de tener los estilos adecuados

const Register = () => {
    // Estado para manejar los datos del formulario
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nombre, setNombre] = useState('');

    // Estado para mensajes de la API o errores por registro.php
    const [apiMessage, setApiMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Para desactivar el botón mientras se envía

    const navigate = useNavigate();

    // Funcion de envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiMessage(null);
        setIsSubmitting(true);

        if (password !== confirmPassword) {
            setApiMessage({ type: 'error', text: "Las contraseñas no coinciden" });
            return;
        }

        // PHP espera datos POST (application/x-www-form-urlencoded)
        const formData = new FormData();
        formData.append('username', username);
        formData.append('nombre', nombre);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirm-password', confirmPassword);


        {/** Llamada a la función de registro que esta en apiService.js */}
        try {
            const response = await registerUser(formData);
            setApiMessage({ type: 'success', text: response.message || "Registro exitoso" });
            setTimeout(() => {
                navigate('/login'); // Redirigir al login después del registro exitoso
            }, 3000);
        } catch (error) {
            setApiMessage({ type: 'error', text: error.message || "Error en el registro" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='register-container'>
            <h2>Registro de Usuario</h2>

            {/** Mensaje de la API */}
            {apiMessage && (
                <div className={`api-message ${apiMessage.type}`}>
                    {apiMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className='registration-form'>
                <div className='form-group'>
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingresa tu Nombre de Usuario"
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="nombre">Nombre Completo</label>
                    <input
                        type="text"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ingresa tu Nombre Completo"
                        required
                    />
                </div>
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
                <div className='form-group'>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu Contraseña"
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        type="password"
                        name="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu Contraseña"
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </div>
    );
};

export default Register;
