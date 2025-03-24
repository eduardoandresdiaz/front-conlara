import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './MenuAppointment.css';

const MenuAppointment = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Función para redirigir a la página de "Sacar Nuevo Turno"
  const handleNewAppointment = () => {
    navigate('/createAppointments'); // Redirige a la página de nuevo turno
  };



  // Función para redirigir a la página de "Mis Turnos"
  const handleMyAppointments = () => {
    navigate('/misproductos'); // Redirige a la página de mis turnos
  };

  return (
    <div className="menu-appointment">
      <div className="menu-appointment__content">
        <h1 className="menu-appointment__title">Menú Usuario</h1>
        <div className="menu-appointment__buttons">
          <button className="menu-appointment__button" onClick={handleNewAppointment}>
            Publicar Un Producto
          </button>
          <button className="menu-appointment__button" onClick={handleMyAppointments}>
            Mis Productos Publicados
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuAppointment;
