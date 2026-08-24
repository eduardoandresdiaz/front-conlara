import { useEffect, useState } from 'react';
import './Servicios.css';
import { useNavigate, useLocation } from 'react-router-dom';
import 'swiper/css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const TARGET_CATEGORY = "servicios";

const Servicios = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* Detecta si un producto pertenece a la categoría Servicios */
  const matchesServicios = (p) => {
    if (!p) return false;

    // 1) revisar category como objeto { id, name }
    if (p.category && typeof p.category === 'object') {
      const name = (p.category.name || '').toString().toLowerCase();
      if (name === TARGET_CATEGORY || name.includes(TARGET_CATEGORY)) return true;
    }

    // 2) revisar propiedades alternativas
    const candidates = [
      p.category,
      p.categoria,
      p.Categoria,
      p.categories,
      p.tags,
      p.categoryName,
      p.category_name,
      p.categorias,
    ];

    // 3) revisar nombre del producto
    const prodName = (p.name || p.title || '').toString().toLowerCase();
    if (prodName.includes(TARGET_CATEGORY)) return true;

    for (const c of candidates) {
      if (!c) continue;

      if (typeof c === 'string') {
        const s = c.trim().toLowerCase();
        if (s === TARGET_CATEGORY || s.includes(TARGET_CATEGORY)) return true;
      }

      if (Array.isArray(c)) {
        for (const item of c) {
          if (!item) continue;
          if (typeof item === 'string' && item.toLowerCase().includes(TARGET_CATEGORY)) return true;
          if (typeof item === 'object') {
            const nm = (item.name || item.title || item.label || '').toString().toLowerCase();
            if (nm.includes(TARGET_CATEGORY)) return true;
          }
        }
      }

      if (typeof c === 'object') {
        const nm = (c.name || c.title || c.label || c.nombre || '').toString().toLowerCase();
        if (nm.includes(TARGET_CATEGORY)) return true;
      }
    }

    return false;
  };

  const filterServicios = (items) => {
    if (!Array.isArray(items)) return [];
    return items.filter(matchesServicios);
  };

  const fetchProductos = async (pageNumber = 1, append = false) => {
    try {
      setLoading(true);
      const url = `https://ecommerce-9558.onrender.com/products?page=${pageNumber}&limit=50`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener los productos');
      const data = await response.json();

      const servicios = filterServicios(data);
      setProductos((prev) => (append ? [...prev, ...servicios] : servicios));
      setError('');
      setHasMore(Array.isArray(data) ? data.length === 50 : false);
    } catch (err) {
      setError(err.message);
      if (!append) setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusqueda = async (pageNumber = 1, append = false) => {
    if (busqueda.trim() === '') return fetchProductos(pageNumber, append);
    try {
      setLoading(true);
      const url = `https://ecommerce-9558.onrender.com/products/search?q=${encodeURIComponent(busqueda)}&page=${pageNumber}&limit=50`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al buscar productos');
      const data = await response.json();

      const servicios = filterServicios(data);
      setProductos((prev) => (append ? [...prev, ...servicios] : servicios));
      setError('');
      setHasMore(Array.isArray(data) ? data.length === 50 : false);
    } catch (err) {
      setError(err.message);
      if (!append) setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProductos(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleEdit = (id) => {
    navigate(`/ModifyProduct/${id}`);
  };

  const handleDelete = (id) => {
    console.log('Eliminar producto', id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBusqueda(1, false);
  };

  const formatPrice = (price, expiresAt, mostrarprecio) => {
    const validPrice = isNaN(price) ? parseFloat(price || 0) : parseFloat(price);
    if (!mostrarprecio) return 'Consultar';
    if (expiresAt && new Date(expiresAt) < new Date()) return 'Consultar';
    return validPrice === 1 ? 'Consultar' : `$${validPrice.toFixed(2)}`;
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    if (isNaN(date.getTime())) return d.toString();
    return date.toLocaleString('es-AR');
  };

  return (
    <div className="listadoProductosServicios">
      <div className='botones_superiores'>
        

        {/* ocultar el botón si ya estás en /servicios */}
        {location.pathname !== '/servicios' && (
          <button
            className='telefonos_utiles'
            onClick={() => navigate('/servicios')}
          >
            Guia de Servicios
          </button>
        )}
      </div>

      <form className="listadoProductos__buscador" onSubmit={handleSubmit}>
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{ 320: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          modules={[Navigation, Pagination, Autoplay]}
        >
          <SwiperSlide>
            <img src="https://res.cloudinary.com/dvp0fdhyc/image/upload/v1785880915/img1_npzt1t.png" alt="Slide 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://res.cloudinary.com/dvp0fdhyc/image/upload/v1785888560/Sin_nombre_jnq2v0.png" alt="Slide 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://res.cloudinary.com/dvp0fdhyc/image/upload/v1785880915/img1_npzt1t.png" alt="Slide 3" />
          </SwiperSlide>
        </Swiper>

        <input
          type="text"
          placeholder="Buscar servicios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      {error && <p className="listadoProductos__error">{error}</p>}

      <div className="listadoProductos__list2">
        {loading ? (
          <p>Cargando servicios...</p>
        ) : productos.length === 0 && !error ? (
          <p>No hay servicios disponibles.</p>
        ) : (
          productos.map((producto) => {
            const img = producto.imgUrl || producto.image || producto.images?.[0] || '';
            const price = producto.price ?? producto.precio ?? 0;
            const expiresAt = producto.expiresAt || producto.expireAt || producto.expiration;
            const createdAt = producto.createdAt || producto.created_at || producto.created;
            const stockMin = producto.stockminimo ?? producto.stockMin ?? producto.stock_min ?? '—';
            const ubicacion = producto.ubicacion || producto.location || producto.taller || '—';
            const categoriaRaw = producto.category || producto.categoria || producto.Categoria || producto.categories || producto.categorias || '—';
            const categoriaText = typeof categoriaRaw === 'string'
              ? categoriaRaw
              : (Array.isArray(categoriaRaw) ? categoriaRaw.map(c => (c.name || c)).join(', ') : (categoriaRaw?.name || categoriaRaw?.title || '—'));

            return (
              <div key={producto.id ?? producto._id} className="listadoProductos__details">
                <div className="imagenContainer" style={{ position: 'relative' }}>
                  <img src={img} alt={`Imagen de ${producto.name}`} className="listadoProductos__img" />
                  {(producto.stock === 0 || producto.stock === '0') && <div className="agotadoOverlay">AGOTADO</div>}
                  {producto.resaltaroferta && <div className="ofertaOverlay">OFERTA</div>}
                </div>

                <h2>{producto.name || producto.title || 'Sin nombre'}</h2>

                <div className="price">
                  <span className="precioTexto">
                    Precio: {formatPrice(price, expiresAt, producto.mostrarprecio ?? true)}
                  </span>
                </div>

                <div style={{ marginTop: 8, fontSize: 14, color: '#222', textAlign: 'left', width: '90%' }}>
                  <div><strong>Stock:</strong> {producto.stock ?? '—'}</div>
                  <div><strong>Stock mínimo:</strong> {stockMin}</div>
                  <div><strong>Ubicación:</strong> {ubicacion}</div>
                  <div><strong>Categoría:</strong> {categoriaText}</div>
                  <div><strong>Fecha de Creación:</strong> {formatDate(createdAt)}</div>
                  <div><strong>Fecha de Expiración:</strong> {formatDate(expiresAt)}</div>
                </div>

                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <button className="meInteresaBoton" onClick={() => handleClick(producto.id)}>Ver Detalles</button>
                  {producto.creatorEmail === localStorage.getItem('userEmail') && (
                    <>
                      <button className="meInteresaBoton" onClick={() => handleEdit(producto.id)}>Modificar Publicacion</button>
                      <button className="meInteresaBoton" onClick={() => handleDelete(producto.id)}>Eliminar Publicación</button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {loading && <p>😉</p>}
    </div>
  );
};

export default Servicios;
