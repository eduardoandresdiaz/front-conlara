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

  const [cargandoProveedores, setCargandoProveedores] = useState(true);
  const [cargandoFaltantes, setCargandoFaltantes] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        setCargandoProveedores(true);
        setError("");

        const token = localStorage.getItem("token");
        const email = user?.email;

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

        const listaProveedores = Array.isArray(response.data.proveedores)
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
  }, [user?.email]);

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

  const handleSeleccionarProveedor = async (event) => {
    const proveedorSeleccionado = event.target.value;

    setSupplierName(proveedorSeleccionado);
    setMensaje("");
    setError("");

    await obtenerFaltantes(proveedorSeleccionado);
  };

  const eliminarFaltante = async (faltanteId) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este faltante?"
    );

    if (!confirmar) return;

    try {
      setProcesando(true);
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
      setProcesando(false);
    }
  };

  const marcarListaComoPedida = async () => {
    if (!supplierName) {
      setError("Debes seleccionar un proveedor.");
      return;
    }

    if (faltantes.length === 0) {
      setError("Este proveedor no tiene faltantes pendientes.");
      return;
    }

    const confirmar = window.confirm(
      `¿Confirmas que el pedido a ${supplierName} ya fue realizado?`
    );

    if (!confirmar) return;

    try {
      setProcesando(true);
      setMensaje("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Tu sesión ha finalizado. Inicia sesión nuevamente.");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/product-requests/mark-as-ordered`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            supplierName,
          },
        }
      );

      setFaltantes([]);

      setMensaje(
        `${response.data.updatedRecords} producto(s) marcados como pedidos. Ya puedes comenzar una nueva lista para ${supplierName}.`
      );
    } catch (error) {
      console.error("Error al marcar la lista:", error);

      setError(
        error.response?.data?.message ||
          "No se pudo marcar la lista como pedida."
      );
    } finally {
      setProcesando(false);
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

  return (
    <div className="ver-faltantes">
      <div className="ver-faltantes__content">
        <h1 className="ver-faltantes__title">
          Ver faltantes
        </h1>

        <p className="ver-faltantes__description">
          Selecciona un proveedor para consultar su lista pendiente.
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
              procesando
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

        {!cargandoProveedores && proveedores.length === 0 && (
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
          supplierName &&
          faltantes.length === 0 && (
            <div className="ver-faltantes__empty">
              No hay faltantes pendientes para {supplierName}.
            </div>
          )}

        {!cargandoFaltantes && faltantes.length > 0 && (
          <>
            <div className="ver-faltantes__summary">
              <strong>{supplierName}</strong>

              <span>
                {faltantes.length} producto(s) pendiente(s)
              </span>
            </div>

            <div className="ver-faltantes__list">
              {faltantes.map((faltante) => (
                <article
                  key={faltante.id}
                  className="ver-faltantes__card"
                >
                  <div className="ver-faltantes__card-header">
                    <span className="ver-faltantes__date">
                      {formatearFecha(faltante.requestedAt)}
                    </span>

                    <span className="ver-faltantes__status">
                      {faltante.status}
                    </span>
                  </div>

                  <h2 className="ver-faltantes__product">
                    {faltante.productDetail}
                  </h2>

                  <div className="ver-faltantes__quantities">
                    <div className="ver-faltantes__quantity">
                      <span>Stock actual</span>
                      <strong>{faltante.currentStock}</strong>
                    </div>

                    <div className="ver-faltantes__quantity">
                      <span>Cantidad a pedir</span>
                      <strong>
                        {faltante.requestedQuantity}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ver-faltantes__delete"
                    onClick={() =>
                      eliminarFaltante(faltante.id)
                    }
                    disabled={procesando}
                  >
                    Eliminar faltante
                  </button>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="ver-faltantes__button ver-faltantes__button--ordered"
              onClick={marcarListaComoPedida}
              disabled={procesando}
            >
              {procesando
                ? "Procesando..."
                : "Marcar lista como pedida"}
            </button>
          </>
        )}

        <div className="ver-faltantes__actions">
          <button
            type="button"
            className="ver-faltantes__button"
            onClick={() => navigate("/agregar-pedido")}
            disabled={procesando}
          >
            Agregar otro faltante
          </button>

          <button
            type="button"
            className="ver-faltantes__button ver-faltantes__button--back"
            onClick={() => navigate("/pedidos")}
            disabled={procesando}
          >
            Volver a pedidos
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerFaltantes;