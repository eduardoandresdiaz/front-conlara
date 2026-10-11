import React, { useMemo } from "react";
import "./InfoNaschel.css";
import { useNavigate } from "react-router-dom";


/* Información de las farmacias: nombre, dirección, teléfono, coordenadas y enlace a mapa */

const farmaciasInfo = {
  A: {
    clave: "A",
    nombre: "Farmacia Del Pueblo S.C.",
    direccion: "Pedernera y Rivadavia S/N, Naschel, San Luis",
    telefonos: ["2664548697"],
    lat: null,
    lng: null,
    mapa:
      "https://maps.google.com/?q=Farmacia+Del+Pueblo+Naschel+San+Luis",
  },

  B: {
    clave: "B",
    nombre: "Farmacia Rotte",
    direccion: "Pringles 466, Naschel, San Luis",
    telefonos: ["2656491089"],
    lat: null,
    lng: null,
    mapa:
      "https://maps.google.com/?q=Farmacia+Rotte+Naschel+San+Luis",
  },

  C: {
    clave: "C",
    nombre: "Farmacia San Miguel Arcángel",
    direccion: "San Martín 501, Naschel, San Luis",
    telefonos: ["2656491569"],
    lat: null,
    lng: null,
    mapa:
      "https://maps.google.com/?q=Farmacia+San+Miguel+Arcangel+Naschel+San+Luis",
  },
};

/* Tabla CSV copiada del documento */
const tablaCSV = `
DIA,ENERO,FEBRERO,MARZO,ABRIL,MAYO,JUNIO,JULIO,AGOSTO,SETIEMBRE,OCTUBRE,NOVIEMBRE,DICIEMBRE
1,C,A,B,A,B,C,B,C,B,C,A,A
2,C,A,B,A,B,A,B,C,B,C,A,A
3,C,B,C,A,B,A,B,C,B,C,B,A
4,C,B,C,A,B,A,B,A,B,C,B,A
5,C,B,C,A,C,A,B,A,B,C,B,A
6,A,B,C,A,C,A,B,A,B,A,B,A
7,A,B,C,B,C,A,C,A,B,A,B,A
8,A,B,C,B,C,A,C,A,C,A,B,B
9,A,B,C,B,C,B,C,A,C,A,B,B
10,A,C,A,B,C,B,C,A,C,A,C,B
11,A,C,A,B,C,B,C,B,C,A,C,B
12,A,C,A,B,A,B,C,B,C,A,C,B
13,B,C,A,B,A,B,C,B,C,B,C,B
14,B,C,A,C,A,B,A,B,C,B,C,B
15,B,C,A,C,A,B,A,B,A,B,C,C
16,B,C,A,C,A,C,A,B,A,B,C,C
17,B,A,B,C,A,C,A,B,A,B,A,C
18,B,A,B,C,A,C,A,C,A,B,A,C
19,B,A,B,C,B,C,A,C,A,B,A,C
20,C,A,B,C,B,C,A,C,A,C,A,C
21,C,A,B,A,B,C,B,C,A,C,A,C
22,C,A,B,A,B,C,B,C,B,C,A,A
23,C,A,B,A,B,A,B,C,B,C,A,A
24,C,B,C,A,B,A,B,C,B,C,B,A
25,C,B,C,A,B,A,B,A,B,C,B,A
26,C,B,C,A,C,A,B,A,B,C,B,A
27,A,B,C,A,C,A,B,A,B,A,B,A
28,A,B,C,B,C,A,C,A,B,A,B,A
29,A,-,C,B,C,A,C,A,C,A,B,B
30,A,-,C,B,C,B,C,A,C,A,B,B
31,A,-,A,-,C,-,C,A,-,A,-,B
`;

/* Normaliza nombre de mes */
const normalizeMonth = (m) =>
  m
    .trim()
    .toLowerCase()
    .replace("septiembre", "setiembre");

/* Parser CSV -> objeto turnos */
function parseTablaCSV(csv) {
  const lines = csv.trim().split("\n").map((l) => l.trim());
  if (lines.length < 2) return {};

  const headers = lines[0].split(",").map((h) => h.trim());
  const months = headers.slice(1).map((h) => normalizeMonth(h));

  const result = {};
  months.forEach((m) => (result[m] = {}));

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const diaStr = cols[0];
    const dia = parseInt(diaStr, 10);
    if (isNaN(dia)) continue;

    for (let j = 1; j < cols.length; j++) {
      const mes = months[j - 1];
      const val = cols[j] || "-";
      result[mes][dia] = val;
    }
  }

  return result;
}

