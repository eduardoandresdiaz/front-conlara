import React from "react";
import "./InfoLaToma.css"; // Importa el CSS para estilos

const Info = () => {
  const lugares = [
    {
      nombre: "Policía de La Toma",
      telefono: "+54 2664 582287",
      direccion: "Av. Belgrano 150, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Policia+La+Toma+San+Luis",
    },
    {
      nombre: "Hospital de La Toma",
      telefono: "+54 2655 421248",
      direccion: "Av. Libertador 250, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Hospital+La+Toma+San+Luis",
    },
    {
      nombre: "Cuartel de Bomberos",
      telefono: "+54 2664 440000",
      direccion: "San Martín 300, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Bomberos+La+Toma+San+Luis",
    },
    {
      nombre: "Municipalidad de La Toma",
      telefono: "+54 2664 450000",
      direccion: "Plaza Pringles s/n, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Municipalidad+La+Toma+San+Luis",
    },
    {
      nombre: "Terminal de Ómnibus",
      telefono: "+54 2664 460000",
      direccion: "Ruta 2, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Terminal+La+Toma+San+Luis",
    },
  ];

  return (
    <div className="infoUtil">
      <h1>ℹ️ Información Útil - La Toma</h1>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <a
          href="https://conlara.com.ar/Historia"
          target="_blank"
          rel="noopener noreferrer"
          className="btnHistoria"
        >
          📖 Historia de La Toma
        </a>
      </div>
      <ul>
        {lugares.map((lugar, index) => (
          <li key={index} style={{ marginBottom: "15px" }}>
            <h2>{lugar.nombre}</h2>
            <p>
              📞 Teléfono:{" "}
              <a href={`tel:${lugar.telefono}`}>{lugar.telefono}</a>
            </p>
            <p>📍 Dirección: {lugar.direccion}</p>
            <p>
              🌍{" "}
              <a href={lugar.mapa} target="_blank" rel="noopener noreferrer">
                Ver en mapa
              </a>
            </p>
          </li>
        ))}
      </ul>

      {/* Botón de historia */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <a
          href="https://conlara.com.ar/Historia"
          target="_blank"
          rel="noopener noreferrer"
          className="btnHistoria"
        >
          📖 Historia de La Toma
        </a>
      </div>
    </div>
  );
};

export default Info;
