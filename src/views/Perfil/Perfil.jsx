import { useState, useEffect } from 'react';
import './Perfil.css'; // Archivo CSS para estilos
import { useUser } from '../../context/UserContext'; // Contexto para obtener el usuario logueado

const Perfil = () => {
  const { user, setUser } = useUser(); // Obtener y actualizar los datos del usuario en el contexto
  const [formData, setFormData] = useState({
    id: '',
    direccion: '',
    telefono: '',
    ciudad: '',
    provincia: '',
  });
  const [message, setMessage] = useState('');
  const [dataFetched, setDataFetched] = useState(false); // Bandera para evitar bucles

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de autenticación.');
        }

        const response = await fetch(`https://ecommerce-9558.onrender.com/users/email/${user.email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario.');
        }

        const userData = await response.json();

        // Actualiza los datos del formulario y el contexto
        setFormData({
          id: userData.id,
          direccion: userData.address || '',
          telefono: userData.phone || '',
          ciudad: userData.city || '',
          provincia: userData.country || '', // Cambié 'country' a 'provincia' si es necesario
        });
        setUser(userData); // Actualiza el contexto con los datos completos
        setDataFetched(true); // Marca como "datos cargados"
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error.message);
      }
    };

    if (user?.email && !dataFetched) {
      fetchUserData();
    }
  }, [user, dataFetched, setUser]); // Asegúrate de incluir solo dependencias necesarias

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Actualiza el estado correctamente
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de autenticación.');
      }

      const response = await fetch(`https://ecommerce-9558.onrender.com/users/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: formData.direccion,
          phone: formData.telefono,
          city: formData.ciudad,
          country: formData.provincia, // Ajustado si 'provincia' debe ser 'country' en el backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Intentar leer mensaje detallado
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      setMessage('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error.message);
      setMessage('Error al actualizar el perfil: ' + error.message);
    }
  };

  return (
    <div className="perfil">
      <h1 className="perfil__title">Modificar Perfil</h1>
      {message && <p className="perfil__message">{message}</p>}
      <form className="perfil__form" onSubmit={handleSubmit}>
        <div className="perfil__field">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange} // Ahora permite modificar
          />
        </div>
        <div className="perfil__field">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="perfil__field">
          <label htmlFor="ciudad">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange} // Ahora permite modificar
          />
        </div>
        <div className="perfil__field">
          <label htmlFor="provincia">Provincia</label>
          <input
            type="text"
            id="provincia"
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="perfil__button">Actualizar Perfil</button>
      </form>
    </div>
  );
};

export default Perfil;
