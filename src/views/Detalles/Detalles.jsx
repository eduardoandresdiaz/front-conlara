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
  const [loading, setLoading] = useState(true);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  /* =========================================================
     OBTENER PRODUCTO
  ========================================================= */

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://ecommerce-9558.onrender.com/products/${id}`,
          {
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `Error al obtener los detalles del producto (${response.status})`
          );
        }

        const data = await response.json();

        console.log("PRODUCTO DETALLES:", data);

        setProducto(data);
        setError("");
      } catch (error) {
        if (error.name === "AbortError") {
          setError(
            "La solicitud tardó demasiado tiempo y fue cancelada."
          );
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [id]);

  /* =========================================================
     NAVEGACIÓN
  ========================================================= */

  const handleRegresar = () => {
    navigate("/");
  };

  const handleComprar = () => {
    setMostrarContacto(true);
  };

  const handleVolverAtras = () => {
    navigate(-1);
  };

  /* =========================================================
     URL PARA COMPARTIR
  ========================================================= */

  const productUrl =
    `https://og.conlara.com.ar/productos/share/${id}`;

  const facebookProductUrl =
    `https://ecommerce-9558.onrender.com/products/share-facebook/${id}`;

  const mensajeWhatsApp =
    `🛍️ Miralo en Conlara.com.ar\n` +
    `Compra y Vende en el Valle del Conlara\n` +
    `${producto.name || ""}\n\n` +
    `🔗 ${productUrl}`;

  const textoPersonalizado =
    "¡Echa un vistazo a este producto en Conlara! Compra y vende en el Valle del Conlara.";

  const facebookShareUrl =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      facebookProductUrl
    )}&quote=${encodeURIComponent(textoPersonalizado)}`;

  const whatsappUrl = isMobile
    ? `whatsapp://send?text=${encodeURIComponent(mensajeWhatsApp)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(
      mensajeWhatsApp
    )}`;

  /* =========================================================
     COPIAR ENLACE
  ========================================================= */

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        alert("Enlace copiado al portapapeles");
      })
      .catch(() => {
        alert("Hubo un error al copiar el enlace");
      });
  };

  /* =========================================================
     FORMATEAR PRECIO
  ========================================================= */

  const formatPrice = (
    price,
    expiresAt,
    mostrarprecio = true
  ) => {
    if (mostrarprecio === false) {
      return "Consultar";
    }

    if (
      expiresAt &&
      new Date(expiresAt) < new Date()
    ) {
      return "Consultar";
    }

    const validPrice = isNaN(price)
      ? 0
      : parseFloat(price);

    if (validPrice === 1) {
      return "Consultar";
    }

    return `$${validPrice.toFixed(2)}`;
  };

  /* =========================================================
     FORMATEAR FECHA
  ========================================================= */

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return null;
    }

    const fechaObjeto = new Date(fecha);

    if (isNaN(fechaObjeto.getTime())) {
      return null;
    }

    return fechaObjeto.toLocaleDateString();
  };

  /* =========================================================
     PRECIO
  ========================================================= */

  const precioFormateado = formatPrice(
    producto.price,
    producto.expiresAt,
    producto.mostrarprecio
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <div className="encabezadoConlara">
        <h1 className="detallesProducto__tituloPrincipal">
          CONLARA.COM.AR
        </h1>

        <h2 className="detallesProducto__subtitulo"></h2>
      </div>

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <div className="detallesProducto">

        {/* ===================================================
            SEO
        =================================================== */}

        <Helmet>
  <title>
    {producto.name
      ? `${producto.name} | Conlara.com.ar`
      : "Producto | Conlara.com.ar"}
  </title>

  <meta
    name="description"
    content={
      producto.description
        ? `${producto.name} - ${producto.description}`.slice(0, 160)
        : producto.name
          ? `Encontrá ${producto.name} publicado en Conlara.com.ar.`
          : "Encontrá productos publicados en Conlara.com.ar."
    }
  />

  <meta
    name="robots"
    content="index, follow, max-image-preview:large"
  />

  <link
    rel="canonical"
    href={`https://conlara.com.ar/productos/${id}`}
  />

  <meta
    property="og:type"
    content="product"
  />

  <meta
    property="og:title"
    content={
      producto.name
        ? `${producto.name} | Conlara.com.ar`
        : "Producto | Conlara.com.ar"
    }
  />

  <meta
    property="og:description"
    content={
      producto.description ||
      (producto.name
        ? `Encontrá ${producto.name} en Conlara.com.ar.`
        : "Encontrá productos en Conlara.com.ar.")
    }
  />

  <meta
    property="og:image"
    content={
      producto.imgUrl ||
      "https://conlara.com.ar/imagen2.jpg"
    }
  />

  <meta
    property="og:url"
    content={`https://conlara.com.ar/productos/${id}`}
  />

  <meta
    property="og:site_name"
    content="Conlara.com.ar"
  />

  <meta
    property="og:locale"
    content="es_AR"
  />
