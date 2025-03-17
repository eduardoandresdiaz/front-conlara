import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validateRegister } from '../../helpers/validate';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const posData = async (formData) => {
    try {
      console.log("Enviando al backend:", formData);

      const response = await axios.post("https://ecommerce-9558.onrender.com/auth/signup", formData);
      console.log("Respuesta del backend:", response.data);

      if (response.status === 201) {
        alert("Usuario registrado. Redirigiendo...");
        navigate("/login");
        return true;
      }
    } catch (error) {
      console.error("Error durante la solicitud:", error);

      if (error.response) {
        alert(`Error del servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        alert("No se recibió respuesta del servidor.");
      } else {
        alert(`Error al enviar la solicitud: ${error.message}`);
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
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          country: '',
          address: '',
          city: '',
        }}
        validate={() => ({})} // Desactiva temporalmente la validación
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          console.log("Formulario enviado con valores:", values);

          const success = await posData({
            ...values,
            phone: Number(values.phone) // Convierte el teléfono a número
          });

          if (success) resetForm();
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="register__form">
            {['name', 'email', 'password', 'confirmPassword', 'phone', 'country', 'address', 'city'].map((field) => (
              <div key={field} className="register__field">
                <label className="register__label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <Field type={field.includes('password') ? 'password' : 'text'} name={field} className="register__input" />
                <ErrorMessage name={field} component="div" className="register__error" />
              </div>
            ))}

            <button type="submit" className="register__button">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
