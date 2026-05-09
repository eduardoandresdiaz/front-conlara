import { useEffect, useState } from 'react';
import { useUser } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
import './MisProductos.css';

const MisProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [mensajeStock, setMensajeStock] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchProductos = async () => {
    try {
      if (!user || !user.email) {
        throw new Error("No se encontró el email del usuario.");
      }

      const response = await fetch(`https://ecommerce-9558.onrender.com/products/by-creator?creatorEmail=${user.email}`);
      if (!response.ok) {
        throw new Error('Error al obtener los productos del usuario');
      }
      const data = await response.json();
      setProductos(data);
      setError('');
    } catch (error) {
      setError(error.message);
      setProductos([]);
    }
  };

  const eliminarProducto = async (producto) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No se encontró un token de autenticación.");
      }

      const imgUrl = producto.imgUrl;
      const publicId = imgUrl.split('/').pop().split('.')[0];

      const responseImg = await fetch(`https://ecommerce-9558.onrender.com/file-upload/deleteImage/${publicId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!responseImg.ok) {
        throw new Error('Error al eliminar la imagen asociada al producto');
      }

      const responseProduct = await fetch(`https://ecommerce-9558.onrender.com/products/${producto.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!responseProduct.ok) {
        throw new Error('Error al eliminar el producto');
      }

      const deletedProduct = await responseProduct.json();
      setProductos((prevProductos) => prevProductos.filter((p) => p.id !== producto.id));
    } catch (error) {
      console.error('Error al intentar eliminar el producto y la imagen:', error.message);
    }
  };

  const marcarVendido = async (producto) => {
    try {
      if (producto.stock <= 0) {
        setMensajeStock("No quedan productos en stock");
        setModalOpen(true);
        return;
      }

      const nuevoStock = producto.stock - 1;

      const token = localStorage.getItem('token');
      const response = await fetch(`https://ecommerce-9558.onrender.com/products/${producto.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: nuevoStock }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el stock');
      }

      setProductos((prevProductos) =>
        prevProductos.map((p) =>
          p.id === producto.id ? { ...p, stock: nuevoStock } : p
        )
      );

      setMensajeStock(`Te quedan ${nuevoStock} productos en stock`);
      setModalOpen(true);
    } catch (error) {
      console.error('Error al marcar como vendido:', error.message);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="listadoProductos">
      <h1 className="tituloSuperior">Mis Publicaciones</h1>
      {error && <p className="listadoProductos__error">{error}</p>}

      <div className="listadoProductos__list">
        {productos.length === 0 && !error ? (
          <p>Cargando productos...</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="listadoProductos__details">
              <h2>{producto.name}</h2>
              <p><strong>Precio:</strong> ${producto.price}</p>
              <p><strong>Stock:</strong> {producto.stock}</p>
              <p><strong>Categoría:</strong> {producto.category.name}</p>
              <p><strong>Fecha de Creación:</strong> {new Date(producto.createdAt).toLocaleString()}</p>
              <p><strong>Fecha de Expiración:</strong> {new Date(producto.expiresAt).toLocaleDateString()}</p>

              {/* Botón Vendido entre fecha de expiración e imagen */}
              <button
                className="vendidoBoton"
                onClick={() => marcarVendido(producto)}
              >
                Vendido
              </button>

              <img
                src={producto.imgUrl}
                alt={`Imagen de ${producto.name}`}
                style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'cover' }}
              />

              <button
                className="eliminarBoton"
                onClick={() => eliminarProducto(producto)}
              >
                Eliminar Publicación
              </button>

              <button
                className="modificarBoton"
                onClick={() => navigate(`/ModifyProduct/${producto.id}`)}
              >
                Modificar Publicacion
              </button>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>{mensajeStock}</p>
            <button onClick={() => setModalOpen(false)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisProductos;

// import { useEffect, useState } from 'react';
// import { useUser } from "../../context/UserContext"; // Importar el contexto para obtener el email del usuario
// import { useNavigate } from 'react-router-dom';
// import './MisProductos.css'; // Asegúrate de que este archivo contenga los estilos necesarios

// const MisProductos = () => {
//   const [productos, setProductos] = useState([]);
//   const [error, setError] = useState('');
//   const { user } = useUser(); // Obtener el usuario logueado desde el contexto
//   const navigate = useNavigate();

//   // Fetch de productos desde la API usando el email del usuario
//   const fetchProductos = async () => {
//     try {
//       // Verificar que el usuario esté logueado y tenga un email válido
//       if (!user || !user.email) {
//         throw new Error("No se encontró el email del usuario.");
//       }

//       // Petición GET al endpoint con el email del usuario
//       const response = await fetch(`https://ecommerce-9558.onrender.com/products/by-creator?creatorEmail=${user.email}`);
//       if (!response.ok) {
//         throw new Error('Error al obtener los productos del usuario');
//       }
//       const data = await response.json();
//       setProductos(data); // Actualizar el estado con los productos recibidos
//       setError('');
//     } catch (error) {
//       setError(error.message);
//       setProductos([]);
//     }
//     ///prueba
//   };

//   // Función para eliminar un producto y su imagen
//   const eliminarProducto = async (producto) => {
//     try {
//       // Obtener el token desde el almacenamiento local
//       const token = localStorage.getItem('token'); // Suponiendo que guardaste el token al iniciar sesión

//       if (!token) {
//         throw new Error("No se encontró un token de autenticación.");
//       }

//       // Extraer el publicId de la URL de la imagen
//       const imgUrl = producto.imgUrl;
//       const publicId = imgUrl.split('/').pop().split('.')[0]; // Obtener el publicId desde la URL

//       // Petición DELETE para eliminar la imagen en Cloudinary
//       const responseImg = await fetch(`https://ecommerce-9558.onrender.com/file-upload/deleteImage/${publicId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`, // Token de autenticación
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!responseImg.ok) {
//         throw new Error('Error al eliminar la imagen asociada al producto');
//       }

//       console.log('Imagen eliminada correctamente.');

//       // Petición DELETE para eliminar el producto
//       const responseProduct = await fetch(`https://ecommerce-9558.onrender.com/products/${producto.id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`, // Token de autenticación
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!responseProduct.ok) {
//         throw new Error('Error al eliminar el producto');
//       }

//       const deletedProduct = await responseProduct.json();
//       console.log('Producto eliminado:', deletedProduct);

//       // Actualizar la lista de productos filtrando el eliminado
//       setProductos((prevProductos) => prevProductos.filter((p) => p.id !== producto.id));
//     } catch (error) {
//       console.error('Error al intentar eliminar el producto y la imagen:', error.message);
//     }
//   };

//   // Llamar a la API al montar el componente
//   useEffect(() => {
//     fetchProductos();
//   }, []);

//   return (
//     <div className="listadoProductos">
//       {/* Título superior centrado */}
//       <h1 className="tituloSuperior">Mis Publicaciones</h1>

//       {/* Mostrar mensaje de error si algo falla */}
//       {error && <p className="listadoProductos__error">{error}</p>}

//       {/* Mostrar la lista de productos */}
//       <div className="listadoProductos__list">
//         {productos.length === 0 && !error ? (
//           <p>Cargando productos...</p>
//         ) : (
//           productos.map((producto) => (
//             <div key={producto.id} className="listadoProductos__details">
//               <h2>{producto.name}</h2>
//               {/* <p><strong>Correo Electrónico:</strong> {producto.creatorEmail}</p> */}
//               <p><strong>Precio:</strong> ${producto.price}</p>
//               <p><strong>Stock:</strong> {producto.stock}</p>
//               <p><strong>Categoría:</strong> {producto.category.name}</p>
//               <p><strong>Fecha de Creación:</strong> {new Date(producto.createdAt).toLocaleString()}</p>

//               {/* Renderizar imagen del producto */}
//               <img
//                 src={producto.imgUrl} // La URL de la imagen obtenida desde el backend
//                 alt={`Imagen de ${producto.name}`} // Texto alternativo para la imagen
//                 style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'cover' }} // Ajuste de tamaño y proporciones
//                 />
//                 {/* <p><strong>Descripción:</strong> {producto.description}</p> */}

//               {/* Botón para eliminar la publicación */}
//               <button
//                 className="eliminarBoton"
//                 onClick={() => eliminarProducto(producto)}
//               >
//                 Eliminar Publicación
//               </button>

//               {/* Botón para modificar el producto */}
//               <button
//                 className="modificarBoton"
//                 onClick={() => navigate(`/ModifyProduct/${producto.id}`)} // Navega al formulario de modificación
//               >
//                 Modificar Publicacion
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default MisProductos;
