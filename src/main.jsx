import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import DetallesProducto from './views/Detalles/Detalles.jsx'; // Ajuste de la ruta correcta
import App from './App.jsx'; // Componente principal

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="*" element={<App />} /> {/* Ajustado para incluir el comodín '*' */}
          <Route path="/productos/:id" element={<DetallesProducto />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
