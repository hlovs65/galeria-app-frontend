// src/components/Gallery.jsx
import "./Gallery.css"
import React, { useState } from "react";
//import imageDatos from "../imageDatos.js"; // Ya no necesitamos importar los datos aquí
import { Link } from "react-router-dom";
import { filterImages } from "./imageUtils.js";
import { API_BASE_URL } from "../config/apiConfig.js"; // Importa la URL base de la API

// Componente Gallery que recibe las imágenes y las funciones del hook como props
const Gallery = ({
  images,
  onImageSelect,
  selectedImages,
  handleDownload,
  isDownloading,
  downloadError
}) => {  // Recibe las imágenes como prop, y las funciones del hook
  // 1. Define los estados de la aplicación
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el término de búsqueda

  // 2. Logica de búsqueda: Filtra las imágenes según el término de búsqueda
  const filteredImages = filterImages(images, searchQuery);

  // 3. Renderiza la galería de imágenes filtradas
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar imágenes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search-input"
        />
      </div>

      <div className="download-container">
        <button
          onClick={handleDownload}
          disabled={isDownloading || selectedImages.length === 0}
          style={{
            cursor: isDownloading || selectedImages.length === 0 ? 'not-allowed' : 'pointer',
            backgroundColor: isDownloading || selectedImages.length === 0 ? '#ccc' : '#007bff',
            color: isDownloading || selectedImages.length === 0 ? '#666' : '#fff'
          }}
        >
          {isDownloading
            ? "Compromiendo y Descargando..."
            : `Descargar Imágenes Seleccionadas (${selectedImages.length})`
          }
        </button>
      </div>

      {downloadError && (
        <div
          className="error-message"
          style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '10px 0' }}
        >
          Error al descargar las imágenes: {downloadError}
        </div>
      )}

      <div className="gallery-container">
        {filteredImages && filteredImages.length > 0 ? (  // Verifica que haya imágenes filtradas
          filteredImages.map((image) => ( // Mapea sobre la variable de estado
            <div key={image.id} className="gallery-item">
              <input
                type="checkbox"
                className="select-checkbox"
                checked={selectedImages.includes(image.id)}
                onChange={(e) => onImageSelect(image.id, e.target.checked)}
                id={`select-${image.id}`}
                name={`select-${image.id}`}
              />
              <Link to={`/image/${image.id}`}>
                <img src={`${API_BASE_URL}${image.imageUrl}`} alt={image.title} />
                <h2>{image.title}</h2>
                <p>{image.description}</p>
              </Link>
            </div>
          ))
        ) : (
          <div className="no-results-message">No se encontraron imágenes que coincidan con tu búsqueda.</div>
        )}
      </div>
    </>
  );
};

export default Gallery;
