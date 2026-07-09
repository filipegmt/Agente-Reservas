import { XCircle, Calendar, MapPin, Users } from "lucide-react";

export function CardCancelamento({ reserva }) {
  return (
    <div className="mt-2 bg-zinc-800 border border-red-900/60 rounded-2xl overflow-hidden w-72 shadow-lg opacity-90">
      <div className="px-4 pt-4 pb-3 border-b border-red-900/40 bg-red-950/20">
        <p className="flex items-center gap-1.5 text-xs text-red-400 font-semibold uppercase tracking-widest mb-1">
          <XCircle className="w-3.5 h-3.5" />
          Reserva Cancelada
        </p>
        <p className="text-zinc-300 font-semibold line-through">
          {reserva.local}
        </p>
      </div>

      <div className="px-4 py-4 space-y-3 opacity-75">
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
      </div>
    </div>
  );
}
