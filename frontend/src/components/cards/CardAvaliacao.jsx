import { Star, MessageSquare } from "lucide-react";

export function CardAvaliacao({ avaliacao }) {
  return (
    <div className="mt-2 bg-zinc-800 border border-amber-700/50 rounded-2xl overflow-hidden w-72 shadow-lg">
      <div className="px-4 pt-4 pb-3 border-b border-amber-700/40 bg-amber-950/10">
        <p className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-widest mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          Avaliação Registada
        </p>
        <p className="text-zinc-100 font-semibold">{avaliacao.local}</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Bloco da Nota */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-amber-400">
            {avaliacao.nota}
          </span>
          <span className="text-sm text-zinc-500 font-medium">/ 5</span>
        </div>

        {/* Comentário Opcional */}
        {avaliacao.comentario && (
          <div className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-700/30">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
            <span className="italic leading-relaxed">
              "{avaliacao.comentario}"
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
