import React, { useState, } from 'react'
import { Typography, Button, Box, Toolbar, TextField, CircularProgress, TablePagination, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { ROWS_PER_PAGE_OPTIONS, Order} from './../constants/DebenturesConstants';
import DebenturesTable from '../components/DebenturesTable'
import DebenturesDialog from '../components/DebenturesDialog'
import useDebentures from '../hooks/useDebentures'
import { Debenture } from '../types/DebenturesTypes'
import RefreshIcon from '@mui/icons-material/Refresh';

const DebenturesPage: React.FC = () => {

  const { items, loading, error, fetchAll, add, update, remove, dialogOpen, editing, setEditing,
    setDialogOpen, filter, setFilter, page, setPage, rowsPerPage, setRowsPerPage} = useDebentures()


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


  const filtered = items.filter(i => {
    const q = filter.trim().toLowerCase()
    if (!q) return true
    return (
      i.codigo.toLowerCase().includes(q) ||
      i.emissor.toLowerCase().includes(q) ||
      (i.indice || '').toLowerCase().includes(q)
    )
  })

   
  const [order, setOrder] = React.useState<Order|undefined>(undefined);
  const [orderBy, setOrderBy] = React.useState<keyof Debenture|string>('asc');

  const handleRequestSort = (property: keyof Debenture) => {
    const isAsc = orderBy === property && order === 'asc';
    setPage(0);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sorted = React.useMemo(() => {
    return [...filtered].sort((a:any, b:any) => {
      const valA = a[orderBy];
      const valB = b[orderBy];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return order === 'asc' ? valA - valB : valB - valA;
      }

      return order === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filtered, order, orderBy]);

  const paginated = React.useMemo(() => {
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  return (
    <Box sx={{ mr:3, ml:2 }}>
      <Toolbar />

      <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar (código, emissor, índice)"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(0) }}
          size="small"
          />
        <Button onClick={() => fetchAll()} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}>Atualizar</Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick} sx={{ height: '50px', backgroundColor: '#0723c0ff', fontWeight: 'bold', ml: 'auto'}}>
          Adicionar
        </Button>
      </Box>

      {error && <Box sx={{ color: 'error.main', mb: 2 }}>{error}</Box>}
      <DebenturesTable
        items={paginated}
        onEdit={handleEdit}
        onDelete={handleDelete}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        />

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      </Paper>
      <DebenturesDialog open={dialogOpen} initial={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />
    </Box>
  )
}

export default DebenturesPage
