import { API_BASE } from '../../../config/api'

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export type Order = 'asc' | 'desc';

export const ENDPOINT_DEBENTURES = `${API_BASE}/api/debentures/`;

export const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const handleFetchError = async (res: Response) => {
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}