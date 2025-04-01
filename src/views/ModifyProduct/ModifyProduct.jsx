import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import './ModifyProduct.css';
import { useParams, useNavigate } from 'react-router-dom';

const ModifyProduct = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // Almacenar la URL de la imagen actual

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://ecommerce-9558.onrender.com/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Configurar valores iniciales y almacenar la URL de la imagen
        setInitialValues({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          stock: response.data.stock,
          category: response.data.category ? response.data.category.id : '',
        });

        setImageUrl(response.data.imgUrl); // Guardar la URL de la imagen
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        alert('No se pudo cargar el producto.');
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://ecommerce-9558.onrender.com/categories',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
        alert('No se pudieron cargar las categorías.');
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const updateProduct = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Datos enviados al backend:', JSON.stringify(formData, null, 2));
      await axios.put(
        `https://ecommerce-9558.onrender.com/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (selectedFile) {
        const formDataImage = new FormData();
        formDataImage.append('file', selectedFile);

        await axios.post(
          `https://ecommerce-9558.onrender.com/file-upload/uploadImage/${id}`,
          formDataImage,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert('Producto modificado y nueva imagen subida exitosamente.');
      } else {
        alert('Producto modificado exitosamente (sin cambiar imagen).');
      }

      navigate('/mis-productos');
    } catch (error) {
      console.error('Error al modificar el producto:', error);
      alert(error.response?.data?.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <div className="modify-product">
      <h1 className="modify-product__title">Modificar Producto</h1>
      {Object.keys(initialValues).length > 0 ? (
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors = {};
            if (!values.name) errors.name = 'El nombre del producto es obligatorio.';
            if (!values.description) errors.description = 'La descripción es obligatoria.';
            if (!values.price || isNaN(values.price) || values.price <= 0) {
              errors.price = 'El precio debe ser un número positivo.';
            }
            if (
              !values.stock ||
              !Number.isInteger(Number(values.stock)) ||
              values.stock < 0
            ) {
              errors.stock = 'La cantidad debe ser un número entero positivo.';
            }
            if (!values.category || !/^[0-9a-fA-F-]{36}$/.test(values.category)) {
              errors.category = 'La categoría es obligatoria y debe ser un UUID válido.';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = {
              name: values.name,
              description: values.description,
              price: parseFloat(values.price),
              stock: parseInt(values.stock, 10),
              category: { id: values.category },
            };

            await updateProduct(formData);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="modify-product__form">
              <div className="modify-product__field">
                <label htmlFor="name" className="modify-product__label">
                  Nombre del producto
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="modify-product__input"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="modify-product__error"
                />
              </div>

              <div className="modify-product__field">
                <label htmlFor="description" className="modify-product__label">
                  Descripción
                </label>
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  className="modify-product__input"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="modify-product__error"
                />
              </div>

              <div className="modify-product__field">
                <label htmlFor="price" className="modify-product__label">
                  Precio
                </label>
                <Field
                  type="number"
                  name="price"
                  id="price"
                  className="modify-product__input"
                  step="0.01"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="modify-product__error"
                />
              </div>

              <div className="modify-product__field">
                <label htmlFor="stock" className="modify-product__label">
                  Cantidad
                </label>
                <Field
                  type="number"
                  name="stock"
                  id="stock"
                  className="modify-product__input"
                />
                <ErrorMessage
                  name="stock"
                  component="div"
                  className="modify-product__error"
                />
              </div>

              <div className="modify-product__field">
                <label htmlFor="category" className="modify-product__label">
                  Categoría
                </label>
                <Field
                  as="select"
                  name="category"
                  id="category"
                  className="modify-product__input"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="modify-product__error"
                />
              </div>

              {/* Mostrar la imagen actual */}
              {imageUrl && (
                <div className="modify-product__field">
                  <label className="modify-product__label">Imagen Actual</label>
                  <img
                    src={imageUrl}
                    alt="Imagen actual del producto"
                    className="modify-product__image"
                  />
                </div>
              )}

              <div className="modify-product__field">
                <label htmlFor="file" className="modify-product__label">
                  Subir Nueva Imagen
                </label>
                <input
                  type="file"
                  id="file"
                  className="modify-product__input"
                  onChange={handleFileChange}
                />
              </div>

              <button
                type="submit"
                className="modify-product__button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Modificando...' : 'Modificar Publicacion'}
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <p>Cargando producto...</p>
      )}
    </div>
  );
};

export default ModifyProduct;


// import { useEffect, useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import axios from 'axios';
// import './ModifyProduct.css'; // Mantén un CSS separado para este formulario
// import { useParams, useNavigate } from 'react-router-dom';

// const ModifyProduct = () => {
//   const { id } = useParams(); // Obtener el ID del producto desde la URL
//   const navigate = useNavigate();
//   const [initialValues, setInitialValues] = useState({});
//   const [categories, setCategories] = useState([]); // Para almacenar las categorías
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(
//           `https://ecommerce-9558.onrender.com/products/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );
//         setInitialValues({
//           name: response.data.name,
//           description: response.data.description,
//           price: response.data.price,
//           stock: response.data.stock,
//           category: response.data.category ? response.data.category.id : '',
//         });
//       } catch (error) {
//         console.error('Error al cargar el producto:', error);
//         alert('No se pudo cargar el producto.');
//       }
//     };

//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           'https://ecommerce-9558.onrender.com/categories',
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error('Error al cargar las categorías:', error);
//         alert('No se pudieron cargar las categorías.');
//       }
//     };

//     fetchProduct();
//     fetchCategories();
//   }, [id]);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const updateProduct = async (formData) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No se encontró un token de autenticación.');
//       }

//       console.log('Datos enviados al backend:', JSON.stringify(formData, null, 2));
//       const response = await axios.put(
//         `https://ecommerce-9558.onrender.com/products/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       console.log('Respuesta del servidor (producto):', response.data);

//       if (selectedFile) {
//         const formDataImage = new FormData();
//         formDataImage.append('file', selectedFile);

//         const imageResponse = await axios.post(
//           `https://ecommerce-9558.onrender.com/file-upload/uploadImage/${id}`,
//           formDataImage,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//         console.log('Respuesta del servidor (imagen):', imageResponse.data);
//         alert('Producto modificado y nueva imagen subida exitosamente.');
//       } else {
//         alert('Producto modificado exitosamente (sin cambiar imagen).');
//       }

//       navigate('/mis-productos');
//     } catch (error) {
//       console.error('Error al modificar el producto:', error);
//       alert(error.response?.data?.message || 'Ocurrió un error inesperado.');
//     }
//   };

//   return (
//     <div className="modify-product">
//       <h1 className="modify-product__title">Modificar Producto</h1>
//       {Object.keys(initialValues).length > 0 ? (
//         <Formik
//           initialValues={initialValues}
//           validate={(values) => {
//             const errors = {};
//             if (!values.name) errors.name = 'El nombre del producto es obligatorio.';
//             if (!values.description) errors.description = 'La descripción es obligatoria.';
//             if (!values.price || isNaN(values.price) || values.price <= 0) {
//               errors.price = 'El precio debe ser un número positivo.';
//             }
//             if (
//               !values.stock ||
//               !Number.isInteger(Number(values.stock)) ||
//               values.stock < 0
//             ) {
//               errors.stock = 'La cantidad debe ser un número entero positivo.';
//             }
//             if (!values.category || !/^[0-9a-fA-F-]{36}$/.test(values.category)) {
//               errors.category = 'La categoría es obligatoria y debe ser un UUID válido.';
//             }
//             return errors;
//           }}
//           onSubmit={async (values, { setSubmitting }) => {
//             const formData = {
//               name: values.name,
//               description: values.description,
//               price: parseFloat(values.price),
//               stock: parseInt(values.stock, 10),
//               category: { id: values.category }, // Enviar categoría como objeto con ID
//             };

//             await updateProduct(formData);
//             setSubmitting(false);
//           }}
//         >
//           {({ isSubmitting }) => (
//             <Form className="modify-product__form">
//               <div className="modify-product__field">
//                 <label htmlFor="name" className="modify-product__label">
//                   Nombre del producto
//                 </label>
//                 <Field
//                   type="text"
//                   name="name"
//                   id="name"
//                   className="modify-product__input"
//                 />
//                 <ErrorMessage
//                   name="name"
//                   component="div"
//                   className="modify-product__error"
//                 />
//               </div>

//               <div className="modify-product__field">
//                 <label htmlFor="description" className="modify-product__label">
//                   Descripción
//                 </label>
//                 <Field
//                   as="textarea"
//                   name="description"
//                   id="description"
//                   className="modify-product__input"
//                 />
//                 <ErrorMessage
//                   name="description"
//                   component="div"
//                   className="modify-product__error"
//                 />
//               </div>

//               <div className="modify-product__field">
//                 <label htmlFor="price" className="modify-product__label">
//                   Precio
//                 </label>
//                 <Field
//                   type="number"
//                   name="price"
//                   id="price"
//                   className="modify-product__input"
//                   step="0.01"
//                 />
//                 <ErrorMessage
//                   name="price"
//                   component="div"
//                   className="modify-product__error"
//                 />
//               </div>

//               <div className="modify-product__field">
//                 <label htmlFor="stock" className="modify-product__label">
//                   Cantidad
//                 </label>
//                 <Field
//                   type="number"
//                   name="stock"
//                   id="stock"
//                   className="modify-product__input"
//                 />
//                 <ErrorMessage
//                   name="stock"
//                   component="div"
//                   className="modify-product__error"
//                 />
//               </div>

//               <div className="modify-product__field">
//                 <label htmlFor="category" className="modify-product__label">
//                   Categoría
//                 </label>
//                 <Field
//                   as="select"
//                   name="category"
//                   id="category"
//                   className="modify-product__input"
//                 >
//                   <option value="">Selecciona una categoría</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </Field>
//                 <ErrorMessage
//                   name="category"
//                   component="div"
//                   className="modify-product__error"
//                 />
//               </div>

//               <div className="modify-product__field">
//                 <label htmlFor="file" className="modify-product__label">
//                   Subir Nueva Imagen
//                 </label>
//                 <input
//                   type="file"
//                   id="file"
//                   className="modify-product__input"
//                   onChange={handleFileChange}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="modify-product__button"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Modificando...' : 'Modificar Publicacion'}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       ) : (
//         <p>Cargando producto...</p>
//       )}
//     </div>
//   );
// };

// export default ModifyProduct;
