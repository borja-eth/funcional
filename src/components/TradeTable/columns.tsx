import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Chip, Typography, Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import type { Trade } from '@/types/supabase'

export const getColumns = (
  handleDeleteTrade: (id: number) => void,
  handleCloseTrade: (trade: Trade) => void
): GridColDef<Trade>[] => [
  {
    field: 'type',
    headerName: 'Type',
    width: 100,
    renderCell: (params: GridRenderCellParams<Trade>) => (
      <Chip
        label={params.row.type}
        color={params.row.type === 'Buy' ? 'success' : 'error'}
        size="small"
      />
    ),
  },
  {
    field: 'entryDate',
    headerName: 'Entry Date',
    width: 130,
    renderCell: (params: GridRenderCellParams<Trade>) => {
      return new Date(params.row.entryDate).toLocaleDateString()
    }
  },
  {
    field: 'entryPrice',
    headerName: 'Entry Price',
    width: 130,
    renderCell: (params: GridRenderCellParams<Trade>) => {
      return `$${params.row.entryPrice.toLocaleString()}`
    }
  },
  {
    field: 'amount',
    headerName: 'Amount BTC',
    width: 130,
    renderCell: (params: GridRenderCellParams<Trade>) => {
      return `${params.row.amount.toFixed(8)} BTC`
    }
  },
  {
    field: 'unrealizedPnL',
    headerName: 'Unrealized P&L',
    width: 160,
    renderCell: (params: GridRenderCellParams<Trade>) => {
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
    renderCell: (params: GridRenderCellParams<Trade>) => {
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
    renderCell: (params: GridRenderCellParams<Trade>) => (
      <Chip
        label={params.row.status}
        color={params.row.status === 'Open' ? 'primary' : 'default'}
        size="small"
      />
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 160,
    renderCell: (params: GridRenderCellParams<Trade>) => (
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
            onClick={() => handleCloseTrade(params.row)}
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