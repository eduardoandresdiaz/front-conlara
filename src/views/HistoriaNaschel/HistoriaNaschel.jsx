import React from "react";
import "./HistoriaNaschel.css";

function HistoriaNaschel() {
  return (
    <div className="historia-container">
      <h1>Historia de Naschel</h1>
      <p>Conocé el legado de nuestro pueblo a través de este video.</p>

      <a
        href="https://www.facebook.com/share/v/1BmXWzaZ6T/"
        target="_blank"
        rel="noopener noreferrer"
        className="historia-button"
      >
        Presentacion Historia de Naschel
      </a>

      {/* <a
        href="https://www.facebook.com/share/v/19CuF6fMTu/"
        target="_blank"
        rel="noopener noreferrer"
        className="historia-button"
      >
        El Origen del Mármol Ónix
      </a> */}
    </div>
  );
}

export default HistoriaNaschel;