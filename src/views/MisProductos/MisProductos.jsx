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
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const [filtroCaducidad, setFiltroCaducidad] = useState(false);
  const calcularDiasParaVencer = (fechaCaducidad) => {
    if (!fechaCaducidad) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const vencimiento = new Date(`${fechaCaducidad}T00:00:00`);

    return Math.ceil(
      (vencimiento.getTime() - hoy.getTime()) /
      (1000 * 60 * 60 * 24)
    );
  };
  const obtenerAvisoVencimiento = (fechaCaducidad) => {
    const dias = calcularDiasParaVencer(fechaCaducidad);

    if (dias === null) {
      return null;
    }

    if (dias < 0) {
      return {
        mensaje: '⛔ PRODUCTO VENCIDO',
        clase: 'vencimientoProductoOverlay vencimientoProductoOverlay--vencido',
      };
    }

    if (dias === 0) {
      return {
        mensaje: '⚠️ VENCE HOY',
        clase: 'vencimientoProductoOverlay vencimientoProductoOverlay--hoy',
      };
    }

    if (dias === 1) {
      return {
        mensaje: '⚠️ 1 DÍA PARA VENCER',
        clase: 'vencimientoProductoOverlay vencimientoProductoOverlay--proximo',
      };
    }

    if (dias <= 30) {
      return {
        mensaje: `⚠️ ${dias} DÍAS PARA VENCER`,
        clase: 'vencimientoProductoOverlay vencimientoProductoOverlay--proximo',
      };
    }

    return null;
  };

  const fetchProductos = async () => {
    try {
      if (!user || !user.email) {
        throw new Error("⚠️ Por seguridad, tu sesión ha expirado. Vuelve a iniciar sesión para continuar.");
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

  const proveedoresDisponibles = [
    ...new Set(
      productos
        .map((producto) => producto.proveedor?.trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  // Filtrado dinámico con soporte para mostrar SOLO stock mínimo cuando ese filtro está activo
  const productosFiltrados = productos.filter((p) => {
    const esAgotado = Number(p.stock) === 0;

    const esVencido =
      p.expiresAt && new Date(p.expiresAt) < new Date();

    const stockActual = Number(p.stock);
    const stockMinimoValor = Number(p.stockminimo ?? 0);

    const esStockMinimo =
      stockActual > 0 &&
      stockActual <= stockMinimoValor;
    const diasParaVencer = calcularDiasParaVencer(p.fechaCaducidad);

    const esProductoAVencerOVencido =
      diasParaVencer !== null &&
      diasParaVencer <= 30;



    const textoBusqueda = busqueda.trim().toLowerCase();

    const coincideBusqueda =
      textoBusqueda === '' ||
      p.name?.toLowerCase().includes(textoBusqueda) ||
      p.category?.name?.toLowerCase().includes(textoBusqueda) ||
      p.proveedor?.toLowerCase().includes(textoBusqueda);

    const coincideProveedor =
      proveedorSeleccionado === '' ||
      p.proveedor?.trim() === proveedorSeleccionado;

    if (!coincideBusqueda || !coincideProveedor) {
      return false;
    }

    if (filtroStockMinimo) {
      return esStockMinimo;
    }

    if (filtroAgotados) {
      return esAgotado;
    }

    if (filtroVencidos) {
      return esVencido;
    }
    if (filtroCaducidad) {
      return esProductoAVencerOVencido;
    }

    return true;
  });


  const cantidadAgotados = productos.filter((p) => p.stock === 0).length;
  const cantidadVencidos = productos.filter((p) => new Date(p.expiresAt) < new Date()).length;
  const cantidadStockMinimo = productos.filter((p) => (p.stock > 0) && (p.stock <= (p.stockminimo ?? 0))).length;
  const cantidadCaducidad = productos.filter((p) => {
    const dias = calcularDiasParaVencer(p.fechaCaducidad);

    return (
      dias !== null &&
      dias <= 30
    );
  }).length;


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

  //////////////////////////////////////////////////////////////////////////////
  const compartirWhatsApp = async (producto) => {
    try {
      // Detectar si está usando un dispositivo móvil
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Buscar los datos del vendedor
      const userData = await fetchUserDataByEmail(producto.creatorEmail);

      // Reemplazar "_" y "-" por espacios
      const nickname = (userData.nickname || "")
        .replace(/[_-]+/g, " ")
        .trim();

      // Quitar +54 del teléfono
      const telefono = (userData.phone || "")
        .replace(/^\+54\s?/, "")
        .trim();

      // URL pública para compartir
      const productUrl = `https://og.conlara.com.ar/productos/share/${producto.id}`;
      const productUrl2 = `https://ecommerce-9558.onrender.com/productos/share/${producto.id}`;
      // Mensaje de WhatsApp
      const mensajeWhatsApp =
        `${productUrl}
      ${nickname}
      ${producto.name}
      ${telefono ? `📞 ${telefono}` : ""}`;

      // Móvil → aplicación WhatsApp
      // PC → WhatsApp Web
      const whatsappUrl = isMobile
        ? `whatsapp://send?text=${encodeURIComponent(mensajeWhatsApp)}`
        : `https://web.whatsapp.com/send?text=${encodeURIComponent(mensajeWhatsApp)}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, "_blank");

    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="listadoProductos">
      <h1 className="tituloSuperior">Mis Publicaciones</h1>


      {/* Buscador */}
      <form
        className="buscadorContainer"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Buscar mis productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscadorInput"
        />

        <p className="Lupa">🔍</p>
      </form>

      {/* Filtro por proveedor */}
      <div className="filtroProveedorContainer">
        <label
          htmlFor="filtroProveedor"
          className="filtroProveedorLabel"
        >
          Filtrar por proveedor
        </label>

        <select
          id="filtroProveedor"
          className="filtroProveedorSelect"
          value={proveedorSeleccionado}
          onChange={(event) =>
            setProveedorSeleccionado(event.target.value)
          }
        >
          <option value="">Todos los proveedores</option>

          {proveedoresDisponibles.map((proveedor) => (
            <option key={proveedor} value={proveedor}>
              {proveedor}
            </option>
          ))}
        </select>

        {proveedorSeleccionado && (
          <button
            type="button"
            className="filtroProveedorLimpiar"
            onClick={() => setProveedorSeleccionado('')}
          >
            Quitar filtro
          </button>
        )}
      </div>

      {/* Botones de filtro */}
      <div className="filtrosContainer"></div>

      {/* Botones de filtro */}
      <div className="filtrosContainer">
        <button
          className={`filtroBoton ${filtroCaducidad ? 'filtroBoton--activo' : ''}`}
          onClick={() => {
            setFiltroCaducidad(prev => !prev);
            setFiltroAgotados(false);
            setFiltroVencidos(false);
            setFiltroStockMinimo(false);
          }}
        >
          {filtroCaducidad
            ? "✓ A vencer y vencidos - Mostrar Todo"
            : `Productos a vencer y vencidos (${cantidadCaducidad})`}
        </button>

        <button
          className={`filtroBoton ${filtroAgotados ? 'filtroBoton--activo' : ''}`}
          onClick={() => {
            setFiltroAgotados(prev => !prev);
            setFiltroVencidos(false);
            setFiltroStockMinimo(false);
            setFiltroCaducidad(false);
          }}
        >
          {filtroAgotados
            ? "✓ Agotados - Mostrar Todo"
            : `Productos Agotados (${cantidadAgotados})`}
        </button>

        <button
          className={`filtroBoton ${filtroVencidos ? 'filtroBoton--activo' : ''}`}
          onClick={() => {
            setFiltroVencidos(prev => !prev);
            setFiltroAgotados(false);
            setFiltroStockMinimo(false);
            setFiltroCaducidad(false);
          }}
        >
          {filtroVencidos
            ? "✓ Ofertas Vencidas - Mostrar Todo"
            : `Ofertas Vencidas (${cantidadVencidos})`}
        </button>

        <button
          className={`filtroBoton ${filtroStockMinimo ? 'filtroBoton--activo' : ''}`}
          onClick={() => {
            setFiltroStockMinimo(prev => !prev);
            setFiltroAgotados(false);
            setFiltroVencidos(false);
            setFiltroCaducidad(false);
          }}
        >
          {filtroStockMinimo
            ? "✓ Stock Mínimo - Mostrar Todo"
            : `Stock Mínimo (${cantidadStockMinimo})`}
        </button>
      </div>

      {error && <p className="listadoProductos__error">{error}</p>}

      <div className="listadoProductos__list">
        {productosFiltrados.length === 0 && !error ? (
          <p>Cargando....</p>
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
                <p>
                  <strong>Categoría:</strong>{' '}
                  {producto.category?.name ?? 'Sin categoría'}
                </p>

                <p>
                  <strong>Fecha de Creación:</strong>{' '}
                  {new Date(producto.createdAt).toLocaleString()}
                </p>

                <p>
                  <strong>Expiración de Oferta o Precio:</strong>{' '}
                  {new Date(producto.expiresAt).toLocaleDateString()}
                </p>

                <p>
                  <strong>Vencimiento del producto:</strong>{' '}
                  {producto.fechaCaducidad
                    ? new Date(`${producto.fechaCaducidad}T00:00:00`).toLocaleDateString()
                    : 'No tiene vencimiento'}
                </p>
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
                {(() => {
                  const avisoVencimiento = obtenerAvisoVencimiento(
                    producto.fechaCaducidad
                  );

                  if (!avisoVencimiento) {
                    return null;
                  }

                  return (
                    <div className={avisoVencimiento.clase}>
                      {avisoVencimiento.mensaje}
                    </div>
                  );
                })()}

              </div>

              <button
                className="eliminarBoton"
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Estás seguro de eliminar "${producto.name}"?`
                    )
                  ) {
                    eliminarProducto(producto);
                  }
                }}
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