/* Resuelve farmacia efectiva aplicando reglas especiales y devolviendo direccion y mapa */
function resolverFarmacia(turnoRaw) {
  if (!turnoRaw || turnoRaw === "-") {
    return {
      clave: null,
      nombre: "No disponible",
      nota: null,
      direccion: null,
      mapa: null,
      telefonos: [],
    };
  }

  const letra = turnoRaw.charAt(0);

  if (!letra) {
    return {
      clave: null,
      nombre: "No disponible",
      nota: null,
      direccion: null,
      mapa: null,
      telefonos: [],
    };
  }

  const info = farmaciasInfo[letra];

  return {
    clave: letra,
    nombre: info?.nombre ?? "No disponible",
    nota: null,
    direccion: info?.direccion ?? null,
    mapa: info?.mapa ?? null,
    telefonos: info?.telefonos ?? [],
  };
}
///////////////////////////////////////////////////////////////////////////////////////////

const Info = () => {
  const navigate = useNavigate();
  const turnos = useMemo(() => parseTablaCSV(tablaCSV), []);

  const hoy = new Date();
  const diaHoy = hoy.getDate();
  const mesHoy = normalizeMonth(
    hoy.toLocaleString("es-ES", {
      month: "long",
    })
  );

  const turnoRawHoy = turnos[mesHoy]?.[diaHoy] ?? null;
  const farmaciaHoy = resolverFarmacia(turnoRawHoy);
//////////////////////////////////////////////
const lugares = [
  {
    nombre: "Policía de Naschel",
    telefonos: ["911", "2656 491024"],
    direccion: "Naschel, San Luis",
    mapa:
      "https://maps.google.com/?q=Policia+Naschel+San+Luis",
  },

  {
    nombre: "Hospital de Naschel",
    telefonos: ["107"],
    direccion: "Naschel, San Luis",
    mapa:
      "https://maps.google.com/?q=Hospital+Naschel+San+Luis",
  },

  {
    nombre: "Cuartel de Bomberos de Naschel",
    telefonos: ["100"],
    direccion: "Naschel, San Luis",
    mapa:
      "https://maps.google.com/?q=Bomberos+Naschel+San+Luis",
  },

  {
    nombre: "Municipalidad de Naschel",
    telefonos: ["2656 491025"],
    direccion: "Av. Belgrano 498, Naschel, San Luis",
    mapa:
      "https://maps.google.com/?q=Municipalidad+de+Naschel+San+Luis",
  },

  {
    nombre: "Terminal de Ómnibus de Naschel",
    telefonos: [],
    direccion: "Naschel, San Luis",
    mapa:
      "https://maps.google.com/?q=Terminal+de+Omnibus+Naschel+San+Luis",
  },
];
  /////////////////////////////////////////////////////////////////////////////

  const normalizeTelHref = (tel) => tel.replace(/[^\d+]/g, "");

  return (
    <div className="infoUtil">
      <h1>ℹ️ Información Útil - Naschel</h1>


      <div className="centerLink">
      <button
  type="button"
  onClick={() => navigate("/HistoriaNaschel")}
  className="btnHistoria"
>
  📖 Historia de Naschel
</button>
      </div>
      <div className="preciosAgro">
  <h2>🌾 Precios de Granos</h2>

  <div className="preciosGrid">
  <div className="precioCard">
  <h3>🌽 Maíz</h3>
  <p>$294.800/t</p>
</div>

<div className="precioCard">
  <h3>🫘 Soja</h3>
  <p>$560.000/t</p>
</div>

<div className="precioCard">
  <h3>🌻 Girasol</h3>
  <p>$611.419/t</p>
</div>
  </div>
</div>
      <div className="farmaciaTurno">
        <h2>💊 Farmacia de turno hoy</h2>

        {farmaciaHoy.clave ? (
          <>
            <p><strong>{farmaciaHoy.nombre}</strong></p>

            <p><strong>📍 Dirección:</strong> {farmaciaHoy.direccion}</p>

            <p>
              <strong>📞 Teléfono:</strong>{" "}
              {farmaciaHoy.telefonos.map((t, i) => (
                <a key={i} href={`tel:${normalizeTelHref(t)}`} className="telefonoLink">
                  {t}{i < farmaciaHoy.telefonos.length - 1 ? " · " : ""}
                </a>
              ))}
            </p>

            <p>
              <strong>🌐 Mapa:</strong>{" "}
              <a href={farmaciaHoy.mapa} target="_blank" rel="noopener noreferrer">
                Ver en Google Maps
              </a>
            </p>

            {farmaciaHoy.nota && <p className="notaTurno">📌 {farmaciaHoy.nota}</p>}

            <p className="fechaTurno">📅 {diaHoy} de {mesHoy}</p>
          </>
        ) : (
          <p>No hay farmacia de turno registrada para hoy.</p>
        )}
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
                Como LLegar
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Info;
