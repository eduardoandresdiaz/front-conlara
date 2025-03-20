import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateLogin } from '../../helpers/validate';
import './Login.css';
import { useUser } from '../../context/UserContext';

const Login = () => {
  const { setUser } = useUser();
  const initialValues = { email: "", password: "" }; // Nombres de campos actualizados
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Nuevo estado para mensajes de feedback
  const navigate = useNavigate();

  useEffect(() => {
    setErrors(validateLogin(formData));
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedbackMessage(""); // Limpia cualquier mensaje previo
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await loginUser(formData);
        console.log("Response procesado:", response);
        const { token, message } = response;

        if (!token) {
          throw new Error("El servidor no devolvió un token válido.");
        }

        localStorage.setItem("token", token); // Guarda el token
        setUser({ email: formData.email }); // Actualiza el usuario en el contexto
        setFeedbackMessage(message); // Mensaje de bienvenida
        navigate('/MenuAppointment'); // Redirige al usuario
      } catch (error) {
        console.error("Error en handleSubmit:", error);
        setFeedbackMessage(
          typeof error === "string" ? error : "Ocurrió un error inesperado."
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFeedbackMessage("Por favor corrige los errores antes de continuar.");
    }
  };

  const loginUser = async (data) => {
    try {
      const response = await axios.post("https://ecommerce-9558.onrender.com/auth/signin", data);
      console.log("Respuesta completa de la API:", response);
      if (response.status === 200 || response.status === 201) {
        const { token, message } = response.data;
        return { token, message }; // Retorna token y mensaje
      } else {
        throw new Error("La respuesta del servidor no es exitosa.");
      }
    } catch (error) {
      console.error("Error en loginUser:", error.response || error.message);
      throw error.response?.data?.message || "Error al intentar iniciar sesión";
    }
  };

  return (
    <div className="login">
      <h1 className="login__title">Iniciar Sesión</h1>
      <form className="login__form" onSubmit={handleSubmit}>
        {feedbackMessage && <div className="login__feedback">{feedbackMessage}</div>} {/* Mensaje dinámico */}
        <div className="login__field">
          <label className="login__label">Email:</label>
          <input
            type="email"
            name="email"
            className="login__input"
            placeholder="mail@mail.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <span className="login__error">{errors.email}</span>}
        </div>
        <div className="login__field">
          <label className="login__label">Password:</label>
          <input
            type="password"
            name="password"
            className="login__input"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <span className="login__error">{errors.password}</span>}
        </div>
        <button type="submit" className="login__button" disabled={isSubmitting}>
          {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
        </button>
        <br />
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="login__button"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Login;
