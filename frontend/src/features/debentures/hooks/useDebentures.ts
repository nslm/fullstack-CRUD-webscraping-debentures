import { useEffect, useState } from 'react'
import { Debenture } from '../types/DebenturesTypes'
import { ENDPOINT_DEBENTURES, JSON_HEADERS, handleFetchError} from '../constants/DebenturesConstants';


export default function useDebentures() {
    function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
      key = "debenture_" + key;
      const [state, setState] = useState<T>(() => {
        try {
          const saved = sessionStorage.getItem(key);
          return saved ? JSON.parse(saved) : defaultValue;
        } catch {
          return defaultValue;
        }
      });
  
      useEffect(() => {
        try {
          sessionStorage.setItem(key, JSON.stringify(state));
        } catch (err) {
          console.warn(`Erro salvando ${key} no localStorage`, err);
        }
      }, [key, state]);
  
      return [state, setState];
    }
    const [items, setItems] = usePersistedState<Debenture[]>('items',[])
    const [loading, setLoading] = usePersistedState('loading', true)
    const [error, setError] = usePersistedState<string | null>('error', null)
    const [dialogOpen, setDialogOpen] = usePersistedState('dialogOpen', false)
    const [editing, setEditing] = usePersistedState<Debenture | null>('editing', null)
    const [filter, setFilter] = usePersistedState('filter', '')
    const [page, setPage] = usePersistedState('page', 0)
    const [rowsPerPage, setRowsPerPage] = usePersistedState('rowsPerPage',10)

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(ENDPOINT_DEBENTURES)
      await handleFetchError(res);
      const data = await res.json()
      setItems(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar debentures')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const add = async (d: Debenture) => {
    const res = await fetch(ENDPOINT_DEBENTURES, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(d)
    })
    await handleFetchError(res);
    const created = await res.json()
    setItems(s => [...s, created])
    return created
  }

  const update = async (codigo: string, updated: Debenture) => {
    const res = await fetch(`${ENDPOINT_DEBENTURES}${encodeURIComponent(codigo)}/`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(updated)
    })
    await handleFetchError(res);
    const upd = await res.json()
    setItems(s => s.map(i => (i.codigo === codigo ? upd : i)))
    return upd
  }

  const remove = async (codigo: string) => {
    const res = await fetch(`${ENDPOINT_DEBENTURES}${encodeURIComponent(codigo)}/`, {
      method: 'DELETE'
    })
    await handleFetchError(res);
    setItems(s => s.filter(i => i.codigo !== codigo))
    return true
  }

    return { items, loading, error, fetchAll, add, update, remove, dialogOpen, editing, setEditing,
          setDialogOpen, filter, setFilter, page, setPage, rowsPerPage, setRowsPerPage}
}
