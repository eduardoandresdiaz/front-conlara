import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import './PerfilPublico.css';

const API_BASE = 'https://ecommerce-9558.onrender.com';
const FALLBACK_USER_IMG = '/fallback-user.png';
const FALLBACK_PRODUCT_IMG = '/fallback-product.png';

// Componente de tarjeta reutilizable (autocontenido para pegar directo)
function ProductCard({ producto, onClick, showOverlays = true }) {
  const imgSrc = producto.imgUrl || FALLBACK_PRODUCT_IMG;
  const expired = producto.expiresAt && new Date(producto.expiresAt) < new Date();

  const formatPrice = (price, expiresAt, mostrarprecio = true) => {
    if (mostrarprecio === false) return 'Consultar';
    if (expiresAt && new Date(expiresAt) < new Date()) return 'Consultar';
    const validPrice = isNaN(price) ? 0 : parseFloat(price);
    return validPrice === 1 ? 'Consultar' : `$${validPrice.toFixed(2)}`;
  };

  return (
    <div className="listadoProductos__details">
      <div className="imagenContainer">
        <img
          src={imgSrc}
          alt={producto.name || 'Producto'}
          onError={(e) => { e.currentTarget.src = FALLBACK_PRODUCT_IMG; }}
        />
        {showOverlays && producto.stock === 0 && (
          <div className="agotadoOverlay">AGOTADO</div>
        )}
        {showOverlays && producto.resaltaroferta && !expired && (
          <div className="ofertaOverlay">OFERTA</div>
        )}
      </div>

      <h2>{producto.name}</h2>

      <div className="price">
        <span aria-label={`Precio del producto ${producto.name}`}>
          Precio: {formatPrice(producto.price, producto.expiresAt, producto.mostrarprecio)}
        </span>
      </div>

      <button
        className="meInteresaBoton"
        onClick={() => onClick(producto.id)}
        aria-label={`Ver detalles de ${producto.name}`}
        type="button"
      >
        Me Interesa
      </button>
    </div>
  );
}

const PerfilPublico = () => {
  const { nickname } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!nickname) return;
    setError('');
    setUsuario(null);
    setProductos([]);
    setLoadingUsuario(true);

    const source = axios.CancelToken.source();

    const fetchUsuario = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/users/nickname/${encodeURIComponent(nickname)}`,
          { cancelToken: source.token }
        );
        setUsuario(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Error al obtener usuario:', err);
          setError('Usuario no encontrado');
        }
      } finally {
        setLoadingUsuario(false);
      }
    };

    fetchUsuario();

    return () => {
      source.cancel('PerfilPublico desmontado - cancelar fetchUsuario');
    };
  }, [nickname]);

  useEffect(() => {
    if (!usuario || !usuario.email) return;
    setError('');
    setLoadingProductos(true);

    const source = axios.CancelToken.source();

    const fetchProductos = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/products/by-creator?creatorEmail=${encodeURIComponent(usuario.email)}`,
          { cancelToken: source.token }
        );
        setProductos(res.data || []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Error al obtener productos:', err);
          setError('Error al obtener productos');
        }
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductos();

    return () => {
      source.cancel('PerfilPublico desmontado - cancelar fetchProductos');
    };
  }, [usuario]);

  const handleClick = (id) => navigate(`/productos/${id}`);

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://conlara.com.ar/usuarios/${encodeURIComponent(nickname)}`;

  if (error) {
    return (
      <div className="listadoProductos">
        <p className="listadoProductos__error" role="alert">{error}</p>
      </div>
    );
  }

  if (loadingUsuario) {
    return (
      <div className="listadoProductos" aria-live="polite">
        <p>Cargando usuario...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="listadoProductos" aria-live="polite">
        <p>Usuario no encontrado.</p>
      </div>
    );
  }
  // función para formatear nickname (colocala arriba del return)
const formatNickname = (nick = '') => {
  if (!nick) return '';
  return nick
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};
const formatPhone = (phone = '') => {
  if (!phone) return '';
  return phone.replace(/^\+54/, '').trim();
};


  return (
    <>
      <Helmet>
        <title>Perfil de {usuario?.nickname}</title>
        <meta name="description" content={`Mira los productos publicados por ${usuario?.nickname}`} />
        <meta property="og:title" content={`Perfil de usuario: ${usuario?.nickname}`} />
        <meta property="og:description" content={`Mira los productos publicados por ${usuario?.nickname}`} />
        <meta property="og:image" content={usuario?.imgUrlUser || FALLBACK_USER_IMG} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="listadoProductos">
        <h1 style={{ textAlign: 'center' }}>{formatNickname(usuario?.nickname)}</h1>

        <div className="perfilPublico__imagen">
  <img
    src={usuario.imgUrlUser || FALLBACK_USER_IMG}
    alt={`Foto de ${formatNickname(usuario?.nickname) || 'usuario'}`}
    onError={(e) => { e.currentTarget.src = FALLBACK_USER_IMG; }}
  />
  
  

  {/* 🔥 Datos de contacto */}
<div className="perfilPublico__contacto">
  {usuario.phone && (
    <p>
      📞 Teléfono: <a href={`tel:${usuario.phone}`}>{formatPhone(usuario.phone)}</a>
    </p>
  )}
  {usuario.address && (
    <p>
      📍 Dirección: {usuario.address} {usuario.city}
    </p>
  )}


  
</div>

  

  
 
</div>

        <div className="compartirFacebook">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="botonFacebook"
            aria-label="Compartir perfil en Facebook"
          >
            Compartir en Facebook
          </a>
        </div>

        <div className="listadoProductos__list" aria-live="polite">
          {loadingProductos ? (
            <p>Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p>No hay productos cargados.</p>
          ) : (
            productos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onClick={handleClick}
                showOverlays={true}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default PerfilPublico;
