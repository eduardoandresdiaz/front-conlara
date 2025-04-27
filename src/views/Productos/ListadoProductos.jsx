import { useEffect, useState } from 'react';
import './ListadoProductos.css';
import { useNavigate } from 'react-router-dom';

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchProductos = async () => {
    try {
      const response = await fetch('https://ecommerce-9558.onrender.com/products?page=1&limit=1000');
      if (!response.ok) throw new Error('Error al obtener los productos');
      const data = await response.json();
      setProductos(data);
      setError('');
    } catch (error) {
      setError(error.message);
      setProductos([]);
    }
  };

  const fetchBusqueda = async () => {
    if (busqueda.trim() === '') return fetchProductos(); // Si está vacío, cargar todos
    try {
      const response = await fetch(`https://ecommerce-9558.onrender.com/products/search?q=${encodeURIComponent(busqueda)}`);
      if (!response.ok) throw new Error('Error al buscar productos');
      const data = await response.json();
      setProductos(data);
      setError('');
    } catch (error) {
      setError(error.message);
      setProductos([]);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleClick = (id) => {
    navigate(`/productos/${id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBusqueda();
  };

  const formatPrice = (price) => {
    // Asegurarse de que el precio sea un número válido
    const validPrice = isNaN(price) ? 0 : parseFloat(price);
    // Mostrar "Consultar" si el precio es 1.00
    return validPrice === 1 ? "Consultar" : `$${validPrice.toFixed(2)}`;
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
          productos.map((producto) => {
            return (
              <div key={producto.id} className="listadoProductos__details">
                <img
                  src={producto.imgUrl}
                  alt={`Imagen de ${producto.name}`}
                  style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'cover' }}
                />
                <h2>{producto.name}</h2>
                {/* <p>{producto.description}</p> */}
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListadoProductos;
