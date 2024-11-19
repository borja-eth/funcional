import { DataGrid } from '@mui/x-data-grid'
import { Paper, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { getColumns } from './columns'
import type { Trade } from '@/types/supabase'

interface TradeTableProps {
  trades: Trade[]
  onNewTrade: () => void
  onDeleteTrade: (id: number) => void
  onCloseTrade: (trade: Trade) => void
}

export function TradeTable({
  trades,
  onNewTrade,
  onDeleteTrade,
  onCloseTrade
}: TradeTableProps) {
  const columns = getColumns(onDeleteTrade, onCloseTrade)
  
  return (
    <Paper sx={{ 
      p: 3, 
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 2
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Treasury Trades
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewTrade}
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
    </Paper>
  )
} 