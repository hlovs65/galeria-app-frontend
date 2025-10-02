import React, { useState } from "react";
import "./AddImageForm.css";
import { API_BASE_URL } from "../config/apiConfig.js";

const AddImageForm = ({ onImageAdd }) => {
  // Estado para almacenar la imagen seleccionada
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Preparar los datos con FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", imageFile); // 'image' debe coincidir con el nombre del campo en el backend

    const API_URL = `${API_BASE_URL}/api/images`; // Endpoint para obtener las imágenes


    try {
      // 2. Enviar la solicitud POST al backend
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const addedImage = await response.json();
        if (response.status === 201) { // Verifica si la imagen fue creada exitosamente
          // 3. Actualizar el estado en el componente padre
          onImageAdd(addedImage);
          setTitle("");
          setDescription("");
          setImageFile(null);
          alert("Imagen agregada exitosamente");
        } else {
          alert("Imagen duplicada. No se agregará a la galería."); // Para depuración
        }
      } else {
        alert("Error al agregar la imagen, intente nuevamente");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red al agregar la imagen");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-image-form">
      <h3>Agregar Nueva Imagen</h3>
      <div className="form-group">
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Descripción:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Archivo de Imagen:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
      </div>
      <button type="submit">Agregar Imagen</button>
    </form>
  );
};

export default AddImageForm;
