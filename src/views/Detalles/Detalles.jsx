import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const DetallesProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({});
  const [error, setError] = useState('');
  const [mostrarContacto, setMostrarContacto] = useState(false);

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
    navigate('/');
  };

  const handleComprar = () => {
    setMostrarContacto(true);
  };

  return (
    <div className="detallesProducto">
      <Helmet>
        <title>{producto.name ? `${producto.name} - Conlara Tienda` : 'Cargando producto...'}</title>
        <meta property="og:type" content="product" />
        <meta property="og:title" content={producto.name ? `${producto.name} - Conlara Tienda` : 'Producto en Conlara Tienda'} />
        <meta property="og:description" content={producto.description || 'Detalles del producto disponible en Conlara Tienda'} />
        <meta property="og:image" content={producto.imgUrl || 'https://conlara.com.ar/default-product.jpg'} />
        <meta property="og:url" content={`https://conlara.com.ar/productos/${id}`} />
        <meta property="og:site_name" content="Conlara Tienda" />
      </Helmet>

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
            src={producto.imgUrl || 'https://conlara.com.ar/default-product.jpg'}
            alt={`Imagen de ${producto.name || 'producto'}`}
          />
          <div className="detallesProducto__botones">
            <button className="detallesProducto__boton" onClick={handleRegresar}>
              Regresar
            </button>
            <button className="detallesProducto__boton" onClick={handleComprar}>
              Comprar
            </button>
          </div>
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
