import { Calendar, Users, MapPin, CheckCircle2 } from "lucide-react";

export function CardReserva({ reserva }) {
  return (
    <div className="mt-2 bg-zinc-800 border border-zinc-700/60 rounded-2xl overflow-hidden w-72 shadow-lg">
      <div className="px-4 pt-4 pb-3 border-b border-zinc-700/50">
        <p className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Reserva Confirmada
        </p>
        <p className="text-zinc-100 font-semibold">{reserva.local}</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <Calendar className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span>
            {reserva.data} · {reserva.hora}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <Users className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span>
            {reserva.pessoas} {reserva.pessoas === 1 ? "pessoa" : "pessoas"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span>{reserva.morada}</span>
        </div>
      </div>
    </div>
  );
}
