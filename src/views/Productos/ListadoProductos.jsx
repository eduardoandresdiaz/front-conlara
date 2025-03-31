import { useEffect, useState } from 'react';
import './ListadoProductos.css'; // Cambié la referencia a ListadoProductos.css
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para manejar la navegación

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para redirigir a otra página

  // Fetch de productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await fetch('https://ecommerce-9558.onrender.com/products?page=1&limit=1000');
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProductos(data); // Actualiza el estado con los productos recibidos
      setError('');
    } catch (error) {
      setError(error.message);
      setProductos([]);
    }
  };

  // Llamar a la API al montar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para manejar el clic en "Me Interesa"
  const handleClick = (id) => {
    navigate(`/productos/${id}`); // Redirige a la página de detalles del producto
  };

  return (
    <div className="listadoProductos">
      {error && <p className="listadoProductos__error">{error}</p>}

      <div className="listadoProductos__list">
        {productos.length === 0 && !error ? (
          <p>Cargando productos...</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="listadoProductos__details">
              <h2>{producto.name}</h2>
              <p><strong>Descripción:</strong> {producto.description}</p>
              <p><strong>Precio:</strong> ${producto.price}</p>
              <p><strong>Stock:</strong> {producto.stock}</p>
              <p><strong>Categoría:</strong> {producto.category.name}</p>
              <img
                src={producto.imgUrl}
                alt={`Imagen de ${producto.name}`}
                style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'cover' }}
              />
              <button
                className="meInteresaBoton"
                onClick={() => handleClick(producto.id)} // Manejar el clic para abrir detalles
              >
                Me Interesa
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListadoProductos;


// import { useEffect, useState } from 'react';
// import './ListadoProductos.css'; // Cambié la referencia a ListadoProductos.css

// const ListadoProductos = () => {
//   const [productos, setProductos] = useState([]);
//   const [error, setError] = useState('');

//   // Fetch de productos desde la API
//   const fetchProductos = async () => {
//     try {
//       const response = await fetch('https://ecommerce-9558.onrender.com/products?page=1&limit=1000');
//       if (!response.ok) {
//         throw new Error('Error al obtener los productos');
//       }
//       const data = await response.json();
//       setProductos(data); // Actualiza el estado con los productos recibidos
//       setError('');
//     } catch (error) {
//       setError(error.message);
//       setProductos([]);
//     }
//   };

//   // Llamar a la API al montar el componente
//   useEffect(() => {
//     fetchProductos();
//   }, []);

//   return (
//     <div className="listadoProductos">
//       {/* <h1>Listado de Productos</h1> */}

//       {error && <p className="listadoProductos__error">{error}</p>}

//       <div className="listadoProductos__list">
//         {productos.length === 0 && !error ? (
//           <p>Cargando productos...</p>
//         ) : (
//           productos.map((producto) => (
//             <div key={producto.id} className="listadoProductos__details">
//               <h2>{producto.name}</h2>
//               <p><strong>Descripción:</strong> {producto.description}</p>
//               <p><strong>Precio:</strong> ${producto.price}</p>
//               <p><strong>Stock:</strong> {producto.stock}</p>
//               <p><strong>Categoría:</strong> {producto.category.name}</p>
//               <img
//                 src={producto.imgUrl}
//                 alt={`Imagen de ${producto.name}`}
//                 style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'cover' }}
//               />
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ListadoProductos;
