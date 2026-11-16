const API_URL = "https://granosar.lfcaucino.workers.dev/api/v1";

const isValidPrice = (value) =>
  typeof value === "number" && Number.isFinite(value);

export async function cargarPreciosGranos() {
  const response = await fetch(`${API_URL}/pizarra`);
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  const result = await response.json();
  const precios = result?.data;
  if (!precios?.granos || typeof precios.granos !== "object") {
    throw new Error("La respuesta no contiene cotizaciones de granos");
  }

  const granosSinPrecio = Object.keys(precios.granos).filter(
    (clave) => !isValidPrice(precios.granos[clave]?.ars_tn)
  );
  if (granosSinPrecio.length === 0) {
    return precios;
  }

  let serieHistorica;
  try {
    const historicoResponse = await fetch(`${API_URL}/pizarra/historico?dias=30`);
    if (!historicoResponse.ok) {
      throw new Error(`Error HTTP ${historicoResponse.status}`);
    }

    const historico = await historicoResponse.json();
    if (!Array.isArray(historico?.data?.serie)) {
      throw new Error("La respuesta histórica no contiene una serie de precios");
    }
    serieHistorica = historico.data.serie;
  } catch (error) {
    console.error("Error obteniendo el histórico de precios de granos:", error);
    return precios;
  }

  const granos = { ...precios.granos };
  for (const clave of granosSinPrecio) {
    let ultimaCotizacion;
    for (let i = serieHistorica.length - 1; i >= 0; i--) {
      const cotizacion = serieHistorica[i];
      if (isValidPrice(cotizacion?.[clave])) {
        ultimaCotizacion = cotizacion;
        break;
      }
    }

    if (ultimaCotizacion) {
      granos[clave] = {
        ...granos[clave],
        ars_tn: ultimaCotizacion[clave],
        usd_tn: null,
        variacion_pct_vs_rueda_anterior: null,
        fechaPrecioHistorico: ultimaCotizacion.fecha,
      };
    }
  }

  return { ...precios, granos };
}
