//src/components/GaleriaDeImagenes.jsx
import { useAuth } from '../hooks/useAuth.js'; // Para usar el boton de cerrar sesión
import { Outlet } from 'react-router-dom';
import './GaleriaDeImagenes.css';

const GaleriaDeImagenes = () => {
    const { user } = useAuth(); // Hook personalizado para manejar la autenticación

    const saludoNombre = user ? user.username : 'Invitado';


    return (
        <>
            <div className="gallery-header"
                style={{ padding: '20px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>¡Bienvenido a la Galería de Imágenes, {saludoNombre}!</h2>
                <p>Aquí puedes ver y gestionar tus imágenes.</p>
            </div>

            {/* Aquí se renderiza el contenido anidado de las rutas Gallery y ImageDetail */}
            <main className='gallery-content' style={{ padding: '20px' }}>
                <Outlet className="gallery-outlet" style={{ padding: '20px' }} />
            </main>
        </>
    );
};

export default GaleriaDeImagenes;