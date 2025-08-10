import { useEffect, useState } from 'react'
import { Debenture } from '../features/debentures/debentureTypes'

// API base loaded from Vite env (VITE_API_BASE). Fallback to http://localhost:8000.
const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000'

export default function useDebentures() {
  const [items, setItems] = useState<Debenture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/debentures`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const add = async (d: Debenture) => {
    const res = await fetch(`${API_BASE}/api/debentures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(txt || `HTTP ${res.status}`)
    }
    const created = await res.json()
    setItems(s => [...s, created])
    return created
  }

  const update = async (codigo: string, updated: Debenture) => {
    const res = await fetch(`${API_BASE}/api/debentures/${encodeURIComponent(codigo)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(txt || `HTTP ${res.status}`)
    }
    const upd = await res.json()
    setItems(s => s.map(i => (i.codigo === codigo ? upd : i)))
    return upd
  }

  const remove = async (codigo: string) => {
    const res = await fetch(`${API_BASE}/api/debentures/${encodeURIComponent(codigo)}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(txt || `HTTP ${res.status}`)
    }
    setItems(s => s.filter(i => i.codigo !== codigo))
    return true
  }

  return { items, loading, error, fetchAll, add, update, remove }
}
