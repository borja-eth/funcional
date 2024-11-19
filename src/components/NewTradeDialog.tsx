import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'
import type { TradeForm } from '@/types/supabase'

interface NewTradeDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TradeForm) => Promise<void>
  currentBtcPrice: number
}

export function NewTradeDialog({ 
  open, 
  onClose, 
  onSubmit,
  currentBtcPrice 
}: NewTradeDialogProps) {
  const [form, setForm] = useState<TradeForm>({
    type: 'Buy',
    price: currentBtcPrice.toString(),
    amount: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
    setForm({
      type: 'Buy',
      price: currentBtcPrice.toString(),
      amount: ''
    })
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#1E1E1E',
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle>New Trade</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                label="Type"
                onChange={(e) => setForm({ ...form, type: e.target.value as 'Buy' | 'Sell' })}
              >
                <MenuItem value="Buy">Buy</MenuItem>
                <MenuItem value="Sell">Sell</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Price (USD)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <TextField
              label="Amount (BTC)"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              fullWidth
              InputProps={{
                inputProps: {
                  min: 0,
                  step: "0.00000001"
                }
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Create Trade
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
