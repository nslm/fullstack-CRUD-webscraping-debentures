export const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000';


export function formatDate(dateString?: string) {
if (!dateString) return "-"; 
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}


export function formatValue(value: number) {
    if (value >= 1_000_000) return parseFloat((value / 1_000_000).toFixed(0)) + "MI";
    if (value >= 1_000) return parseFloat((value / 1_000).toFixed(0)) + "K";
    return value.toFixed(2); // arredonda para 2 casas decimais
    }


export function formatValueRS(value: number) {
    if (value >= 1_000_000) return `R$ ${parseFloat((value / 1_000_000).toFixed(0))}MI`;
    if (value >= 1_000)     return `R$ ${parseFloat((value / 1_000).toFixed(0))}K`;
    return `R$ ${value}`;
    }


export function formatNumber(value: number) {
  let formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (formatted.endsWith(",0")) {
    formatted = formatted.replace(/,0+$/, "");
  }

  return formatted;
}


export function formatNumberRS(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    }

export function formatPercent(value: number | null | undefined, decimal: number = 2) {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  })}%`;
}

export function safeValue(value: number | null | undefined) {
  if (value === null || value === undefined) return 0;
  return value;
}

