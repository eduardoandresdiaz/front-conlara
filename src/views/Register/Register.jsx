import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useState } from 'react';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const uploadProfileImage = async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // 👈 Adjuntar la imagen correctamente
  
      console.log("📤 Subiendo imagen al backend:", formData);
  
      const response = await axios.post(
        `https://ecommerce-9558.onrender.com/file-upload/uploadProfileImage/${userId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      console.log("✅ Imagen subida exitosamente:", response.data);
      return response.data.imgUrlUser; // 👈 Retorna la URL de la imagen subida
    } catch (error) {
      console.error("❌ Error al subir la imagen:", error);
      return null;
    }
  };
  

  const posData = async (formData) => {
    console.log("📤 Datos enviados al backend:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.post(
        "https://ecommerce-9558.onrender.com/auth/signup",
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 201) {
        alert("Usuario registrado. Redirigiendo...");
        navigate("/login");
        return true;
      }
    } catch (error) {
      console.error("Error durante la solicitud:", error);
      if (error.response) {
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
          nickname: '',
          profileImage: null,
          acceptTerms: false
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) errors.name = 'El nombre es obligatorio.';
          if (!values.dni) errors.dni = 'El DNI es obligatorio.';
          else if (!/^\d{7,8}$/.test(values.dni)) errors.dni = 'DNI inválido.';
          if (!values.email) errors.email = 'El email es obligatorio.';
          if (!values.password) errors.password = 'La contraseña es obligatoria.';
          else if (values.password.length < 6) errors.password = 'Debe tener al menos 6 caracteres.';
          if (values.password !== values.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
          if (!values.phone) errors.phone = 'El teléfono es obligatorio.';
          if (!values.nickname) errors.nickname = 'El nickname es obligatorio.';
          if (!values.acceptTerms) errors.acceptTerms = 'Debes aceptar los Términos y Condiciones.';
          return errors;
        }}
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          console.log("📤 Datos antes de enviar:", values);
        
          try {
            // 1️⃣ Registro del usuario (sin imagen)
            const userResponse = await axios.post(
              "https://ecommerce-9558.onrender.com/auth/signup",
              {
                name: values.name,
                dni: values.dni,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                phone: values.phone.startsWith("+54") ? values.phone : `+54${values.phone}`,
                country: values.country,
                address: values.address,
                city: values.city,
                nickname: values.nickname,
                imgUrlUser: "https://res.cloudinary.com/dvp0fdhyc/image/upload/v1745373239/sinfoto_rxnp9w.jpg"
              }
            );
        
            if (userResponse.status !== 201) throw new Error("Error al registrar usuario");
        
            const userId = userResponse.data.id;
            console.log("✅ Usuario creado con ID:", userId);
        
            // 2️⃣ Subida de imagen si el usuario proporciona una
            if (values.profileImage) {
              const imageFormData = new FormData();
              imageFormData.append("file", values.profileImage);
        
              const uploadRes = await axios.post(
                `https://ecommerce-9558.onrender.com/file-upload/uploadProfileImage/${userId}`,
                imageFormData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
        
              const uploadedImageUrl = uploadRes.data.imgUrlUser;
              console.log("✅ Imagen subida con URL:", uploadedImageUrl);
            }
        
            alert("¡Registro exitoso!");
            resetForm();
            setPreviewImage(null);
            navigate("/login");
          } catch (error) {
            console.error("❌ Error en el registro:", error.response?.data || error.message);
            alert("Hubo un problema al registrar el usuario.");
          }
        
          setSubmitting(false);
        }}
        
        
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="register__form">

            {/* Campos de texto */}
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

            {/* Nickname */}
            <div className="register__field">
              <label htmlFor="nickname" className="register__label">Nickname</label>
              <Field type="text" name="nickname" id="nickname" className="register__input" />
              <ErrorMessage name="nickname" component="div" className="register__error" />
            </div>

            {/* Imagen de perfil */}
            <div className="register__field">
              <label htmlFor="profileImage" className="register__label">Imagen de Perfil</label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFieldValue('profileImage', file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setPreviewImage(reader.result);
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewImage(null);
                  }
                }}
                className="register__input"
              />
              {previewImage && (
                <div className="register__image-preview">
                  <img src={previewImage} alt="Vista previa" className="register__image" />
                </div>
              )}
            </div>

            {/* Términos y Condiciones */}
            <div className="register__field">
              <label className="register__label">Términos y Condiciones</label>
              <div className="register__terms-box">
                <strong>Términos y Condiciones:</strong>
                <p>Al registrarte aceptás nuestros Términos y Condiciones de uso. Conlara actúa como intermediario en las transacciones...</p>
                <p><strong>1. Aceptación de los Términos:</strong> El acceso y uso de la plataforma conlara.com.ar implica la aceptación...</p>
                <p><strong>10. Jurisdicción:</strong> Este acuerdo se rige por las leyes de la República Argentina...</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Field
                  type="checkbox"
                  name="acceptTerms"
                  checked={values.acceptTerms}
                  onChange={() => setFieldValue('acceptTerms', !values.acceptTerms)}
                />
                Acepto los Términos y Condiciones
              </label>
              <ErrorMessage name="acceptTerms" component="div" className="register__error" />
            </div>

            <button type="submit" className="register__button" disabled={isSubmitting || !values.acceptTerms}>
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;




