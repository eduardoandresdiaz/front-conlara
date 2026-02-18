import { useEffect, useState } from 'react';
import './ListadoProductos.css';
import { useNavigate } from 'react-router-dom';

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1); // página actual
  const [hasMore, setHasMore] = useState(true); // controlar si hay más productos
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProductos = async (pageNumber = 1, append = false) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ecommerce-9558.onrender.com/products?page=${pageNumber}&limit=1000`
      );
      if (!response.ok) throw new Error('Error al obtener los productos');
      const data = await response.json();

      // 👇 acumula productos si append es true
      setProductos((prev) => (append ? [...prev, ...data] : data));
      setError('');
      setHasMore(data.length === 50); // si devuelve menos de 50, no hay más
    } catch (error) {
      setError(error.message);
      if (!append) setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusqueda = async (pageNumber = 1, append = false) => {
    if (busqueda.trim() === '') return fetchProductos(pageNumber, append);
    try {
      setLoading(true);
      const response = await fetch(
        `https://ecommerce-9558.onrender.com/products/search?q=${encodeURIComponent(busqueda)}&page=${pageNumber}&limit=50`
      );
      if (!response.ok) throw new Error('Error al buscar productos');
      const data = await response.json();

      setProductos((prev) => (append ? [...prev, ...data] : data));
      setError('');
      setHasMore(data.length === 50);
    } catch (error) {
      setError(error.message);
      if (!append) setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos(page);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        if (hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          busqueda.trim() === ''
            ? fetchProductos(nextPage, true)
            : fetchBusqueda(nextPage, true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, busqueda, page]);

  const handleClick = (id) => {
    navigate(`/productos/${id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBusqueda(1, false);
  };

  const formatPrice = (price) => {
    const validPrice = isNaN(price) ? 0 : parseFloat(price);
    return validPrice === 1 ? 'Consultar' : `$${validPrice.toFixed(2)}`;
  };

  return (
    <div className="listadoProductos">
      {/* Buscador */}
      <form className="listadoProductos__buscador" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      {error && <p className="listadoProductos__error">{error}</p>}

      <div className="listadoProductos__list">
        {productos.length === 0 && !error ? (
          <p>Cargando productos...</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="listadoProductos__details">
              <img
                src={producto.imgUrl}
                alt={`Imagen de ${producto.name}`}
                className="listadoProductos__img"
              />
              <h2>{producto.name}</h2>
              <div className="price">
                <span>Precio: {formatPrice(producto.price)}</span>
              </div>
              <button
                className="meInteresaBoton"
                onClick={() => handleClick(producto.id)}
              >
                Me Interesa
              </button>
            </div>
          ))
        )}
      </div>

      {loading && <p>Cargando más productos...</p>}
    </div>
  );
};

export default ListadoProductos;


// import { useEffect, useState } from 'react';
// import './ListadoProductos.css';
// import { useNavigate } from 'react-router-dom';

// const ListadoProductos = () => {
//   const [productos, setProductos] = useState([]);
//   const [error, setError] = useState('');
//   const [busqueda, setBusqueda] = useState('');
//   const navigate = useNavigate();

//   const fetchProductos = async () => {
//     try {
//       const response = await fetch('https://ecommerce-9558.onrender.com/products?page=1&limit=50');
//       if (!response.ok) throw new Error('Error al obtener los productos');
//       const data = await response.json();
//       setProductos(data);
//       setError('');
//     } catch (error) {
//       setError(error.message);
//       setProductos([]);
//     }
//   };

//   const fetchBusqueda = async () => {
//     if (busqueda.trim() === '') return fetchProductos();
//     try {
//       const response = await fetch(`https://ecommerce-9558.onrender.com/products/search?q=${encodeURIComponent(busqueda)}`);
//       if (!response.ok) throw new Error('Error al buscar productos');
//       const data = await response.json();
//       setProductos(data);
//       setError('');
//     } catch (error) {
//       setError(error.message);
//       setProductos([]);
//     }
//   };

//   useEffect(() => {
//     fetchProductos();
//   }, []);

//   const handleClick = (id) => {
//     navigate(`/productos/${id}`);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchBusqueda();
//   };

//   const formatPrice = (price) => {
//     const validPrice = isNaN(price) ? 0 : parseFloat(price);
//     return validPrice === 1 ? "Consultar" : `$${validPrice.toFixed(2)}`;
//   };

//   return (
//     <div className="listadoProductos">
//       {/* Buscador */}
//       <form className="listadoProductos__buscador" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Buscar productos..."
//           value={busqueda}
//           onChange={(e) => setBusqueda(e.target.value)}
//         />
//         <button type="submit">🔍</button>
//       </form>

//       {error && <p className="listadoProductos__error">{error}</p>}

//       <div className="listadoProductos__list">
//         {productos.length === 0 && !error ? (
//           <p>Cargando productos...</p>
//         ) : (
//           productos.map((producto) => {
//             return (
//               <div key={producto.id} className="listadoProductos__details">
//                 <img
//                   src={producto.imgUrl}
//                   alt={`Imagen de ${producto.name}`}
//                   className="listadoProductos__img"
//                 />
//                 <h2>{producto.name}</h2>
//                 <div className="price">
//                   <span>Precio: {formatPrice(producto.price)}</span>
//                 </div>
//                 <button
//                   className="meInteresaBoton"
//                   onClick={() => handleClick(producto.id)}
//                 >
//                   Me Interesa
//                 </button>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default ListadoProductos;

// import { useEffect, useState } from 'react';
// import './ListadoProductos.css';
// import { useNavigate } from 'react-router-dom';

// const ListadoProductos = () => {
//   const [productos, setProductos] = useState([]);
//   const [error, setError] = useState('');
//   const [busqueda, setBusqueda] = useState('');
//   const navigate = useNavigate();

//   const fetchProductos = async () => {
//     try {
//       const response = await fetch('https://ecommerce-9558.onrender.com/products?page=1&limit=1000');
//       if (!response.ok) throw new Error('Error al obtener los productos');
//       const data = await response.json();
//       setProductos(data);
//       setError('');
//     } catch (error) {
//       setError(error.message);
//       setProductos([]);
//     }
//   };

//   const fetchBusqueda = async () => {
//     if (busqueda.trim() === '') return fetchProductos(); // Si está vacío, cargar todos
//     try {
//       const response = await fetch(`https://ecommerce-9558.onrender.com/products/search?q=${encodeURIComponent(busqueda)}`);
//       if (!response.ok) throw new Error('Error al buscar productos');
//       const data = await response.json();
//       setProductos(data);
//       setError('');
//     } catch (error) {
//       setError(error.message);
//       setProductos([]);
//     }
//   };

//   useEffect(() => {
//     fetchProductos();
//   }, []);

//   const handleClick = (id) => {
//     navigate(`/productos/${id}`);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchBusqueda();
//   };

//   const formatPrice = (price) => {
//     // Asegurarse de que el precio sea un número válido
//     const validPrice = isNaN(price) ? 0 : parseFloat(price);
//     // Mostrar "Consultar" si el precio es 1.00
//     return validPrice === 1 ? "Consultar" : `$${validPrice.toFixed(2)}`;
//   };

//   return (
//     <div className="listadoProductos">
//       {/* Buscador */}
//       <form className="listadoProductos__buscador" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Buscar productos..."
//           value={busqueda}
//           onChange={(e) => setBusqueda(e.target.value)}
//         />
//         <button type="submit">🔍</button>
//       </form>

//       {error && <p className="listadoProductos__error">{error}</p>}

//       <div className="listadoProductos__list">
//         {productos.length === 0 && !error ? (
//           <p>Cargando productos...</p>
//         ) : (
//           productos.map((producto) => {
//             return (
//               <div key={producto.id} className="listadoProductos__details">
//                 <img
//                   src={producto.imgUrl}
//                   alt={`Imagen de ${producto.name}`}
//                   className="listadoProductos__img"
//                 />
//                 <h2>{producto.name}</h2>
//                 {/* <p>{producto.description}</p> */}
//                 <div className="price">
//                   <span>Precio: {formatPrice(producto.price)}</span>
//                 </div>
//                 <button
//                   className="meInteresaBoton"
//                   onClick={() => handleClick(producto.id)}
//                 >
//                   Me Interesa
//                 </button>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default ListadoProductos;
