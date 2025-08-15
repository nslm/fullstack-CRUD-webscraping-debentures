export const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000';


export function getColor(idx: number, total: number) {
    const startHue = 140; 
    const endHue = 200;  
    const hue = startHue + ((endHue - startHue) * idx) / (total - 1);
    const saturation = 40; 
    const lightness = 70;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }


export function formatValue(value: number) {
    if (value >= 1_000_000) return parseFloat((value / 1_000_000).toFixed(0)) + "MI";
    if (value >= 1_000) return parseFloat((value / 1_000).toFixed(0)) + "K";
    return value.toString();
    }


export function formatValueRS(value: number) {
    if (value >= 1_000_000) return `R$ ${parseFloat((value / 1_000_000).toFixed(0))}MI`;
    if (value >= 1_000)     return `R$ ${parseFloat((value / 1_000).toFixed(0))}K`;
    return `R$ ${value}`;
    }


export function formatNumber(value: number) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    }


export function formatNumberRS(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    }


export function formatPercent(value: number, decimal: number = 2) {
    return `${value.toLocaleString("pt-BR", {
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal,
    })}%`;
    }
