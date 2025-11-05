import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// ----------------------------------------------------
// Componente de Envoltura para RUTAS PROTEGIDAS
// ----------------------------------------------------
// Si NO está logueado, redirige a /login. 
// Si SÍ está logueado, renderiza el componente.
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Componente de Envoltura para RUTA PÚBLICA (Login)
// Si SÍ está logueado, redirige a /. 
// Si NO está logueado, renderiza el componente Login.
const AuthRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to="/" /> : children;
};

export { ProtectedRoute, AuthRoute };