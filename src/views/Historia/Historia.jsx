import React from "react";
import "./Historia.css"; // Importa el CSS

function Historia() {
  return (
    <div className="historia-container">
      <h1>Historia de La Toma</h1>
      <p>Conocé el legado de nuestro pueblo a través de este video.</p>
      <a
        href="https://www.facebook.com/share/v/1BmXWzaZ6T/"
        target="_blank"
        rel="noopener noreferrer"
        className="historia-button"
      >
        Ver video Capitulo 1 "Los Cesares" La llegada de los Españoles
      </a>
      <a
        href="https://www.facebook.com/share/v/19LXhJBsJ3/"
        target="_blank"
        rel="noopener noreferrer"
        className="historia-button"
      >
        El Origen del Marmol Onix
      </a>
      
      
    </div>
  );
}

export default Historia;
