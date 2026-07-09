// pages/Reservas.jsx — Painel de marcações e histórico de reservas

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  MapPin,
  BookMarked,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
  Star,
} from "lucide-react";

// ─── Configuração dos estados ─────────────────────────────────────────────────
const ESTADOS = {
  confirmada: {
    rotulo: "Confirmada",
    classe: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icone: CheckCircle2,
  },
  concluída: {
    rotulo: "Concluída",
    classe: "bg-zinc-700/60 text-zinc-500 border-zinc-600/40",
    icone: CheckCircle2,
  },
  cancelada: {
    rotulo: "Cancelada",
    classe: "bg-red-500/10 text-red-400 border-red-500/20",
    icone: XCircle,
  },
  pendente: {
    rotulo: "Pendente",
    classe: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icone: AlertTriangle,
  },
};

// ─── Utilitários de data/hora (fuso de Portugal) ─────────────────────────────
// Devolve a data e hora atuais no fuso de Europe/Lisbon.
function obterAgoraLisboa() {
  const formatador = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const partes = formatador.formatToParts(new Date());
  const obter = (tipo) => partes.find((p) => p.type === tipo)?.value;

  let hora = obter("hour");
  if (hora === "24") hora = "00";

  return `${obter("year")}-${obter("month")}-${obter("day")}T${hora}:${obter("minute")}`;
}

// Indica se a combinação data+hora de uma reserva ainda está no futuro.
function reservaEhFutura(reserva) {
  if (!reserva.data || !reserva.hora) return false;
  const dataHoraReserva = `${reserva.data}T${reserva.hora}`;
  return dataHoraReserva >= obterAgoraLisboa();
}

// Converte "2026-07-09" em "9 de jul de 2026"
function formatarDataHumana(dataISO) {
  if (!dataISO || dataISO === "Data a definir") return dataISO;
  const [ano, mes, dia] = dataISO.split("-");
  if (!ano || !mes || !dia) return dataISO;

  const meses = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${ano}`;
}

// ─── Sub-componente: Badge de estado ─────────────────────────────────────────
function BadgeEstado({ estado }) {
  const cfg = ESTADOS[estado?.toLowerCase()] || ESTADOS.pendente;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.classe}`}
    >
      {cfg.rotulo}
    </span>
  );
}

