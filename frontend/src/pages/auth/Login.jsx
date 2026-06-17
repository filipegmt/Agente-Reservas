// pages/auth/Login.jsx — Página de início de sessão

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [emAutenticacao, setEmAutenticacao] = useState(false);
  const [erro, setErro] = useState("");
  const navegar = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setEmAutenticacao(true);

    try {
      const resposta = await fetch("http://localhost:5678/webhook/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const dados = await resposta.json();

      if (dados.sucesso) {
        // O login funcionou! Guardamos a chave de acesso e os dados do SQLite no navegador
        localStorage.setItem("reservaai_auth", "true");
        localStorage.setItem("user_id", dados.utilizador.id);
        localStorage.setItem("user_nome", dados.utilizador.nome);
        localStorage.setItem("user_email", dados.utilizador.email);

        // Passadeira vermelha para a página do Chat
        window.location.href = "/chat";
      } else {
        // A base de dados recusou. Mostramos o erro e paramos a animação do botão
        setErro(dados.mensagem);
        setEmAutenticacao(false);
      }
    } catch (err) {
      // Dispara se o React não conseguir encontrar o n8n ativo no Docker
      setErro("Erro de ligação ao servidor central. Verifica a tua ligação.");
      setEmAutenticacao(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* ——— PAINEL ESQUERDO — Decorativo ——— */}
      <div className="hidden lg:flex lg:w-[48%] bg-zinc-900 relative overflow-hidden p-12 flex-col justify-between border-r border-zinc-800">
        {/* Efeitos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, zinc-400 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <span className="text-zinc-100 font-semibold text-lg tracking-tight">
              ReservaAI
            </span>
          </div>
        </div>

        {/* Citação + Estatísticas */}
        <div className="relative z-10">
          <blockquote className="text-[2.1rem] font-light text-zinc-100 leading-snug mb-3 tracking-tight">
            "Precisão é<br />
            transformar intenção
            <br />
            em ação."
          </blockquote>
          <p className="text-zinc-600 text-sm">— Filosofia do ReservaAI</p>

          {/* Cartões de estatísticas */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              { rotulo: "Reservas concluídas", valor: "1.2k+" },
              { rotulo: "Restaurantes parceiros", valor: "340+" },
            ].map(({ rotulo, valor }) => (
              <div
                key={rotulo}
                className="bg-zinc-800/50 backdrop-blur border border-zinc-700/40 rounded-2xl p-4"
              >
                <p className="text-zinc-500 text-xs">{rotulo}</p>
                <p className="text-zinc-100 text-2xl font-bold mt-1 tracking-tight">
                  {valor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ——— PAINEL DIREITO — Formulário ——— */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[380px]">
          {/* Logo visível apenas em mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-zinc-100 font-semibold">ReservaAI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[1.75rem] font-bold text-zinc-50 tracking-tight leading-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Inicia sessão para continuar.
            </p>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Lembrar-me + Esqueceu? */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-zinc-600 bg-zinc-800 accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  Lembrar-me
                </span>
              </label>
              <a
                href="#"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Esqueceste a palavra-passe?
              </a>
            </div>

            {/* Botão de submissão */}
            <button
              type="submit"
              disabled={emAutenticacao}
              className="w-full flex items-center justify-center gap-2.5 py-3 mt-2 bg-stone-200 hover:bg-stone-100 disabled:bg-zinc-800 disabled:cursor-not-allowed text-zinc-900 font-semibold rounded-xl transition-all text-sm shadow-sm"
            >
              {emAutenticacao ? (
                <>
                  <span className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                  <span className="text-zinc-400 font-normal">
                    Em autenticação…
                  </span>
                </>
              ) : (
                <>
                  <span>Iniciar sessão</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link para registo */}
          <p className="text-center text-sm text-zinc-600 mt-8">
            Ainda não tens conta?{" "}
            <Link
              to="/registo"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
