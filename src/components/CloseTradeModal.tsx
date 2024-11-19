import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { Trade } from '@/types/supabase'

interface CloseTradeModalProps {
  open: boolean
  trade: Trade | null
  onClose: () => void
  onSubmit: (data: { closePrice: string; closeAmount: string }) => Promise<void>
  currentBtcPrice: number
}

export default function CloseTradeModal({ 
  open, 
  trade, 
  onClose, 
  onSubmit, 
  currentBtcPrice 
}: CloseTradeModalProps) {
  const [closePrice, setClosePrice] = useState(() => currentBtcPrice.toString())
  const [closeAmount, setCloseAmount] = useState(() => trade?.amount.toString() ?? '')

  useEffect(() => {
    if (open) {
      setClosePrice(currentBtcPrice.toString())
      setCloseAmount(trade?.amount.toString() ?? '')
    }
  }, [open, currentBtcPrice, trade])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ closePrice, closeAmount })
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
      <DialogTitle>Close Trade</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Close Price (USD)"
              type="number"
              value={closePrice}
              onChange={(e) => setClosePrice(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label={`Close Amount (max ${trade?.amount ?? 0} BTC)`}
              type="number"
              value={closeAmount}
              onChange={(e) => setCloseAmount(e.target.value)}
              required
              fullWidth
              InputProps={{
                inputProps: {
                  min: 0,
                  max: trade?.amount ?? 0,
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
            Close Trade
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
} 