// import { useNavigate } from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import axios from 'axios';
// //import { useState } from 'react';
// import './Register.css';

// const Register = () => {
//   const navigate = useNavigate();

//   const posData = async (formData) => {
//     try {
//       console.log("Enviando al backend:", formData);

//       const response = await axios.post(
//         "https://ecommerce-9558.onrender.com/auth/signup",
//         formData
//       );
//       console.log("Respuesta del backend:", response.data);

//       if (response.status === 201) {
//         alert("Usuario registrado. Redirigiendo...");
//         navigate("/login");
//         return true;
//       }
//     } catch (error) {
//       console.error("Error durante la solicitud:", error);
    
//       if (error.response) {
//         const serverMessage = error.response.data.message || "Error inesperado en el servidor.";
//         alert(`Problema detectado: ${serverMessage}`);
//       } else if (error.request) {
//         alert("No se recibió respuesta del servidor. Verifica tu conexión.");
//       } else {
//         alert(`Error inesperado: ${error.message}`);
//       }
    
//       return false;
//     }
//   };

//   return (
//     <div className="register">
//       <h1 className="register__title">Registro</h1>
//       <Formik
//         initialValues={{
//           name: '',
//           dni: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//           phone: '',
//           country: '',
//           address: '',
//           city: '',
//           acceptTerms: false
//         }}
//         validate={(values) => {
//           const errors = {};

//           if (!values.name) {
//             errors.name = 'El nombre es obligatorio.';
//           }

//           if (!values.dni) {
//             errors.dni = 'El DNI es obligatorio.';
//           } else if (!/^\d{7,8}$/.test(values.dni)) {
//             errors.dni = 'El DNI debe ser un número válido (7 u 8 dígitos).';
//           }

//           if (!values.email) {
//             errors.email = 'El email es obligatorio.';
//           }

//           if (!values.password) {
//             errors.password = 'La contraseña es obligatoria.';
//           } else if (values.password.length < 6) {
//             errors.password = 'La contraseña debe tener al menos 6 caracteres.';
//           }

//           if (values.password !== values.confirmPassword) {
//             errors.confirmPassword = 'Las contraseñas no coinciden.';
//           }

//           if (!values.phone) {
//             errors.phone = 'El teléfono es obligatorio.';
//           }

//           if (!values.acceptTerms) {
//             errors.acceptTerms = 'Debes aceptar los Términos y Condiciones.';
//           }

//           return errors;
//         }}
//         onSubmit={async (values, { setSubmitting, resetForm }) => {
//           try {
//             const processedValues = {
//               ...values,
//               phone: values.phone.startsWith('+54') ? values.phone : `+54${values.phone}`,
//             };

//             console.log("Valores procesados para enviar:", processedValues);

//             const success = await posData(processedValues);

