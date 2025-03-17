import { useEffect, useState } from 'react';
import '../ViewAppointment/ViewAppointment.css'; // Puedes mantener los estilos existentes

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <div className="viewAppointment">
      <h1>Listado de Productos</h1>

      {error && <p className="viewAppointment__error">{error}</p>}

      <div className="viewAppointment__list">
        {productos.length === 0 && !error ? (
          <p>Cargando productos...</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="viewAppointment__details">
              <h2>{producto.name}</h2>
              <p><strong>Descripción:</strong> {producto.description}</p>
              <p><strong>Precio:</strong> ${producto.price}</p>
              <p><strong>Stock:</strong> {producto.stock}</p>
              <p><strong>Categoría:</strong> {producto.category.name}</p>
              <img
                src={producto.imgUrl}
                alt={`Imagen de ${producto.name}`}
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListadoProductos;
