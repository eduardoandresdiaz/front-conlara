import { useEffect, useState } from 'react';
import { useUser } from "../../context/UserContext";
import './Carrusell.css';

const Carrusell = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useUser();

  // 🔹 Función para barajar productos (Fisher-Yates)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchProductos = async () => {
    try {
      if (!user || !user.email) {
        throw new Error("No se encontró el email del usuario.");
      }

      const response = await fetch(
        `https://ecommerce-9558.onrender.com/products/by-creator?creatorEmail=${user.email}`
      );
      if (!response.ok) {
        throw new Error('Error al obtener los productos del usuario');
      }
      const data = await response.json();

      // 🔹 Barajar productos al recibirlos
      setProductos(shuffleArray(data));
      setError('');
    } catch (error) {
      setError(error.message);
      setProductos([]);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          // 🔹 Avanzar secuencialmente
          if (prevIndex + 1 < productos.length) {
            return prevIndex + 1;
          } else {
            // Reiniciar al llegar al final (opcional)
            return 0;
          }
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [productos]);

  const productoActual = productos[currentIndex];

  const formatPrice = (price) => {
    const validPrice = isNaN(price) ? 0 : parseFloat(price);
    return validPrice === 1 ? "Consultar" : `$${validPrice.toFixed(2)}`;
  };

  return (
    <div className="carrusell">
      <h1 className="carrusell__nickname">
        {user?.nickname ? user.name : "Nuestros Productos"}
      </h1>

      {error && <p className="carrusell__error">{error}</p>}

      {!error && productos.length === 0 && <p>Cargando productos...</p>}

      {productoActual && (
        <div key={productoActual.id} className="carrusell__details">
          <h2 className="carrusell__name">{productoActual.name}</h2>
          <p className="carrusell__precio">
            <strong>Precio:</strong> {formatPrice(productoActual.price)}
          </p>
          <img
            src={productoActual.imgUrl}
            alt={`Imagen de ${productoActual.name}`}
            className="carrusell__imagen"
          />
        </div>
      )}
    </div>
  );
};

export default Carrusell;
