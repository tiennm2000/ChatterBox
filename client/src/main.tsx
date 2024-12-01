import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { SocketProvider } from './context/SocketContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <App />
      <Toaster closeButton />
    </SocketProvider>
  </StrictMode>
);
