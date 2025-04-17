import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "./NavBar.module.css";
import logo from "../../assets/media/images/imagen2.jpg";
import { useUser } from "../../context/UserContext";

const NavBar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({});
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={style.NavBarContainer}>
      <Link to="/" className={style.logoContainer}>
        <img src={logo} alt="Logo Conlara.com.ar" className={style.imageLogo} />
      </Link>
      <h1 className={style.title}>Conlara.com.ar</h1>

      {/* Botón del menú hamburguesa */}
      <button className={style.menuButton} onClick={toggleMenu} aria-label="Abrir menú">
        ☰
      </button>

      {/* Menú de enlaces */}
      <div className={`${style.linksContainer} ${menuOpen ? style.open : ""}`}>
        {!user || !user.email ? (
          <>
            <Link to="/login" className={style.authLink}>
              <button className={style.loginButton}>Iniciar Sesión</button>
            </Link>
            <Link to="/register" className={style.authLink}>
              <button className={style.menuAppointmentButton}>Registrarse</button>
            </Link>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/perfil")} className={style.emailButton}>
              {user.email}
            </button>
            <button onClick={handleLogout} className={style.logoutButton}>
              Cerrar Sesión
            </button>
            <button onClick={() => navigate("/MenuAppointment")} className={style.menuAppointmentButton}>
              Menú de Publicaciones
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
