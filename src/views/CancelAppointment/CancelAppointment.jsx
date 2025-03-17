
import { useState } from 'react'; 
import './CancelAppointment.css';

const CancelAppointment = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [appointmentData, setAppointmentData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setAppointmentId(e.target.value);
  };

  const handleFetchAppointment = async () => {
    try {
      const response = await fetch(`http://localhost:3002/appointments/${appointmentId}`);
      if (!response.ok) {
        throw new Error('Turno no encontrado');
      }
      const data = await response.json();
      setAppointmentData(data);
      setError('');
    } catch (error) {
      setError(error.message);
      setAppointmentData(null);
      setSuccessMessage('');
    }
  };

  const handleCancelAppointment = async () => {
    if (appointmentData) {
      const appointmentDate = new Date(appointmentData.date);
      const today = new Date();

      // Validación: solo permite cancelar un turno un día antes
      const oneDayBefore = new Date(appointmentDate);
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);

      if (today > oneDayBefore) {
        setError('Solo puedes cancelar un turno al menos un día antes.');
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:3002/appointments/cancel/${appointmentId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('No se pudo cancelar el turno');
      }
      const data = await response.json();
      setAppointmentData(data);
      setSuccessMessage('Turno cancelado exitosamente');
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="cancelAppointment">
      <h1>Cancelar Turno</h1>
      <div className="cancelAppointment__input">
        <label htmlFor="appointment-id">ID del Turno:</label>
        <input
          type="text"
          id="appointment-id"
          value={appointmentId}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleFetchAppointment} className="cancelAppointment__button">
        Buscar Turno
      </button>

      {error && <p className="cancelAppointment__error">{error}</p>}

      {appointmentData && (
        <div className="cancelAppointment__details">
          <h2>Detalles del Turno</h2>
          <p><strong>ID:</strong> {appointmentData.id}</p>
          <p><strong>Fecha:</strong> {appointmentData.date}</p>
          <p><strong>Hora:</strong> {appointmentData.time}</p>
          <p><strong>Estado:</strong> {appointmentData.status}</p>
          <p><strong>Descripción:</strong> {appointmentData.description}</p>
          <button onClick={handleCancelAppointment} className="cancelAppointment__button cancel">
            Cancelar Turno
          </button>
        </div>
      )}

      {successMessage && <p className="cancelAppointment__success">{successMessage}</p>}
    </div>
  );
};

export default CancelAppointment;
