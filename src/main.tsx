import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CartProvider } from './features/cart/context/CartContext';
import { I18nProvider } from './i18n/i18nContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </I18nProvider>
  </StrictMode>,
);