//             if (success) resetForm();
//           } catch (error) {
//             console.error("Error al enviar los datos:", error);
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ isSubmitting, values, setFieldValue }) => (
//           <Form className="register__form">
//             <div className="register__field">
//               <label htmlFor="name" className="register__label">Nombre y Apellido</label>
//               <Field type="text" name="name" id="name" className="register__input" />
//               <ErrorMessage name="name" component="div" className="register__error" />
//             </div>

//             <div className="register__field">
//               <label htmlFor="dni" className="register__label">DNI</label>
//               <Field type="text" name="dni" id="dni" className="register__input" />
//               <ErrorMessage name="dni" component="div" className="register__error" />
//             </div>

//             <div className="register__field">
//               <label htmlFor="email" className="register__label">Email</label>
//               <Field type="email" name="email" id="email" className="register__input" />
//               <ErrorMessage name="email" component="div" className="register__error" />
//             </div>

//             <div className="register__field">
//               <label htmlFor="password" className="register__label">Clave</label>
//               <Field type="password" name="password" id="password" className="register__input" />
//               <ErrorMessage name="password" component="div" className="register__error" />
//             </div>

//             <div className="register__field">
//               <label htmlFor="confirmPassword" className="register__label">Confirmar Clave</label>
//               <Field type="password" name="confirmPassword" id="confirmPassword" className="register__input" />
//               <ErrorMessage name="confirmPassword" component="div" className="register__error" />
//             </div>

//             <div className="register__field">
//               <label htmlFor="phone" className="register__label">Teléfono</label>
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <span style={{ marginRight: "8px" }}>+54</span>
//                 <Field type="text" name="phone" id="phone" className="register__input" />
//               </div>
//               <ErrorMessage name="phone" component="div" className="register__error" />
//             </div>

//             <div className="register__field">
//               <label htmlFor="country" className="register__label">Provincia</label>
//               <Field type="text" name="country" id="country" className="register__input" />
//               <ErrorMessage name="country" component="div" className="register__error" />
//             </div>

//             <div className="register__field">
//               <label htmlFor="address" className="register__label">Dirección</label>
//               <Field type="text" name="address" id="address" className="register__input" />
//               <ErrorMessage name="address" component="div" className="register__error" />
//             </div>

//             <div className="register__field">
//               <label htmlFor="city" className="register__label">Ciudad</label>
//               <Field type="text" name="city" id="city" className="register__input" />
//               <ErrorMessage name="city" component="div" className="register__error" />
//             </div>

//             {/* Términos y Condiciones */}
//             <div className="register__field">
//   <label className="register__label">Términos y Condiciones</label>
//   <div
//     style={{
//       maxHeight: '150px',
//       overflowY: 'scroll',
//       padding: '10px',
//       border: '1px solid #ccc',
//       marginBottom: '10px',
//       backgroundColor: '#f9f9f9',
//       fontSize: '0.9rem'
//     }}
//   >
//    <div className="register__terms-box">
//   <strong>Términos y Condiciones:</strong>
//   {/*  */}
// </div>

//   </div>
//   <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//     <Field
//       type="checkbox"
//       name="acceptTerms"
//       checked={values.acceptTerms}
//       onChange={() => setFieldValue('acceptTerms', !values.acceptTerms)}
//     />
//     Acepto los Términos y Condiciones
//   </label>
//   <ErrorMessage name="acceptTerms" component="div" className="register__error" />
// </div>


//             <button type="submit" className="register__button" disabled={isSubmitting || !values.acceptTerms}>
//               {isSubmitting ? "Registrando..." : "Registrarse"}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default Register;

{/* <p>Al registrarte aceptás nuestros Términos y Condiciones de uso. Conlara actúa como intermediario en las transacciones, no se responsabiliza por publicaciones ni cumplimiento de acuerdos entre usuarios. Todo contenido en el sitio es propiedad intelectual de sus autores. Nos reservamos el derecho de suspender cuentas por uso indebido. Para más información consultá nuestra política completa disponible en el sitio.</p>
  
  <p>El uso del sitio implica aceptar las condiciones descritas. El usuario será responsable de la información proporcionada y de su conducta en la plataforma. Conlara se reserva el derecho de modificar estos términos cuando lo considere necesario.</p>
  
  <strong>Términos y Condiciones de Uso de Conlara</strong>
  <p><em>Última actualización: Abril 2025</em></p>

  <p>Bienvenido a Conlara. Al registrarte y utilizar nuestros servicios aceptás los siguientes Términos y Condiciones. Te recomendamos leerlos atentamente.</p>

  <p><strong>1. Aceptación de los Términos:</strong> El acceso y uso de la plataforma conlara.com.ar implica la aceptación plena de estos términos. Si no estás de acuerdo con alguno de ellos, por favor no continúes con el uso de la plataforma.</p>

  <p><strong>2. Registro de Usuarios:</strong> Para operar dentro del sitio, es obligatorio completar el formulario de registro con datos válidos. El usuario declara y garantiza que la información brindada es veraz, actual y completa.</p>

  <p><strong>3. Confidencialidad de la Cuenta:</strong> El usuario es responsable de la confidencialidad de su cuenta y contraseña. Conlara no se responsabiliza por el uso indebido de credenciales por terceros.</p>

  <p><strong>4. Publicaciones:</strong> Los productos publicados deben cumplir con la legislación vigente y las políticas del sitio. Conlara se reserva el derecho de eliminar publicaciones sin previo aviso si considera que infringen estas normas.</p>

  <p><strong>5. Responsabilidad sobre las Transacciones:</strong> Conlara actúa como intermediario entre vendedores y compradores, pero no participa directamente en las transacciones. No garantiza la veracidad de las publicaciones, ni se responsabiliza por el cumplimiento de las obligaciones asumidas por los usuarios.</p>

  <p><strong>6. Prohibiciones:</strong> Está prohibido:</p>
  <ul>
    <li>Utilizar el sitio para fines ilegales o fraudulentos.</li>
    <li>Publicar contenido ofensivo, discriminatorio o falso.</li>
    <li>Manipular precios o interferir en las publicaciones de otros usuarios.</li>
  </ul>

  <p><strong>7. Propiedad Intelectual:</strong> Todo el contenido del sitio (textos, imágenes, logos, etc.) es propiedad de Conlara o de sus respectivos titulares. Su uso no autorizado está prohibido.</p>

  <p><strong>8. Protección de Datos:</strong> Los datos personales serán tratados conforme a nuestra Política de Privacidad. Al registrarte, aceptás que Conlara procese tus datos para brindarte los servicios.</p>

  <p><strong>9. Modificaciones de los Términos:</strong> Conlara podrá modificar los Términos y Condiciones en cualquier momento. Los cambios serán informados por los canales habituales y entrarán en vigencia 10 días después de su publicación.</p>

  <p><strong>10. Jurisdicción:</strong> Este acuerdo se rige por las leyes de la República Argentina. Cualquier controversia será resuelta por el <strong>Juzgado de Concarán, San Luis, Argentina</strong>.</p> */}