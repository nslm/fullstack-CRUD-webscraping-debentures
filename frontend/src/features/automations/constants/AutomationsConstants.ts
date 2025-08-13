export const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000';

export const AUTOMATIONS = [
  { id: "caracteristicas", label: "Automação Características das Debêntures" },
  { id: "balcao", label: "Automação Dados de Negociação de Balcão" },
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
