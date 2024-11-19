import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { IconButton, Box, Chip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import type { Trade } from '@/types/supabase'

interface UseTradeColumnsProps {
  onDeleteTrade: (tradeId: number) => void
  onCloseTrade: (trade: Trade) => void
}

type TradeGridRow = Trade & {
  unrealizedPnL: Trade['unrealizedPnL']
  realizedPnL: Trade['realizedPnL']
}

export const useTradeColumns = ({ onDeleteTrade, onCloseTrade }: UseTradeColumnsProps) => {
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
      type: 'date',
      valueFormatter: (params: { value: string | null }) => {
        if (!params.value) return ''
        return new Date(params.value).toLocaleDateString()
      }
    },
    {
      field: 'entryPrice',
      headerName: 'Entry Price',
      width: 130,
      type: 'number',
      valueFormatter: (params: { value: number | null }) => {
        if (!params.value) return '-'
        return `$${params.value.toLocaleString()}`
      }
    },
    {
      field: 'amount',
      headerName: 'Amount BTC',
      width: 130,
      type: 'number',
      valueFormatter: (params: { value: number | null }) => {
        if (!params.value) return '-'
        return `${params.value.toFixed(8)} BTC`
      }
    },
    {
      field: 'unrealizedPnL',
      headerName: 'Unrealized P&L',
      width: 160,
      renderCell: (params: GridRenderCellParams<TradeGridRow>) => {
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
      renderCell: (params: GridRenderCellParams<TradeGridRow>) => {
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
            onClick={() => onDeleteTrade(params.row.id)}
            sx={{ mr: 1 }}
            title="Delete Trade"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          {params.row.status === 'Open' && (
            <IconButton
              size="small"
              onClick={() => onCloseTrade(params.row)}
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

  return columns
} 