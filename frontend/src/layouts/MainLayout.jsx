// layouts/MainLayout.jsx — Esqueleto das páginas internas
// Contém a Sidebar fixa à esquerda e o <Outlet /> para injetar as páginas

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { MessageSquare, BookMarked, Settings, LogOut, Sparkles } from 'lucide-react';

// Definição dos itens de navegação principais
const LIGACOES_NAV = [
  { para: '/chat',       rotulo: 'Conversa',   icone: MessageSquare },
  { para: '/reservas',   rotulo: 'Reservas',   icone: BookMarked },
  { para: '/definicoes', rotulo: 'Definições', icone: Settings },
];

export default function MainLayout() {
  const navegar = useNavigate();

  const terminarSessao = () => {
    localStorage.removeItem('hotelai_auth');
    navegar('/login');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">

      {/* ======================== SIDEBAR ======================== */}
      <aside className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0">

        {/* Logo / Marca */}
        <div className="px-4 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-zinc-100 font-semibold text-sm leading-none tracking-tight">HotelAI</p>
              <p className="text-zinc-500 text-xs mt-0.5">Agente de reservas</p>
            </div>
          </div>
        </div>

        {/* Rótulo da secção */}
        <div className="px-5 pt-5 pb-1">
          <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest">Menu</p>
        </div>

        {/* Navegação principal */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {LIGACOES_NAV.map(({ para, rotulo, icone: Icone }) => (
            <NavLink
              key={para}
              to={para}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icone
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'
                    }`}
                  />
                  <span className="flex-1">{rotulo}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Perfil do utilizador + Terminar sessão */}
        <div className="px-3 pb-4 border-t border-zinc-800 pt-3">
          {/* Card do utilizador */}
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-indigo-400">F</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate leading-none">Filipe</p>
              <p className="text-xs text-zinc-600 truncate mt-0.5">Plano gratuito</p>
            </div>
          </div>

          {/* Botão de saída */}
          <button
            onClick={terminarSessao}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Terminar sessão</span>
          </button>
        </div>
      </aside>

      {/* ======================== ÁREA PRINCIPAL ======================== */}
      {/* O <Outlet /> injeta a página da rota activa (Chat, Reservas, Definições) */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
        <Outlet />
      </main>
    </div>
  );
}
