'use client'

import { useState } from 'react'
import { Box, Button, Typography, Grid, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid } from '@mui/x-data-grid'

// Hooks personalizados
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice'
import { useTrades } from '@/hooks/useTrades'
import { useTradeColumns } from '@/hooks/useTradeColumns'

// Componentes
import PnLSummaryCard from '@/components/PnLSummaryCard'
import CloseTradeModal from '@/components/CloseTradeModal'
import BitcoinPriceCard from '@/components/BitcoinPriceCard'
import NewTradeDialog from '@/components/NewTradeDialog'

// Servicios y utilidades
import { TradeService } from '@/services/TradeService'
import { calculateCumulativePnL } from '@/utils/pnlCalculator'
import { Trade, TradeForm } from '@/types/supabase'

export default function Dashboard() {
  const [openNewTrade, setOpenNewTrade] = useState(false)
  const [openCloseTrade, setOpenCloseTrade] = useState(false)
  const [tradeToClose, setTradeToClose] = useState<Trade | null>(null)

  const { currentBtcPrice, priceChange } = useBitcoinPrice()
  const { trades, setTrades } = useTrades(currentBtcPrice)
  const tradeService = new TradeService()
  
  const columns = useTradeColumns({
    onDeleteTrade: (tradeId) => {
      setTrades(prevTrades => prevTrades.filter(trade => trade.id !== tradeId))
    },
    onCloseTrade: (trade) => {
      setTradeToClose(trade)
      setOpenCloseTrade(true)
    }
  })

  const handleNewTrade = async (formData: TradeForm) => {
    try {
      const newTrade = await tradeService.createTrade(formData, currentBtcPrice)
      setTrades(prevTrades => [...prevTrades, newTrade])
      setOpenNewTrade(false)
    } catch (error) {
      console.error('Error creating trade:', error)
    }
  }

  const handleCloseTrade = async (data: any) => {
    if (!tradeToClose) return
    try {
      const updatedTrades = await tradeService.closeTrade(tradeToClose, data, currentBtcPrice)
      setTrades(updatedTrades)
      setOpenCloseTrade(false)
      setTradeToClose(null)
    } catch (error) {
      console.error('Error closing trade:', error)
    }
  }

  const cumulativePnL = calculateCumulativePnL(trades)

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
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

        <NewTradeDialog 
          open={openNewTrade}
          onClose={() => setOpenNewTrade(false)}
          onSubmit={handleNewTrade}
          currentBtcPrice={currentBtcPrice}
        />

        <CloseTradeModal
          open={openCloseTrade}
          trade={tradeToClose}
          onClose={() => {
            setOpenCloseTrade(false)
            setTradeToClose(null)
          }}
          onSubmit={handleCloseTrade}
          currentBtcPrice={currentBtcPrice}
        />
      </Paper>
    </Box>
  )
}

