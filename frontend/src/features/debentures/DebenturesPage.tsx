import React, { useState } from 'react'
import { Typography, Button, Box, Toolbar, TextField, CircularProgress, TablePagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DebenturesTable from './DebenturesTable'
import DebentureDialog from './DebentureDialog'
import useDebentures from '../../hooks/useDebentures'
import { Debenture } from './debentureTypes'

const DebenturesPage: React.FC = () => {
  const { items, loading, error, fetchAll, add, update, remove } = useDebentures()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Debenture | null>(null)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleAddClick = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const handleSave = async (d: Debenture) => {
    try {
      if (editing) {
        await update(editing.codigo, d)
      } else {
        await add(d)
      }
      await fetchAll()
      setDialogOpen(false)
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar')
    }
  }

  const handleEdit = (d: Debenture) => {
    setEditing(d)
    setDialogOpen(true)
  }

  const handleDelete = async (codigo: string) => {
    if (!confirm('Confirma exclusão?')) return
    try {
      await remove(codigo)
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir')
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // client-side filter (case-insensitive)
  const filtered = items.filter(i => {
    const q = filter.trim().toLowerCase()
    if (!q) return true
    return (
      i.codigo.toLowerCase().includes(q) ||
      i.emissor.toLowerCase().includes(q) ||
      (i.indice || '').toLowerCase().includes(q)
    )
  })

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <div>
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Debentures</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
          Adicionar
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar (código, emissor, índice)"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(0) }}
          size="small"
        />
        <Button onClick={() => fetchAll()} disabled={loading}>Atualizar</Button>
        {loading && <CircularProgress size={20} />}
      </Box>

      {error && <Box sx={{ color: 'error.main', mb: 2 }}>{error}</Box>}

      <DebenturesTable items={paginated} onEdit={handleEdit} onDelete={handleDelete} />

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <DebentureDialog open={dialogOpen} initial={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />
    </div>
  )
}

export default DebenturesPage
