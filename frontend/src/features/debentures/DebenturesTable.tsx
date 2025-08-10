import React from 'react'
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Paper, TableContainer
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Debenture } from './debentureTypes'

type Props = {
  items: Debenture[]
  onEdit: (d: Debenture) => void
  onDelete: (code: string) => void
}

const DebenturesTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Emissor</TableCell>
            <TableCell>Vencimento</TableCell>
            <TableCell>Índice</TableCell>
            <TableCell>Taxa (%)</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.codigo}>
              <TableCell>{row.codigo}</TableCell>
              <TableCell>{row.emissor}</TableCell>
              <TableCell>{row.vencimento}</TableCell>
              <TableCell>{row.indice}</TableCell>
              <TableCell>{row.taxa/1000}</TableCell>
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
