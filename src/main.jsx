import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import DetallesProducto from './views/Detalles/Detalles.jsx'; // Componente de detalles
import App from './App.jsx'; // Componente principal
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <HelmetProvider>
          <Routes>
            <Route path="*" element={<App />} />
            <Route path="/productos/:id" element={<DetallesProducto />} />
            <Route path="/productos/share/:id" element={<DetallesProducto />} />
          </Routes>
        </HelmetProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { UserProvider } from './context/UserContext.jsx';
// import DetallesProducto from './views/Detalles/Detalles.jsx'; // Ruta correcta al componente
// import App from './App.jsx'; // Componente principal
// import { HelmetProvider } from 'react-helmet-async';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <UserProvider>
//         <HelmetProvider>
//           <Routes>
//             <Route path="*" element={<App />} />
//             <Route path="/productos/:id" element={<DetallesProducto />} />
//           </Routes>
//         </HelmetProvider>
//       </UserProvider>
//     </BrowserRouter>
//   </StrictMode>
// );
