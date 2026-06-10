// pages/Chat.jsx — Área de conversa com o agente de IA (integração n8n)
// IMPORTANTE: substitui WEBHOOK_URL pelo URL real do teu fluxo n8n

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ─── Configuração do Webhook n8n ───────────────────────────────────────────────
const WEBHOOK_URL = "http://localhost:5678/webhook-test/chat";
// ──────────────────────────────────────────────────────────────────────────────

const nomeUtilizador = localStorage.getItem("user_nome") || "Utilizador";

// Mensagens de boas-vindas presentes ao carregar o chat
const MENSAGENS_INICIAIS = [
  {
    id: "bv-1",
    tipo: "assistente",
    conteudo: `Olá, ${nomeUtilizador}! Estou pronto para te ajudar a encontrar e reservar o restaurante perfeito. O que pretendes hoje?`,
    hora: new Date().toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

// ─── Sub-componente: Balão de Mensagem ────────────────────────────────────────
function BalaoMensagem({ msg }) {
  const ehUtilizador = msg.tipo === "utilizador";

  return (
    <div
      className={`flex ${ehUtilizador ? "justify-end" : "justify-start"} items-end gap-2`}
    >
      {/* Avatar do assistente */}
      {!ehUtilizador && (
        <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mb-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
        </div>
      )}

      <div
        className={`max-w-[75%] ${ehUtilizador ? "items-end" : "items-start"} flex flex-col`}
      >
        {/* Bolha de texto */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            ehUtilizador
              ? "bg-indigo-600 text-white rounded-br-sm shadow-sm shadow-indigo-600/20"
              : msg.erro
                ? "bg-red-900/30 text-red-300 border border-red-500/20 rounded-bl-sm"
                : "bg-zinc-800 text-zinc-200 rounded-bl-sm"
          }`}
        >
          {msg.conteudo}
        </div>

        {/* Card de Confirmação de Reserva */}
        {msg.reserva && <CardReserva reserva={msg.reserva} />}

        {/* Hora */}
        <p
          className={`text-xs text-zinc-600 mt-1 ${ehUtilizador ? "text-right" : "text-left"}`}
        >
          {msg.hora}
        </p>
      </div>
    </div>
  );
}

// ─── Sub-componente: Card de Confirmação de Reserva ──────────────────────────
function CardReserva({ reserva }) {
  const [confirmado, setConfirmado] = useState(false);
  const [cancelado, setCancelado] = useState(false);

  if (cancelado) {
    return (
      <div className="mt-2 bg-zinc-800/60 border border-zinc-700 rounded-2xl p-4 w-72 text-xs text-zinc-500 text-center">
        Reserva cancelada.
      </div>
    );
  }

  return (
    <div className="mt-2 bg-zinc-800 border border-zinc-700/60 rounded-2xl overflow-hidden w-72 shadow-lg">
      {/* Cabeçalho do card */}
      <div className="px-4 pt-4 pb-3 border-b border-zinc-700/50">
        <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-1">
          Confirmação de Reserva
        </p>
        <p className="text-zinc-100 font-semibold">{reserva.local}</p>
      </div>

      {/* Detalhes */}
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <Calendar className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          <span>
            {reserva.data} · {reserva.hora}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <Users className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          <span>
            {reserva.pessoas} {reserva.pessoas === 1 ? "pessoa" : "pessoas"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          <span>{reserva.morada}</span>
        </div>
      </div>

      {/* Botões de ação */}
      {!confirmado ? (
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setConfirmado(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-stone-200 hover:bg-stone-100 text-zinc-900 font-semibold rounded-xl text-xs transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmar
          </button>
          <button
            onClick={() => setCancelado(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-xl text-xs transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancelar
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center gap-2 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-medium">
              Reserva confirmada!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Indicador de escrita ─────────────────────────────────────────────────────
function IndicadorEscrita() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-3 h-3 text-indigo-400" />
      </div>
      <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal: Chat ───────────────────────────────────────────────
export default function Chat() {
  const [mensagens, setMensagens] = useState(MENSAGENS_INICIAIS);
  const [input, setInput] = useState("");
  const [emEnvio, setEmEnvio] = useState(false);
  const fimRef = useRef(null);
  const inputRef = useRef(null);

  // Faz scroll automático para a última mensagem
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, emEnvio]);

  const enviarMensagem = async () => {
    const texto = input.trim();
    if (!texto || emEnvio) return;

    const hora = new Date().toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Adiciona a mensagem do utilizador
    const msgUtilizador = {
      id: Date.now(),
      tipo: "utilizador",
      conteudo: texto,
      hora,
    };
    setMensagens((prev) => [...prev, msgUtilizador]);
    setInput("");
    setEmEnvio(true);

    try {
      const userId = localStorage.getItem("user_id");

      const resposta = await fetch("http://localhost:5678/webhook-test/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagem: texto,
          user_id: userId,
          historico: mensagens.map((m) => ({
            papel: m.tipo === "utilizador" ? "user" : "assistant",
            conteudo: m.conteudo,
          })),
        }),
      });

      const dados = await resposta.json();

      // O n8n pode devolver a resposta nos campos: output, resposta, message, text
      const textoResposta =
        dados?.output ||
        dados?.resposta ||
        dados?.message ||
        dados?.text ||
        "Resposta recebida, mas sem conteúdo interpretável.";

      const msgAssistente = {
        id: Date.now() + 1,
        tipo: "assistente",
        conteudo: textoResposta,
        hora: new Date().toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        // Se o n8n devolver um objecto de reserva, inclui-o no card
        reserva: dados?.reserva || null,
      };

      setMensagens((prev) => [...prev, msgAssistente]);
    } catch (erro) {
      console.error("[ReservaAI] Erro ao contactar webhook:", erro);
      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          tipo: "assistente",
          conteudo:
            "Não foi possível contactar o servidor. Verifica a ligação e tenta novamente.",
          hora: new Date().toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          erro: true,
        },
      ]);
    } finally {
      setEmEnvio(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ——— Cabeçalho ——— */}
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3 flex-shrink-0 bg-zinc-950/80 backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
        <div>
          <h1 className="text-sm font-semibold text-zinc-100 leading-none">
            Agente ReservaAI
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Reservas inteligentes · n8n
          </p>
        </div>
      </div>

      {/* ——— Área de mensagens ——— */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {mensagens.map((msg) => (
          <BalaoMensagem key={msg.id} msg={msg} />
        ))}

        {/* Indicador de processamento */}
        {emEnvio && <IndicadorEscrita />}

        {/* Âncora de scroll */}
        <div ref={fimRef} />
      </div>

      {/* ——— Barra de input fixa ——— */}
      <div className="px-6 py-4 border-t border-zinc-800 flex-shrink-0 bg-zinc-950">
        <div className="flex items-end gap-3 bg-zinc-800/80 border border-zinc-700/50 rounded-2xl px-4 py-3 focus-within:border-zinc-600 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreve a tua mensagem… (↵ para enviar)"
            rows={1}
            disabled={emEnvio}
            className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 text-sm resize-none outline-none max-h-36 leading-relaxed disabled:opacity-50"
            style={{ fieldSizing: "content" }}
          />
          <button
            onClick={enviarMensagem}
            disabled={!input.trim() || emEnvio}
            className="flex-shrink-0 w-8 h-8 bg-stone-200 hover:bg-stone-100 disabled:bg-zinc-700/70 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all shadow-sm"
            aria-label="Enviar mensagem"
          >
            <Send className="w-3.5 h-3.5 text-zinc-900 disabled:text-zinc-500" />
          </button>
        </div>
        <p className="text-xs text-zinc-700 mt-2 text-center">
          O agente pode cometer erros. Verifica sempre informações importantes.
        </p>
      </div>
    </div>
  );
}
