// Validación para el registro
export const validateRegister = (values) => {
  const errors = {};

  // Validación de email
  if (!values.email) {
    errors.email = 'El email es obligatorio.';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = 'El formato del email no es válido.';
  }

  // Validación de contraseña
  if (!values.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (values.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  // Validación de nombre
  if (!values.name) {
    errors.name = 'El nombre es obligatorio.';
  } else if (values.name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }

  // Validación de fecha de nacimiento
  if (!values.birthdate) {
    errors.birthdate = 'La fecha de nacimiento es obligatoria.';
  } else {
    const birthdate = new Date(values.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    if (age < 18) {
      errors.birthdate = 'Debes tener al menos 18 años.';
    }
  }

  // Validación de DNI
  if (!values.nDni) {
    errors.nDni = 'El DNI es obligatorio.';
  } else if (!/^\d+$/.test(values.nDni)) {
    errors.nDni = 'El DNI debe contener solo números.';
  } else if (values.nDni.length < 7 || values.nDni.length > 8) {
    errors.nDni = 'El DNI debe tener entre 7 y 8 dígitos.';
  }

  // Validación de nombre de usuario
  if (!values.username) {
    errors.username = 'El nombre de usuario es obligatorio.';
  } else if (values.username.length < 4) {
    errors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
  }

  return errors;
};

// Validación para el login
export const validateLogin = (values) => {
  const errors = {};

  // Validación de email
  if (!values.email) {
    errors.email = 'El email es obligatorio.';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = 'El formato del email no es válido.';
  }

  // Validación de contraseña
  if (!values.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (values.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
};

// Validación para la cita (appointment)
export const validateAppointment = (values) => {
  const errors = {};

  // Validación de fecha
  if (!values.date) {
    errors.date = 'La fecha es obligatoria.';
  } else {
    const appointmentDate = new Date(values.date);
    const today = new Date();
    if (appointmentDate < today) {
      errors.date = 'El turno debe sacarse al menos un día antes.';
    }

    const dayOfWeek = appointmentDate.getDay(); // 0: Domingo, 6: Sábado
    if (dayOfWeek === 6 || dayOfWeek === 0) { // Bloquear sábados y domingos
      errors.date = 'No se pueden sacar turnos los sábados ni domingos.';
    }
  }

  // Validación de hora
  if (!values.time) {
    errors.time = 'La hora es obligatoria.';
  } else if (!/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(values.time)) {
    errors.time = 'La hora debe tener el formato HH:MM.';
  }

  // Validación de estado
  if (!values.status) {
    errors.status = 'El estado es obligatorio.';
  } else if (!['Active', 'Cancelled', 'Completed'].includes(values.status)) {
    errors.status = 'El estado debe ser "Active", "Cancelled" o "Completed".';
  }

  // Validación de descripción
  if (!values.description) {
    errors.description = 'La descripción es obligatoria.';
  } else if (values.description.length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres.';
  }

  // Validación para cancelación de turnos
  if (values.cancel) {
    const appointmentDate = new Date(values.date);

    // Comparar solo la fecha (sin hora)
    const appointmentDay = new Date(appointmentDate.setHours(0, 0, 0, 0));
    const currentDay = new Date(new Date().setHours(0, 0, 0, 0));

    if (appointmentDay <= currentDay) {
      errors.cancel = 'Solo se pueden cancelar turnos hasta el día anterior.';
      alert('Solo se pueden cancelar turnos hasta el día anterior.');
    }
  }

  return errors;
};
