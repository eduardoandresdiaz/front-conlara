import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const DetallesProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({});
  const [error, setError] = useState("");
  const [mostrarContacto, setMostrarContacto] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `https://ecommerce-9558.onrender.com/products/${id}`
        );
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

  const productUrl = `https://conlara.com.ar/productos/${id}`;

  return (
    <div className="detallesProducto">
      <Helmet>
        <title>
          {producto.name
            ? `${producto.name} - Conlara Tienda`
            : "Cargando producto..."}
        </title>
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
            <span className="detallesProducto__etiqueta">Precio: </span>$
            {producto.price}
          </p>
          <img
            className="detallesProducto__imagen"
            src={producto.imgUrl}
            alt={`Imagen de ${producto.name}`}
          />

          {/* Botones de compartir */}
          <div className="detallesProducto__compartir">
            <h3>Compartir</h3>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                productUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="detallesProducto__boton compartir facebook"
            >
              <i className="fa-brands fa-facebook-f"></i> Compartir en Facebook
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Mirá este producto: ${producto.name} - ${productUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="detallesProducto__boton compartir whatsapp"
            >
              <i className="fa-brands fa-whatsapp"></i> Compartir en WhatsApp
            </a>

            {/* Instagram (no permite compartir directamente, pero se puede redirigir al perfil) */}
            <a
              href="https://www.instagram.com/conlara.tienda/"
              target="_blank"
              rel="noopener noreferrer"
              className="detallesProducto__boton compartir instagram"
            >
              <i className="fa-brands fa-instagram"></i> Ver en Instagram
            </a>
          </div>

          <div className="detallesProducto__botones">
            <button className="detallesProducto__boton" onClick={() => navigate("/")}>
              Regresar
            </button>
          </div>
        </div>
      ) : (
        <p className="detallesProducto__mensaje">Cargando detalles del producto...</p>
      )}
    </div>
  );
};

export default DetallesProducto;
