import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import "./VerFaltantes.css";

const API_URL = "https://ecommerce-9558.onrender.com";

const VerFaltantes = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [proveedores, setProveedores] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [faltantes, setFaltantes] = useState([]);
  const [noDisponibles, setNoDisponibles] = useState([]);
  const [vista, setVista] = useState("pendientes");
  const [reasignandoId, setReasignandoId] = useState(null);
  const [proveedorDestino, setProveedorDestino] = useState("");

  const [cargandoProveedores, setCargandoProveedores] = useState(true);
  const [cargandoFaltantes, setCargandoFaltantes] = useState(false);

  // Guarda el ID del faltante que se está procesando
  const [faltanteProcesandoId, setFaltanteProcesandoId] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        setCargandoProveedores(true);
        setError("");

        const token = localStorage.getItem("token");
        const email = user?.merchantOwnerEmail || user?.email;

        if (!token) {
          setError("Tu sesión ha finalizado. Inicia sesión nuevamente.");
          return;
        }

        if (!email) {
          setError("No se pudo identificar al usuario.");
          return;
        }

        const response = await axios.get(
          `${API_URL}/users/email/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const listaProveedores = Array.isArray(
          response.data.proveedores
        )
          ? response.data.proveedores
          : [];

        setProveedores(listaProveedores);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);

        setError(
          error.response?.data?.message ||
            "No se pudieron cargar los proveedores."
        );
      } finally {
        setCargandoProveedores(false);
      }
    };

    if (user?.email) {
      obtenerProveedores();
    } else {
      setCargandoProveedores(false);
    }
  }, [user?.email, user?.merchantOwnerEmail]);

  const obtenerFaltantes = async (proveedorSeleccionado) => {
    if (!proveedorSeleccionado) {
      setFaltantes([]);
      return;
    }

    try {
      setCargandoFaltantes(true);
      setMensaje("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Tu sesión ha finalizado. Inicia sesión nuevamente.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/product-requests/pending-by-supplier`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            supplierName: proveedorSeleccionado,
          },
        }
      );

      setFaltantes(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error al obtener faltantes:", error);

      setFaltantes([]);

      setError(
        error.response?.data?.message ||
          "No se pudieron obtener los faltantes."
      );
    } finally {
      setCargandoFaltantes(false);
    }
  };

  const obtenerNoDisponibles = async () => {
    try {
      setCargandoFaltantes(true);
      setMensaje("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Tu sesión ha finalizado. Inicia sesión nuevamente.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/product-requests/unavailable`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNoDisponibles(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error al obtener productos no disponibles:", error);

      setNoDisponibles([]);

      setError(
        error.response?.data?.message ||
          "No se pudieron obtener los productos no disponibles."
      );
    } finally {
      setCargandoFaltantes(false);
    }
  };

  const handleCambiarVista = async (nuevaVista) => {
    setVista(nuevaVista);
    setReasignandoId(null);
    setProveedorDestino("");
    setMensaje("");
    setError("");

    if (nuevaVista === "no-disponibles") {
      await obtenerNoDisponibles();
    }
  };

  const handleSeleccionarProveedor = async (event) => {
    const proveedorSeleccionado = event.target.value;

    setSupplierName(proveedorSeleccionado);
    setMensaje("");
    setError("");

    await obtenerFaltantes(proveedorSeleccionado);
  };

  // Marca solamente un producto como pedido
  const marcarComoPedido = async (faltanteId) => {
    const confirmar = window.confirm(
      "¿Confirmas que este producto ya fue pedido?"
    );

    if (!confirmar) return;

    try {
      setFaltanteProcesandoId(faltanteId);
      setMensaje("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Tu sesión ha finalizado. Inicia sesión nuevamente.");
        return;
      }

      await axios.patch(
        `${API_URL}/product-requests/${faltanteId}/mark-as-ordered`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualiza solamente el ítem seleccionado
      setFaltantes((faltantesActuales) =>
        faltantesActuales.map((faltante) =>
          faltante.id === faltanteId
            ? {
                ...faltante,
                status: "PEDIDO",
              }
            : faltante
        )
      );

      setMensaje("Producto marcado como pedido correctamente.");
    } catch (error) {
      console.error("Error al marcar como pedido:", error);

      setError(
        error.response?.data?.message ||
          "No se pudo marcar el producto como pedido."
      );
    } finally {
      setFaltanteProcesandoId(null);
    }
  };

  const marcarComoNoDisponible = async (faltante) => {
    const confirmar = window.confirm(
      "¿Confirmas que el proveedor no tiene este producto?"
    );

    if (!confirmar) return;

    try {
      setFaltanteProcesandoId(faltante.id);
      setMensaje("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Tu sesión ha finalizado. Inicia sesión nuevamente.");
        return;
      }

      await axios.patch(
        `${API_URL}/product-requests/${faltante.id}/mark-as-unavailable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFaltantes((faltantesActuales) =>
        faltantesActuales.filter(
          (item) => item.id !== faltante.id
        )
      );
      setNoDisponibles((actuales) => [
        ...actuales,
        { ...faltante, status: "NO_DISPONIBLE" },
      ]);

      setMensaje("Producto marcado como no disponible.");
    } catch (error) {
      console.error("Error al marcar como no disponible:", error);

      setError(
        error.response?.data?.message ||
          "No se pudo marcar el producto como no disponible."
      );
    } finally {
      setFaltanteProcesandoId(null);
    }
  };

  const pedirAOtroProveedor = async (faltante) => {
    if (!proveedorDestino) {
      setError("Selecciona el proveedor al que deseas pedir el producto.");
      return;
    }

    try {
      setFaltanteProcesandoId(faltante.id);
      setMensaje("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Tu sesión ha finalizado. Inicia sesión nuevamente.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/product-requests/${faltante.id}/reassign`,
        {
          supplierName: proveedorDestino,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNoDisponibles((actuales) =>
        actuales.map((item) =>
          item.id === faltante.id
            ? {
                ...item,
                derivedSuppliers: response.data.derivedSuppliers,
              }
            : item
        )
      );

      setMensaje(
        `El producto fue derivado a ${proveedorDestino}.`
      );
      setReasignandoId(null);
      setProveedorDestino("");
    } catch (error) {
      console.error("Error al pedir a otro proveedor:", error);

      const serverMessage = error.response?.data?.message;

      setError(
        Array.isArray(serverMessage)
          ? serverMessage.join(" ")
          : serverMessage ||
              "No se pudo asignar el producto al nuevo proveedor."
      );
    } finally {
      setFaltanteProcesandoId(null);
    }
  };

  const eliminarFaltante = async (faltanteId) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este faltante?"
    );

    if (!confirmar) return;

    try {
      setFaltanteProcesandoId(faltanteId);
      setMensaje("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Tu sesión ha finalizado. Inicia sesión nuevamente.");
        return;
      }

      await axios.delete(
        `${API_URL}/product-requests/${faltanteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFaltantes((faltantesActuales) =>
        faltantesActuales.filter(
          (faltante) => faltante.id !== faltanteId
        )
      );

      setMensaje("Faltante eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar faltante:", error);

      setError(
        error.response?.data?.message ||
          "No se pudo eliminar el faltante."
      );
    } finally {
      setFaltanteProcesandoId(null);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return "Fecha inválida";
    }

    return fechaConvertida.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cantidadPendientes = faltantes.filter(
    (faltante) => faltante.status !== "PEDIDO"
  ).length;
  const productosMostrados =
    vista === "no-disponibles" ? noDisponibles : faltantes;

  return (
    <div className="ver-faltantes">
      <div className="ver-faltantes__content">
        <h1 className="ver-faltantes__title">
          Ver faltantes
        </h1>

        <p className="ver-faltantes__description">
          {vista === "no-disponibles"
            ? "Consulta los productos que un proveedor no tenía disponibles."
            : "Selecciona un proveedor para consultar su lista pendiente."}
        </p>

        {error && (
          <div className="ver-faltantes__alert ver-faltantes__alert--error">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="ver-faltantes__alert ver-faltantes__alert--success">
            {mensaje}
          </div>
        )}

        <div className="ver-faltantes__tabs">
          <button
            type="button"
            className={`ver-faltantes__tab ${
              vista === "pendientes" ? "ver-faltantes__tab--active" : ""
            }`}
            onClick={() => handleCambiarVista("pendientes")}
            disabled={cargandoFaltantes || faltanteProcesandoId !== null}
          >
            Faltantes pendientes
          </button>
          <button
            type="button"
            className={`ver-faltantes__tab ${
              vista === "no-disponibles" ? "ver-faltantes__tab--active" : ""
            }`}
            onClick={() => handleCambiarVista("no-disponibles")}
            disabled={cargandoFaltantes || faltanteProcesandoId !== null}
          >
            Productos no disponibles
          </button>
        </div>

        {vista === "pendientes" && (
          <div className="ver-faltantes__field">
            <label
              htmlFor="supplierName"
              className="ver-faltantes__label"
            >
              Proveedor
            </label>

            <select
              id="supplierName"
              className="ver-faltantes__select"
              value={supplierName}
              onChange={handleSeleccionarProveedor}
              disabled={
                cargandoProveedores ||
                cargandoFaltantes ||
                faltanteProcesandoId !== null
              }
            >
              <option value="">
                {cargandoProveedores
                  ? "Cargando proveedores..."
                  : "Seleccionar proveedor"}
              </option>

              {proveedores.map((proveedor, index) => (
                <option
                  key={`${proveedor.empresa}-${index}`}
                  value={proveedor.empresa}
                >
                  {proveedor.empresa}
                </option>
              ))}
            </select>
          </div>
        )}

        {!cargandoProveedores &&
          vista === "pendientes" &&
          proveedores.length === 0 && (
            <div className="ver-faltantes__empty">
              No tienes proveedores registrados.
            </div>
          )}

        {cargandoFaltantes && (
          <div className="ver-faltantes__loading">
            Cargando faltantes...
          </div>
        )}

        {!cargandoFaltantes &&
          !error &&
          ((vista === "pendientes" && supplierName && faltantes.length === 0) ||
            (vista === "no-disponibles" && noDisponibles.length === 0)) && (
            <div className="ver-faltantes__empty">
              {vista === "no-disponibles"
                ? "Todavía no hay productos marcados como no disponibles."
                : `No hay faltantes pendientes para ${supplierName}.`}
            </div>
          )}

        {!cargandoFaltantes && productosMostrados.length > 0 && (
          <>
            <div className="ver-faltantes__summary">
              <strong>
                {vista === "no-disponibles"
                  ? "Todos los proveedores"
                  : supplierName}
              </strong>

              <span>
                {vista === "no-disponibles"
                  ? `${noDisponibles.length} producto(s) no disponible(s)`
                  : `${cantidadPendientes} producto(s) pendiente(s)`}
              </span>
            </div>

            <div className="ver-faltantes__list">
              {productosMostrados.map((faltante) => {
                const estaPedido =
                  faltante.status === "PEDIDO";
                const estaNoDisponible =
                  faltante.status === "NO_DISPONIBLE";
                const proveedoresDerivados =
                  faltante.derivedSuppliers ?? [];
                const otrosProveedores = proveedores.filter(
                  (proveedor) => {
                    const nombreProveedor =
                      proveedor.empresa?.trim().toLowerCase();

                    return (
                      nombreProveedor &&
                      nombreProveedor !==
                        faltante.supplierName?.trim().toLowerCase() &&
                      !proveedoresDerivados.some(
                        (derivado) =>
                          derivado.trim().toLowerCase() ===
                          nombreProveedor
                      )
                    );
                  }
                );

                const estaProcesando =
                  faltanteProcesandoId === faltante.id;
                const estaReasignando =
                  reasignandoId === faltante.id;

                return (
                  <article
                    key={faltante.id}
                    className={`ver-faltantes__card ${
                      estaPedido
                        ? "ver-faltantes__card--ordered"
                        : estaNoDisponible
                          ? "ver-faltantes__card--unavailable"
                          : ""
                    }`}
                  >
                    <div className="ver-faltantes__card-header">
                      <span className="ver-faltantes__date">
                        {formatearFecha(
                          faltante.requestedAt
                        )}
                      </span>

                      <span
                        className={`ver-faltantes__status ${
                          estaPedido
                            ? "ver-faltantes__status--ordered"
                            : estaNoDisponible
                              ? "ver-faltantes__status--unavailable"
                              : ""
                        }`}
                      >
                        {estaPedido
                          ? "Ya pedido"
                          : estaNoDisponible
                            ? "No disponible"
                            : "Pendiente"}
                      </span>
                    </div>

                    {vista === "no-disponibles" && (
                      <p className="ver-faltantes__supplier">
                        Proveedor: <strong>{faltante.supplierName}</strong>
                      </p>
                    )}

                    <h2 className="ver-faltantes__product">
                      {faltante.productDetail}
                    </h2>

                    <div className="ver-faltantes__quantities">
                      <div className="ver-faltantes__quantity">
                        <span>Stock actual</span>

                        <strong>
                          {faltante.currentStock}
                        </strong>
                      </div>

                      <div className="ver-faltantes__quantity">
                        <span>Cantidad a pedir</span>

                        <strong>
                          {faltante.requestedQuantity}
                        </strong>
                      </div>
                    </div>

                    {!estaPedido && !estaNoDisponible && (
                      <button
                        type="button"
                        className="ver-faltantes__ordered"
                        onClick={() =>
                          marcarComoPedido(faltante.id)
                        }
                        disabled={
                          faltanteProcesandoId !== null
                        }
                      >
                        {estaProcesando
                          ? "Marcando..."
                          : "Marcar como pedido"}
                      </button>
                    )}

                    {!estaPedido && !estaNoDisponible && (
                      <button
                        type="button"
                        className="ver-faltantes__unavailable"
                        onClick={() =>
                          marcarComoNoDisponible(faltante)
                        }
                        disabled={faltanteProcesandoId !== null}
                      >
                        {estaProcesando
                          ? "Marcando..."
                          : "Producto no disponible"}
                      </button>
                    )}

                    {estaPedido && (
                      <div className="ver-faltantes__ordered-message">
                        ✓ Este producto ya fue pedido
                      </div>
                    )}

                    {estaNoDisponible && (
                      <>
                        <div className="ver-faltantes__unavailable-message">
                          Este producto no estaba disponible con este proveedor.
                        </div>

                        {proveedoresDerivados.length > 0 && (
                          <p className="ver-faltantes__derived-suppliers">
                            <strong>Derivado a:</strong>{" "}
                            {proveedoresDerivados.join(", ")}
                          </p>
                        )}

                        <button
                          type="button"
                          className="ver-faltantes__reassign"
                          onClick={() => {
                            setError("");
                            setMensaje("");
                            setProveedorDestino("");
                            setReasignandoId(
                              estaReasignando ? null : faltante.id
                            );
                          }}
                          disabled={faltanteProcesandoId !== null}
                        >
                          {estaReasignando
                            ? "Cancelar"
                            : "Pedir a otro proveedor"}
                        </button>

                        {estaReasignando && (
                          <div className="ver-faltantes__reassign-form">
                            {otrosProveedores.length > 0 ? (
                              <>
                                <label
                                  htmlFor={`supplier-${faltante.id}`}
                                  className="ver-faltantes__label"
                                >
                                  Selecciona otro proveedor
                                </label>

                                <select
                                  id={`supplier-${faltante.id}`}
                                  className="ver-faltantes__select"
                                  value={proveedorDestino}
                                  onChange={(event) =>
                                    setProveedorDestino(event.target.value)
                                  }
                                  disabled={faltanteProcesandoId !== null}
                                >
                                  <option value="">
                                    Seleccionar proveedor
                                  </option>
                                  {otrosProveedores.map((proveedor, index) => (
                                    <option
                                      key={`${proveedor.empresa}-${index}`}
                                      value={proveedor.empresa}
                                    >
                                      {proveedor.empresa}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  className="ver-faltantes__reassign-confirm"
                                  onClick={() =>
                                    pedirAOtroProveedor(faltante)
                                  }
                                  disabled={
                                    !proveedorDestino ||
                                    faltanteProcesandoId !== null
                                  }
                                >
                                  {estaProcesando
                                    ? "Asignando..."
                                    : "Confirmar pedido"}
                                </button>
                              </>
                            ) : (
                              <p className="ver-faltantes__no-suppliers">
                                No hay otros proveedores disponibles para derivar este producto.
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {!estaPedido && !estaNoDisponible && (
                      <button
                        type="button"
                        className="ver-faltantes__delete"
                        onClick={() =>
                          eliminarFaltante(faltante.id)
                        }
                        disabled={
                          faltanteProcesandoId !== null
                        }
                      >
                        {estaProcesando
                          ? "Procesando..."
                          : "Eliminar faltante"}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}

        <div className="ver-faltantes__actions">
          <button
            type="button"
            className="ver-faltantes__button"
            onClick={() => navigate("/agregar-pedido")}
            disabled={faltanteProcesandoId !== null}
          >
            Agregar otro faltante
          </button>

          <button
            type="button"
            className="ver-faltantes__button ver-faltantes__button--back"
            onClick={() => navigate("/pedidos")}
            disabled={faltanteProcesandoId !== null}
          >
            Volver a pedidos
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerFaltantes;