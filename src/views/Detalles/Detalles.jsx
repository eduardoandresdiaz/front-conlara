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
    const fetchProducto = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(
          `https://ecommerce-9558.onrender.com/products/${id}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del producto");
        }
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
  }, [id]);

  const handleRegresar = () => navigate("/");
  const handleComprar = () => setMostrarContacto(true);

  const shareUrl = `https://conlara.com.ar/productos/share/${id}`;
  const mensajeWhatsApp = `Mirá este producto: ${producto.name} - ${shareUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = isMobile
    ? `whatsapp://send?text=${encodeURIComponent(mensajeWhatsApp)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(mensajeWhatsApp)}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Enlace copiado al portapapeles");
      })
      .catch(() => {
        alert("Hubo un error al copiar el enlace");
      });
  };

  return (
    <div className="detallesProducto">
      <Helmet>
        <title>
          {producto.name
            ? `${producto.name} - Conlara Tienda`
            : "Cargando producto..."}
        </title>
        <meta
          name="description"
          content={
            producto.description ||
            "Compra los mejores productos en Conlara Tienda"
          }
        />
        <meta
          name="keywords"
          content="tienda, compra, venta, productos, Conlara"
        />
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
        <meta property="og:url" content={shareUrl} />
        <meta property="og:site_name" content="Conlara Tienda" />
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
            <span className="detallesProducto__etiqueta">Precio: </span>${producto.price}
          </p>
          <img
            className="detallesProducto__imagen"
            src={producto.imgUrl}
            alt={`Imagen de ${producto.name}`}
            role="img"
            aria-label={`Imagen ilustrativa de ${producto.name}`}
          />

          <div className="detallesProducto__botones">
            <button
              className="detallesProducto__boton"
              onClick={handleRegresar}
            >
              Lista De Productos
            </button>
            <button
              className="detallesProducto__boton"
              onClick={handleComprar}
            >
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
              <button
                className="detallesProducto__boton"
                onClick={handleCopyToClipboard}
              >
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
  );
};

export default DetallesProducto;


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import "./Detalles.css"; // Asegúrate de tener el archivo CSS correspondiente

// const DetallesProducto = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [producto, setProducto] = useState({});
//   const [error, setError] = useState("");
//   const [mostrarContacto, setMostrarContacto] = useState(false);

//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

//   useEffect(() => {
//     const fetchProducto = async () => {
//       try {
//         const controller = new AbortController(); // Controla abortos
//         const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos
//         const response = await fetch(
//           `https://ecommerce-9558.onrender.com/products/${id}`,
//           { signal: controller.signal }
//         );
//         clearTimeout(timeoutId); // Limpia el timeout
//         if (!response.ok) {
//           throw new Error("Error al obtener los detalles del producto");
//         }
//         const data = await response.json();
//         setProducto(data);
//         setError("");
//       } catch (error) {
//         if (error.name === "AbortError") {
//           setError("La solicitud tardó demasiado tiempo y fue cancelada.");
//         } else {
//           setError(error.message);
//         }
//       }
//     };

//     fetchProducto();
//   }, [id]);

//   const handleRegresar = () => navigate("/");

//   const handleComprar = () => setMostrarContacto(true);

//   const productUrl = `https://conlara.com.ar/productos/${id}`;
//   const mensajeWhatsApp = `Mirá este producto: ${producto.name} - ${productUrl}`;
//   const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//     productUrl
//   )}`;
//   const whatsappUrl = isMobile
//     ? `whatsapp://send?text=${encodeURIComponent(mensajeWhatsApp)}`
//     : `https://web.whatsapp.com/send?text=${encodeURIComponent(mensajeWhatsApp)}`;
//     // DEBUG: Mostrar en consola qué se está enviando a Facebook
//   console.log("🔗 URL del producto:", productUrl);
//   console.log("📘 URL de compartir en Facebook:", facebookShareUrl);
//   console.log("🟢 Mensaje para WhatsApp:", mensajeWhatsApp);
//   console.log("📲 URL de WhatsApp:", whatsappUrl);
//   console.log(" producto:", producto.imgUrl);

