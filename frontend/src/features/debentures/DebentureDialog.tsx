import React, { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from '@mui/material'
import { Debenture } from './debentureTypes'

type Props = {
  open: boolean
  initial?: Debenture | null
  onClose: () => void
  onSave: (d: Debenture) => void
}

const DebentureDialog: React.FC<Props> = ({ open, initial = null, onClose, onSave }) => {
  const [taxaStr, setTaxaStr] = useState('0')

  const [form, setForm] = useState<Debenture>(() => ({
    codigo: '',
    emissor: '',
    vencimento: '',
    indice: '',
    taxa: 0
  }))

  useEffect(() => {
    if (initial) {
      setForm(initial) 
      setTaxaStr(String(initial.taxa / 1000))}
    else setForm({ codigo: '', emissor: '', vencimento: '', indice: '', taxa: 0 })
  }, [initial, open])

const handleChange = (k: keyof Debenture) => (e: React.ChangeEvent<HTMLInputElement>) => {
  if (k === 'taxa') {
    const val = e.target.value

    // Permite string vazia, números, e um ponto decimal
    if (/^\d*\.?\d*$/.test(val) || val === '') {
      setTaxaStr(val)
    }
  } else {
    // Para os outros campos, guarda o valor direto (string)
    setForm(prev => ({ ...prev, [k]: e.target.value }))
  }
}

  const handleSave = () => {
    // basic validation
    if (!form.codigo || !form.emissor || !form.vencimento) {
      alert('Preencha os campos obrigatórios: código, emissor e vencimento.')
      return
    }
    const num = parseFloat(taxaStr)
    onSave({
      ...form,
      taxa: isNaN(num) ? 0 : Math.round(num * 1000),
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Editar Debenture' : 'Adicionar Debenture'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
          {!initial && (
            <TextField
              label="Código"
              value={form.codigo}
              onChange={handleChange('codigo')}
              required
            />
          )}
          <TextField label="Emissor" value={form.emissor} onChange={handleChange('emissor')} required />
          <TextField
            label="Vencimento"
            type="date"
            value={form.vencimento}
            onChange={handleChange('vencimento')}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField label="Índice" value={form.indice} onChange={handleChange('indice')} />
          <TextField label="Taxa (%)" type="text" value={taxaStr} onChange={handleChange('taxa')} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">{initial ? 'Salvar' : 'Adicionar'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DebentureDialog
