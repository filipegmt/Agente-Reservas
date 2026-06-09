// pages/auth/Register.jsx — Página de criação de conta

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const FUNCIONALIDADES = [
  'Reservas automáticas via IA',
  'Histórico organizado e pesquisável',
  'Notificações em tempo real',
];

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [emCriacao, setEmCriacao] = useState(false);
  const [erro, setErro] = useState('');
  const navegar = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (password.length < 8) {
      setErro('A palavra-passe deve ter pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirmarPassword) {
      setErro('As palavras-passe não coincidem.');
      return;
    }

    setEmCriacao(true);
    await new Promise((r) => setTimeout(r, 900));
    localStorage.setItem('hotelai_auth', 'true');
    navegar('/chat');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">

      {/* ——— PAINEL ESQUERDO — Decorativo ——— */}
      <div className="hidden lg:flex lg:w-[48%] bg-zinc-900 relative overflow-hidden p-12 flex-col justify-between border-r border-zinc-800">

        {/* Efeitos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-violet-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-zinc-100 font-semibold text-lg tracking-tight">HotelAI</span>
          </div>
        </div>

        {/* Título + Lista de funcionalidades */}
        <div className="relative z-10">
          <h2 className="text-[2.2rem] font-light text-zinc-100 leading-tight mb-4 tracking-tight">
            Inteligência<br />que age por ti.
          </h2>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed mb-8">
            Um agente que encontra, compara e reserva os melhores restaurantes e hotéis — sem esforço da tua parte.
          </p>

          <div className="space-y-3">
            {FUNCIONALIDADES.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-zinc-400 text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Depoimento */}
          <div className="mt-10 bg-zinc-800/50 border border-zinc-700/40 rounded-2xl p-4">
            <p className="text-zinc-400 text-sm italic leading-relaxed">
              "Poupei horas de pesquisa. O agente encontrou o restaurante perfeito em segundos."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
                <span className="text-indigo-400 text-xs font-bold">M</span>
              </div>
              <span className="text-zinc-600 text-xs">Marta Silva, Lisboa</span>
            </div>
          </div>
        </div>
      </div>

      {/* ——— PAINEL DIREITO — Formulário ——— */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-[380px] my-auto">

          {/* Logo visível apenas em mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-zinc-100 font-semibold">HotelAI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[1.75rem] font-bold text-zinc-50 tracking-tight leading-tight">
              Criar conta
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">Junta-te ao HotelAI gratuitamente.</p>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Campo Nome */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="O teu nome"
                  required
                  className="w-full bg-zinc-800/80 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="o.teu@email.pt"
                  required
                  className="w-full bg-zinc-800/80 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            {/* Campo Palavra-passe */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Palavra-passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  className="w-full bg-zinc-800/80 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-xl pl-10 pr-12 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {mostrarPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Palavra-passe */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Confirmar palavra-passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Repete a palavra-passe"
                  required
                  className="w-full bg-zinc-800/80 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            {/* Termos */}
            <p className="text-xs text-zinc-600 pt-1">
              Ao criar conta, aceitas os{' '}
              <a href="#" className="text-indigo-400 hover:underline">Termos de Serviço</a>
              {' '}e a{' '}
              <a href="#" className="text-indigo-400 hover:underline">Política de Privacidade</a>.
            </p>

            {/* Botão de submissão */}
            <button
              type="submit"
              disabled={emCriacao}
              className="w-full flex items-center justify-center gap-2.5 py-3 bg-stone-200 hover:bg-stone-100 disabled:bg-zinc-800 disabled:cursor-not-allowed text-zinc-900 font-semibold rounded-xl transition-all text-sm shadow-sm"
            >
              {emCriacao ? (
                <>
                  <span className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                  <span className="text-zinc-400 font-normal">Em criação de conta…</span>
                </>
              ) : (
                <>
                  <span>Criar conta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link para login */}
          <p className="text-center text-sm text-zinc-600 mt-8">
            Já tens conta?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Iniciar sessão
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
