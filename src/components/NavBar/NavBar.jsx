import { Link, useNavigate } from "react-router-dom";
import style from "./NavBar.module.css";
import logo from "../../assets/media/images/logo.jpg";
import { useUser } from "../../context/UserContext";

const NavBar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Eliminar datos del user
    setUser({}); // Actualizar el estado
    navigate("/"); // Va al login
  };

  const handleOpenMenuAppointment = () => {
    navigate("/MenuAppointment"); // Redirigir al menú de turnos
  };

  return (
    <nav className={style.NavBarContainer}>
      <Link to="/" className={style.logoContainer}>
        <img src={logo} alt="Logo Conlara.com.ar" className={style.imageLogo} />
      </Link>
      <div className={style.linksContainer}>
        {!user || Object.keys(user).length === 0 ? (
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
            {/* Mostrar mensaje de bienvenida y botones solo para usuarios logueados */}
            <span className={style.welcomeMessage}>{user.email}</span>
            <button onClick={handleLogout} className={style.logoutButton}>
              Cerrar Sesión
            </button>
            <button
              onClick={handleOpenMenuAppointment}
              className={style.menuAppointmentButton}
            >
              Menú de Publicaciones
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
