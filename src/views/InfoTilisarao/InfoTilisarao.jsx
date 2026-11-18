import { useEffect, useState } from "react";
import { cargarPreciosGranos } from "../../helpers/grainQuotes.js";
import "./InfoTilisarao.css";

const farmacias = [
  {
    nombre: "Farmacia Norte",
    telefonos: ["2656 42-0349"],
    mapa: "https://maps.google.com/?q=Farmacia+Norte+Tilisarao+San+Luis",
  },
  {
    nombre: "Farmacia Cordero",
    telefonos: ["2656 42-1485"],
    mapa: "https://maps.google.com/?q=Farmacia+Cordero+Tilisarao+San+Luis",
  },
  {
    nombre: "Farmacia Señor de Renca",
    telefonos: ["2656 42-2150"],
    mapa: "https://maps.google.com/?q=Farmacia+Señor+de+Renca+Tilisarao+San+Luis",
  },
  {
    nombre: "Farmacia Santa Ana",
    telefonos: ["2656 42-0157"],
    mapa: "https://maps.google.com/?q=Farmacia+Santa+Ana+Tilisarao+San+Luis",
  },
  {
    nombre: "Farmacia Farmanueva",
    telefonos: [],
    mapa: "https://maps.google.com/?q=Farmacia+Farmanueva+Tilisarao+San+Luis",
  },
];

const DURACION_TURNO = 7 * 24 * 60 * 60 * 1000;
const INICIO_CAMBIO_TURNOS = new Date(2026, 0, 6, 8);

function obtenerFarmaciaDeTurno(fecha) {
  if (fecha.getFullYear() !== 2026) return null;

  const primerTurno = new Date(2026, 0, 1);
  let indice = 0;

  if (fecha >= INICIO_CAMBIO_TURNOS) {
    const semanasDesdeElCambio = Math.floor(
      (fecha - INICIO_CAMBIO_TURNOS) / DURACION_TURNO
    );
    indice = (semanasDesdeElCambio + 1) % farmacias.length;
  } else if (fecha < primerTurno) {
    return null;
  }

  return farmacias[indice];
}

const formatNumber = (value, options) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("es-AR", options)
    : "No disponible";

const normalizarTelefono = (telefono) => telefono.replace(/[^\d+]/g, "");

const lugares = [
  {
    nombre: "Policía de Tilisarao",
    telefonos: ["911"],
    direccion: "Tilisarao, San Luis",
    mapa: "https://maps.google.com/?q=Policia+Tilisarao+San+Luis",
  },
  {
    nombre: "Hospital de Tilisarao",
    telefonos: ["107"],
    direccion: "Tilisarao, San Luis",
    mapa: "https://maps.google.com/?q=Hospital+Tilisarao+San+Luis",
  },
  {
    nombre: "Cuartel de Bomberos",
    telefonos: ["100"],
    direccion: "Tilisarao, San Luis",
    mapa: "https://maps.google.com/?q=Bomberos+Tilisarao+San+Luis",
  },
  {
    nombre: "Municipalidad de Tilisarao",
    telefonos: ["02656 42-0242"],
    direccion: "Tilisarao, San Luis",
    mapa: "https://maps.google.com/?q=Municipalidad+de+Tilisarao+San+Luis",
    web: "https://municipalidadtilisarao.gob.ar/",
    logo: "https://municipalidadtilisarao.gob.ar/assets/images/logo-header-negro.png",
  },
  {
    nombre: "Terminal de Ómnibus",
    telefonos: [],
    direccion: "Tilisarao, San Luis",
    mapa: "https://maps.google.com/?q=Terminal+de+Omnibus+Tilisarao+San+Luis",
  },
];