//   const handleCopyToClipboard = () => {
//     navigator.clipboard
//       .writeText(productUrl)
//       .then(() => {
//         alert("Enlace copiado al portapapeles");
//       })
//       .catch(() => {
//         alert("Hubo un error al copiar el enlace");
//       });
//   };

//   return (
//     <div className="detallesProducto">
//       <Helmet>
//         <title>
//           {producto.name
//             ? `${producto.name} - Conlara Tienda`
//             : "Cargando producto..."}
//         </title>
//         <meta
//           name="description"
//           content={
//             producto.description ||
//             "Compra los mejores productos en Conlara Tienda"
//           }
//         />
//         <meta
//           name="keywords"
//           content="tienda, compra, venta, productos, Conlara"
//         />
//         <meta property="og:type" content="product" />
//         <meta property="og:title" content={producto.name || "Producto"} />
//         <meta
//           property="og:description"
//           content={producto.description || "Detalles del producto"}
//         />
//         <meta
//           property="og:image"
//           content={producto.imgUrl || "https://via.placeholder.com/400"}
//         />
//         <meta property="og:url" content={productUrl} />
//         <meta property="og:site_name" content="Conlara Tienda" />
//       </Helmet>

//       {error ? (
//         <div className="error-container">
//           <p className="error-message">
//             Hubo un problema al cargar los detalles: {error}
//           </p>
//         </div>
//       ) : null}

//       {producto.name ? (
//         <div className="detallesProducto__contenedor">
//           <h1 className="detallesProducto__titulo">{producto.name}</h1>
//           <p className="detallesProducto__informacion">
//             <span className="detallesProducto__etiqueta">Descripción: </span>
//             {producto.description}
//           </p>
//           <p className="detallesProducto__informacion">
//             <span className="detallesProducto__etiqueta">Precio: </span>${producto.price}
//           </p>
//           <img
//             className="detallesProducto__imagen"
//             src={producto.imgUrl}
//             alt={`Imagen de ${producto.name}`}
//             role="img"
//             aria-label={`Imagen ilustrativa de ${producto.name}`}
//           />

//           <div className="detallesProducto__botones">
//             <button
//               className="detallesProducto__boton"
//               onClick={handleRegresar}
//             >
//               Lista De Productos
//             </button>
//             <button
//               className="detallesProducto__boton"
//               onClick={handleComprar}
//             >
//               Comprar
//             </button>
//           </div>

//           {mostrarContacto && producto.telefono && (
//             <div className="detallesProducto__contacto">
//               <p>
//                 <strong>Correo del vendedor:</strong> {producto.creatorEmail}
//               </p>
//               <p>
//                 <strong>Teléfono del vendedor:</strong> {producto.telefono}
//               </p>
//               {isMobile && (
//                 <div className="detallesProducto__accionesMovil">
//                   <a
//                     href={`tel:${producto.telefono}`}
//                     className="detallesProducto__boton"
//                   >
//                     Llamar
//                   </a>
//                   <a
//                     href={`https://wa.me/${producto.telefono}`}
//                     className="detallesProducto__boton"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     WhatsApp
//                   </a>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="detallesProducto__compartir">
//             <h3>Compartir</h3>
//             <a
//               href={facebookShareUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="detallesProducto__boton compartir facebook"
//             >
//               <i className="fa-brands fa-facebook-f"></i> Compartir en Facebook
//             </a>
//             <a
//               href={whatsappUrl}
//               className="detallesProducto__boton compartir whatsapp"
//             >
//               <i className="fa-brands fa-whatsapp"></i> Compartir en WhatsApp
//             </a>
//             <div className="detallesProducto__copiar">
//               <button
//                 className="detallesProducto__boton"
//                 onClick={handleCopyToClipboard}
//               >
//                 Copiar Enlace
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="loading-spinner">
//           <p>Cargando detalles del producto...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetallesProducto;

