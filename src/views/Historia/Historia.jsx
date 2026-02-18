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
        Ver video
      </a>
      
    </div>
  );
}

export default Historia;
