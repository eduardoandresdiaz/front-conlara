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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = user?.email;

        if (!token || !email) return;

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
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);

  const handlePrint = () => {
    window.print(); // 🔹 Abrir ventana de impresión del navegador
  };

  return (
    <div className="menu-appointment">
      <div className="menu-appointment__content">
        <h1 className="menu-appointment__title">Menú Usuario</h1>
        <div className="menu-appointment__buttons">
          <button className="menu-appointment__button" onClick={() => navigate("/createAppointments")}>
            Publicar tu Producto
          </button>
          <button className="menu-appointment__button" onClick={() => navigate("/misproductos")}>
          Modificar o Eliminar Productos Publicados
          </button>

          {nickname && (
            <>
              <button
                className="menu-appointment__button"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=¡Mira el perfil de ${nickname} en Conlara Tienda! https://ecommerce-9558.onrender.com/users/share/${nickname}`,
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

              {/* 🔹 Botón para mostrar QR */}
              <button className="menu-appointment__button" onClick={() => setShowQR(!showQR)}>
                {showQR ? "Ocultar QR" : "Generar QR para tu Tienda"}
              </button>

              {/* 🔹 Mostrar QR y opción de imprimir */}
              {showQR && (
                <div className="menu-appointment__qr">
                  <QRCodeCanvas value={`https://conlara.com.ar/${nickname}`} size={200} />
                  <p className="qr-link">
                    <a href={`https://conlara.com.ar/${nickname}`} target="_blank">
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



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../../context/UserContext";
// import "./MenuAppointment.css";

// const MenuAppointment = () => {
//   const navigate = useNavigate();
//   const { user } = useUser();
//   const [nickname, setNickname] = useState("");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const email = user?.email;

//         if (!token || !email) return;

//         const response = await fetch(`https://ecommerce-9558.onrender.com/users/email/${email}`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) throw new Error("Error obteniendo datos del usuario");

//         const data = await response.json();
//         setNickname(data.nickname); // Guardar el nickname en estado
//       } catch (error) {
//         console.error("Error al obtener el usuario:", error);
//       }
//     };

//     if (user?.email) {
//       fetchUserData();
//     }
//   }, [user?.email]);

//   return (
//     <div className="menu-appointment">
//       <div className="menu-appointment__content">
//         <h1 className="menu-appointment__title">Menú Usuario</h1>
//         <div className="menu-appointment__buttons">
//           <button className="menu-appointment__button" onClick={() => navigate("/createAppointments")}>
//             Publicar tu Producto
//           </button>
//           <button className="menu-appointment__button" onClick={() => navigate("/misproductos")}>
//             Modificar o Eliminar Productos Publicados
//           </button>

//           {/* Mostrar botones de compartir solo si hay un `nickname` */}
//           {nickname && (
//             <>
//               <button
//                 className="menu-appointment__button"
//                 onClick={() =>
//                   window.open(
//                     `https://wa.me/?text=¡Mira el perfil de ${nickname} en Conlara Tienda! https://ecommerce-9558.onrender.com/users/share/${nickname}`,
//                     "_blank"
//                   )
//                 }
//               >
//                 Compartir en WhatsApp
//               </button>

//               <button
//                 className="menu-appointment__button"
//                 onClick={() =>
//                   window.open(
//                     `https://www.facebook.com/sharer/sharer.php?u=https://ecommerce-9558.onrender.com/users/share/${nickname}`,
//                     "_blank"
//                   )
//                 }
//               >
//                 Compartir en Facebook
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuAppointment;



// import { useNavigate } from 'react-router-dom'; // Importa useNavigate
// import './MenuAppointment.css';


// const MenuAppointment = () => {
//   const navigate = useNavigate(); // Inicializa el hook useNavigate

//   // Función para redirigir a la página de "Sacar Nuevo Turno"
//   const handleNewAppointment = () => {
//     navigate('/createAppointments'); // Redirige a la página de nuevo turno
//   };



//   // Función para redirigir a la página de "Mis Turnos"
//   const handleMyAppointments = () => {
//     navigate('/misproductos'); // Redirige a la página de mis turnos
//   };

//   return (
//     <div className="menu-appointment">
//       <div className="menu-appointment__content">
//         <h1 className="menu-appointment__title">Menú Usuario</h1>
//         <div className="menu-appointment__buttons">
//           <button className="menu-appointment__button" onClick={handleNewAppointment}>
//             Publicar tu Producto
//           </button>
//           <button className="menu-appointment__button" onClick={handleMyAppointments}>
//             Mis Productos Publicados
//           </button>
//           <button
//   className="menu-appointment__button"
//   onClick={() => window.open(`https://wa.me/?text=¡Mira el perfil de ${user.nickname} en Conlara Tienda! https://conlara.com.ar/users/share/${user.nickname}`, '_blank')}
// >
//   Compartir en WhatsApp
// </button>

// <button
//   className="menu-appointment__button"
//   onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https://conlara.com.ar/users/share/${user.nickname}`, '_blank')}
// >
//   Compartir en Facebook
// </button>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuAppointment;
