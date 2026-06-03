import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { App } from './pages/App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CustomerProvider } from './context/CustomerContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomerProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </CustomerProvider>
  </React.StrictMode>
);

