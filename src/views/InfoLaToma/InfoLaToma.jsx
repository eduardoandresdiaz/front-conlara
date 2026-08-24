import React, { useMemo } from "react";
import "./InfoLaToma.css";

/* Información de las farmacias: nombre, dirección, teléfono, coordenadas y enlace a mapa */
const farmaciasInfo = {
  A: {
    clave: "A",
    nombre: "Farmacia Santa Rita",
    direccion: "Av. Libertador 250, La Toma, San Luis",
    telefonos: ["+54 2664 500111"],
    lat: -33.000000,
    lng: -66.000000,
    mapa: "https://maps.google.com/?q=Farmacia+Santa+Rita+La+Toma+San+Luis",
  },
  B: {
    clave: "B",
    nombre: "Farmacia San Francisco",
    direccion: "Calle 9 de Julio 45, La Toma, San Luis",
    telefonos: ["+54 2664 500222"],
    lat: -33.001000,
    lng: -66.001000,
    mapa: "https://maps.google.com/?q=Farmacia+San+Francisco+La+Toma+San+Luis",
  },
  C: {
    clave: "C",
    nombre: "Farmacia San Diego",
    direccion: "25 de Mayo 10, La Toma, San Luis",
    telefonos: ["+54 2664 500333"],
    lat: -33.002000,
    lng: -66.002000,
    mapa: "https://maps.google.com/?q=Farmacia+San+Diego+La+Toma+San+Luis",
  },
};

/* Tabla CSV copiada del documento */
const tablaCSV = `
DIA,ENERO,FEBRERO,MARZO,ABRIL,MAYO,JUNIO,JULIO,AGOSTO,SETIEMBRE,OCTUBRE,NOVIEMBRE,DICIEMBRE
1,A,B,C,A,A,B,B,C,A,A,A,B
2,B,C,A,B,B,C,C,C,B,B,C,C
3,C,A,B,C,B,A,A,B,C,C,A,A
4,A,B,C,A,A,B,B,C,A,C,B,B
5,B,C,A,A,B,C,B,A,B,B,C,C
6,C,A+,B,C,C,A,A,B,B,C,A,C
7,A,B,C,A,A,A,B,C,A,A,B,B
8,B,C,C,B,B,C,C,A,B,B,B,C
9,C,A+,B,C,C,A,A,A,C,C,A,A
10,A,B,C,A,C,B,B,C,A,A,B,B
11,B,C,A,B,B,C,C,A,B,A,C,C
12,C+,A*,B,B,C,A,C,B,C,C,A,A
13,A,B,C,A,A,B,B,C,C,A,B,A
14,B,C,A,B,B,B,C,A,B,B,C,C
15,C+,A+,A,C,C,A,A,B,C,C,C,A
16,A,B,C,A,A,B,B,B,A,A,B,B
17,B,C,A,B,A,C,C,A,B,B,C,C
18,C+,A+,B,C,C,A,A,B,C,B,A,A
19,A,B,C,C,A,B,A,C,A,A,B,B
20,B,C,A,B,B,C,C,A,A,B,C,B
21,C+,A+,B,C,C,C,A,B,C,C,A,A
22,A,B,B,A,A,B,B,C,A,A,A,B
23,B,C,A,B,B,C,C,C,B,B,C,C
24,C+,A*,B,C,B,A,A,B,C,C,A,A
25,A,B,C,A,A,B,B,C,A,C,B,B
26,B,C,A,A,B,C,B,A,B,B,C,C
27,C,A+,B,C,C,A,A,B,B,C,A,C
28,A,B,C,A,A,A,B,C,A,A,B,B
29,B,-,C,B,B,C,C,A,B,B,B,C
30,C,-,B,C,C,A,A,A,C,C,A,A
31,A,-,C,-,C,-,B,C,-,A,-,B
`;

/* Normaliza nombre de mes */
const normalizeMonth = (m) => m.trim().toLowerCase();

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
    return { clave: null, nombre: "No disponible", nota: null, direccion: null, mapa: null, telefonos: [] };
  }

  const letra = turnoRaw.match(/[ABC]/)?.[0] ?? null;
  if (!letra) return { clave: null, nombre: "No disponible", nota: null, direccion: null, mapa: null, telefonos: [] };

  const isCstar = /C\*/.test(turnoRaw);
  const isAplus = /A\+/.test(turnoRaw);
  const isAstar = /A\*/.test(turnoRaw);

  if (isCstar) {
    const info = farmaciasInfo["A"];
    return {
      clave: "A",
      nombre: info.nombre,
      nota: "Turno original C* (San Diego cerrado); cubre Farmacia Santa Rita",
      direccion: info.direccion,
      mapa: info.mapa,
      telefonos: info.telefonos,
    };
  }
  if (isAplus) {
    const info = farmaciasInfo["C"];
    return {
      clave: "C",
      nombre: info.nombre,
      nota: "Turno original A+ (Santa Rita cerrado); cubre Farmacia San Diego",
      direccion: info.direccion,
      mapa: info.mapa,
      telefonos: info.telefonos,
    };
  }
  if (isAstar) {
    const info = farmaciasInfo["B"];
    return {
      clave: "B",
      nombre: info.nombre,
      nota: "Turno original A*; cubre Farmacia San Francisco",
      direccion: info.direccion,
      mapa: info.mapa,
      telefonos: info.telefonos,
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

const Info = () => {
  const turnos = useMemo(() => parseTablaCSV(tablaCSV), []);

  const hoy = new Date();
  const diaHoy = hoy.getDate();
  const mesHoy = hoy.toLocaleString("es-ES", { month: "long" }).toLowerCase();

  const turnoRawHoy = turnos[mesHoy]?.[diaHoy] ?? null;
  const farmaciaHoy = resolverFarmacia(turnoRawHoy);

  const lugares = [
    {
      nombre: "Policía de La Toma",
      telefonos: ["911", "2664 582287", "2664 582289"],
      direccion: "Av. Belgrano 150, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Policia+La+Toma+San+Luis",
    },
    {
      nombre: "Hospital de La Toma",
      telefonos: ["107","2655 421248"],
      direccion: "Av. Libertador 250, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Hospital+La+Toma+San+Luis",
    },
    {
      nombre: "Cuartel de Bomberos",
      telefonos: ["100","2655 421021"],
      direccion: "Sarmiento y San Martin, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Bomberos+La+Toma+San+Luis",
    },
    {
      nombre: "Municipalidad de La Toma",
      telefonos: ["2655 421530"],
      direccion: " Av. Belgrano y Rivadavia, La Toma, San Luis",
      mapa: "https://maps.google.com/?q=Municipalidad+La+Toma+San+Luis",
    },
    {
      nombre: "Terminal de Ómnibus",
      telefonos: ["2664 460000"],
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
