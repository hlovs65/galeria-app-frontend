import './App.css'
import Gallery from './components/Gallery.jsx'
import Navbar from './components/Navbar.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import ImageDetail from './components/ImageDetail.jsx'
import React, { useState, useEffect } from 'react'
import AdminSection from './components/AdminSection.jsx'
import { useImageSelection } from './hooks/useImageSelection.js'
import { useDownloadImages } from './hooks/useDownloadImages.js'
import { API_BASE_URL } from './config/apiConfig.js'
import Loading from './components/Loading.jsx'
import GaleriaDeImagenes from './components/GaleriaDeImagenes.jsx'
import Register from './components/Register.jsx'
import { useAuth } from './hooks/useAuth.js' // Hook personalizado para manejar la autenticación
import Login from './components/login.jsx' // Componente de Login
import { ProtectedRoute, AuthRoute } from './components/RouteWrappers.jsx'
import ResendToken from './components/ResendToken.jsx'

function App() {
  // ----------------------------------------------------
  // 1. OBTENER ESTADO DE AUTENTICACIÓN
  // ----------------------------------------------------
  // RENOMBRAR isLoading del AuthProvider a isAuthLoading para evitar conflicto
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  // ----------------------------------------------------
  // 2. ESTADOS Y LÓGICA DE CARGA DE IMÁGENES (Se mantiene casi igual)
  // ----------------------------------------------------
  const [images, setImages] = useState([]); // El estado donde se guardarán las imágenes
  const [isLoadingImages, setIsLoadingImages] = useState(true); // Estado para saber si la aplicación está cargando
  const [error, setError] = useState(null); // Estado para manejar posibles errores

  //Hooks de selección y descarga de imágenes
  // Usa el hook useImageSelection para manejar la selección de imágenes
  const { selectedImages, onImageSelect, resetSelection } = useImageSelection();

  // Usa el hook useDownloadImages para manejar la descarga de imágenes
  const { handleDownload, isLoading: isDownloading, error: downloadError } = useDownloadImages(selectedImages, resetSelection);


  // La URL de la API 
  const API_URL = `${API_BASE_URL}/api/images`; // Endpoint para obtener las imágenes


  // Carga de imágenes al montar el componente (Publicamente accesible)
  useEffect(() => {
    // Usamos fetch() para hacer la solicitud a la API
    fetch(API_URL)  // Usamos la URL de la API que viene de App.jsx
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setImages(data); // Actualiza el estado con los datos
        setIsLoadingImages(false); // Deja de mostrar el estado de carga
      })
      .catch((err) => {
        setError(err.message); // Si hay un error, actualiza el estado de error
        setIsLoadingImages(false); // Deja de mostrar el estado de carga
      });
  }, [API_URL, setImages]); // Solo se ejecuta una vez al montar el componente

  // ----------------------------------------------------
  // Funciones para agregar, actualizar y eliminar imágenes. CRUD
  // ----------------------------------------------------

  // Función para agregar una nueva imagen
  const handleImageAdd = (newImage) => {
    setImages((prevImages) => [...prevImages, newImage]);
  };

  // Funciones para actualizar y eliminar imágenes
  const handleImageUpdate = (updatedImage) => {
    setImages((prevImages) => prevImages.map(image =>
      image.id === updatedImage.id ? updatedImage : image
    ));
  };

  const handleImageDelete = (deletedImageId) => {
    setImages((prevImages) => prevImages.filter(image => image.id !== deletedImageId));
  };

  // Estado combinado de carga: si cualquiera de los dos está cargando, mostramos el estado de carga
  const isLoading = isAuthLoading || isLoadingImages;

  // ----------------------------------------------------
  // 3. RENDERIZADO CONDICIONAL DE CARGA Y ERROR
  // ----------------------------------------------------
  // Prioridad 1: Mostrar carga mientras se verifica el JWT EN LOCALSTORAGE
  // Prioridad 2: Si el AuthProvider ya cargó, verifica el estado de carga de las imágenes.
  // Prioridad 3: Mostrar error si hubo un problema al obtener las imágenes

  // Prioridad 1:
  if (isAuthLoading) {
    return <Loading />;
  }

  // Prioridad 2:
  if (isLoading) {
    return <div className="loading-message">Cargando imágenes...</div>;
  }

  // Prioridad 3:
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }


  return (
    <>
      <div className="main-container">
        <header>
          <h1>Maravillas naturales de Mexico</h1>
        </header>

        {/* Pasamos el estado de login al Navbar para mostrar LOGIN/LOGOUT */}
        <Navbar isLoggedIn={isLoggedIn} />

        <main>
          <Routes>
            {/* RUTA PÚBLICA: INICIO / GALERÍA DE IMÁGENES */}
            {/* --------------------------------------------*/}
            {/* RUTAS PÚBLICAS PARA TODOS LOS USUARIOS */}
            {/* --------------------------------------------*/}
            <Route path='/' element={<GaleriaDeImagenes />} >

              {/* Las descargas (que están en Gallery) son públicas para el usuario registrado, 
              por lo que pasamos la función handleDownload y los estados relacionados */}
              <Route index element={<Gallery
                images={images}
                onImageSelect={onImageSelect}
                selectedImages={selectedImages}
                handleDownload={handleDownload} // Pasa la función handleDownload al componente Gallery
                isDownloading={isDownloading} // Pasa el estado de descarga
                downloadError={downloadError} /> // Pasa el estado de error de descarga
              } />

              {/* RUTA PROTEGIDA: DETALLE DE IMAGEN (ACTUALIZAR / ELIMINAR) */}
              <Route
                path='/image/:id'
                element={
                  <ProtectedRoute>
                    <ImageDetail
                      images={images}
                      onImageUpdate={handleImageUpdate}
                      onImageDelete={handleImageDelete}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* RUTA PUBLICA PERO CON REDIRECCION A LOGIN CON AUTHROUTE
            COMPONENTE DE ENVOLTORIO */}
            <Route path='/login' element={<AuthRoute><Login /></AuthRoute>} />


            {/* --------------------------------------------*/}
            {/* RUTAS PUBLICA: REGISTRO, REENVIO DE TOKEN*/}
            {/* --------------------------------------------*/}
            <Route path='/register' element={<Register />} />

            <Route path='resend_token' element={<ResendToken />} />

            {/* --------------------------------------------*/}
            {/* RUTAS PROTEGIDAS PARA USUARIOS LOGUEADOS */}
            {/* --------------------------------------------*/}

            {/* RUTA PROTEGIDA: SECCIÓN ADMIN (AGREGAR IMÁGENES) */}
            <Route
              path='/admin'
              element={
                <ProtectedRoute>
                  <AdminSection
                    onImageAdd={(handleImageAdd)}
                  />
                </ProtectedRoute>
              }
            />

            {/* --------------------------------------------*/}
            {/* RUTAS ESTATICAS */}
            {/* --------------------------------------------*/}
            <Route path='/about' element={
              <div>
                <h2>Acerca de</h2>
                <p>Esta aplicación muestra las maravillas naturales de México.</p>
              </div>
            } />
            <Route path='/contact' element={
              <div>
                <h2>Contacto</h2>
                <p>Puedes contactarnos en <a href="mailto:contacto@maravillas.com">contacto@maravillas.com</a>.</p>
              </div>
            } />

            {/* --------------------------------------------*/}
            {/* RUTA DE CAIDA (404 / cualquier otra) */}
            {/* --------------------------------------------*/}
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Maravillas naturales de Mexico. Todos los derechos reservados.</p>
        </footer>
      </div >
    </>
  )
}

export default App
