import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import DetallesProducto from './DetallesProducto'; // Importar el componente DetallesProducto
import App from './App.jsx'; // Componente principal

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/productos/:id" element={<DetallesProducto />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
