import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material'
import { useState } from 'react'
import type { TradeForm } from '@/types/supabase'

interface NewTradeDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (formData: TradeForm) => Promise<void>
  currentBtcPrice: number
}

export default function NewTradeDialog({
  open,
  onClose,
  onSubmit,
  currentBtcPrice
}: NewTradeDialogProps) {
  const [formData, setFormData] = useState<TradeForm>({
    type: 'Buy',
    price: currentBtcPrice.toString(),
    amount: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({
      type: 'Buy',
      price: currentBtcPrice.toString(),
      amount: '',
    })
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
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  type: e.target.value as 'Buy' | 'Sell'
                }))}
              >
                <MenuItem value="Buy">Buy</MenuItem>
                <MenuItem value="Sell">Sell</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Price (USD)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                price: e.target.value
              }))}
              required
              fullWidth
              InputProps={{
                inputProps: { 
                  min: 0,
                  step: "0.01"
                }
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Amount (BTC)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                amount: e.target.value
              }))}
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