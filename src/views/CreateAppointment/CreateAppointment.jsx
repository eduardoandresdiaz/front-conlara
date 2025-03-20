import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import './CreateAppointment.css'; // Mantiene el CSS existente
import { useState } from 'react';

const CreateAppointment = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const compressedFile = await compressImage(file, 500); // Reduce a 500 KB
      setSelectedFile(compressedFile); // Reemplaza el archivo anterior
    }
  };

  const compressImage = (file, maxFileSizeKB) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Configura el tamaño del canvas
          canvas.width = img.width;
          canvas.height = img.height;

          // Dibuja la imagen en el canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Reduce la calidad hasta alcanzar 500 KB
          let quality = 0.9;
          let base64Data;

          do {
            base64Data = canvas.toDataURL('image/jpeg', quality); // Convierte a base64
            quality -= 0.1; // Reduce la calidad
          } while (base64Data.length / 1024 > maxFileSizeKB && quality > 0);

          // Convierte base64 a archivo
          fetch(base64Data)
            .then((res) => res.blob())
            .then((blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            })
            .catch(reject);
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const posData = async (formData) => {
    try {
      console.log('Datos enviados:', formData);

      // Crear el producto
      const response = await axios.post('https://ecommerce-9558.onrender.com/products', formData);
      console.log('Respuesta del backend (producto):', response.data);

      if (response.status === 201 || response.data.startsWith('Producto creado exitosamente')) {
        const productId = response.data.split(': ')[1]; // Extrae el ID del producto
        console.log('ID del producto:', productId);

        // Subir imagen asociada al producto
        if (selectedFile) {
          const formDataImage = new FormData();
          formDataImage.append('file', selectedFile);

          const imageResponse = await axios.post(
            `https://ecommerce-9558.onrender.com/file-upload/uploadImage/${productId}`,
            formDataImage,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );

          console.log('Respuesta del backend (imagen):', imageResponse.data);
          alert('Producto creado y imagen subida exitosamente');
          return true; // Indica éxito
        } else {
          alert('Producto creado exitosamente (sin imagen)');
          return true;
        }
      } else {
        alert('Error inesperado en el servidor');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'No se pudo completar la acción');
      return false; // Indica error
    }
  };

  return (
    <div className="create-appointment">
      <h1 className="create-appointment__title">Crear Producto</h1>
      <Formik
        initialValues={{
          name: '',
          description: '',
          price: '',
          stock: '',
          category: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = 'El nombre del producto es obligatorio.';
          }
          if (!values.description) {
            errors.description = 'La descripción es obligatoria.';
          }
          if (!values.price) {
            errors.price = 'El precio es obligatorio.';
          } else if (isNaN(values.price) || values.price <= 0) {
            errors.price = 'El precio debe ser un número positivo.';
          }
          if (!values.stock) {
            errors.stock = 'La cantidad es obligatoria.';
          } else if (!Number.isInteger(Number(values.stock)) || values.stock < 0) {
            errors.stock = 'La cantidad debe ser un número entero positivo.';
          }
          if (!values.category) {
            errors.category = 'La categoría es obligatoria.';
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const success = await posData(values);
          if (success) {
            resetForm(); // Limpia el formulario si se crea exitosamente
            setSelectedFile(null); // Limpia la selección de archivo
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form className="create-appointment__form">
            <div className="create-appointment__field">
              <label htmlFor="name" className="create-appointment__label">Nombre del producto</label>
              <Field
                type="text"
                name="name"
                id="name"
                className="create-appointment__input"
              />
              <ErrorMessage name="name" component="div" className="create-appointment__error" />
            </div>

            <div className="create-appointment__field">
              <label htmlFor="description" className="create-appointment__label">Descripción</label>
              <Field
                as="textarea"
                name="description"
                id="description"
                className="create-appointment__input"
              />
              <ErrorMessage name="description" component="div" className="create-appointment__error" />
            </div>

            <div className="create-appointment__field">
              <label htmlFor="price" className="create-appointment__label">Precio</label>
              <Field
                type="number"
                name="price"
                id="price"
                className="create-appointment__input"
                step="0.01"
              />
              <ErrorMessage name="price" component="div" className="create-appointment__error" />
            </div>

            <div className="create-appointment__field">
              <label htmlFor="stock" className="create-appointment__label">Cantidad</label>
              <Field
                type="number"
                name="stock"
                id="stock"
                className="create-appointment__input"
              />
              <ErrorMessage name="stock" component="div" className="create-appointment__error" />
            </div>

            <div className="create-appointment__field">
              <label htmlFor="category" className="create-appointment__label">Categoría</label>
              <Field
                type="text"
                name="category"
                id="category"
                className="create-appointment__input"
              />
              <ErrorMessage name="category" component="div" className="create-appointment__error" />
            </div>

            <div className="create-appointment__field">
              <label htmlFor="file" className="create-appointment__label">Subir Imagen</label>
              <input
                type="file"
                id="file"
                className="create-appointment__input"
                onChange={handleFileChange}
              />
            </div>

            <button
              type="submit"
              className="create-appointment__button"
              disabled={isSubmitting || Object.values(errors).some((error) => error)}
            >
              {isSubmitting ? 'Procesando...' : 'Crear Producto'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateAppointment;