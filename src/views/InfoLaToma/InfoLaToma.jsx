import React from "react";
import "./InfoLaToma.css";

const Info = () => {
  const lugares = [
    {
      nombre: "Policía de La Toma",
      telefonos: ["107", "+54 2664 582287", "+54 2664 582289"],
      direccion: "Av. Belgrano 150, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Policia+La+Toma+San+Luis",
    },
    {
      nombre: "Hospital de La Toma",
      telefonos: ["+54 2655 421248"],
      direccion: "Av. Libertador 250, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Hospital+La+Toma+San+Luis",
    },
    {
      nombre: "Cuartel de Bomberos",
      telefonos: ["+54 2664 440000", "+54 2664 440001"],
      direccion: "San Martín 300, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Bomberos+La+Toma+San+Luis",
    },
    {
      nombre: "Municipalidad de La Toma",
      telefonos: ["+54 2664 450000"],
      direccion: "Plaza Pringles s/n, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Municipalidad+La+Toma+San+Luis",
    },
    {
      nombre: "Terminal de Ómnibus",
      telefonos: ["+54 2664 460000"],
      direccion: "Ruta 2, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Terminal+La+Toma+San+Luis",
    },
  ];

  const normalizeTelHref = (tel) => tel.replace(/[^\d+]/g, "");

  return (
    <div className="infoUtil">
      <h1>ℹ️ Información Útil - La Toma</h1>

      <div className="centerLink">
        <a
          href="https://conlara.com.ar/Historia"
          target="_blank"
          rel="noopener noreferrer"
          className="btnHistoria"
        >
          📖 Historia de La Toma
        </a>
      </div>

      <ul className="lugaresList">
        {lugares.map((lugar, index) => (
          <li key={index} className="lugarItem">
            <h2 className="lugarNombre">{lugar.nombre}</h2>

            <div className="telefonoBlock">
              <strong>📞 Teléfono{lugar.telefonos.length > 1 ? "s" : ""}:</strong>
              <div className="telefonoColumn">
                {lugar.telefonos.map((tel, i) => (
                  <div key={i} className="telefonoFila">
                    <span className="telefonoLabel">Teléfono {i + 1}:</span>
                    <a
                      href={`tel:${normalizeTelHref(tel)}`}
                      className="telefonoLink"
                    >
                      {tel}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <p className="direccion">📍 Dirección: {lugar.direccion}</p>

            <p className="mapa">
              🌍{" "}
              <a href={lugar.mapa} target="_blank" rel="noopener noreferrer">
                Ver en mapa
              </a>
            </p>
          </li>
        ))}
      </ul>

      <div className="centerLink">
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
