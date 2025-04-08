
import { useState, useEffect } from 'react'; //import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la redirección
import logoConlara from "../../assets/media/images/imagen2.png"; // Importar la imagen de las canchas
import styles from './Home.module.css';
import ListadoProductos from '../Productos/ListadoProductos';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Verificar
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user); // Estable en localStorage
  }, []);

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      // Eliminar usuario del localStorage
      localStorage.removeItem('user');
      setIsLoggedIn(false);
    } else {
      // Redirigir al 
      navigate("/login");
    }
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}></h1>
      <img 
        src={logoConlara} 
        alt="Portal de Compras y Venta en el Valle del Conlara" 
        className={styles.canchas} 
      />
      <button 
        onClick={handleAuthButtonClick} 
        className={styles.authButton}
      >
        {isLoggedIn ? 'Logout' : 'Publicar un Producto'}
      </button>
      <ListadoProductos />
    </div>
    
  );
};

export default Home;
