// src/components/AdminSection.jsx
import React from "react";
import AddImageForm from "./AddImageForm.jsx";
import "./AdminSection.css";

const AdminSection = ({ onImageAdd }) => {
  return (
    <div className="admin-section">
      <h2>Administrar Imágenes</h2>
      <AddImageForm onImageAdd={onImageAdd} />
    </div>
  );
};

export default AdminSection;