</Helmet>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="error-container">
            <p className="error-message">
              Hubo un problema al cargar los detalles:{" "}
              {error}
            </p>
          </div>
        )}

        {/* ===================================================
            CARGANDO
        =================================================== */}

        {loading && !error && (
          <div className="loading-spinner">
            <p>Cargando detalles del producto...</p>
          </div>
        )}

        {/* ===================================================
            PRODUCTO
        =================================================== */}

        {!loading && !error && producto.name && (
          <div className="detallesProducto__contenedor">

            {/* BOTÓN VOLVER */}

            {window.history.length > 1 && (
              <button
                className="detallesProducto__boton volver-atras"
                onClick={handleVolverAtras}
              >
                ⬅ Volver
              </button>
            )}

            {/* NOMBRE */}

            <h1 className="detallesProducto__titulo">
              {producto.name}
            </h1>

            {/* PRECIO */}

            <p className="detallesProducto__informacion">
              <span className="detallesProducto__etiqueta">
                Precio:{" "}
              </span>

              {precioFormateado}
            </p>

            {/* DESCRIPCIÓN */}

            {producto.description && (
              <p className="detallesProducto__informacion">
                <span className="detallesProducto__etiqueta">
                  Descripción:{" "}
                </span>

                {producto.description}
              </p>
            )}

            {/* CATEGORÍA */}

            {producto.category?.name && (
              <p className="detallesProducto__informacion">
                <span className="detallesProducto__etiqueta">
                  Categoría:{" "}
                </span>

                {producto.category.name}
              </p>
            )}

            {/* UBICACIÓN

            {producto.ubicacion && (
              <p className="detallesProducto__informacion">
                <span className="detallesProducto__etiqueta">
                  Ubicación:{" "}
                </span>

                {producto.ubicacion}
              </p>
            )} */}

            {/* STOCK */}

            {/* {producto.stock !== undefined &&
              producto.stock !== null && (
                <p className="detallesProducto__informacion">
                  <span className="detallesProducto__etiqueta">
                    Stock:{" "}
                  </span>

                  {producto.stock}
                </p>
              )} */}

            {/* PROVEEDOR */}

            {/* {producto.proveedor && (
              <p className="detallesProducto__informacion">
                <span className="detallesProducto__etiqueta">
                  Proveedor:{" "}
                </span>

                {producto.proveedor}
              </p>
            )} */}

            {/* FECHA CADUCIDAD */}

            {/* {producto.fechaCaducidad && (
              <p className="detallesProducto__informacion">
                <span className="detallesProducto__etiqueta">
                  Vencimiento del producto:{" "}
                </span>

                {formatearFecha(
                  `${producto.fechaCaducidad}T00:00:00`
                )}
              </p>
            )} */}

            {/* =================================================
                IMAGEN
            ================================================= */}

            <div className="detallesProducto__imagenContainer">

              <img
                className="detallesProducto__imagen"
                src={
                  producto.imgUrl ||
                  "https://via.placeholder.com/400"
                }
                alt={`Imagen de ${producto.name}`}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400";
                }}
              />

              {producto.resaltaroferta && (
                <div className="detallesProducto__ofertaOverlay">
                  OFERTA
                </div>
              )}

            </div>

            {/* =================================================
                COMPRAR / CONSULTAR
            ================================================= */}

            <div className="detallesProducto__botones">

              <button
                className="detallesProducto__boton"
                onClick={handleComprar}
              >
                {precioFormateado === "Consultar"
                  ? "Consultar precio"
                  : "Comprar"}
              </button>

            </div>

            {/* =================================================
                DATOS DEL VENDEDOR
            ================================================= */}

            {mostrarContacto && (
              <div className="detallesProducto__contacto">

                {producto.creatorEmail && (
                  <p>
                    <strong>
                      Correo del vendedor:
                    </strong>{" "}
                    {producto.creatorEmail}
                  </p>
                )}

                {producto.telefono && (
                  <p>
                    <strong>
                      Teléfono del vendedor:
                    </strong>{" "}
                    {producto.telefono}
                  </p>
                )}

                {isMobile && producto.telefono && (
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

            {/* =================================================
                COMPARTIR
            ================================================= */}

            <div className="detallesProducto__compartir">

              {/*
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detallesProducto__boton compartir facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
                Compartir en Facebook
              </a>
              */}

              <a
                href={whatsappUrl}
                className="detallesProducto__boton compartir whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-whatsapp"></i>
                {" "}
                Compartir en WhatsApp
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
        )}

        {/* PRODUCTO NO ENCONTRADO */}

        {!loading &&
          !error &&
          !producto.name && (
            <div className="error-container">
              <p className="error-message">
                No se encontraron datos del producto.
              </p>
            </div>
          )}

      </div>

      {/* =====================================================
          REGRESAR AL LISTADO
      ===================================================== */}

      <div className="boton-regresar-contenedor">

        <button
          className="detallesProducto__boton"
          onClick={handleRegresar}
        >
          Mirá más productos de conlara.com.ar
        </button>

      </div>
    </>
  );
};

