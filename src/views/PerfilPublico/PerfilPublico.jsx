import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from "react-helmet";

import './PerfilPublico.css';

const PerfilPublico = () => {
  const { nickname } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!nickname) return;
    console.log("Intentando buscar usuario con nickname:", nickname);

    const fetchUsuario = async () => {
      try {
        const res = await axios.get(`https://ecommerce-9558.onrender.com/users/nickname/${nickname}`);
        setUsuario(res.data);
        console.log("Usuario cargado:", res.data);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        setError('Usuario no encontrado');
      }
    };

    fetchUsuario();
  }, [nickname]);

  useEffect(() => {
    if (!usuario) return;

    const fetchProductos = async () => {
      try {
        const res = await axios.get(`https://ecommerce-9558.onrender.com/products/by-creator?creatorEmail=${usuario.email}`);
        setProductos(res.data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError('Error al obtener productos');
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
  if (!usuario || (productos.length === 0 && !error)) return <p>Cargando productos...</p>;

  return (
    <>
      <Helmet>
        <title>Perfil de {usuario?.nickname}</title>
        <meta name="description" content={`Mira los productos publicados por ${usuario?.nickname}`} />
        <meta property="og:title" content={`Perfil de usuario: ${usuario?.nickname}`} />
        <meta property="og:description" content={`Mira los productos publicados por ${usuario?.nickname}`} />
        <meta property="og:image" content={usuario?.imgUrlUser} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="listadoProductos">
        <h1 style={{ textAlign: 'center' }}>{usuario.nickname}</h1>

        <div className="perfilPublico__imagen">
          <img src={usuario.imgUrlUser} alt={`Foto de ${usuario.nickname}`} />
        </div>

        {/* 🔥 Botón para compartir en Facebook */}
        <div className="compartirFacebook">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="botonFacebook"
          >
            Compartir en Facebook
          </a>
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
    </>
  );
};

export default PerfilPublico;
