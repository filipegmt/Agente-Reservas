// App.jsx — Orquestrador central da aplicação HotelAI
// Dependências: react-router-dom (instalar com: npm install react-router-dom)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Chat from './pages/Chat';
import Reservas from './pages/Reservas';
import Definicoes from './pages/Definicoes';

// --- Guardas de rota ---

function RotaPrivada({ children }) {
  const autenticado = localStorage.getItem('hotelai_auth') === 'true';
  return autenticado ? children : <Navigate to="/login" replace />;
}

function RotaPublica({ children }) {
  const autenticado = localStorage.getItem('hotelai_auth') === 'true';
  return !autenticado ? children : <Navigate to="/chat" replace />;
}

// --- Componente raiz ---

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona a raiz para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas públicas — apenas acessíveis sem sessão */}
        <Route
          path="/login"
          element={<RotaPublica><Login /></RotaPublica>}
        />
        <Route
          path="/registo"
          element={<RotaPublica><Register /></RotaPublica>}
        />

        {/* Rotas privadas — envolvidas no MainLayout com Sidebar */}
        <Route
          path="/"
          element={<RotaPrivada><MainLayout /></RotaPrivada>}
        >
          <Route path="chat"       element={<Chat />} />
          <Route path="reservas"   element={<Reservas />} />
          <Route path="definicoes" element={<Definicoes />} />
        </Route>

        {/* Fallback para qualquer rota inexistente */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