export default DetallesProducto;
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import "./Detalles.css";

// const DetallesProducto = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [producto, setProducto] = useState({});
//   const [error, setError] = useState("");
//   const [mostrarContacto, setMostrarContacto] = useState(false);

//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

//   useEffect(() => {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 10000);

//     const fetchProducto = async () => {
//       try {
//         const response = await fetch(
//           `https://ecommerce-9558.onrender.com/products/${id}`,
//           { signal: controller.signal }
//         );
//         clearTimeout(timeoutId);
//         if (!response.ok) throw new Error("Error al obtener los detalles del producto");
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

//     return () => {
//       controller.abort();
//       clearTimeout(timeoutId);
//     };
//   }, [id]);

//   const handleRegresar = () => navigate("/");
//   const handleComprar = () => setMostrarContacto(true);
//   const handleVolverAtras = () => navigate(-1);

//   const productUrl = `https://og.conlara.com.ar/productos/share/${id}`;
//   const facebookProductUrl = `https://ecommerce-9558.onrender.com/products/share-facebook/${id}`;

//   const mensajeWhatsApp = `🛍️ Miralo en Conlara.com.ar\n Compra y Vende en el Valle del Conlara\n${producto.name}\n\n🔗 ${productUrl}`;
//   const textoPersonalizado = "¡Echa un vistazo a este producto en Conlara! Compra y vende en el Valle del Conlara.";

//   const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookProductUrl)}&quote=${encodeURIComponent(textoPersonalizado)}`;
//   const whatsappUrl = isMobile
//     ? `whatsapp://send?text=${encodeURIComponent(mensajeWhatsApp)}`
//     : `https://web.whatsapp.com/send?text=${encodeURIComponent(mensajeWhatsApp)}`;

//   const handleCopyToClipboard = () => {
//     navigator.clipboard
//       .writeText(productUrl)
//       .then(() => alert("Enlace copiado al portapapeles"))
//       .catch(() => alert("Hubo un error al copiar el enlace"));
//   };

//   // Función de precio integrada en el mismo archivo
//   const formatPrice = (price, expiresAt, mostrarprecio = true) => {
//     if (mostrarprecio === false) return "Consultar";
//     if (expiresAt && new Date(expiresAt) < new Date()) return "Consultar";
//     const validPrice = isNaN(price) ? 0 : parseFloat(price);
//     return validPrice === 1 ? "Consultar" : `$${validPrice.toFixed(2)}`;
//   };

//   return (
//     <>
//       <div className="encabezadoConlara">
//         <h1 className="detallesProducto__tituloPrincipal">CONLARA.COM.AR</h1>
//         <h2 className="detallesProducto__subtitulo"></h2>
//       </div>

