import './App.css'
import Gallery from './components/Gallery.jsx'
import Navbar from './components/Navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import ImageDetail from './components/ImageDetail.jsx'
import React, { useState, useEffect } from 'react'
import AdminSection from './components/AdminSection.jsx'
import { useImageSelection } from './hooks/useImageSelection.js'
import { useDownloadImages } from './hooks/useDownloadImages.js'
import { API_BASE_URL } from './config/apiConfig.js'

function App() {
  // 1. Define los estados de la aplicación
  const [images, setImages] = useState([]); // El estado donde se guardarán las imágenes
  const [isLoading, setIsLoading] = useState(true); // Estado para saber si la aplicación está cargando

  // 2. Usa el hook useImageSelection para manejar la selección de imágenes
  const { selectedImages, onImageSelect, resetSelection } = useImageSelection();

  // 3. Usa el hook useDownloadImages para manejar la descarga de imágenes
  const { handleDownload, isLoading: isDownloading, error: downloadError } = useDownloadImages(selectedImages, resetSelection);

  const [error, setError] = useState(null); // Estado para manejar posibles errores

  // La URL de la API 
  const API_URL = `${API_BASE_URL}/api/images`; // Endpoint para obtener las imágenes


  // 2. Usa useEffect para realizar la llamada a la API
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
        setIsLoading(false); // Deja de mostrar el estado de carga
      })
      .catch((err) => {
        setError(err.message); // Si hay un error, actualiza el estado de error
        setIsLoading(false); // Deja de mostrar el estado de carga
      });
  }, [API_URL, setImages]); // Solo se ejecuta una vez al montar el componente

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

  // 3. Renderizado Condicional: Muestra diferentes cosas según el estado
  if (isLoading) {
    return <div className="loading-message">Cargando imágenes...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <>
      <div className="main-container">
        <header>
          <h1>Maravillas naturales de Mexico</h1>
        </header>

        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Gallery
              images={images}
              onImageSelect={onImageSelect}
              selectedImages={selectedImages}
              handleDownload={handleDownload} // Pasa la función handleDownload al componente Gallery
              isDownloading={isDownloading} // Pasa el estado de descarga
              downloadError={downloadError} /> // Pasa el estado de error de descarga
            } />
            <Route path='/admin' element={<AdminSection onImageAdd={(handleImageAdd)} />} />
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
            <Route path='/image/:id' element={<ImageDetail
              images={images}
              onImageUpdate={handleImageUpdate}
              onImageDelete={handleImageDelete}
            />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Maravillas naturales de Mexico. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  )
}

export default App