// ─── Sub-componente: Modal de detalhe ────────────────────────────────────────
function ModalDetalhe({ reserva, aoFechar }) {
  if (!reserva) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={aoFechar}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-40 relative overflow-hidden">
          <img
            src={reserva.imagem}
            alt={reserva.restaurante}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <BadgeEstado estado={reserva.estado} />
            {reserva.avaliacao && (
              <span className="flex items-center gap-1 bg-zinc-900/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-zinc-700/50 text-amber-400 text-xs font-semibold">
                <Star className="w-3 h-3 fill-current" />
                {reserva.avaliacao}/5
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-zinc-100 font-semibold text-lg">
            {reserva.restaurante}
          </h2>
          <p className="text-zinc-500 text-xs mt-0.5">{reserva.tipo}</p>

          <div className="mt-4 space-y-2.5">
            {[
              { icone: Calendar, valor: formatarDataHumana(reserva.data) },
              { icone: Clock, valor: reserva.hora },
              { icone: Users, valor: `${reserva.pessoas} pessoas` },
              { icone: MapPin, valor: reserva.morada },
            ].map(
              ({ icone: Icone, valor }, index) =>
                valor &&
                valor !== "empty" && (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 text-xs text-zinc-400"
                  >
                    <Icone className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                    <span>{valor}</span>
                  </div>
                ),
            )}
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={aoFechar}
              className="flex-1 py-2.5 text-xs bg-stone-200 hover:bg-stone-100 text-zinc-900 font-semibold rounded-xl transition-colors"
            >
              Fechar
            </button>
            {reserva.estado === "confirmada" && (
              <button className="flex-1 py-2.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors">
                Cancelar reserva
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal: Reservas ──────────────────────────────────────────
export default function Reservas() {
  const [reservaDetalhe, setReservaDetalhe] = useState(null);

  const [proximasReservas, setProximasReservas] = useState([]);
  const [historicoReservas, setHistoricoReservas] = useState([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const buscarReservas = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        navegar("/login");
        return;
      }

      try {
        const resposta = await fetch(
          "http://localhost:5678/webhook/listar-reservas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }),
          },
        );

        const dados = await resposta.json();

        if (Array.isArray(dados)) {
          const dadosMapeados = dados.map((res) => {
            const ehFutura = reservaEhFutura({
              data: res.data,
              hora: res.hora,
            });

            // Interceta a reserva e converte para "concluída" se já tiver passado
            let estadoFinal = res.status || "pendente";
            if (estadoFinal === "confirmada" && !ehFutura) {
              estadoFinal = "concluída";
            }

            return {
              id: res.id,
              restaurante: res.nome_restaurante || "Restaurante Desconhecido",
              tipo: "Restaurante",
              data: res.data || "Data a definir",
              hora: res.hora || "Hora a definir",
              pessoas: res.num_pessoas || 0,
              estado: estadoFinal,
              morada: res.morada || "Morada não disponível",
              avaliacao: res.nota || null,
              imagem:
                res.imagem_url ||
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
            };
          });

          // Filtra consoante os novos estados
          setProximasReservas(
            dadosMapeados.filter((r) => r.estado === "confirmada"),
          );
          setHistoricoReservas(
            dadosMapeados.filter(
              (r) => r.estado === "cancelada" || r.estado === "concluída",
            ),
          );
        }
      } catch (err) {
        setErro("Erro ao carregar as tuas reservas. Verifica a ligação.");
      } finally {
        setACarregar(false);
      }
    };

    buscarReservas();
  }, [navegar]);

  return (
    <>
      <div className="h-full overflow-y-auto px-6 py-6">
        <div className="max-w-xl mx-auto">
          {/* ——— Cabeçalho ——— */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">
                Reservas
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Gere as tuas marcações e consulta o histórico.
              </p>
            </div>
            <button
              onClick={() => navegar("/chat")}
              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-stone-200 hover:bg-stone-100 text-zinc-900 font-semibold rounded-xl transition-colors shadow-sm flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Nova reserva
            </button>
          </div>

          {erro && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {erro}
            </div>
          )}

          {aCarregar ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-zinc-500 animate-spin mb-4" />
              <p className="text-zinc-500 text-sm">A carregar marcações...</p>
            </div>
          ) : (
            <>
              {/* ——— Próximas Reservas ——— */}
              <section className="mb-8">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                  Próximas Reservas
                </h2>

                {proximasReservas.length === 0 ? (
                  <div className="bg-zinc-800/40 rounded-2xl p-10 text-center border border-zinc-700/30 border-dashed">
                    <BookMarked className="w-9 h-9 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">
                      Não tens reservas futuras.
                    </p>
                    <p className="text-zinc-600 text-xs mt-1">
                      Usa o chat para pedir ao agente uma reserva.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proximasReservas.map((reserva) => (
                      <div
                        key={reserva.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-200 group"
                      >
                        <div className="h-44 relative overflow-hidden">
                          <img
                            src={reserva.imagem}
                            alt={reserva.restaurante}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                          <div className="absolute bottom-3 left-4">
                            <BadgeEstado estado={reserva.estado} />
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-zinc-100 font-semibold leading-tight">
                                {reserva.restaurante}
                              </h3>
                              <p className="text-zinc-500 text-xs mt-0.5">
                                {reserva.tipo}
                              </p>
                            </div>
                            <button
                              onClick={() => setReservaDetalhe(reserva)}
                              className="text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0 mt-0.5"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
                            <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatarDataHumana(reserva.data)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{reserva.hora}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                              <Users className="w-3.5 h-3.5" />
                              <span>{reserva.pessoas} pessoas</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => setReservaDetalhe(reserva)}
                              className="flex-1 text-xs py-2.5 bg-stone-200 hover:bg-stone-100 text-zinc-900 font-semibold rounded-xl transition-colors"
                            >
                              Ver detalhes
                            </button>
                            <button className="flex-1 text-xs py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl transition-colors border border-zinc-700/50">
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ——— Histórico de Reservas ——— */}
              {historicoReservas.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                    Histórico de Reservas
                  </h2>

                  <div className="grid grid-cols-3 gap-3">
                    {historicoReservas.map((reserva) => (
                      <button
                        key={reserva.id}
                        onClick={() => setReservaDetalhe(reserva)}
                        className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-200 group text-left flex flex-col"
                      >
                        <div className="h-20 overflow-hidden relative flex-shrink-0">
                          <img
                            src={reserva.imagem}
                            alt={reserva.restaurante}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-zinc-900/20" />
                        </div>

                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-zinc-300 text-xs font-medium truncate leading-tight">
                              {reserva.restaurante}
                            </p>
                            <p className="text-zinc-500 text-[11px] mt-0.5">
                              {formatarDataHumana(reserva.data)}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <BadgeEstado estado={reserva.estado} />
                            {reserva.avaliacao &&
                              reserva.estado === "concluída" && (
                                <div className="flex items-center gap-0.5 text-amber-400">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="text-[10px] font-bold">
                                    {reserva.avaliacao}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <ModalDetalhe
        reserva={reservaDetalhe}
        aoFechar={() => setReservaDetalhe(null)}
      />
    </>
  );
}
