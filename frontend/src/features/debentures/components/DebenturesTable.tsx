import React from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Paper, TableContainer, TableSortLabel } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Debenture } from '../types/DebenturesTypes'



type Props = {
  items: Debenture[]
  onEdit: (d: Debenture) => void
  onDelete: (code: string) => void
  order: any
  orderBy: any
  onRequestSort: (property: keyof Debenture) => void
}

const DebenturesTable: React.FC<Props> = ({
  items, onEdit, onDelete, order, orderBy, onRequestSort
}) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {[
              { id: 'codigo', label: 'Código' },
              { id: 'emissor', label: 'Emissor' },
              { id: 'vencimento', label: 'Vencimento' },
              { id: 'indice', label: 'Índice' },
              { id: 'taxa', label: 'Taxa (%)' },
            ].map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
                sx={{ fontWeight: 'bold' }}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => onRequestSort(headCell.id as keyof Debenture)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row) => (
            <TableRow key={row.codigo}>
              <TableCell sx={{ py: 0.9, fontSize: 15 }}>{row.codigo}</TableCell>
              <TableCell sx={{ py: 0.9, fontSize: 15 }}>{row.emissor}</TableCell>
              <TableCell sx={{ py: 0.9, fontSize: 15 }}>{row.vencimento}</TableCell>
              <TableCell sx={{ py: 0.9, fontSize: 15 }}>{row.indice}</TableCell>
              <TableCell sx={{ py: 0.9, fontSize: 15 }}>{(row.taxa / 10**4).toFixed(2)}</TableCell>
              <TableCell sx={{ py: 0.9, fontSize: 15 }} align="right">
                <IconButton size="small" onClick={() => onEdit(row)} aria-label="editar">
                  <EditIcon/>
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(row.codigo)} aria-label="excluir">
                  <DeleteIcon/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  )
}

export default DebenturesTable
