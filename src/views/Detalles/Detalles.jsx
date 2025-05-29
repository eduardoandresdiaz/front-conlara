import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Detalles.css";

const DetallesProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({});
  const [error, setError] = useState("");
  const [mostrarContacto, setMostrarContacto] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `https://ecommerce-9558.onrender.com/products/${id}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("Error al obtener los detalles del producto");
        const data = await response.json();
        setProducto(data);
        setError("");
      } catch (error) {
        if (error.name === "AbortError") {
          setError("La solicitud tardó demasiado tiempo y fue cancelada.");
        } else {
          setError(error.message);
        }
      }
    };

    fetchProducto();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [id]);

  const handleRegresar = () => navigate("/");
  const handleComprar = () => setMostrarContacto(true);
  const productUrl = `https://og.conlara.com.ar/productos/share/${id}`;
const facebookProductUrl = `https://ecommerce-9558.onrender.com/products/share-facebook/${id}`;

const mensajeWhatsApp = `🛍️ Miralo en Conlara.com.ar\n Compra y Vende en el Valle del Conlara\n${producto.name}\n\n🔗 ${productUrl}`;
const textoPersonalizado = "¡Echa un vistazo a este producto en Conlara! Compra y vende en el Valle del Conlara.";

const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookProductUrl)}&quote=${encodeURIComponent(textoPersonalizado)}`;
const whatsappUrl = isMobile
  ? `whatsapp://send?text=${encodeURIComponent(mensajeWhatsApp)}`
  : `https://web.whatsapp.com/send?text=${encodeURIComponent(mensajeWhatsApp)}`;


  // const productUrl = `https://og.conlara.com.ar/productos/share/${id}`;
  // const mensajeWhatsApp = `🛍️ Miralo en Conlara.com.ar\n Compra y Vende en el Valle del Conlara\n${producto.name}\n\n🔗 ${productUrl}`;
  // const textoPersonalizado = "¡Echa un vistazo a este producto en Conlara! Compra y vende en el Valle del Conlara.";
  // const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(textoPersonalizado)}`;
  // const whatsappUrl = isMobile
  //   ? `whatsapp://send?text=${encodeURIComponent(mensajeWhatsApp)}`
  //   : `https://web.whatsapp.com/send?text=${encodeURIComponent(mensajeWhatsApp)}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(productUrl)
      .then(() => alert("Enlace copiado al portapapeles"))
      .catch(() => alert("Hubo un error al copiar el enlace"));
  };

  return (
    <>
      <div className="encabezadoConlara">
        <h1 className="detallesProducto__tituloPrincipal">CONLARA.COM.AR</h1>
        <h2 className="detallesProducto__subtitulo">Compra y Vende en El Valle Del Conlara</h2>
      </div>

      <div className="detallesProducto">
        <Helmet>
          <title>
            {producto.name
              ? `${producto.name} - Conlara.com.ar`
              : "Cargando producto..."}
          </title>
          <meta
            name="description"
            content={
              producto.description ||
              "Compra los mejores productos en Conlara.com.ar"
            }
          />
          <meta name="keywords" content="tienda, compra, venta, productos, Conlara" />
          <meta property="og:type" content="product" />
          <meta property="og:title" content={producto.name || "Producto"} />
          <meta
            property="og:description"
            content={producto.description || "Detalles del producto"}
          />
          <meta
            property="og:image"
            content={producto.imgUrl || "https://via.placeholder.com/400"}
          />
          <meta property="og:url" content={productUrl} />
          <meta property="og:site_name" content="Conlara.com.ar" />
        </Helmet>

        {error ? (
          <div className="error-container">
            <p className="error-message">
              Hubo un problema al cargar los detalles: {error}
            </p>
          </div>
        ) : null}

        {producto.name ? (
          <div className="detallesProducto__contenedor">
            <h1 className="detallesProducto__titulo">{producto.name}</h1>
            <p className="detallesProducto__informacion">
              <span className="detallesProducto__etiqueta">Descripción: </span>
              {producto.description}
            </p>
            <p className="detallesProducto__informacion">
              <span className="detallesProducto__etiqueta">Precio: </span>
              {Number(producto.price) === 1 || !producto.price
                ? "Consultar precio"
                : `$${Number(producto.price).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </p>

            <img
              className="detallesProducto__imagen"
              src={producto.imgUrl || "https://via.placeholder.com/400"}
              alt={`Imagen de ${producto.name}`}
              onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
              role="img"
              aria-label={`Imagen ilustrativa de ${producto.name}`}
            />

            <div className="detallesProducto__botones">
              <button className="detallesProducto__boton" onClick={handleComprar}>
                Comprar
              </button>
            </div>

            {mostrarContacto && producto.telefono && (
              <div className="detallesProducto__contacto">
                <p>
                  <strong>Correo del vendedor:</strong> {producto.creatorEmail}
                </p>
                <p>
                  <strong>Teléfono del vendedor:</strong> {producto.telefono}
                </p>
                {isMobile && (
                  <div className="detallesProducto__accionesMovil">
                    <a
                      href={`tel:${producto.telefono}`}
                      className="detallesProducto__boton"
                    >
                      Llamar
                    </a>
                    <a
                      href={`https://wa.me/${producto.telefono}`}
                      className="detallesProducto__boton"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="detallesProducto__compartir">
              <h3>Compartir</h3>
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detallesProducto__boton compartir facebook"
              >
                <i className="fa-brands fa-facebook-f"></i> Compartir en Facebook
              </a>
              <a
                href={whatsappUrl}
                className="detallesProducto__boton compartir whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i> Compartir en WhatsApp
              </a>
              <div className="detallesProducto__copiar">
                <button className="detallesProducto__boton" onClick={handleCopyToClipboard}>
                  Copiar Enlace
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="loading-spinner">
            <p>Cargando detalles del producto...</p>
          </div>
        )}
      </div>

      <div className="boton-regresar-contenedor">
        <button className="detallesProducto__boton" onClick={handleRegresar}>
          Mirá más productos de conlara.com.ar
        </button>
      </div>
    </>
  );
};

export default DetallesProducto;
