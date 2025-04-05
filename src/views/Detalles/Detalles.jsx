import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Detalles.css"; // Asegúrate de tener el archivo CSS correspondiente

const DetallesProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({});
  const [error, setError] = useState("");
  const [mostrarContacto, setMostrarContacto] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`https://ecommerce-9558.onrender.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del producto");
        }
        const data = await response.json();
        setProducto(data);
        setError("");
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducto();
  }, [id]);

  const handleRegresar = () => navigate("/");

  const handleComprar = () => setMostrarContacto(true);

  const quitarPrefijoTelefono = (telefono) => {
    return telefono.startsWith("+54") ? telefono.slice(3) : telefono;
  };

  const productUrl = `https://conlara.com.ar/productos/${id}`;
  const mensajeWhatsApp = `Mirá este producto: ${producto.name} - ${productUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
  const whatsappUrl = isMobile
    ? `whatsapp://send?text=${encodeURIComponent(mensajeWhatsApp)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(mensajeWhatsApp)}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      alert("Enlace copiado al portapapeles");
    }).catch(() => {
      alert("Hubo un error al copiar el enlace");
    });
  };

  return (
    <div className="detallesProducto">
      <Helmet>
        <title>{producto.name ? `${producto.name} - Conlara Tienda` : "Cargando producto..."}</title>
        <meta property="og:type" content="product" />
        <meta property="og:title" content={producto.name || "Producto"} />
        <meta property="og:description" content={producto.description || "Detalles del producto"} />
        <meta property="og:image" content={producto.imgUrl || "https://via.placeholder.com/400"} />
        <meta property="og:url" content={productUrl} />
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
            <span className="detallesProducto__etiqueta">Precio: </span>${producto.price}
          </p>
          <img
            className="detallesProducto__imagen"
            src={producto.imgUrl}
            alt={`Imagen de ${producto.name}`}
          />

          <div className="detallesProducto__botones">
            <button className="detallesProducto__boton" onClick={handleRegresar}>Regresar</button>
            <button className="detallesProducto__boton" onClick={handleComprar}>Comprar</button>
          </div>

          {mostrarContacto && producto.telefono && (
            <div className="detallesProducto__contacto">
              <p><strong>Correo del vendedor:</strong> {producto.creatorEmail}</p>
              <p><strong>Teléfono del vendedor:</strong> {quitarPrefijoTelefono(producto.telefono)}</p>
              {isMobile ? (
                <div className="detallesProducto__accionesMovil">
                  <a
                    href={`tel:${quitarPrefijoTelefono(producto.telefono)}`}
                    className="detallesProducto__boton"
                  >
                    Llamar
                  </a>
                  <a
                    href={`https://wa.me/${quitarPrefijoTelefono(producto.telefono)}`}
                    className="detallesProducto__boton"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              ) : null}
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
              <span>Enlace:</span> {productUrl}
              <button
                className="detallesProducto__boton"
                onClick={handleCopyToClipboard}
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="detallesProducto__mensaje">Cargando detalles del producto...</p>
      )}
    </div>
  );
};

export default DetallesProducto;
