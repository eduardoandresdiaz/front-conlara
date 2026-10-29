import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "./NavBar.module.css";
import logo from "../../assets/media/images/home.png";
import { useUser } from "../../context/UserContext";

const NavBar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({});
    closeMenu();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen((estadoAnterior) => !estadoAnterior);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleNavigate = (ruta) => {
    navigate(ruta);
    closeMenu();
  };

  return (
    <nav className={style.NavBarContainer}>
      <Link
        to="/"
        className={style.logoContainer}
        onClick={closeMenu}
      >
        <img
          src={logo}
          alt="Logo de Conlara.com.ar"
          className={style.imageLogo}
        />
      </Link>

      <h1 className={style.title}>Conlara.com.ar</h1>

      {/* Botón del menú hamburguesa */}
      <button
        type="button"
        className={style.menuButton}
        onClick={toggleMenu}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      {/* Menú de enlaces */}
      <div
        className={`${style.linksContainer} ${menuOpen ? style.open : ""
          }`}
      >
        {/* Este botón aparece para todos los usuarios */}


        {!user?.email ? (
          <>
            <Link
              to="/login"
              className={style.authLink}
              onClick={closeMenu}
            >
              <button
                type="button"
                className={style.loginButton}
              >
                Iniciar sesión
              </button>
            </Link>

            <Link
              to="/register"
              className={style.authLink}
              onClick={closeMenu}
            >
              <button
                type="button"
                className={style.menuAppointmentButton}
              >
                Registrarse
              </button>

            </Link>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleNavigate("/perfil")}
              className={style.emailButton}
              title={user.email}
            >
              {user.email}
            </button>

            <button
              type="button"
              onClick={() => handleNavigate("/perfil")}
              className={style.profileButton}
            >
              Tu perfil
            </button>

            <button
              type="button"
              onClick={() => handleNavigate("/MenuAppointment")}
              className={style.menuAppointmentButton}
            >
              Menú de publicaciones
            </button>
            {/* SOLO PARA ADMINISTRADORES */}
            {user?.isAdmin === true && (
              <button
                type="button"
                onClick={() => handleNavigate("/x28x")}
                className={style.adminButton}
              >
                Administración
              </button>
            )}


            <button
              type="button"
              onClick={handleLogout}
              className={style.logoutButton}
            >
              Cerrar sesión
            </button>
          </>
        )}
        <button
          type="button"
          className={style.sobreNosotrosButton}
          onClick={() => handleNavigate("/sobre-nosotros")}
        >
          Sobre nosotros
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import style from "./NavBar.module.css";
// import logo from "../../assets/media/images/home.png";
// import { useUser } from "../../context/UserContext";

// const NavBar = () => {
//   const { user, setUser } = useUser();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser({});
//     closeMenu();
//     navigate("/");
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   return (
//     <nav className={style.NavBarContainer}>
//       <Link to="/" className={style.logoContainer} onClick={closeMenu}>
//         <img src={logo} alt="Logo Conlara.com.ar" className={style.imageLogo} />
//       </Link>
//       <h1 className={style.title}>Conlara.com.ar</h1>

//       {/* Botón del menú hamburguesa */}
//       <button className={style.menuButton} onClick={toggleMenu} aria-label="Abrir menú">
//         ☰
//       </button>

//       {/* Menú de enlaces */}
//       <div className={`${style.linksContainer} ${menuOpen ? style.open : ""}`}>
//         {!user || !user.email ? (
//           <>
//             <Link to="/login" className={style.authLink} onClick={closeMenu}>
//               <button className={style.loginButton}>Iniciar Sesión</button>
//             </Link>
//             <Link to="/register" className={style.authLink} onClick={closeMenu}>
//               <button className={style.menuAppointmentButton}>Registrarse</button>
//             </Link>
//           </>
//         ) : (
//           <>
//             <button onClick={() => { navigate("/perfil"); closeMenu(); }} className={style.emailButton}>
//             <>
//   <button
//     onClick={() => { navigate("/perfil"); closeMenu(); }}
//     className={style.emailButton}
//   >
//     {user.email}
//   </button>
//   <button
//     onClick={() => { navigate("/perfil"); closeMenu(); }}
//     className={style.profileButton}
//   >
//     Tu Perfil
//   </button>
// </>
//             </button>
//             <button onClick={handleLogout} className={style.logoutButton}>
//               Cerrar Sesión
//             </button>
//             <button onClick={() => { navigate("/MenuAppointment"); closeMenu(); }} className={style.menuAppointmentButton}>
//               Menú de Publicaciones
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
