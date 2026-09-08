import { useEffect, useState } from 'react';
import { useUser } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
import './MisProductos.css';
import axios from "axios";

const MisProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [mensajeStock, setMensajeStock] = useState('');
  const [filtroAgotados, setFiltroAgotados] = useState(false);
  const [filtroVencidos, setFiltroVencidos] = useState(false);
  const [filtroStockMinimo, setFiltroStockMinimo] = useState(false); // nuevo estado
  const [busqueda, setBusqueda] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchProductos = async () => {
    try {
      if (!user || !user.email) {
        throw new Error("No se encontró el email del usuario.");
      }

      const response = await fetch(
        `https://ecommerce-9558.onrender.com/products/by-creator?creatorEmail=${user.email}`
      );
      if (!response.ok) {
        throw new Error('Error al obtener los productos del usuario');
      }
      const data = await response.json();
      setProductos(data);
      setError('');
    } catch (error) {
      setError(error.message);
      setProductos([]);
    }
  };

  const eliminarProducto = async (producto) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No se encontró un token de autenticación.");
      }

      const imgUrl = producto.imgUrl;
      const publicId = imgUrl.split('/').pop().split('.')[0];

      const responseImg = await fetch(
        `https://ecommerce-9558.onrender.com/file-upload/deleteImage/${publicId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!responseImg.ok) {
        throw new Error('Error al eliminar la imagen asociada al producto');
      }

      const responseProduct = await fetch(
        `https://ecommerce-9558.onrender.com/products/${producto.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!responseProduct.ok) {
        throw new Error('Error al eliminar el producto');
      }

      await responseProduct.json();
      setProductos((prevProductos) =>
        prevProductos.filter((p) => p.id !== producto.id)
      );
    } catch (error) {
      console.error('Error al intentar eliminar el producto y la imagen:', error.message);
    }
  };

  const marcarVendido = async (producto) => {
    try {
      if (producto.stock <= 0) {
        setMensajeStock("No quedan productos en stock");
        setModalOpen(true);
        return;
      }

      if (new Date(producto.expiresAt) < new Date()) {
        setMensajeStock("La oferta ya venció");
        setModalOpen(true);
        return;
      }

      const nuevoStock = producto.stock - 1;

      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://ecommerce-9558.onrender.com/products/${producto.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stock: nuevoStock }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar el stock');
      }

      setProductos((prevProductos) =>
        prevProductos.map((p) =>
          p.id === producto.id ? { ...p, stock: nuevoStock } : p
        )
      );

      setMensajeStock(`Te quedan ${nuevoStock} productos en stock`);
      setModalOpen(true);
    } catch (error) {
      console.error('Error al marcar como vendido:', error.message);
    }
  };

  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrado dinámico con soporte para mostrar SOLO stock mínimo cuando ese filtro está activo
  const productosFiltrados = productos.filter((p) => {
    const esAgotado = p.stock === 0;
    const esVencido = new Date(p.expiresAt) < new Date();
    const stockMinimoValor = p.stockminimo ?? 0;
    const esStockMinimo = p.stock <= stockMinimoValor && p.stock > 0;

    const textoBusqueda = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      textoBusqueda === '' ||
      (p.name?.toLowerCase().includes(textoBusqueda)) ||
      (p.category?.name?.toLowerCase().includes(textoBusqueda));

    // Si el filtro Stock Mínimo está activo, mostramos SOLO los productos en stock mínimo
    if (filtroStockMinimo) {
      return esStockMinimo && coincideBusqueda;
    }

    // Si Stock Mínimo no está activo, aplicamos los otros filtros (agotados o vencidos).
    // Si hay al menos un filtro activo entre Agotados o Vencidos, mostramos la unión de esos filtros.
    const filtrosActivos = filtroAgotados || filtroVencidos;
    if (filtrosActivos) {
      const cumpleFiltro =
        (filtroAgotados && esAgotado) ||
        (filtroVencidos && esVencido);
      return cumpleFiltro && coincideBusqueda;
    }

    // Si no hay filtros activos, solo aplicamos búsqueda
    return coincideBusqueda;
  });

  const cantidadAgotados = productos.filter((p) => p.stock === 0).length;
  const cantidadVencidos = productos.filter((p) => new Date(p.expiresAt) < new Date()).length;
  const cantidadStockMinimo = productos.filter((p) => (p.stock > 0) && (p.stock <= (p.stockminimo ?? 0))).length;
  
  const fetchUserDataByEmail = async (email) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      throw new Error("No se encontró un token.");
    }
  
    console.log("Email:", email);
    console.log("Token:", token);
  
    const response = await axios.get(
      `https://ecommerce-9558.onrender.com/users/email/${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    console.log("Respuesta:", response.data);
  
    const userData = response.data;
  
    console.log("Datos completos del usuario:", userData);
  
    return userData;
  };
  
  
  const compartirWhatsApp = async (producto) => {
    try {
      // Buscar los datos del vendedor usando el creatorEmail del producto
      const userData = await fetchUserDataByEmail(producto.creatorEmail);
  
      const nickname = userData.nickname || "";
  
      const productUrl = `https://og.conlara.com.ar/productos/share/${producto.id}`;
      
  
      const mensaje = `🛍️ ${producto.name}
  👤 ${nickname}
  
  Compra y vende en el Valle del Conlara.
  
   🔗 ${productUrl}`;
  
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  
      window.open(whatsappUrl, "_blank");
  
    } 
    catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };
  return (
    <div className="listadoProductos">
      <h1 className="tituloSuperior">Mis Publicaciones</h1>

      {/* Buscador */}
      <form className="buscadorContainer" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Buscar mis productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscadorInput"
        />
        <p className="Lupa">🔍</p>
      </form>

      {/* Botones de filtro */}
      <div className="filtrosContainer">
        <button
          className="filtroBoton"
          onClick={() => {
            // Al activar Agotados, desactivo los otros filtros para evitar mezcla
            setFiltroAgotados(prev => !prev);
            setFiltroVencidos(false);
            setFiltroStockMinimo(false);
          }}
        >
          {filtroAgotados ? "Mostrar Todo" : `Productos Agotados (${cantidadAgotados})`}
        </button>

        <button
          className="filtroBoton"
          onClick={() => {
            // Al activar Vencidos, desactivo los otros filtros para evitar mezcla
            setFiltroVencidos(prev => !prev);
            setFiltroAgotados(false);
            setFiltroStockMinimo(false);
          }}
        >
          {filtroVencidos ? "Mostrar Todo" : `Ofertas Vencidas (${cantidadVencidos})`}
        </button>

        <button
          className="filtroBoton"
          onClick={() => {
            // Al activar Stock Mínimo, desactivo los otros filtros para que se muestren SOLO estos
            setFiltroStockMinimo(prev => !prev);
            setFiltroAgotados(false);
            setFiltroVencidos(false);
          }}
        >
          {filtroStockMinimo ? "Mostrar Todo" : `Stock Mínimo (${cantidadStockMinimo})`}
        </button>
      </div>

      {error && <p className="listadoProductos__error">{error}</p>}

      <div className="listadoProductos__list">
        {productosFiltrados.length === 0 && !error ? (
          <p>No hay productos para mostrar.</p>
        ) : (
          productosFiltrados.map((producto) => (
            <div key={producto.id} className="listadoProductos__details">
              <h2>{producto.name}</h2>
              <p><strong>Precio:</strong> ${producto.price}</p>
              <p><strong>Stock:</strong> {producto.stock}</p>

              {/* Nuevos campos */}
              <p><strong>Stock mínimo:</strong> {producto.stockminimo}</p>
              <p><strong>Ubicación:</strong> {producto.ubicacion ?? 'No especificada'}</p>

              <div className="detallesCompactos">
                <p><strong>Categoría:</strong> {producto.category?.name ?? 'Sin categoría'}</p>
                <p><strong>Fecha de Creación:</strong> {new Date(producto.createdAt).toLocaleString()}</p>
                <p><strong>Fecha de Expiración:</strong> {new Date(producto.expiresAt).toLocaleDateString()}</p>
              </div>

              <button
                className="vendidoBoton"
                onClick={() => marcarVendido(producto)}
                disabled={producto.stock === 0 || new Date(producto.expiresAt) < new Date()}
              >
                Vendido
              </button>

              <div className="imagenContainer">
                <img
                  src={producto.imgUrl}
                  alt={`Imagen de ${producto.name}`}
                  className="productoImagen"
                />
                {producto.stock === 0 && (
                  <div className="agotadoOverlay">AGOTADO</div>
                )}
                {new Date(producto.expiresAt) < new Date() && producto.stock > 0 && (
                  <div className="ofertaVencidaOverlay">OFERTA VENCIDA</div>
                )}
                {(producto.stock <= (producto.stockminimo ?? 0) && producto.stock > 0) && (
                  <div className="stockMinimoOverlay">STOCK MÍNIMO</div>
                )}
              </div>

              <button
                className="eliminarBoton"
                onClick={() => eliminarProducto(producto)}
              >
                Eliminar Publicación
              </button>

              <button
                className="modificarBoton"
                onClick={() => navigate(`/ModifyProduct/${producto.id}`)}
              >
                Modificar Publicacion
              </button>
              <button
                     className="compartirWhatsAppBoton"
                      onClick={() => compartirWhatsApp(producto)}>
                                <i className="fa-brands fa-whatsapp"></i>
                                      Compartir en WhatsApp</button>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>{mensajeStock}</p>
            <button onClick={() => setModalOpen(false)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisProductos;
