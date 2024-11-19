import { Box, Button, Typography, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import type { Trade } from '@/types/supabase'

interface TreasuryTradesSectionProps {
  trades: Trade[]
  columns: GridColDef[]
  openNewTrade: boolean
  setOpenNewTrade: (open: boolean) => void
}

export default function TreasuryTradesSection({
  trades,
  columns,
  openNewTrade,
  setOpenNewTrade
}: TreasuryTradesSectionProps) {
  return (
    <Paper sx={{ p: 3, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Treasury Trades</Typography>
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
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
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