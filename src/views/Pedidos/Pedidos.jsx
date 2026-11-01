import { useNavigate } from "react-router-dom";
import "./Pedidos.css";

const Pedidos = () => {
  const navigate = useNavigate();

  return (
    <div className="pedidos">
      <div className="pedidos__content">
        <h1 className="pedidos__title">Pedidos</h1>

        <p className="pedidos__message">
          Administra los pedidos y productos faltantes de tu negocio.
        </p>

        <div className="pedidos__buttons">
          <button
            type="button"
            className="pedidos__button"
            onClick={() => navigate("/agregar-pedido")}
          >
            Agregar pedido
          </button>

          <button
            type="button"
            className="pedidos__button pedidos__button--faltantes"
            onClick={() => navigate("/ver-faltantes")}
          >
            Ver faltantes
          </button>

          <button
            type="button"
            className="pedidos__button pedidos__button--volver"
            onClick={() => navigate("/MenuAppointment")}
          >
            Volver al menú
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;