import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import "./AgregarPedido.css";

const API_URL = "https://ecommerce-9558.onrender.com";

const AgregarPedido = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [proveedores, setProveedores] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [requestedQuantity, setRequestedQuantity] = useState("");

  const [cargandoProveedores, setCargandoProveedores] = useState(true);
  const [guardando, setGuardando] = useState(false);
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
          setError("Tu sesión no es válida. Debes iniciar sesión nuevamente.");
          return;
        }

        if (!email) {
          setError("No se pudo identificar el correo del usuario.");
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

  const limpiarFormulario = () => {
    setProductDetail("");
    setCurrentStock("");
    setRequestedQuantity("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!supplierName) {
      setError("Debes seleccionar un proveedor.");
      return;
    }

    if (!productDetail.trim()) {
      setError("Debes escribir el detalle del producto.");
      return;
    }

    if (
      currentStock === "" ||
      !Number.isInteger(Number(currentStock)) ||
      Number(currentStock) < 0
    ) {
      setError("El stock actual debe ser un número entero igual o mayor que cero.");
      return;
    }

    if (
      requestedQuantity === "" ||
      !Number.isInteger(Number(requestedQuantity)) ||
      Number(requestedQuantity) < 1
    ) {
      setError("La cantidad a pedir debe ser un número entero mayor que cero.");
      return;
    }

    try {
      setGuardando(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Tu sesión ha finalizado. Debes iniciar sesión nuevamente.");
        return;
      }

      const datosFaltante = {
        supplierName,
        productDetail: productDetail.trim(),
        currentStock: Number(currentStock),
        requestedQuantity: Number(requestedQuantity),
      };

      await axios.post(
        `${API_URL}/product-requests`,
        datosFaltante,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMensaje("Producto agregado correctamente a la lista de faltantes.");

      // Mantiene seleccionado el proveedor para cargar más productos.
      limpiarFormulario();
    } catch (error) {
      console.error("Error al registrar el faltante:", error);

      const serverMessage = error.response?.data?.message;

      if (Array.isArray(serverMessage)) {
        setError(serverMessage.join(" "));
      } else {
        setError(
          serverMessage ||
            "No se pudo agregar el producto a la lista de faltantes."
        );
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="agregar-pedido">
      <div className="agregar-pedido__content">
        <h1 className="agregar-pedido__title">
          Agregar pedido
        </h1>

        <p className="agregar-pedido__description">
          Selecciona un proveedor y registra el producto que necesitas pedir.
        </p>

        {error && (
          <div className="agregar-pedido__alert agregar-pedido__alert--error">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="agregar-pedido__alert agregar-pedido__alert--success">
            {mensaje}
          </div>
        )}

        <form
          className="agregar-pedido__form"
          onSubmit={handleSubmit}
        >
          <div className="agregar-pedido__field">
            <label
              htmlFor="supplierName"
              className="agregar-pedido__label"
            >
              Proveedor
            </label>

            <select
              id="supplierName"
              className="agregar-pedido__input"
              value={supplierName}
              onChange={(event) => {
                setSupplierName(event.target.value);
                setMensaje("");
                setError("");
              }}
              disabled={cargandoProveedores || guardando}
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
            <div className="agregar-pedido__empty">
              No tienes proveedores registrados.
            </div>
          )}

          <div className="agregar-pedido__field">
            <label
              htmlFor="productDetail"
              className="agregar-pedido__label"
            >
              Detalle del producto a pedir
            </label>

            <textarea
              id="productDetail"
              className="agregar-pedido__input agregar-pedido__textarea"
              value={productDetail}
              onChange={(event) => {
                setProductDetail(event.target.value);
                setMensaje("");
                setError("");
              }}
              placeholder="Ejemplo: Tuercas 5/16 con rosca Whitworth"
              rows="4"
              maxLength="500"
              disabled={guardando}
            />

            <span className="agregar-pedido__counter">
              {productDetail.length}/500
            </span>
          </div>

          <div className="agregar-pedido__field">
            <label
              htmlFor="currentStock"
              className="agregar-pedido__label"
            >
              Stock actual
            </label>

            <input
              id="currentStock"
              type="number"
              className="agregar-pedido__input"
              value={currentStock}
              onChange={(event) => {
                setCurrentStock(event.target.value);
                setMensaje("");
                setError("");
              }}
              placeholder="Ejemplo: 5"
              min="0"
              step="1"
              inputMode="numeric"
              disabled={guardando}
            />
          </div>

          <div className="agregar-pedido__field">
            <label
              htmlFor="requestedQuantity"
              className="agregar-pedido__label"
            >
              Cantidad a pedir
            </label>

            <input
              id="requestedQuantity"
              type="number"
              className="agregar-pedido__input"
              value={requestedQuantity}
              onChange={(event) => {
                setRequestedQuantity(event.target.value);
                setMensaje("");
                setError("");
              }}
              placeholder="Ejemplo: 100"
              min="1"
              step="1"
              inputMode="numeric"
              disabled={guardando}
            />
          </div>

          <button
            type="submit"
            className="agregar-pedido__button"
            disabled={
              guardando ||
              cargandoProveedores ||
              proveedores.length === 0
            }
          >
            {guardando
              ? "Guardando..."
              : "Agregar a faltantes"}
          </button>

          <button
            type="button"
            className="agregar-pedido__button agregar-pedido__button--back"
            onClick={() => navigate("/pedidos")}
            disabled={guardando}
          >
            Volver a pedidos
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarPedido;