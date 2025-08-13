import React, { useState } from 'react'
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Paper, TableContainer, TableSortLabel
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Debenture } from './debentureTypes'

type Order = 'asc' | 'desc'

type Props = {
  items: Debenture[]
  onEdit: (d: Debenture) => void
  onDelete: (code: string) => void
  order: Order
  orderBy: keyof Debenture
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
                  IconComponent={ExpandMoreIcon}
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
              <TableCell>{row.codigo}</TableCell>
              <TableCell>{row.emissor}</TableCell>
              <TableCell>{row.vencimento}</TableCell>
              <TableCell>{row.indice}</TableCell>
              <TableCell>{row.taxa / 1000}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(row)} aria-label="editar">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(row.codigo)} aria-label="excluir">
                  <DeleteIcon />
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
