// src/components/imageUtils.js

/** 
 * Logica de búsqueda: Filtra las imágenes según el término de búsqueda
 * Si se cumple alguna de las condiciones, la imagen se incluye en el resultado filtrado.
 * Si no se cumple ninguna condición, no se incluye en el resultado.
 * Si el término de búsqueda está vacío, todas las imágenes se incluyen.
 * @param {Array} images - El array original de imágenes.
 * @param {string} searchTerm - El término de búsqueda del usuario.
 * @returns {Array} Un nuevo array con las imágenes filtradas.
 */
  export const filterImages = (images, searchTerm) => {
    if (!Array.isArray(images)) return []; // Verifica que 'images' sea un array
    if (!searchTerm) return images; // Si el término de búsqueda está vacío, devuelve todas las imágenes.

    const normalizedSearchTerm = searchTerm.toLowerCase();

    return images.filter((image) => {
      const titleMatch = image.title.toLowerCase().includes(normalizedSearchTerm);
      const descriptionMatch = image.description.toLowerCase().includes(normalizedSearchTerm);
      return titleMatch || descriptionMatch;
    });
};