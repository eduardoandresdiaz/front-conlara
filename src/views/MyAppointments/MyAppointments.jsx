



import { useEffect, useState, useContext } from "react";
import Appointments from "../../components/Appointments/Appointments";
import axios from "axios";
import "./MyAppointments.css";
//import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; // Contexto de usuario logueado
import { validateAppointment } from "../../helpers/validate"; // Asegúrate de importar la función de validación

const MyAppointments = () => {
 // const navigate = useNavigate();
  const { user } = useContext(UserContext); // Obtén el usuario logueado del contexto
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Para mostrar el error de carga
  const [cancelError, setCancelError] = useState(''); // Para mostrar error de cancelación
  const [cancelSuccess, setCancelSuccess] = useState(''); // Para mostrar éxito de cancelación

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/appointments");
        // Filtra las s para mostrar solo las del usuario logueado
        const userAppointments = response.data.filter(appointment => appointment.userId === user.id);
        setAppointments(userAppointments);
      } catch (error) {
        console.error(error);
        setError("Hubo un error al cargar tus turnos"); // Se maneja el error aquí
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCancelAppointment = async (appointmentId, appointmentDate) => {
    // Validación de la  antes de cancelarla
    const appointmentValues = {
      date: appointmentDate,
      time: "", // Agregar la hora si es necesario
      status: "Active", // Establecer el estado de lso turnos
      description: "", // Establecer la descripción si es necesario
      cancel: true, // Marcar que es una cancelación
    };

    const validationErrors = validateAppointment(appointmentValues);

    if (validationErrors.cancel) {
      setCancelError(validationErrors.cancel);
      setCancelSuccess('');
      return; // No continúa con la cancelación si hay un error
    }

    try {
      // Enviar solicitud para cancelar el turno
      const response = await axios.put(`http://localhost:3002/appointments/cancel/${appointmentId}`);

      if (response.status === 200) {
        // Actualiza el estado de los turnos cambiando el estado del turno a "Cancelled"
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment.id === appointmentId
              ? { ...appointment, status: "Cancelled" }
              : appointment
          )
        );

        setCancelSuccess('Turno cancelado exitosamente');
        setCancelError('');
        alert("Turno cancelado exitosamente");
      }
    } catch (error) {
      setCancelError('No se pudo cancelar el turno');
      setCancelSuccess('');
      console.log(error);
    }
  };

  return (
    <div className="appointments">
      <h1 className="appointments__title">Mis Turnos</h1>

      {loading ? (
        <div className="appointments__loading">Cargando...</div>
      ) : error ? (
        <div className="appointments__error">{error}</div> // Mostrar el error de carga
      ) : appointments.length ? (
        <div className="appointments__list">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`appointments__list-item appointments__list-item--${appointment.status.toLowerCase()}`}
            >
              <Appointments
                date={appointment.date}
                description={appointment.description}
                status={appointment.status}
                time={appointment.time}
              />
              {appointment.status !== 'Cancelled' && (
                <button 
                  onClick={() => handleCancelAppointment(appointment.id, appointment.date)} 
                  className="appointments__button cancel"
                >
                  Cancelar este Turno
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="appointments__no-appointments">No tienes turnos</div>
      )}

      {cancelError && <p className="appointments__error">{cancelError}</p>}
      {cancelSuccess && <p className="appointments__success">{cancelSuccess}</p>}
    </div>
  );
};

export default MyAppointments;
