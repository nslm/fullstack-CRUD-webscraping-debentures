export const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000';

export const AUTOMATIONS = [
  { id: "caracteristicas", label: "Características das Debêntures" },
  { id: "balcao", label: "Dados de Negociação de Balcão" },
];

export const LOG_COLUMNS: Record<string, { field: string; label: string }[]> = {
  balcao: [
    { field: "data_exec", label: "Horário Execução" },
    { field: "data_inicio", label: "Data Inicial" },
    { field: "data_fim", label: "Data Final" },
    { field: "status_final", label: "Status" },
  ],
  caracteristicas: [
    { field: "data_exec", label: "Horário Execução" },
    { field: "duracao", label: "Duração" },
    { field: "volume", label: "Volume" },
    { field: "status_final", label: "Status" },
  ],
};
export const formattedDate = (dateStr: string): string => {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return dateStr; // caso a string seja inválida

  // verifica se a string contém hora
  const hasTime = dateStr.includes("T") || dateStr.includes(":");

  if (hasTime) {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};
