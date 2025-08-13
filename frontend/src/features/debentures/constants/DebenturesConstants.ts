import { API_BASE } from '../../../config/api'

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export type Order = 'asc' | 'desc';

export const ENDPOINT_DEBENTURES = `${API_BASE}/api/debentures/`;

export const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const handleFetchError = async (res: Response) => {
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
};