//       <div className="detallesProducto">
//         <Helmet>
//           <title>
//             {producto.name
//               ? `${producto.name} - Conlara.com.ar`
//               : "Cargando producto..."}
//           </title>
//           <meta
//             name="description"
//             content={
//               producto.description ||
//               "Compra los mejores productos en Conlara.com.ar"
//             }
//           />
//           <meta name="keywords" content="tienda, compra, venta, productos, Conlara" />
//           <meta property="og:type" content="product" />
//           <meta property="og:title" content={producto.name || "Producto"} />
//           <meta
//             property="og:description"
//             content={producto.description || "Detalles del producto"}
//           />
//           <meta
//             property="og:image"
//             content={producto.imgUrl || "https://via.placeholder.com/400"}
//           />
//           <meta property="og:url" content={productUrl} />
//           <meta property="og:site_name" content="Conlara.com.ar" />
//         </Helmet>

//         {error ? (
//           <div className="error-container">
//             <p className="error-message">
//               Hubo un problema al cargar los detalles: {error}
//             </p>
//           </div>
//         ) : null}

//         {producto.name ? (
//           <div className="detallesProducto__contenedor">
//             {window.history.length > 1 && (
//               <button className="detallesProducto__boton volver-atras" onClick={handleVolverAtras}>
//                 ⬅ Volver
//               </button>
//             )}

//             <h1 className="detallesProducto__titulo">{producto.name}</h1>
//             {formatPrice(
//               producto.price,
//               producto.expiresAt,
//               producto.mostrarprecio
//             ) !== "Consultar" && (
//                 <p className="detallesProducto__informacion">
//                   <span className="detallesProducto__etiqueta">Precio: </span>

//                   {formatPrice(
//                     producto.price,
//                     producto.expiresAt,
//                     producto.mostrarprecio
//                   )}
//                 </p>
//               )}
//             <p className="detallesProducto__informacion">
//               <span className="detallesProducto__etiqueta">Precio: </span>
//               {formatPrice(producto.price, producto.expiresAt, producto.mostrarprecio)}
//             </p>

//             <img
//               className="detallesProducto__imagen"
//               src={producto.imgUrl || "https://via.placeholder.com/400"}
//               alt={`Imagen de ${producto.name}`}
//               onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
//               role="img"
//               aria-label={`Imagen ilustrativa de ${producto.name}`}
//             />

//             <div className="detallesProducto__botones">
//               <button
//                 className="detallesProducto__boton"
//                 onClick={handleComprar}
//               >
//                 {formatPrice(
//                   producto.price,
//                   producto.expiresAt,
//                   producto.mostrarprecio
//                 ) === "Consultar"
//                   ? "Consultar precio"
//                   : "Comprar"}
//               </button>
//             </div>

//             {mostrarContacto && producto.telefono && (
//               <div className="detallesProducto__contacto">
//                 <p>
//                   <strong>Correo del vendedor:</strong> {producto.creatorEmail}
//                 </p>
//                 <p>
//                   <strong>Teléfono del vendedor:</strong> {producto.telefono}
//                 </p>
//                 {isMobile && (
//                   <div className="detallesProducto__accionesMovil">
//                     <a
//                       href={`tel:${producto.telefono}`}
//                       className="detallesProducto__boton"
//                     >
//                       Llamar
//                     </a>
//                     <a
//                       href={`https://wa.me/${producto.telefono}`}
//                       className="detallesProducto__boton"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       WhatsApp
//                     </a>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="detallesProducto__compartir">
//               {/* <h3>Compartir</h3>
//               <a
//                 href={facebookShareUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="detallesProducto__boton compartir facebook"
//               >
//                 <i className="fa-brands fa-facebook-f"></i> Compartir en Facebook
//               </a> */}
//               <a
//                 href={whatsappUrl}
//                 className="detallesProducto__boton compartir whatsapp"
//               >
//                 <i className="fa-brands fa-whatsapp"></i> Compartir en WhatsApp
//               </a>
//               <div className="detallesProducto__copiar">
//                 <button className="detallesProducto__boton" onClick={handleCopyToClipboard}>
//                   Copiar Enlace
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="loading-spinner">
//             <p>Cargando detalles del producto...</p>
//           </div>
//         )}
//       </div>

//       <div className="boton-regresar-contenedor">
//         <button className="detallesProducto__boton" onClick={handleRegresar}>
//           Mirá más productos de conlara.com.ar
//         </button>
//       </div>
//     </>
//   );
// };

// export default DetallesProducto;

