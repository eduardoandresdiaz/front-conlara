import { useNavigate } from "react-router-dom";
import "./SobreNosotros.css";

const SobreNosotros = () => {
    const navigate = useNavigate();

    return (
        <main className="sobreNosotros">
            {/* Imagen principal */}
            <section className="sobreNosotros__imagenPrincipal">
                <img
                    src="https://res.cloudinary.com/dvp0fdhyc/image/upload/v1792427395/WhatsApp_Image_2026-10-19_at_1.11.50_PM_cbxs8i.jpg"
                    alt="Conlara.com.ar, plataforma de productos, comercios, emprendedores y servicios"
                    className="sobreNosotros__imagen"
                />
            </section>

            <section className="sobreNosotros__hero">

                <div className="sobreNosotros__heroContenido">
                    <span className="sobreNosotros__etiqueta">
                        Conocé nuestro proyecto
                    </span>

                    <h1>Sobre Conlara.com.ar</h1>

                    <p>
                        Una plataforma argentina creada para conectar personas,
                        comercios, emprendedores, artesanos y prestadores de servicios
                        con su comunidad.
                    </p>

                    <button
                        type="button"
                        className="sobreNosotros__botonPrincipal"
                        onClick={() => navigate("/")}
                    >
                        Ver productos
                    </button>
                </div>
            </section>

            <section className="sobreNosotros__contenedor">
                <article className="sobreNosotros__seccion">
                    <div className="sobreNosotros__icono">🌎</div>

                    <div className="sobreNosotros__texto">
                        <h2>¿Qué es Conlara.com.ar?</h2>

                        <p>
                            <strong>Conlara.com.ar</strong> es una plataforma argentina
                            creada para conectar personas, comercios, emprendedores,
                            artesanos y prestadores de servicios con posibles clientes de
                            su comunidad.
                        </p>

                        <p>
                            El proyecto nació en el Valle del Conlara, provincia de San
                            Luis, con el propósito de facilitar la publicación y promoción
                            de productos, ofertas, comercios y servicios locales.
                        </p>

                        <p>
                            Nuestro objetivo inicial es llegar a todas las localidades del
                            Valle del Conlara y, con el tiempo, expandir la plataforma a
                            diferentes puntos de la Argentina.
                        </p>
                    </div>
                </article>

                <article className="sobreNosotros__seccion sobreNosotros__seccion--destacada">
                    <div className="sobreNosotros__icono">💰</div>

                    <div className="sobreNosotros__texto">
                        <h2>Vendé sin pagar comisiones</h2>

                        <p>
                            Una de las principales diferencias de Conlara.com.ar es que
                            <strong> no cobramos comisiones por cada venta</strong>.
                        </p>

                        <p>
                            La plataforma facilita el contacto directo entre compradores y
                            vendedores. Cada vendedor puede establecer sus precios,
                            responder las consultas de sus clientes y conservar el valor de
                            sus ventas sin pagar un porcentaje por cada operación.
                        </p>

                        <div className="sobreNosotros__mensajeDestacado">
                            <span>✓</span>

                            <p>
                                Publicá tus productos y vendé sin pagar comisiones por cada
                                venta.
                            </p>
                        </div>
                    </div>
                </article>

                <article className="sobreNosotros__seccion">
                    <div className="sobreNosotros__icono">🛍️</div>

                    <div className="sobreNosotros__texto">
                        <h2>Más que una plataforma de compraventa</h2>

                        <p>
                            Conlara.com.ar también ofrece herramientas para ayudar a
                            comerciantes y emprendedores a organizar su actividad diaria.
                        </p>

                        <p>
                            Los usuarios pueden publicar productos, controlar existencias,
                            identificar productos agotados, recibir avisos de stock mínimo,
                            organizar precios y guardar información de sus proveedores.
                        </p>

                        <p>
                            Cada producto publicado mejora la visibilidad del negocio y
                            permite que los posibles clientes conozcan qué productos están
                            disponibles.
                        </p>
                    </div>
                </article>

                <section className="sobreNosotros__beneficios">
                    <h2>¿Qué podés hacer en Conlara.com.ar?</h2>

                    <div className="sobreNosotros__beneficiosGrid">
                        <article className="sobreNosotros__beneficio">
                            <span className="sobreNosotros__beneficioIcono">📢</span>

                            <h3>Publicar productos</h3>

                            <p>
                                Mostrá tus productos, ofertas y novedades para llegar a más
                                personas.
                            </p>
                        </article>

                        <article className="sobreNosotros__beneficio">
                            <span className="sobreNosotros__beneficioIcono">🤝</span>

                            <h3>Contactar directamente</h3>

                            <p>
                                Compradores y vendedores pueden comunicarse directamente, sin
                                intermediarios.
                            </p>
                        </article>

                        <article className="sobreNosotros__beneficio">
                            <span className="sobreNosotros__beneficioIcono">📦</span>

                            <h3>Controlar el stock</h3>

                            <p>
                                Organizá tus existencias e identificá productos agotados o con
                                stock mínimo.
                            </p>
                        </article>

                        <article className="sobreNosotros__beneficio">
                            <span className="sobreNosotros__beneficioIcono">📍</span>

                            <h3>Comprar cerca</h3>

                            <p>
                                Encontrá productos, comercios, emprendedores y servicios de tu
                                localidad.
                            </p>
                        </article>

                        <article className="sobreNosotros__beneficio">
                            <span className="sobreNosotros__beneficioIcono">💵</span>

                            <h3>Vender sin comisiones</h3>

                            <p>
                                Realizá tus ventas sin pagar un porcentaje por cada operación.
                            </p>
                        </article>

                        <article className="sobreNosotros__beneficio">
                            <span className="sobreNosotros__beneficioIcono">📱</span>

                            <h3>Acceder desde cualquier dispositivo</h3>

                            <p>
                                Administrá tus publicaciones desde el teléfono, la computadora
                                o la tablet.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="sobreNosotros__misionVision">
                    <article className="sobreNosotros__tarjeta">
                        <span className="sobreNosotros__tarjetaIcono">🎯</span>

                        <h2>Nuestra misión</h2>

                        <p>
                            Brindar una herramienta sencilla, accesible y cercana para que
                            particulares, comerciantes, emprendedores, artesanos y
                            prestadores de servicios puedan dar a conocer su trabajo,
                            organizar sus productos, llegar a nuevos clientes y vender sin
                            pagar comisiones.
                        </p>
                    </article>

                    <article className="sobreNosotros__tarjeta">
                        <span className="sobreNosotros__tarjetaIcono">🚀</span>

                        <h2>Nuestra visión</h2>

                        <p>
                            Crecer localidad por localidad, comenzando por el Valle del
                            Conlara y llegando progresivamente a toda la Argentina,
                            fortaleciendo el comercio y las economías locales.
                        </p>
                    </article>
                </section>

                <article className="sobreNosotros__seccion">
                    <div className="sobreNosotros__icono">🏘️</div>

                    <div className="sobreNosotros__texto">
                        <h2>Información para cada comunidad</h2>

                        <p>
                            Conlara.com.ar busca reunir información útil para las distintas
                            localidades, como servicios, teléfonos importantes, farmacias,
                            centros de salud, instituciones y contenidos relacionados con la
                            historia de cada pueblo.
                        </p>

                        <p>
                            Queremos que cada localidad pueda contar con un espacio digital
                            donde sus habitantes encuentren productos, servicios,
                            emprendimientos e información importante.
                        </p>
                    </div>
                </article>

                <section className="sobreNosotros__llamadaAccion">
                    <span className="sobreNosotros__llamadaIcono">🚀</span>

                    <h2>Hacé visible lo que ofrecés</h2>

                    <p>
                        Publicá tus productos, promocioná tu actividad y conectate con
                        personas de tu comunidad.
                    </p>

                    <strong>
                        Conlara.com.ar: publicá tus productos, hacé visible tu negocio y
                        vendé sin pagar comisiones.
                    </strong>

                    <div className="sobreNosotros__acciones">
                        <button
                            type="button"
                            className="sobreNosotros__botonPrincipal"
                            onClick={() => navigate("/")}
                        >
                            Ver productos
                        </button>

                        <button
                            type="button"
                            className="sobreNosotros__botonSecundario"
                            onClick={() => navigate("/CreateAppointment")}
                        >
                            Publicar un producto
                        </button>
                    </div>
                </section>
            </section>
        </main>
    );
};

export default SobreNosotros;