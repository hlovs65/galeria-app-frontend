// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul className="botton-nav-container">
        <li>
          <Link to="/" className="nav-button">
            <i className="material-icons">home</i>
            <span>Inicio</span>
          </Link>
        </li>
        <li>
          <Link to="/admin" className="nav-button">
            <i className="material-icons">admin_panel_settings</i>
            <span>Admin</span>
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-button">
            <i className="material-icons">info</i>
            <span>Acerca de</span>
          </Link>
        </li>
        <li>
          <Link to="/contact" className="nav-button">
            <i className="material-icons">contact_mail</i>
            <span>Contacto</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
