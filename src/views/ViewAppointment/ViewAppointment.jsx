import { useState } from 'react';
import './ViewAppointment.css';

const ViewAppointment = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [appointmentData, setAppointmentData] = useState(null);
  const [error, setError] = useState('');

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
    }
  };

  return (
    <div className="viewAppointment">
      <h1>Ver Turno</h1>
      <div className="viewAppointment__input">
        <label htmlFor="appointment-id">ID del Turno:</label>
        <input
          type="text"
          id="appointment-id"
          value={appointmentId}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleFetchAppointment} className="viewAppointment__button">
        Buscar Turno
      </button>

      {error && <p className="viewAppointment__error">{error}</p>}

      {appointmentData && (
        <div className="viewAppointment__details">
          <h2>Detalles del Turno</h2>
          <p><strong>ID:</strong> {appointmentData.id}</p>
          <p><strong>Fecha:</strong> {appointmentData.date}</p>
          <p><strong>Hora:</strong> {appointmentData.time}</p>
          <p><strong>Estado:</strong> {appointmentData.status}</p>
          <p><strong>Descripción:</strong> {appointmentData.description}</p>
        </div>
      )}
    </div>
  );
};

export default ViewAppointment;
