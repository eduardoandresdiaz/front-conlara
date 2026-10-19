import { useEffect, useState } from 'react';
import './ListadoProductos.css';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // 👈 agregar Autoplay

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const PRODUCTOS_POR_PAGINA = 20;

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
        `https://ecommerce-9558.onrender.com/products?page=${pageNumber}&limit=${PRODUCTOS_POR_PAGINA}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }

      const data = await response.json();

      setProductos((prev) =>
        append ? [...prev, ...data] : data
      );

      setError("");
      setHasMore(data.length === PRODUCTOS_POR_PAGINA);
    } catch (error) {
      setError(error.message);

      if (!append) {
        setProductos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBusqueda = async (pageNumber = 1, append = false) => {
    if (busqueda.trim() === "") {
      return fetchProductos(pageNumber, append);
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://ecommerce-9558.onrender.com/products/search?q=${encodeURIComponent(
          busqueda.trim()
        )}&page=${pageNumber}&limit=${PRODUCTOS_POR_PAGINA}`
      );

      if (!response.ok) {
        throw new Error("Error al buscar productos");
      }

      const data = await response.json();

      setProductos((prev) =>
        append ? [...prev, ...data] : data
      );

      setError("");
      setHasMore(data.length === PRODUCTOS_POR_PAGINA);
    } catch (error) {
      setError(error.message);

      if (!append) {
        setProductos([]);
      }
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

  const formatPrice = (price, expiresAt, mostrarprecio) => {
    const validPrice = isNaN(price) ? 0 : parseFloat(price);

    // Si mostrarprecio es false → mostrar "Consultar"
    if (!mostrarprecio) {
      return 'Consultar';
    }

    // Si la oferta ya venció → mostrar "Consultar"
    if (new Date(expiresAt) < new Date()) {
      return 'Consultar';
    }

    // Si el precio es 1 → mostrar "Consultar"
    return validPrice === 1 ? 'Consultar' : `$${validPrice.toFixed(2)}`;
  };



  return (

    <div className="listadoProductos">
      <div className='botones_superiores'>
        <button
          type="button"
          className="telefonos_utiles"
          onClick={() => navigate("/InfoLaToma")}
        >
          Información La Toma
        </button>
        <button
          type="button"
          className="telefonos_utiles"
          onClick={() => navigate("/InfoNaschel")}
        >
          Información Naschel
        </button>
        <button className='telefonos_utiles' onClick={() => navigate('/servicios')}>Guia de Servicios</button>
      </div>
      {/* Buscador */}
      <form className="listadoProductos__buscador" onSubmit={handleSubmit}>
        {/* Carrusel de imágenes */}
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2000, // ⏱ tiempo en ms entre cada slide
            disableOnInteraction: false, // sigue moviéndose aunque el usuario interactúe
            pauseOnMouseEnter: true, // 👈 se detiene si pasás el mouse encima
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          modules={[Navigation, Pagination, Autoplay]} // 👈 incluir Autoplay
        >
          <SwiperSlide>
            <img src="https://res.cloudinary.com/dvp0fdhyc/image/upload/v1785880915/img1_npzt1t.png" alt="Producto 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://res.cloudinary.com/dvp0fdhyc/image/upload/v1785888560/Sin_nombre_jnq2v0.png" alt="Producto 2" />
          </SwiperSlide>
          
          <SwiperSlide>
            <img src="https://res.cloudinary.com/dvp0fdhyc/image/upload/v1792253750/ARTICA_tlfidl.jpg" alt="Producto 3" />
          </SwiperSlide>
        </Swiper>


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
        {productos.length === 0 && loading ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 && !error ? (
          <p>🤖</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="listadoProductos__details">
              <div className="imagenContainer">
                <img
                  src={producto.imgUrl}
                  alt={`Imagen de ${producto.name}`}
                  className="listadoProductos__img"
                  loading="lazy"
                  decoding="async"
                />
                {producto.stock === 0 && (
                  <div className="agotadoOverlay">AGOTADO</div>
                )}
                {/* Overlay de OFERTA */}
                {producto.resaltaroferta && (
                  <div className="ofertaOverlay">OFERTA</div>
                )}

              </div>

              <h2>{producto.name}</h2>
              {formatPrice(
                producto.price,
                producto.expiresAt,
                producto.mostrarprecio
              ) !== 'Consultar' && (
                  <div className="price">
                    <span className="precioTexto">
                      Precio: {formatPrice(
                        producto.price,
                        producto.expiresAt,
                        producto.mostrarprecio
                      )}
                    </span>
                  </div>
                )}
              <button
                className="meInteresaBoton"
                onClick={() => handleClick(producto.id)}
              >
                Ver Detalles
              </button>
            </div>

          ))
        )}
      </div>


      {loading && productos.length > 0 && (
        <p className="listadoProductos__cargandoMas">
          Cargando más productos... 😉
        </p>
      )}
    </div>
  );
};

export default ListadoProductos;
// onClick={() => navigate('/servicios')}