import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const posData = async (formData) => {
    try {
      console.log("Enviando al backend:", formData);

      const response = await axios.post(
        "https://ecommerce-9558.onrender.com/auth/signup",
        formData
      );
      console.log("Respuesta del backend:", response.data);

      if (response.status === 201) {
        alert("Usuario registrado. Redirigiendo...");
        navigate("/login");
        return true;
      }
    } catch (error) {
      console.error("Error durante la solicitud:", error);
    
      if (error.response) {
        // Capturamos el mensaje exacto del backend
        const serverMessage = error.response.data.message || "Error inesperado en el servidor.";
        alert(`Problema detectado: ${serverMessage}`);
      } else if (error.request) {
        alert("No se recibió respuesta del servidor. Verifica tu conexión.");
      } else {
        alert(`Error inesperado: ${error.message}`);
      }
    
      return false;
    }
  };

  return (
    <div className="register">
      <h1 className="register__title">Registro</h1>
      <Formik
        initialValues={{
          name: '',
          dni: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          country: '',
          address: '',
          city: '',
        }}
        validate={(values) => {
          const errors = {};

          if (!values.name) {
            errors.name = 'El nombre es obligatorio.';
          }

          if (!values.dni) {
            errors.dni = 'El DNI es obligatorio.';
          } else if (!/^\d{7,8}$/.test(values.dni)) {
            errors.dni = 'El DNI debe ser un número válido (7 u 8 dígitos).';
          }

          if (!values.email) {
            errors.email = 'El email es obligatorio.';
          }

          if (!values.password) {
            errors.password = 'La contraseña es obligatoria.';
          } else if (values.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres.';
          }

          if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden.';
          }

          if (!values.phone) {
            errors.phone = 'El teléfono es obligatorio.';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            // Agregar prefijo +54 al teléfono si no lo tiene
            const processedValues = {
              ...values,
              phone: values.phone.startsWith('+54') ? values.phone : `+54${values.phone}`,
            };

            console.log("Valores procesados para enviar:", processedValues);

            const success = await posData(processedValues);

            if (success) resetForm();
          } catch (error) {
            console.error("Error al enviar los datos:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="register__form">
            <div className="register__field">
              <label htmlFor="name" className="register__label">Nombre y Apellido</label>
              <Field type="text" name="name" id="name" className="register__input" />
              <ErrorMessage name="name" component="div" className="register__error" />
            </div>

            <div className="register__field">
              <label htmlFor="dni" className="register__label">DNI</label>
              <Field type="text" name="dni" id="dni" className="register__input" />
              <ErrorMessage name="dni" component="div" className="register__error" />
            </div>

            <div className="register__field">
              <label htmlFor="email" className="register__label">Email</label>
              <Field type="email" name="email" id="email" className="register__input" />
              <ErrorMessage name="email" component="div" className="register__error" />
            </div>

            <div className="register__field">
              <label htmlFor="password" className="register__label">Clave</label>
              <Field type="password" name="password" id="password" className="register__input" />
              <ErrorMessage name="password" component="div" className="register__error" />
            </div>

            <div className="register__field">
              <label htmlFor="confirmPassword" className="register__label">Confirmar Clave</label>
              <Field type="password" name="confirmPassword" id="confirmPassword" className="register__input" />
              <ErrorMessage name="confirmPassword" component="div" className="register__error" />
            </div>

            <div className="register__field">
  <label htmlFor="phone" className="register__label">Teléfono</label>
  <div style={{ display: "flex", alignItems: "center" }}>
    <span style={{ marginRight: "8px" }}>+54</span>
    <Field type="text" name="phone" id="phone" className="register__input" />
  </div>
  <ErrorMessage name="phone" component="div" className="register__error" />
</div>


            <div className="register__field">
              <label htmlFor="country" className="register__label">Provincia</label>
              <Field type="text" name="country" id="country" className="register__input" />
              <ErrorMessage name="country" component="div" className="register__error" />
            </div>

            <div className="register__field">
              <label htmlFor="address" className="register__label">Dirección</label>
              <Field type="text" name="address" id="address" className="register__input" />
              <ErrorMessage name="address" component="div" className="register__error" />
            </div>

            <div className="register__field">
              <label htmlFor="city" className="register__label">Ciudad</label>
              <Field type="text" name="city" id="city" className="register__input" />
              <ErrorMessage name="city" component="div" className="register__error" />
            </div>

            <button type="submit" className="register__button" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
