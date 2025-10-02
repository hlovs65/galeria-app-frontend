// src/hooks/useDownloadImages.js
// Este hook recibirá el arreglo de selectedImages como parámetro para saber qué descargar.
// Retornará la función handleDownload que se usará en el botón de descarga.
import { useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
export const useDownloadImages = (selectedImages, resetSelection) => {
    // Inicializa los estados necesarios
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async () => {

        console.log("Iniciando descarga de imágenes:", selectedImages);
        if (selectedImages.length === 0) {
            alert("Por favor, selecciona al menos una imagen para descargar.");
            return;
        }

        const API_URL_DOWNLOAD = `${API_BASE_URL}/api/download/images`;

        try {
            setIsLoading(true); // Indica que la descarga está en curso
            // Realiza la solicitud a la API para descargar las imágenes seleccionadas
            const response = await fetch(API_URL_DOWNLOAD, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageIds: selectedImages }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'mi-galeria-de-imagenes.zip';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                alert("Descarga iniciada.");
                if (resetSelection) {
                    resetSelection(); // Resetea la selección después de la descarga
                }
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            setError(error.message); // Actualiza el estado de error
            alert(`Error al descargar las imágenes: ${error.message}`);
            console.error("Error al descargar:", error);
        } finally {
            setIsLoading(false); // Indica que la descarga ha terminado
        }
    };

    return { handleDownload, isLoading, error };
};