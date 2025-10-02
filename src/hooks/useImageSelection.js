// src/hooks/useImageSelection.js
// hook se encargará de gestionar el estado de las imágenes seleccionadas
//  y las funciones para agregarlas o eliminarlas.
import { useState } from 'react';

export const useImageSelection = () => {
    const [selectedImages, setSelectedImages] = useState([]);

    const onImageSelect = (id, isSelected) => {
        if (isSelected) {
            setSelectedImages((prev) => [...prev, id]);
        } else {
            setSelectedImages((prev) => prev.filter((imageId) => imageId !== id));
        }
    };
    
    // Función para resetear la selección
    const resetSelection = () => {
        setSelectedImages([]);
    };

    return { selectedImages, onImageSelect, resetSelection };
};