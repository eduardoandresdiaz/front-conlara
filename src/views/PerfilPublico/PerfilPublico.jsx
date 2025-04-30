import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './PerfilPublico.css';


const PerfilPublico = () => {
  const { nickname } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`https://ecommerce-9558.onrender.com/users/nickname/${nickname}`);
        if (!res.ok) throw new Error('Usuario no encontrado');
        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsuario();
  }, [nickname]);

  useEffect(() => {
    const fetchProductos = async () => {
      if (!usuario) return;
      try {
        const res = await fetch('https://ecommerce-9558.onrender.com/products?page=1&limit=1000');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        const productosUsuario = data.filter(prod => prod.email === usuario.email);
        setProductos(productosUsuario);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProductos();
  }, [usuario]);

  const formatPrice = (price) => {
    const validPrice = isNaN(price) ? 0 : parseFloat(price);
    return validPrice === 1 ? "Consultar" : `$${validPrice.toFixed(2)}`;
  };

  const handleClick = (id) => navigate(`/productos/${id}`);

  if (error) return <p className="listadoProductos__error">{error}</p>;
  if (!usuario) return <p className="listadoProductos__error">Cargando perfil...</p>;

  return (
    <div className="listadoProductos">
      <h1 style={{ textAlign: 'center' }}>{usuario.nickname}</h1>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
        <img
          src={usuario.imgUrlUser}
          alt={`Foto de ${usuario.nickname}`}
          style={{ maxWidth: '300px', borderRadius: '10px' }}
        />
      </div>

      <div className="listadoProductos__list">
        {productos.length === 0 ? (
          <p>No hay productos cargados.</p>
        ) : (
          productos.map(producto => (
            <div key={producto.id} className="listadoProductos__details">
              <img src={producto.imgUrl} alt={`Imagen de ${producto.name}`} />
              <h2>{producto.name}</h2>
              <div className="price">
                <span>Precio: {formatPrice(producto.price)}</span>
              </div>
              <button className="meInteresaBoton" onClick={() => handleClick(producto.id)}>
                Me Interesa
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PerfilPublico;
