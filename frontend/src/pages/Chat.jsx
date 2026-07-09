// pages/Chat.jsx — Área de conversa com o agente de IA (integração n8n)

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, XCircle } from "lucide-react";
import { GestorDeCards } from "../components/cards/GestorDeCards";

// ─── Configuração do Webhook n8n ───────────────────────────────────────────────
const WEBHOOK_URL = "http://localhost:5678/webhook/chat";
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
          className={`px-4 py-3 rounded-2xl text-sm leading-snug break-words ${
            ehUtilizador
              ? "bg-indigo-600 text-white rounded-br-sm shadow-sm shadow-indigo-600/20 whitespace-pre-wrap"
              : msg.erro
                ? "bg-red-900/30 text-red-300 border border-red-500/20 rounded-bl-sm"
                : "bg-zinc-800 text-zinc-200 rounded-bl-sm"
          }`}
        >
          {ehUtilizador ? (
            msg.conteudo
          ) : (
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="mb-1.5 last:mb-0" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong
                    className="font-semibold text-indigo-300"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc pl-4 mb-1.5 last:mb-0 space-y-1.5"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal pl-4 mb-1.5 last:mb-0 space-y-1.5"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => <li className="pl-0" {...props} />,
              }}
            >
              {msg.conteudo ? String(msg.conteudo) : ""}
            </ReactMarkdown>
          )}
        </div>

        {/* Injeção dinâmica de Cards via Gestor */}
        {msg.cardPayload && <GestorDeCards payload={msg.cardPayload} />}

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
  const [mensagens, setMensagens] = useState(() => {
    const historicoGuardado = localStorage.getItem("reservaai_historico_chat");
    if (historicoGuardado) {
      return JSON.parse(historicoGuardado);
    }
    return MENSAGENS_INICIAIS;
  });
  const [input, setInput] = useState("");
  const [emEnvio, setEmEnvio] = useState(false);
  const [idsContexto, setIdsContexto] = useState([]);
  const [coordenadasUser, setCoordenadasUser] = useState({
    lat: null,
    lon: null,
  });
  const fimRef = useRef(null);
  const inputRef = useRef(null);

  // Solicita a localização do utilizador ao iniciar o componente
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          setCoordenadasUser({
            lat: posicao.coords.latitude,
            lon: posicao.coords.longitude,
          });
        },
        (erro) => {
          console.warn(
            "Localização não permitida ou indisponível:",
            erro.message,
          );
        },
      );
    }
  }, []);

  // Faz scroll automático para a última mensagem
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, emEnvio]);

  // Guarda o histórico no localStorage sempre que o array de mensagens sofre alterações
  useEffect(() => {
    localStorage.setItem("reservaai_historico_chat", JSON.stringify(mensagens));
  }, [mensagens]);

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

      const resposta = await fetch("http://localhost:5678/webhook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagem: texto,
          user_id: userId,
          lat: coordenadasUser.lat,
          lon: coordenadasUser.lon,
          ids_contexto: idsContexto,
          historico: mensagens.map((m) => ({
            papel: m.tipo === "utilizador" ? "user" : "assistant",
            conteudo: m.conteudo,
          })),
        }),
      });

      const dados = await resposta.json();
      // Atualiza a memória de sessão se o n8n enviar IDs de recomendações
      if (dados?.ids_recomendados && Array.isArray(dados.ids_recomendados)) {
        setIdsContexto(dados.ids_recomendados);
      }

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
        cardPayload: dados?.cardPayload || null,
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
