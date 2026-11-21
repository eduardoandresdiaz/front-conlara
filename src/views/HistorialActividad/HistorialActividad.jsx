import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import "./HistorialActividad.css";

const API_URL = "https://ecommerce-9558.onrender.com";
const PAGE_SIZE = 30;

const ACTIONS = [
  ["product.created", "Producto creado"],
  ["product.updated", "Producto editado"],
  ["product.deleted", "Producto eliminado"],
  ["product.stock_changed", "Stock actualizado"],
  ["product.image_updated", "Imagen de producto actualizada"],
  ["product.image_deleted", "Imagen de producto eliminada"],
  ["product_request.created", "Faltante creado"],
  ["product_request.ordered", "Faltante marcado como pedido"],
  ["product_request.unavailable", "Producto marcado como no disponible"],
  ["product_request.reassigned", "Faltante derivado a otro proveedor"],
  ["product_request.deleted", "Faltante eliminado"],
  ["employee.created", "Empleado creado"],
  ["employee.deactivated", "Empleado desactivado"],
];

const FIELD_LABELS = {
  category: "Categoría",
  currentStock: "Stock actual",
  description: "Descripción",
  fechaCaducidad: "Fecha de vencimiento",
  fromSupplier: "Proveedor anterior",
  name: "Producto",
  nopublicable: "No publicable",
  price: "Precio",
  proveedor: "Proveedor",
  requestedQuantity: "Cantidad solicitada",
  resaltaroferta: "Oferta destacada",
  stock: "Stock",
  stockminimo: "Stock mínimo",
  supplierName: "Proveedor",
  toSupplier: "Proveedor nuevo",
  ubicacion: "Ubicación",
  mostrarprecio: "Mostrar precio",
  expiresAt: "Vencimiento",
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  return String(value);
};

const formatChanges = (changes) => {
  if (!changes || typeof changes !== "object") return [];

  return Object.entries(changes)
    .filter(([key]) => key !== "derivedRequestId")
    .map(([key, value]) => {
      const label = FIELD_LABELS[key] || key;
      if (value && typeof value === "object" && "from" in value && "to" in value) {
        return `${label}: ${formatValue(value.from)} → ${formatValue(value.to)}`;
      }
      if (value && typeof value === "object" && value.updated === true) {
        return `${label}: actualizado`;
      }
      return `${label}: ${formatValue(value)}`;
    });
};

const HistorialActividad = () => {
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const isOwner = Boolean(user?.email && user.merchantOwnerId === null);
  const [employees, setEmployees] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    actorUserId: "",
    action: "",
    from: "",
    to: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    if (!token || !isOwner) {
      if (isOwner && !token) {
        setError("La sesión expiró. Iniciá sesión nuevamente para ver el historial.");
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/activity-logs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...appliedFilters,
          page,
          limit: PAGE_SIZE,
        },
      });
      setItems(response.data.items);
      setTotal(response.data.total);
      setError("");
    } catch (requestError) {
      setItems([]);
      setTotal(0);
      setError(
        requestError.response?.status === 404
          ? "El historial todavía no está disponible en el backend. Desplegá la versión que incluye la bitácora."
          : requestError.response?.data?.message ||
          "No se pudo cargar el historial de actividad.",
      );
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, isOwner, page, token]);

  useEffect(() => {
    if (!token || !isOwner) return;

    axios
      .get(`${API_URL}/users/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEmployees(Array.isArray(response.data) ? response.data : []);
      })
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            "No se pudo cargar la lista de empleados.",
        );
      });
  }, [isOwner, token]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    const emptyFilters = { actorUserId: "", action: "", from: "", to: "" };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  if (!isOwner) {
    return (
      <main className="activity-log">
        <p className="activity-log__notice">
          Solo el dueño del comercio puede consultar el historial de actividad.
        </p>
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="activity-log">
      <section className="activity-log__panel">
        <h1>Historial de actividad</h1>
        <p>Consulta las acciones realizadas en el comercio por fecha, empleado o tipo.</p>

        {error && <div className="activity-log__error" role="alert">{error}</div>}

        <form className="activity-log__filters" onSubmit={applyFilters}>
          <label>
            Empleado
            <select
              name="actorUserId"
              value={filters.actorUserId}
              onChange={updateFilter}
            >
              <option value="">Todos</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          </label>

          <label>
            Acción
            <select name="action" value={filters.action} onChange={updateFilter}>
              <option value="">Todas</option>
              {ACTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label>
            Desde
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={updateFilter}
            />
          </label>

          <label>
            Hasta
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={updateFilter}
            />
          </label>

          <div className="activity-log__filter-actions">
            <button type="submit">Filtrar</button>
            <button type="button" className="activity-log__secondary" onClick={resetFilters}>
              Limpiar
            </button>
          </div>
        </form>

        <div className="activity-log__summary">
          {loading
            ? "Cargando actividad..."
            : error
              ? ""
              : `${total} registros`}
        </div>

        {!loading && !error && items.length === 0 ? (
          <p>No hay actividad para los filtros seleccionados.</p>
        ) : !loading && items.length > 0 ? (
          <ol className="activity-log__list">
            {items.map((item) => {
              const actionLabel =
                ACTIONS.find(([value]) => value === item.action)?.[1] ||
                item.action;
              const details = formatChanges(item.changes);

              return (
                <li className="activity-log__item" key={item.id}>
                  <div className="activity-log__item-heading">
                    <strong>{actionLabel}</strong>
                    <time dateTime={item.createdAt}>
                      {new Date(item.createdAt).toLocaleString("es-AR")}
                    </time>
                  </div>
                  <p>{item.actorName} ({item.actorEmail})</p>
                  {details.length > 0 && (
                    <ul>
                      {details.map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        ) : null}

        {totalPages > 1 && (
          <div className="activity-log__pagination">
            <button
              type="button"
              className="activity-log__secondary"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
            >
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button
              type="button"
              className="activity-log__secondary"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default HistorialActividad;
