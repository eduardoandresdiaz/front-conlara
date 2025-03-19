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
    navigate("/"); // va  al login
  };

  const handleOpenMenuAppointment = () => {
    navigate("/MenuAppointment"); // Redirigir al menú de turnos
  };

  return (
    <nav className={style.NavBarContainer}>
      <Link to="/" className={style.logoContainer}>
        <img src={logo} alt="Logo Conlara.com.ar" className={style.imageLogo} />
        
      </Link>
      <p>Conlara Compra y Venta</p>
      <div className={style.linksContainer}>
        {!user || Object.keys(user).length === 0 ? (
          <>
            <Link to="/login" className={style.authLink}>
              Iniciar Sesión
            </Link>
            <Link to="/register" className={style.authLink}>
              Registrarse
            </Link>
          </>
        ) : (
          <>
            {/* Mostrar solo logueado */}
            <button onClick={handleLogout} className={style.logoutButton}>
              Cerrar Sesión
            </button>
            <button
              onClick={handleOpenMenuAppointment}
              className={style.menuAppointmentButton}
            >
            Menu de Publicaciones
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
