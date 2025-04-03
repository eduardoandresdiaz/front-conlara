import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';
import DetallesProducto from './DetallesProducto';

// Componente original con los logotipos y contador
const Home = () => {
  return (
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="/javascript.svg" className="logo vanilla" alt="JavaScript logo" />
      </a>
      <h1>Hello Vite!</h1>
      <div className="card">
        <button id="counter" type="button" onClick={() => setupCounter(document.querySelector('#counter'))}>
          Contador
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite logo to learn more
      </p>
    </div>
  );
};

// Función para configurar el contador (mantenida desde tu código original)
const setupCounter = (element) => {
  let count = 0;
  element.textContent = `Count: ${count}`;
  element.addEventListener('click', () => {
    count++;
    element.textContent = `Count: ${count}`;
  });
};

// Renderización principal
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos/:id" element={<DetallesProducto />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('app')
);


// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
