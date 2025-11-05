// src/components/ImageDetail.jsx
import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import imageDatos from "../imageDatos.js"; //importa los datos
import './ImageDetail.css'
import { API_BASE_URL } from "../config/apiConfig.js";
import { useAuth } from "../hooks/useAuth.js"; // Para usar el boton de cerrar sesión

function ImageDetail({ images, onImageUpdate, onImageDelete }) { // Recibe las imágenes como prop

  // 1. Usa useParams para obtener el ID de la imagen desde la URL
  const { id } = useParams();  // Obtiene el parámetro de la ruta
  const navigate = useNavigate(); // Hook para navegar programáticamente
  const { user } = useAuth(); // Hook para obtener información del usuario
  const puedeGestionar = user && user.role === 'admin'; // Verifica si el usuario tiene rol de admin

  const image = images.find((img) => img.id === parseInt(id)); // Busca la imagen correspondiente

  // 2. Nuevos estados para manejar la edición
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(image?.title || "");
  const [editedDescription, setEditedDescription] = useState(image?.description || "");

  const API_URL = `${API_BASE_URL}/api/images/${image.id}`; // Endpoint para obtener las imágenes


  // Verifica si no se encontró la imagen
  if (!image) {
    return <div>Imagen no encontrada</div>;
  }

  // Función para manejar el clic en el botón de volver
  const handleGoBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  // Funcion para manejar la actualización de (metodo PUT)
  const handleUpdateImage = async (e) => {
    e.preventDefault();
    const updatedData = {
      title: editedTitle,
      description: editedDescription
    };

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const result = await response.json();
        onImageUpdate(result); // Llama a la función pasada por props para actualizar la imagen en App.jsx
        setIsEditing(false); // Ocultar el formulario de edición
        alert('Imagen actualizada con éxito');
      } else {
        alert('Error al actualizar la imagen');
        console.error('Error al actualizar la imagen');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de red al actualizar la imagen');
    }
  };

  // Función para manejar la eliminación de la imagen (metodo DELETE)
  const handleDeleteImage = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta imagen?");
    if (confirmDelete) {
      try {
        const response = await fetch(API_URL, {
          method: 'DELETE',
        });

        if (response.ok) {
          onImageDelete(image.id); // Eliminar la imagen del estado en App.jsx
          navigate('/'); // Redirigir a la galería principal
          alert("Imagen eliminada exitosamente.");
        } else {
          alert("Error al eliminar la imagen.");
        }
      } catch (error) {
        console.error("Error de red:", error);
        alert("Error de red al eliminar la imagen.");
      }
    }
  };


  // Renderiza los detalles de la tarjeta si la encontró
  return (
    <div className="image-detail-container">
      <img src={`${API_BASE_URL}${image.imageUrl}`} alt={image.title} className="image-detail" />
      {isEditing ? (
        <form onSubmit={handleUpdateImage} className="add-image-form">
          <div className="form-group">
            <label className="form-label">Título:</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Nuevo título"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción:</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Nueva descripción"
              required
            />
          </div>
          {puedeGestionar && (
            <section className="button-group">
              <button type="submit">Guardar cambios</button>
              <button onClick={() => setIsEditing(false)}>Cancelar</button>
            </section>
          )}
        </form>
      ) : (
        <div>
          <h2>{image.title}</h2>
          <p>{image.description}</p>
          {puedeGestionar && (
            <section className="button-group">
              <button onClick={() => setIsEditing(true)} className="edit-button">Editar</button>
              <button onClick={handleDeleteImage} className="delete-button">Eliminar</button>
            </section>
          )}
        </div>
      )}
      <div>
        <button onClick={handleGoBack} className="go-back-button">Volver a inicio</button>

      </div>
    </div>
  );
}

export default ImageDetail;
