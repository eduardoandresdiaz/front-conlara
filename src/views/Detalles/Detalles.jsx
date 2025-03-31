import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetallesProducto = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const navigate = useNavigate(); // Navegación para regresar a Home.jsx
  const [producto, setProducto] = useState({});
  const [error, setError] = useState('');
  const [mostrarContacto, setMostrarContacto] = useState(false); // Estado para mostrar contacto

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`https://ecommerce-9558.onrender.com/products/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del producto');
        }
        const data = await response.json();
        setProducto(data);
        setError('');
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducto();
  }, [id]);

  const handleRegresar = () => {
    navigate('/'); // Navegar a Home.jsx
  };

  const handleComprar = () => {
    setMostrarContacto(true); // Mostrar información de contacto
  };

  return (
    <div className="detallesProducto">
      {error && <p className="detallesProducto__mensaje">{error}</p>}
      {producto.name ? (
        <div className="detallesProducto__contenedor">
          <h1 className="detallesProducto__titulo">{producto.name}</h1>
          <p className="detallesProducto__informacion">
            <span className="detallesProducto__etiqueta">Descripción: </span>
            {producto.description}
          </p>
          <p className="detallesProducto__informacion">
            <span className="detallesProducto__etiqueta">Precio: </span>
            ${producto.price}
          </p>
          <p className="detallesProducto__informacion">
            <span className="detallesProducto__etiqueta">Stock: </span>
            {producto.stock}
          </p>
          <p className="detallesProducto__informacion">
            <span className="detallesProducto__etiqueta">Categoría: </span>
            {producto.category?.name || 'Sin categoría'}
          </p>
          <img
            className="detallesProducto__imagen"
            src={producto.imgUrl}
            alt={`Imagen de ${producto.name}`}
          />
          {/* Botones */}
          <div className="detallesProducto__botones">
            <button className="detallesProducto__boton" onClick={handleRegresar}>
              Regresar
            </button>
            <button className="detallesProducto__boton" onClick={handleComprar}>
              Comprar
            </button>
          </div>
          {/* Mostrar información de contacto */}
          {mostrarContacto && (
            <div className="detallesProducto__contacto">
              <p><strong>Correo del vendedor:</strong> {producto.creatorEmail}</p>
              <p><strong>Teléfono del vendedor:</strong> {producto.telefono || 'No disponible'}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="detallesProducto__mensaje">Cargando detalles del producto...</p>
      )}
    </div>
  );
};

export default DetallesProducto;
