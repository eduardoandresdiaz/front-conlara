import "./App.css";
import Home from './views/Home/Home';
import Login from "./views/Login/Login";
import MyAppointments from './views/MyAppointments/MyAppointments';
import Register from "./views/Register/Register";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import CreateAppointment from "./views/CreateAppointment/CreateAppointment";
import MenuAppointment from "./views/MenuAppointment/MenuAppointment";
import ViewAppointment from "./views/ViewAppointment/ViewAppointment";
import CancelAppointment from "./views/CancelAppointment/CancelAppointment";
import ListadoProductos from './views/Productos/ListadoProductos';
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Limpiar el localStorage cuando la aplicación se monte
    localStorage.removeItem("user");
  }, []); 
  
  return (
    <>
      
      <NavBar />
      
      <div style={{ marginTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/createAppointments" element={<CreateAppointment />} />
          <Route path="/MenuAppointment" element={<MenuAppointment />} />
          <Route path="/ViewAppointment" element={<ViewAppointment />} />
          <Route path="/CancelAppointment" element={<CancelAppointment />} />
          <Route path="/productos" element={<ListadoProductos />} />
        
        </Routes>
      </div>
      <ListadoProductos />
    </>
  );
}

export default App;
