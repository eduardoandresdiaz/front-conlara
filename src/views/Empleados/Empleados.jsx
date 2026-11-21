import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import "./Empleados.css";

const API_URL = "https://ecommerce-9558.onrender.com";

const emptyForm = {
  name: "",
  nickname: "",
  dni: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Empleados = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const isOwner = Boolean(user?.email && user.merchantOwnerId === null);
  const activeEmployeeCount = employees.filter((employee) => employee.isActive).length;

  const loadEmployees = useCallback(async () => {
    if (!token || !isOwner) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/users/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "No se pudo cargar la lista de empleados.",
      );
    } finally {
      setLoading(false);
    }
  }, [isOwner, token]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createEmployee = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_URL}/users/employees`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(emptyForm);
      setMessage("Empleado creado correctamente.");
      await loadEmployees();
    } catch (requestError) {
      const serverMessage = requestError.response?.data?.message;
      setError(
        Array.isArray(serverMessage)
          ? serverMessage.join(" ")
          : serverMessage || "No se pudo crear el empleado.",
      );
    } finally {
      setSaving(false);
    }
  };

  const deactivateEmployee = async (employee) => {
    if (!window.confirm(`¿Desactivar la cuenta de ${employee.name}?`)) {
      return;
    }

    setError("");
    setMessage("");
    try {
      await axios.patch(
        `${API_URL}/users/employees/${employee.id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage("Empleado desactivado correctamente.");
      await loadEmployees();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "No se pudo desactivar el empleado.",
      );
    }
  };

  if (!isOwner) {
    return (
      <main className="employees">
        <p className="employees__notice">
          Solo el dueño del comercio puede administrar empleados.
        </p>
      </main>
    );
  }

  return (
    <main className="employees">
      <section className="employees__panel">
        <h1>Empleados</h1>
        <p>
          Crea cuentas individuales para que tus empleados trabajen con los
          productos y pedidos de este comercio.
        </p>

        {error && <div className="employees__message employees__message--error">{error}</div>}
        {message && <div className="employees__message employees__message--success">{message}</div>}

        <h2>Cuentas del comercio</h2>
        {loading ? (
          <p>Cargando empleados...</p>
        ) : employees.length === 0 ? (
          <p>Todavía no hay empleados vinculados.</p>
        ) : (
          <ul className="employees__list">
            {employees.map((employee) => (
              <li className="employees__item" key={employee.id}>
                <div>
                  <strong>{employee.name}</strong>
                  <span>{employee.email}</span>
                  <small>
                    {employee.isActive ? "Activo" : "Desactivado"}
                  </small>
                </div>
                {employee.isActive && (
                  <button
                    type="button"
                    className="employees__deactivate"
                    onClick={() => deactivateEmployee(employee)}
                  >
                    Desactivar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <h2>Agregar empleado</h2>
        <p>
          Empleados activos: {activeEmployeeCount}. Comparte las credenciales
          iniciales de forma segura.
        </p>
        <form className="employees__form" onSubmit={createEmployee}>
          <label>
            Nombre
            <input name="name" value={form.name} onChange={updateForm} required minLength="3" maxLength="50" />
          </label>
          <label>
            Nombre del comercio (usuario)
            <input name="nickname" value={form.nickname} onChange={updateForm} required minLength="3" maxLength="50" />
          </label>
          <label>
            DNI
            <input name="dni" value={form.dni} onChange={updateForm} required minLength="7" maxLength="15" />
          </label>
          <label>
            Correo electrónico
            <input name="email" type="email" value={form.email} onChange={updateForm} required maxLength="50" />
          </label>
          <label>
            Contraseña inicial
            <input name="password" type="password" value={form.password} onChange={updateForm} required minLength="8" maxLength="15" autoComplete="new-password" />
          </label>
          <label>
            Confirmar contraseña
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateForm} required minLength="8" maxLength="15" autoComplete="new-password" />
          </label>
          <button
            type="submit"
            disabled={saving || loading}
          >
            {saving ? "Creando..." : "Crear empleado"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Empleados;
