import { CardReserva } from "./CardReserva";
import { CardCancelamento } from "./CardCancelamento";
import { CardAvaliacao } from "./CardAvaliacao";

export function GestorDeCards({ payload }) {
  // Se o n8n não enviar dados para gerar um cartão, o componente fica invisível
  if (!payload || !payload.tipo) {
    return null;
  }

  // O componente decide qual UI mostrar com base no 'tipo' recebido do n8n
  switch (payload.tipo) {
    case "reserva_confirmada":
      return <CardReserva reserva={payload.dados} />;

    case "reserva_cancelada":
      return <CardCancelamento reserva={payload.dados} />;

    case "avaliacao_registada":
      return <CardAvaliacao avaliacao={payload.dados} />;

    default:
      // Caso receba um tipo desconhecido, previne erros no ecrã
      console.warn("Tipo de cartão desconhecido:", payload.tipo);
      return null;
  }
}
