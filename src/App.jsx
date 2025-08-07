import "./App.css";
import Home from "./views/Home/Home";
import Login from "./views/Login/Login";
import MisProductos from "./views/MisProductos/MisProductos";
import Register from "./views/Register/Register";
import { Routes, Route, useLocation } from "react-router-dom"; // ⬅️ importá useLocation
import NavBar from "./components/NavBar/NavBar";
import CreateAppointment from "./views/CreateAppointment/CreateAppointment";
import MenuAppointment from "./views/MenuAppointment/MenuAppointment";
import ViewAppointment from "./views/ViewAppointment/ViewAppointment";
import CancelAppointment from "./views/CancelAppointment/CancelAppointment";
import ListadoProductos from "./views/Productos/ListadoProductos";
import ModifyProduct from "./views/ModifyProduct/ModifyProduct";
import DetallesProducto from "./views/Detalles/Detalles";
import Perfil from "./views/Perfil/Perfil";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import PerfilPublico from "./views/PerfilPublico/PerfilPublico";

function App() {
  const location = useLocation();

  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    console.log("Ruta actual:", location.pathname); // ⬅️ Log de ruta
  }, [location]);

  return (
    <HelmetProvider>
      <div style={{ marginTop: "115px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/MisProductos" element={<MisProductos />} />
          <Route path="/createAppointments" element={<CreateAppointment />} />
          <Route path="/MenuAppointment" element={<MenuAppointment />} />
          <Route path="/ViewAppointment" element={<ViewAppointment />} />
          <Route path="/CancelAppointment" element={<CancelAppointment />} />
          <Route path="/productos" element={<ListadoProductos />} />
          <Route path="/ModifyProduct/:id" element={<ModifyProduct />} />
          <Route path="/productos/:id" element={<DetallesProducto />} />
          <Route path="/productos/share/:id" element={<DetallesProducto />} />
          <Route path="/perfil" element={<Perfil />} />
          {/* <Route path="/:nickname" element={<PerfilPublico />} /> */}
          <Route path="/perfil/:nickname" element={<PerfilPublico />} />

        </Routes>
      <NavBar />
      </div>
    </HelmetProvider>
  );
}

export default App;


// import "./App.css";
// import Home from "./views/Home/Home";
// import Login from "./views/Login/Login";
// import MisProductos from "./views/MisProductos/MisProductos";
// import Register from "./views/Register/Register";
// import { Routes, Route } from "react-router-dom";
// import NavBar from "./components/NavBar/NavBar";
// import CreateAppointment from "./views/CreateAppointment/CreateAppointment";
// import MenuAppointment from "./views/MenuAppointment/MenuAppointment";
// import ViewAppointment from "./views/ViewAppointment/ViewAppointment";
// import CancelAppointment from "./views/CancelAppointment/CancelAppointment";
// import ListadoProductos from "./views/Productos/ListadoProductos";
// import ModifyProduct from "./views/ModifyProduct/ModifyProduct";
// import DetallesProducto from "./views/Detalles/Detalles"; // Importando el componente de detalles
// import Perfil from "./views/Perfil/Perfil"; // Importa el nuevo componente
// import { HelmetProvider } from "react-helmet-async"; // HelmetProvider para metadatos dinámicos
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     // Limpiar el localStorage cuando la aplicación se monte
//     localStorage.removeItem("user");
//   }, []);

//   return (
//     <HelmetProvider>
//       <NavBar />
//       <div style={{ marginTop: "60px" }}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/MisProductos" element={<MisProductos />} />
//           <Route path="/createAppointments" element={<CreateAppointment />} />
//           <Route path="/MenuAppointment" element={<MenuAppointment />} />
//           <Route path="/ViewAppointment" element={<ViewAppointment />} />
//           <Route path="/CancelAppointment" element={<CancelAppointment />} />
//           <Route path="/productos" element={<ListadoProductos />} />
//           <Route path="/ModifyProduct/:id" element={<ModifyProduct />} />
//           <Route path="/productos/:id" element={<DetallesProducto />} /> {/* Detalles producto */}
//           <Route path="/productos/share/:id" element={<DetallesProducto />} /> {/* Ruta para productos compartidos */}

//           <Route path="/perfil" element={<Perfil />} /> {/* Nueva ruta */}
//         </Routes>
//       </div>
//     </HelmetProvider>
//   );
// }

// export default App;

// import "./App.css";
// import Home from './views/Home/Home';
// import Login from "./views/Login/Login";
// import MisProductos from './views/MisProductos/MisProductos';
// import Register from "./views/Register/Register";
// import { Routes, Route } from "react-router-dom";
// import NavBar from "./components/NavBar/NavBar";
// import CreateAppointment from "./views/CreateAppointment/CreateAppointment";
// import MenuAppointment from "./views/MenuAppointment/MenuAppointment";
// import ViewAppointment from "./views/ViewAppointment/ViewAppointment";
// import CancelAppointment from "./views/CancelAppointment/CancelAppointment";
// import ListadoProductos from './views/Productos/ListadoProductos';
// import ModifyProduct from './views/ModifyProduct/ModifyProduct';
// import DetallesProducto from "./views/Detalles/Detalles"; // Importando el componente de detalles
// import Perfil from './views/Perfil/Perfil'; // Importa el nuevo componente
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     // Limpiar el localStorage cuando la aplicación se monte
//     localStorage.removeItem("user");
//   }, []); 
  
//   return (
//     <>
//       <NavBar />
      
//       <div style={{ marginTop: '60px' }}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/MisProductos" element={<MisProductos />} />
//           <Route path="/createAppointments" element={<CreateAppointment />} />
//           <Route path="/MenuAppointment" element={<MenuAppointment />} />
//           <Route path="/ViewAppointment" element={<ViewAppointment />} />
//           <Route path="/CancelAppointment" element={<CancelAppointment />} />
//           <Route path="/productos" element={<ListadoProductos />} />
//           <Route path="/ModifyProduct/:id" element={<ModifyProduct />} />
//           <Route path="/productos/:id" element={<DetallesProducto />} /> {/* Detalles producto */}
//           <Route path="/perfil" element={<Perfil />} /> {/* Nueva ruta */}
          
//         </Routes>
//       </div>
      
//     </>
//   );
// }

// export default App;

// import "./App.css";
// import Home from './views/Home/Home';
// import Login from "./views/Login/Login";
// import MisProductos from './views/MisProductos/MisProductos';
// import Register from "./views/Register/Register";
// import { Routes, Route } from "react-router-dom";
// import NavBar from "./components/NavBar/NavBar";
// import CreateAppointment from "./views/CreateAppointment/CreateAppointment";
// import MenuAppointment from "./views/MenuAppointment/MenuAppointment";
// import ViewAppointment from "./views/ViewAppointment/ViewAppointment";
// import CancelAppointment from "./views/CancelAppointment/CancelAppointment";
// import ListadoProductos from './views/Productos/ListadoProductos';
// import ModifyProduct from './views/ModifyProduct/ModifyProduct';
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     // Limpiar el localStorage cuando la aplicación se monte
//     localStorage.removeItem("user");
//   }, []); 
  
//   return (
//     <>
      
//       <NavBar />
      
//       <div style={{ marginTop: '60px' }}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/MisProductos" element={<MisProductos />} />
//           <Route path="/createAppointments" element={<CreateAppointment />} />
//           <Route path="/MenuAppointment" element={<MenuAppointment />} />
//           <Route path="/ViewAppointment" element={<ViewAppointment />} />
//           <Route path="/CancelAppointment" element={<CancelAppointment />} />
//           <Route path="/productos" element={<ListadoProductos />} />
//           <Route path="/ModifyProduct/:id" element={<ModifyProduct />} />

        
//         </Routes>
//       </div>
//       <ListadoProductos />
//     </>
//   );
// }

// export default App;
