'use client'

import { useEffect, useState } from 'react'
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
import { ResponsiveLine } from '@nivo/line';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTheme } from '@mui/material/styles';
import { format, differenceInHours, differenceInDays } from 'date-fns';
import { 
  ToggleButton, 
  ToggleButtonGroup, 
  Tabs, 
  Tab, 
  Paper 
} from '@mui/material';
import { supabase } from '@/lib/supabase'

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

interface Trade {
  id: number
  type: 'Buy' | 'Sell'
  entryDate: Date
  entryPrice: number
  amount: number
  realizedPnL: { value: number; unit: 'USD' | 'BTC' } | null
  unrealizedPnL: { value: number; unit: 'USD' | 'BTC' } | null
  status: 'Open' | 'Closed'
  cashValue?: number
}

function calculateUnrealizedPnL(trade: Trade, currentBtcPrice: number): { value: number; unit: 'USD' | 'BTC' } {
  if (trade.type === 'Buy') {
    return {
      value: (currentBtcPrice - trade.entryPrice) * trade.amount,
      unit: 'USD'
    }
  } else {
    const initialCashValue = trade.entryPrice * trade.amount // How much cash we got
    const currentBtcAmount = initialCashValue / currentBtcPrice // How much BTC we can buy now
    const btcDifference = currentBtcAmount - trade.amount // Positive means profit
    return {
      value: btcDifference,
      unit: 'BTC'
    }
  }
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
// Add this new component
function PnLSummaryCard({ trades }: { trades: Trade[] }) {
  // Calculate cumulative values
  const summary = trades.reduce((acc, trade) => {
    // Handle Unrealized P&L for open trades
    if (trade.status === 'Open' && trade.unrealizedPnL) {
      if (trade.unrealizedPnL.unit === 'USD') {
        acc.unrealizedUSD += trade.unrealizedPnL.value
      } else {
        acc.unrealizedBTC += trade.unrealizedPnL.value
      }
    }
    
    // Handle Realized P&L for closed trades
    if (trade.realizedPnL) {
      if (trade.realizedPnL.unit === 'USD') {
        acc.realizedUSD += trade.realizedPnL.value
      } else {
        acc.realizedBTC += trade.realizedPnL.value
      }
    }
    
    return acc
  }, {
    unrealizedUSD: 0,
    unrealizedBTC: 0,
    realizedUSD: 0,
    realizedBTC: 0,
  })

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
            P&L Summary
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Unrealized P&L Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Unrealized P&L
            </Typography>
            {summary.unrealizedUSD !== 0 && (
              <Typography 
                variant="h6" 
                color={summary.unrealizedUSD >= 0 ? 'success.main' : 'error.main'}
                gutterBottom
              >
                {summary.unrealizedUSD >= 0 ? '+' : ''}
                ${summary.unrealizedUSD.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            )}
            {summary.unrealizedBTC !== 0 && (
              <Typography 
                variant="h6" 
                color={summary.unrealizedBTC >= 0 ? 'success.main' : 'error.main'}
                gutterBottom
              >
                {summary.unrealizedBTC >= 0 ? '+' : ''}
                {summary.unrealizedBTC.toFixed(4)} BTC
              </Typography>
            )}
            {summary.unrealizedUSD === 0 && summary.unrealizedBTC === 0 && (
              <Typography variant="h6" color="text.secondary">
                No open positions
              </Typography>
            )}
          </Grid>

          {/* Realized P&L Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Realized P&L
            </Typography>
            {summary.realizedUSD !== 0 && (
              <Typography 
                variant="h6" 
                color={summary.realizedUSD >= 0 ? 'success.main' : 'error.main'}
                gutterBottom
              >
                {summary.realizedUSD >= 0 ? '+' : ''}
                ${summary.realizedUSD.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            )}
            {summary.realizedBTC !== 0 && (
              <Typography 
                variant="h6" 
                color={summary.realizedBTC >= 0 ? 'success.main' : 'error.main'}
                gutterBottom
              >
                {summary.realizedBTC >= 0 ? '+' : ''}
                {summary.realizedBTC.toFixed(4)} BTC
              </Typography>
            )}
            {summary.realizedUSD === 0 && summary.realizedBTC === 0 && (
              <Typography variant="h6" color="text.secondary">
                No closed trades
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
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
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
        )
        const data = await response.json()
        setCurrentBtcPrice(data.bitcoin.usd)
        setPriceChange(data.bitcoin.usd_24h_change)
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fetch trades from Supabase on component mount
  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('entry_date', { ascending: false })

      if (error) throw error

      // Convert the data format from database to frontend format
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
      // Add proper error handling/notification here
    }
  }

  // Update P&L for all open trades when BTC price changes
  useEffect(() => {
    if (currentBtcPrice > 0) {
      setTrades(prevTrades => 
        prevTrades.map(trade => ({
          ...trade,
          unrealizedPnL: trade.status === 'Open' ? 
            calculateUnrealizedPnL(trade, currentBtcPrice) : 
            trade.unrealizedPnL
        }))
      )
    }
  }, [currentBtcPrice])

  // Update handleNewTrade to save to Supabase
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
    }

    try {
      // Insert into Supabase
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

      // Update local state
      setTrades(prevTrades => [...prevTrades, newTrade])
      setOpenNewTrade(false)
    } catch (error) {
      console.error('Error creating trade:', error)
      // Add proper error handling/notification here
    }
  }

  // Update handleCloseTrade to save to Supabase
  const handleCloseTrade = async (tradeId: number, closeData: CloseTradeForm) => {
    try {
      const updatedTrades = trades.map(trade => {
        if (trade.id === tradeId) {
          const closePrice = Number(closeData.closePrice)
          const closeAmount = Number(closeData.closeAmount)
          
          let realizedPnL = calculateRealizedPnL(trade, closePrice, closeAmount)
          
          // If closing partial amount
          if (closeAmount < trade.amount) {
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
          }

          // If closing entire position
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
        return trade
      })

      setTrades(updatedTrades)
      setOpenCloseTrade(false)
      setTradeToClose(null)
    } catch (error) {
      console.error('Error closing trade:', error)
      // Add proper error handling/notification here
    }
  }

  // Update handleDeleteTrade to delete from Supabase
  const handleDeleteTrade = async (tradeId: number) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        const { error } = await supabase
          .from('trades')
          .delete()
          .eq('id', tradeId)

        if (error) throw error

        setTrades(prevTrades => prevTrades.filter(trade => trade.id !== tradeId))
      } catch (error) {
        console.error('Error deleting trade:', error)
        // Add proper error handling/notification here
      }
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
        if (!params.value || params.row.status !== 'Open') return '-'
        
        const pnl = params.value as { value: number; unit: 'USD' | 'BTC' }
        const isPositive = pnl.value >= 0
        
        let formattedValue = ''
        if (pnl.unit === 'USD') {
          formattedValue = `$${pnl.value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        } else {
          formattedValue = `${pnl.value.toFixed(4)} BTC`
        }

        return (
          <Typography color={isPositive ? 'success.main' : 'error.main'}>
            {isPositive ? '+' : ''}{formattedValue}
          </Typography>
        )
      },
    },
    {
      field: 'realizedPnL',
      headerName: 'Realized P&L',
      width: 160,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-'
        
        const pnl = params.value as { value: number; unit: 'USD' | 'BTC' }
        const isPositive = pnl.value >= 0
        
        let formattedValue = ''
        if (pnl.unit === 'USD') {
          formattedValue = `$${pnl.value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        } else {
          formattedValue = `${pnl.value.toFixed(4)} BTC`
        }

        return (
          <Typography color={isPositive ? 'success.main' : 'error.main'}>
            {isPositive ? '+' : ''}{formattedValue}
          </Typography>
        )
      },
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

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <BitcoinPriceCard price={currentBtcPrice} priceChange={priceChange} />
        </Grid>
        <Grid item xs={12} md={4}>
          <PnLSummaryCard trades={trades} />
        </Grid>
      </Grid>

      {/* Trades Table with New Trade Button */}
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
