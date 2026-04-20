import { useEffect, useState } from 'react';
import './ListadoUsuarios.css';
import { useNavigate } from 'react-router-dom';

const ListadoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const fetchUsuarios = async (pageNumber = 1, append = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `https://ecommerce-9558.onrender.com/users?page=${pageNumber}&limit=50`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado. Inicia sesión nuevamente.');
        }
        throw new Error('Error al obtener los usuarios');
      }

      const data = await response.json();
      setUsuarios((prev) => (append ? [...prev, ...data] : data));
      setError('');
      setHasMore(data.length === 50);
    } catch (error) {
      setError(error.message);
      if (!append) setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios(page);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        if (hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchUsuarios(nextPage, true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, page]);

  const handleChangePassword = (id) => {
    setSelectedUser(id);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://ecommerce-9558.onrender.com/users/${selectedUser}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al cambiar la contraseña');
      }

      alert('Contraseña actualizada correctamente');
      setSelectedUser(null);
      setNewPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Seguro que deseas borrar este usuario?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://ecommerce-9558.onrender.com/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al borrar el usuario');
      }

      alert('Usuario borrado correctamente');
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsuarios(1, false);
  };

  return (
    <div className="listadoUsuarios">
      {/* Buscador */}
      <form className="listadoUsuarios__buscador" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      {error && <p className="listadoUsuarios__error">{error}</p>}

      <div className="listadoUsuarios__list">
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : usuarios.length === 0 && !error ? (
          <p>No se encontraron usuarios.</p>
        ) : (
          usuarios.map((usuario) => (
            <div key={usuario.id} className="listadoUsuarios__details">
              <img
                src={usuario.imgUrlUser}
                alt={`Foto de ${usuario.name}`}
                className="listadoUsuarios__img"
              />
              <h2>{usuario.name}</h2>
              <p>Nickname: {usuario.nickname}</p>
              <p>Email: {usuario.email}</p>
              <p>Teléfono: {usuario.phone}</p>
              <p>Ciudad: {usuario.city}, {usuario.country}</p>
              <p>Sharedcount: {usuario.sharedcount}</p>
              <button
                className="cambiarPasswordBoton"
                onClick={() => handleChangePassword(usuario.id)}
              >
                Cambiar contraseña
              </button>
              <button
                className="borrarUsuarioBoton"
                onClick={() => handleDeleteUser(usuario.id)}
              >
                Borrar usuario
              </button>
            </div>
          ))
        )}
      </div>

      {loading && <p>Cargando más usuarios...</p>}

      {/* Modal para cambiar contraseña */}
      {selectedUser && (
        <div className="modal">
          <h3>Cambiar contraseña</h3>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setSelectedUser(null)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListadoUsuarios;

// import { useEffect, useState } from 'react';
// import './ListadoUsuarios.css';
// import { useNavigate } from 'react-router-dom';

// const ListadoUsuarios = () => {
//   const [usuarios, setUsuarios] = useState([]);
//   const [error, setError] = useState('');
//   const [busqueda, setBusqueda] = useState('');
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newPassword, setNewPassword] = useState('');
//   const navigate = useNavigate();

//   const fetchUsuarios = async (pageNumber = 1, append = false) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const response = await fetch(
//         `https://ecommerce-9558.onrender.com/users?page=${pageNumber}&limit=50`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('No autorizado. Inicia sesión nuevamente.');
//         }
//         throw new Error('Error al obtener los usuarios');
//       }

//       const data = await response.json();
//       setUsuarios((prev) => (append ? [...prev, ...data] : data));
//       setError('');
//       setHasMore(data.length === 50);
//     } catch (error) {
//       setError(error.message);
//       if (!append) setUsuarios([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsuarios(page);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 200
//       ) {
//         if (hasMore && !loading) {
//           const nextPage = page + 1;
//           setPage(nextPage);
//           fetchUsuarios(nextPage, true);
//         }
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, loading, page]);

//   const handleChangePassword = (id) => {
//     setSelectedUser(id);
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         `https://ecommerce-9558.onrender.com/users/${selectedUser}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ password: newPassword }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Error al cambiar la contraseña');
//       }

//       alert('Contraseña actualizada correctamente');
//       setSelectedUser(null);
//       setNewPassword('');
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleDeleteUser = async (id) => {
//     if (!window.confirm('¿Seguro que deseas borrar este usuario?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         `https://ecommerce-9558.onrender.com/users/${id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Error al borrar el usuario');
//       }

//       alert('Usuario borrado correctamente');
//       setUsuarios((prev) => prev.filter((u) => u.id !== id));
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchUsuarios(1, false);
//   };

//   return (
//     <div className="listadoUsuarios">
//       {/* Buscador */}
//       <form className="listadoUsuarios__buscador" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Buscar usuarios..."
//           value={busqueda}
//           onChange={(e) => setBusqueda(e.target.value)}
//         />
//         <button type="submit">🔍</button>
//       </form>

//       {error && <p className="listadoUsuarios__error">{error}</p>}

//       <div className="listadoUsuarios__list">
//         {loading ? (
//           <p>Cargando usuarios...</p>
//         ) : usuarios.length === 0 && !error ? (
//           <p>No se encontraron usuarios.</p>
//         ) : (
//           usuarios.map((usuario) => (
//             <div key={usuario.id} className="listadoUsuarios__details">
//               <img
//                 src={usuario.imgUrlUser}
//                 alt={`Foto de ${usuario.name}`}
//                 className="listadoUsuarios__img"
//               />
//               <h2>{usuario.name}</h2>
//               <p>Nickname: {usuario.nickname}</p>
//               <p>Email: {usuario.email}</p>
//               <p>Teléfono: {usuario.phone}</p>
//               <p>Ciudad: {usuario.city}, {usuario.country}</p>
//               <button
//                 className="cambiarPasswordBoton"
//                 onClick={() => handleChangePassword(usuario.id)}
//               >
//                 Cambiar contraseña
//               </button>
//               <button
//                 className="borrarUsuarioBoton"
//                 onClick={() => handleDeleteUser(usuario.id)}
//               >
//                 Borrar usuario
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       {loading && <p>Cargando más usuarios...</p>}

//       {/* Modal para cambiar contraseña */}
//       {selectedUser && (
//         <div className="modal">
//           <h3>Cambiar contraseña</h3>
//           <form onSubmit={handlePasswordSubmit}>
//             <input
//               type="password"
//               placeholder="Nueva contraseña"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//             <button type="submit">Guardar</button>
//             <button type="button" onClick={() => setSelectedUser(null)}>
//               Cancelar
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListadoUsuarios;
