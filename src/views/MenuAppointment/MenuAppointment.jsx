import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { QRCodeCanvas } from "qrcode.react"; 
import "./MenuAppointment.css";

const MenuAppointment = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [nickname, setNickname] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [maxProducts, setMaxProducts] = useState(0); // ⭐ Límite permitido

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = user?.email;

        if (!token || !email) return;

        // 🔹 Obtener datos del usuario
        const response = await fetch(`https://ecommerce-9558.onrender.com/users/email/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error obteniendo datos del usuario");

        const data = await response.json();
        setNickname(data.nickname);
        setMaxProducts(data.sharedcount); // ⭐ Guardar límite

        // 🔹 Obtener productos del usuario
        const responseProducts = await fetch(`https://ecommerce-9558.onrender.com/products/creator/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!responseProducts.ok) throw new Error("Error obteniendo productos");
        const dataProducts = await responseProducts.json();
        setProductCount(dataProducts.length);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="menu-appointment">
      <div className="menu-appointment__content">
        <h1 className="menu-appointment__title">Menú Usuario</h1>

        {/* Mostrar cantidad y límite */}
        <h2 className="menu-appointment__subtitle">
          Productos publicados: {productCount}
        </h2>
        <h3 className="menu-appointment__subtitle">
          Límite permitido: {maxProducts}
        </h3>

        <div className="menu-appointment__buttons">
          {/* Botón deshabilitado si se alcanza el límite */}
          <button
            className={`menu-appointment__button ${productCount >= maxProducts ? "disabled" : ""}`}
            onClick={() => navigate("/createAppointments")}
            disabled={productCount >= maxProducts}
          >
            Publicar tu Producto
          </button>

          <button
                  className="menu-appointment__button"
                  onClick={() => navigate("/misproductos")}>
                          {nickname.replace(/[_-]/g, " ")}
                             </button>

          {nickname && (
            <>
              <button
                className="menu-appointment__button"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=¡Toca La Imagen Para ver ${nickname} en Conlara.com.ar! https://ecommerce-9558.onrender.com/users/share/${nickname}`,
                    "_blank"
                  )
                }
              >
                Comparte Tu Tienda en WhatsApp
              </button>

              <button
                className="menu-appointment__button"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=https://ecommerce-9558.onrender.com/users/share/${nickname}`,
                    "_blank"
                  )
                }
              >
                Comparte Tu Tienda en Facebook
              </button>

              <button className="menu-appointment__button" onClick={() => setShowQR(!showQR)}>
                {showQR ? "Ocultar QR" : "Generar QR para tu Tienda"}
              </button>

              {showQR && (
                <div className="menu-appointment__qr">
                  <QRCodeCanvas value={`https://conlara.com.ar/${nickname}`} size={200} />
                  <p className="qr-link">
                    <a href={`https://conlara.com.ar/${nickname}`} target="_blank" rel="noreferrer">
                      {`https://conlara.com.ar/${nickname}`}
                    </a>
                  </p>
                  <button className="print-button" onClick={handlePrint}>
                    Imprimir QR
                  </button>
                </div>
              )}

              <button 
                className="menu-appointment__button" 
                onClick={() => navigate("/carrusel")}>
                Mostrar Productos
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuAppointment;
  