const InfoTilisarao = () => {
  const [precios, setPrecios] = useState(null);
  const [cotizaciones, setCotizaciones] = useState(null);
  const [errorPrecios, setErrorPrecios] = useState("");
  const [errorDivisas, setErrorDivisas] = useState("");
  const hoy = new Date();
  const farmaciaHoy = obtenerFarmaciaDeTurno(hoy);

  useEffect(() => {
    const cargarPrecios = async () => {
      try {
        setPrecios(await cargarPreciosGranos());
      } catch (error) {
        console.error("Error obteniendo precios de granos:", error);
        setErrorPrecios("No se pudieron cargar las cotizaciones de granos.");
      }
    };

    const cargarDivisas = async () => {
      try {
        const [dolarResponse, euroResponse] = await Promise.all([
          fetch("https://dolarapi.com/v1/dolares/oficial"),
          fetch("https://dolarapi.com/v1/cotizaciones/eur"),
        ]);
        if (!dolarResponse.ok || !euroResponse.ok) {
          throw new Error("Error HTTP al consultar las cotizaciones");
        }

        const [dolar, euro] = await Promise.all([
          dolarResponse.json(),
          euroResponse.json(),
        ]);
        setCotizaciones({ dolar, euro });
      } catch (error) {
        console.error("Error obteniendo cotizaciones de divisas:", error);
        setErrorDivisas("No se pudieron cargar las cotizaciones de divisas.");
      }
    };

    cargarPrecios();
    cargarDivisas();
  }, []);

  return (
    <div className="infoTilisarao">
      <h1>ℹ️ Información Útil - Tilisarao</h1>

      <div className="radarClima">
        <h2>🌦️ Radar Meteorológico</h2>
        <iframe
          title="Radar Meteorológico de Tilisarao"
          width="100%"
          height="600"
          src="https://embed.windy.com/embed2.html?lat=-32.73&lon=-65.29&zoom=10&level=surface&overlay=radar&product=radar"
          frameBorder="0"
        />
      </div>

      <div className="farmaciaTurno">
        <h2>💊 Farmacia de turno</h2>
        {farmaciaHoy ? (
          <>
            <p><strong>{farmaciaHoy.nombre}</strong></p>
            <p><strong>📍 Localidad:</strong> Tilisarao, San Luis</p>
            <p>
              <strong>📞 Teléfono:</strong>{" "}
              {farmaciaHoy.telefonos.length > 0 ? (
                farmaciaHoy.telefonos.map((telefono, index) => (
                  <a
                    key={telefono}
                    href={`tel:${normalizarTelefono(telefono)}`}
                    className="telefonoLink"
                  >
                    {telefono}{index < farmaciaHoy.telefonos.length - 1 ? " · " : ""}
                  </a>
                ))
              ) : (
                "No encontrado en las fuentes consultadas"
              )}
            </p>
            <p>
              <strong>🌐 Mapa:</strong>{" "}
              <a href={farmaciaHoy.mapa} target="_blank" rel="noopener noreferrer">
                Ver en Google Maps
              </a>
            </p>
            <p className="fechaTurno">
              📅 {hoy.toLocaleDateString("es-AR")} · Los turnos cambian los martes a las 8:00.
            </p>
          </>
        ) : (
          <p>
            El calendario de turnos disponible corresponde a 2026. No hay un
            turno registrado para esta fecha.
          </p>
        )}
      </div>

      <div className="farmaciaTurno">
        <h2>☎️ Teléfonos de farmacias de Tilisarao</h2>
        {farmacias.map((farmacia) => (
          <p key={farmacia.nombre}>
            <strong>{farmacia.nombre}:</strong>{" "}
            {farmacia.telefonos.length > 0 ? (
              farmacia.telefonos.map((telefono, index) => (
                <a
                  key={telefono}
                  href={`tel:${normalizarTelefono(telefono)}`}
                  className="telefonoLink"
                >
                  {telefono}{index <  farmacia.telefonos.length - 1 ? " · " : ""}
                </a>
              ))
            ) : (
              "No disponible"
            )}
          </p>
        ))}
      </div>

      <div className="preciosAgro">
        <h2>🌾 Cotizaciones de granos</h2>
        <div className="preciosGrid">
          {[
            { clave: "maiz", nombre: "Maíz", icono: "🌽" },
            { clave: "soja", nombre: "Soja", icono: "🫘" },
            { clave: "girasol", nombre: "Girasol", icono: "🌻" },
            { clave: "trigo", nombre: "Trigo", icono: "🌾" },
            { clave: "sorgo", nombre: "Sorgo", icono: "🟤" },
          ].map(({ clave, nombre, icono }) => {
            const grano = precios?.granos?.[clave];
            const precioArs = formatNumber(grano?.ars_tn);
            const precioUsd = formatNumber(grano?.usd_tn, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            return (
              <div className="precioCard" key={clave}>
                <h3>{icono} {nombre}</h3>
                {grano ? (
                  <>
                    <p>{precioArs === "No disponible" ? precioArs : `$${precioArs}/t`}</p>
                    <p className="precioSecundario">
                      {precioUsd === "No disponible" ? `US$ ${precioUsd}` : `US$ ${precioUsd}/t`}
                    </p>
                    {grano.fechaPrecioHistorico && (
                      <p className="precioSecundario">
                        Último precio disponible:{" "}
                        {new Date(`${grano.fechaPrecioHistorico}T12:00:00`).toLocaleDateString("es-AR")}
                      </p>
                    )}
                    {grano.fechaPrecioHistorico ? (
                      <p className="variacionGrano">Variación: No disponible</p>
                    ) : typeof grano.variacion_pct_vs_rueda_anterior === "number" && (
                      <p className="variacionGrano">
                        {grano.variacion_pct_vs_rueda_anterior > 0 ? "+" : ""}
                        {formatNumber(grano.variacion_pct_vs_rueda_anterior, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}% vs. rueda anterior
                      </p>
                    )}
                  </>
                ) : (
                  <p>{errorPrecios || "Cargando..."}</p>
                )}
              </div>
            );
          })}
        </div>
        {precios && (
          <p className="actualizacionGranos">
            Rueda del {new Date(`${precios.fecha}T12:00:00`).toLocaleDateString("es-AR")}.{" "}
            Fuente:{" "}
            <a href="https://granos.ar" target="_blank" rel="noopener noreferrer">
              granos.ar
            </a>
            {" · "}{precios.fuente_precios}
          </p>
        )}

        <h2 className="tituloDivisas">💱 Divisas</h2>
        <div className="preciosGrid">
          {cotizaciones ? (
            [
              { clave: "dolar", nombre: "Dólar oficial", cotizacion: cotizaciones.dolar },
              { clave: "euro", nombre: "Euro", cotizacion: cotizaciones.euro },
            ].map(({ clave, nombre, cotizacion }) => (
              <div className="precioCard" key={clave}>
                <h3>{nombre}</h3>
                <p>Compra: ${formatNumber(cotizacion.compra)}</p>
                <p>Venta: ${formatNumber(cotizacion.venta)}</p>
                <p className="actualizacionDivisa">
                  Actualizado: {new Date(cotizacion.fechaActualizacion).toLocaleString("es-AR")}
                </p>
              </div>
            ))
          ) : (
            <p role={errorDivisas ? "alert" : undefined}>
              {errorDivisas || "Cargando cotizaciones de divisas..."}
            </p>
          )}
        </div>
        <p className="actualizacionGranos">
          Fuente de divisas:{" "}
          <a href="https://dolarapi.com" target="_blank" rel="noopener noreferrer">
            DolarApi
          </a>
        </p>
      </div>

      <ul className="lugaresList">
        {lugares.map((lugar) => (
          <li key={lugar.nombre} className="lugarItem">
            {lugar.logo && (
              <div className="lugarLogoContenedor">
                <img
                  src={lugar.logo}
                  alt={`Logo de ${lugar.nombre}`}
                  className="lugarLogo"
                />
              </div>
            )}
            <h2 className="lugarNombre">{lugar.nombre}</h2>
            {lugar.telefonos.length > 0 ? (
              <div className="telefonoBlock">
                {lugar.telefonos.map((telefono) => (
                  <div key={telefono} className="telefonoFila">
                    <span>📞</span>
                    <a href={`tel:${normalizarTelefono(telefono)}`} className="telefonoLink">
                      {telefono}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>📞 Teléfono: No disponible</p>
            )}
            <p className="direccion">📍 Dirección: {lugar.direccion}</p>
            <p className="mapa">
              🌍{" "}
              <a href={lugar.mapa} target="_blank" rel="noopener noreferrer">
                Cómo llegar
              </a>
            </p>
            {lugar.web && (
              <p className="sitioWeb">
                🌐{" "}
                <a href={lugar.web} target="_blank" rel="noopener noreferrer">
                  Visitar página web
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoTilisarao;
