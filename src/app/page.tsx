'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Trade } from '@/types/supabase'
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid'
import CloseIcon from '@mui/icons-material/Close'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { 
  Paper 
} from '@mui/material';
import PnLSummaryCard from '@/components/PnLSummaryCard'

// Bitcoin Price Card Component
function BitcoinPriceCard({ price, priceChange }: { price: number, priceChange?: number }) {
  return (
    <Card sx={{ 
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 2,
      height: '100%' 
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          <Typography variant="h6" color="text.secondary">
            Bitcoin Price
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          ${price?.toLocaleString() ?? 'Loading...'}
        </Typography>
        {priceChange && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: priceChange >= 0 ? 'success.main' : 'error.main',
              mt: 1 
            }}
          >
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% (24h)
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

// Add this interface for the form
interface TradeForm {
  type: 'Buy' | 'Sell'
  amount: string
  price: string
}

// Updated NewTradeDialog component
function NewTradeDialog({ 
  open, 
  onClose, 
  onSubmit,
  currentBtcPrice 
}: { 
  open: boolean
  onClose: () => void
  onSubmit: (data: TradeForm) => void
  currentBtcPrice: number
}) {
  const [formData, setFormData] = useState<TradeForm>({
    type: 'Buy',
    amount: '',
    price: currentBtcPrice.toString(),
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        type: 'Buy',
        amount: '',
        price: currentBtcPrice.toString(),
      })
    }
  }, [open, currentBtcPrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#1E1E1E',
          borderRadius: 2,
          minWidth: '400px',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Trade</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({
                  ...formData,
                  type: e.target.value as 'Buy' | 'Sell'
                })}
                required
              >
                <MenuItem value="Buy">Buy</MenuItem>
                <MenuItem value="Sell">Sell</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({
                ...formData,
                amount: e.target.value
              })}
              InputProps={{
                endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
              }}
              required
              inputProps={{ step: "0.0001", min: "0" }}
            />

            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({
                ...formData,
                price: e.target.value
              })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
              inputProps={{ step: "0.01", min: "0" }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Create Trade
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

// Updated CloseTradeDialog component
function CloseTradeDialog({ 
  open, 
  onClose, 
  onSubmit,
  currentBtcPrice 
}: { 
  open: boolean
  onClose: () => void
  onSubmit: (data: { closePrice: string, closeAmount: string }) => void
  currentBtcPrice: number
}) {
  const [formData, setFormData] = useState({
    closePrice: currentBtcPrice.toString(),
    closeAmount: '',
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        closePrice: currentBtcPrice.toString(),
        closeAmount: '',
      })
    }
  }, [open, currentBtcPrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#1E1E1E',
          borderRadius: 2,
          minWidth: '400px',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Close Trade</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Close Price"
              type="number"
              value={formData.closePrice}
              onChange={(e) => setFormData({
                ...formData,
                closePrice: e.target.value
              })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
              inputProps={{ step: "0.01", min: "0" }}
            />

            <TextField
              label="Close Amount"
              type="number"
              value={formData.closeAmount}
              onChange={(e) => setFormData({
                ...formData,
                closeAmount: e.target.value
              })}
              InputProps={{
                endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
              }}
              required
              inputProps={{ step: "0.0001", min: "0" }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<CloseIcon />}
          >
            Close Trade
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [openNewTrade, setOpenNewTrade] = useState(false)
  const [openCloseTrade, setOpenCloseTrade] = useState(false)
  const [tradeToClose, setTradeToClose] = useState<Trade | null>(null)
  const [currentBtcPrice, setCurrentBtcPrice] = useState(0)
  const [priceChange, setPriceChange] = useState<number | null>(null)

  // Fetch Bitcoin price
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
        const data = await response.json()
        setCurrentBtcPrice(data.bitcoin.usd)
        setPriceChange(data.bitcoin.usd_24h_change)
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error)
      }
    }

    fetchBitcoinPrice()
    const interval = setInterval(fetchBitcoinPrice, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Update unrealized P&L when price changes
  useEffect(() => {
    if (currentBtcPrice <= 0) return

    setTrades(prevTrades => 
      prevTrades.map(trade => {
        if (trade.status === 'Open') {
          return {
            ...trade,
            unrealizedPnL: calculateUnrealizedPnL(trade, currentBtcPrice)
          }
        }
        return trade
      })
    )
  }, [currentBtcPrice]) // Only depend on price changes

  // Fetch trades
  useEffect(() => {
    fetchTrades()
  }, [])

  const calculateUnrealizedPnL = (trade: Trade, currentPrice: number): { value: number; unit: 'USD' | 'BTC' } => {
    if (trade.type === 'Buy') {
      // For Buy trades: (Current Price - Entry Price) * Amount in USD
      const pnlValue = (currentPrice - trade.entryPrice) * trade.amount
      return {
        value: pnlValue,
        unit: 'USD'
      }
    } else {
      // For Sell trades: (Entry Price - Current Price) * Amount in BTC
      // If you sold at a higher price than current price, you're profitable in BTC terms
      const btcValue = trade.amount * ((trade.entryPrice - currentPrice) / currentPrice)
      return {
        value: btcValue,
        unit: 'BTC'
      }
    }
  }

  const calculateRealizedPnL = (
    trade: Trade, 
    closePrice: number, 
    closeAmount: number
  ): { value: number; unit: 'USD' | 'BTC' } => {
    if (trade.type === 'Buy') {
      // For Buy trades: (Close Price - Entry Price) * Close Amount in USD
      const pnlValue = (closePrice - trade.entryPrice) * closeAmount
      return {
        value: pnlValue,
        unit: 'USD'
      }
    } else {
      // For Sell trades: (Entry Price - Close Price) * Close Amount in BTC
      const btcValue = closeAmount * ((trade.entryPrice - closePrice) / closePrice)
      return {
        value: btcValue,
        unit: 'BTC'
      }
    }
  }

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('entry_date', { ascending: false })

      if (error) throw error

      const formattedTrades = data.map(trade => ({
        id: trade.id,
        type: trade.type as 'Buy' | 'Sell',
        entryDate: new Date(trade.entry_date),
        entryPrice: Number(trade.entry_price),
        amount: Number(trade.amount),
        realizedPnL: trade.realized_pnl,
        unrealizedPnL: trade.unrealized_pnl,
        status: trade.status as 'Open' | 'Closed',
        cashValue: trade.cash_value ? Number(trade.cash_value) : undefined,
      }))

      setTrades(formattedTrades)
    } catch (error) {
      console.error('Error fetching trades:', error)
    }
  }

  const handleNewTrade = async (formData: TradeForm) => {
    const newTrade: Trade = {
      id: Date.now(),
      type: formData.type,
      entryDate: new Date(),
      entryPrice: Number(formData.price),
      amount: Number(formData.amount),
      realizedPnL: null,
      unrealizedPnL: null,
      status: 'Open',
      cashValue: formData.type === 'Sell' ? Number(formData.price) * Number(formData.amount) : undefined
    }

    // Calculate initial unrealized P&L
    if (currentBtcPrice > 0) {
      newTrade.unrealizedPnL = calculateUnrealizedPnL(newTrade, currentBtcPrice)
      console.log('New Trade P&L:', newTrade.unrealizedPnL) // Debug log
    }

    try {
      const { error } = await supabase
        .from('trades')
        .insert({
          id: newTrade.id,
          type: newTrade.type,
          entry_date: newTrade.entryDate.toISOString(),
          entry_price: newTrade.entryPrice,
          amount: newTrade.amount,
          realized_pnl: newTrade.realizedPnL,
          unrealized_pnl: newTrade.unrealizedPnL,
          status: newTrade.status,
          cash_value: newTrade.cashValue,
        })

      if (error) throw error

      setTrades(prevTrades => [...prevTrades, newTrade])
      setOpenNewTrade(false)
    } catch (error) {
      console.error('Error creating trade:', error)
    }
  }

  const handleDeleteTrade = (tradeId: number) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      setTrades(prevTrades => prevTrades.filter(trade => trade.id !== tradeId))
    }
  }

  const handleCloseTrade = async (tradeId: number, closeData: { closePrice: string; closeAmount: string }) => {
    try {
      const updatedTrades = trades.map(trade => {
        if (trade.id === tradeId) {
          const closePrice = Number(closeData.closePrice)
          const closeAmount = Number(closeData.closeAmount)
          
          const realizedPnL = calculateRealizedPnL(trade, closePrice, closeAmount)
          
          if (closeAmount < trade.amount) {
            // Partial close
            const updatedTrade = {
              ...trade,
              amount: trade.amount - closeAmount,
              realizedPnL,
              unrealizedPnL: calculateUnrealizedPnL(
                { ...trade, amount: trade.amount - closeAmount },
                currentBtcPrice
              )
            }

            // Update in Supabase
            supabase
              .from('trades')
              .update({
                amount: updatedTrade.amount,
                realized_pnl: updatedTrade.realizedPnL,
                unrealized_pnl: updatedTrade.unrealizedPnL,
              })
              .eq('id', tradeId)

            return updatedTrade
          } else {
            // Full close
            const closedTrade = {
              ...trade,
              status: 'Closed' as const,
              realizedPnL,
              unrealizedPnL: null
            }

            // Update in Supabase
            supabase
              .from('trades')
              .update({
                status: closedTrade.status,
                realized_pnl: closedTrade.realizedPnL,
                unrealized_pnl: closedTrade.unrealizedPnL,
              })
              .eq('id', tradeId)

            return closedTrade
          }
        }
        return trade
      })

      setTrades(updatedTrades)
      setOpenCloseTrade(false)
      setTradeToClose(null)
    } catch (error) {
      console.error('Error closing trade:', error)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value === 'Buy' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'entryDate',
      headerName: 'Entry Date',
      width: 130,
      valueFormatter: (params) => {
        if (!params.value) return ''
        return new Date(params.value).toLocaleDateString()
      }
    },
    {
      field: 'entryPrice',
      headerName: 'Entry Price',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-'
        return `$${Number(params.value).toLocaleString()}`
      },
    },
    {
      field: 'amount',
      headerName: 'Amount BTC',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-'
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {params.row.type === 'Sell' && '-'}
            {Number(params.value).toFixed(4)} BTC
          </Box>
        )
      },
    },
    {
      field: 'unrealizedPnL',
      headerName: 'Unrealized P&L',
      width: 160,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.row.unrealizedPnL || params.row.status !== 'Open') return '-'
        
        const pnl = params.row.unrealizedPnL
        const isPositive = pnl.value >= 0
        const formattedValue = pnl.unit === 'USD'
          ? `$${Math.abs(pnl.value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          : `${Math.abs(pnl.value).toFixed(8)} BTC`

        return (
          <Typography 
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 'medium' }}
          >
            {isPositive ? '+' : '-'}{formattedValue}
          </Typography>
        )
      }
    },
    {
      field: 'realizedPnL',
      headerName: 'Realized P&L',
      width: 160,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.row.realizedPnL) return '-'
        
        const pnl = params.row.realizedPnL
        const isPositive = pnl.value >= 0
        const formattedValue = pnl.unit === 'USD'
          ? `$${Math.abs(pnl.value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          : `${Math.abs(pnl.value).toFixed(8)} BTC`

        return (
          <Typography 
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 'medium' }}
          >
            {isPositive ? '+' : '-'}{formattedValue}
          </Typography>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value === 'Open' ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleDeleteTrade(params.row.id)}
            sx={{ mr: 1 }}
            title="Delete Trade"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          {params.row.status === 'Open' && (
            <IconButton
              size="small"
              onClick={() => {
                setTradeToClose(params.row)
                setOpenCloseTrade(true)
              }}
              color="error"
              title="Close Trade"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ]

  // Calculate cumulative P&L
  const calculateCumulativePnL = () => {
    let totalUnrealizedBTC = 0
    let totalUnrealizedUSD = 0
    let totalRealizedBTC = 0
    let totalRealizedUSD = 0

    trades.forEach(trade => {
      // Sum up unrealized P&L
      if (trade.unrealizedPnL && trade.status === 'Open') {
        if (trade.unrealizedPnL.unit === 'BTC') {
          totalUnrealizedBTC += trade.unrealizedPnL.value
        } else {
          totalUnrealizedUSD += trade.unrealizedPnL.value
        }
      }

      // Sum up realized P&L
      if (trade.realizedPnL) {
        if (trade.realizedPnL.unit === 'BTC') {
          totalRealizedBTC += trade.realizedPnL.value
        } else {
          totalRealizedUSD += trade.realizedPnL.value
        }
      }
    })

    return {
      unrealized: {
        btc: totalUnrealizedBTC,
        usd: totalUnrealizedUSD
      },
      realized: {
        btc: totalRealizedBTC,
        usd: totalRealizedUSD
      }
    }
  }

  const cumulativePnL = calculateCumulativePnL()

  return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: 'background.default', 
      minHeight: '100vh', 
      p: 3,
    }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <BitcoinPriceCard price={currentBtcPrice} priceChange={priceChange} />
        </Grid>
        <Grid item xs={12} md={4}>
          <PnLSummaryCard
            title="Unrealized P&L"
            btcValue={cumulativePnL.unrealized.btc}
            usdValue={cumulativePnL.unrealized.usd}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PnLSummaryCard
            title="Realized P&L"
            btcValue={cumulativePnL.realized.btc}
            usdValue={cumulativePnL.realized.usd}
          />
        </Grid>
      </Grid>

      <Paper 
        sx={{ 
          p: 3, 
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Treasury Trades
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewTrade(true)}
          >
            New Trade
          </Button>
        </Box>

        <DataGrid
          rows={trades}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '& .MuiDataGrid-columnHeaders': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        />

        <NewTradeDialog 
          open={openNewTrade} 
          onClose={() => setOpenNewTrade(false)}
          onSubmit={handleNewTrade}
          currentBtcPrice={currentBtcPrice}
        />

        <CloseTradeDialog
          open={openCloseTrade}
          trade={tradeToClose}
          onClose={() => {
            setOpenCloseTrade(false)
            setTradeToClose(null)
          }}
          onSubmit={(data) => handleCloseTrade(tradeToClose!.id, data)}
          currentBtcPrice={currentBtcPrice}
        />
      </Paper>
    </Box>
  )
}

