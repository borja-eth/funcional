'use client'

import { useState, useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { TradeTable } from '@/components/TradeTable/TradeTable'
import { NewTradeDialog } from '@/components/NewTradeDialog'
import CloseTradeModal from '@/components/CloseTradeModal'
import BitcoinPriceCard from '@/components/BitcoinPriceCard'
import PnLSummaryCard from '@/components/PnLSummaryCard'
import useTrades from '@/hooks/useTrades'
import useBitcoinPrice from '@/hooks/useBitcoinPrice'
import type { Trade } from '@/types/supabase'

export default function Dashboard() {
  const { 
    trades, 
    handleNewTrade, 
    handleCloseTrade, 
    handleDeleteTrade,
    cumulativePnL 
  } = useTrades()
  
  const { currentPrice, priceChange } = useBitcoinPrice()
  
  const [openNewTrade, setOpenNewTrade] = useState(false)
  const [openCloseTrade, setOpenCloseTrade] = useState(false)
  const [tradeToClose, setTradeToClose] = useState<Trade | null>(null)

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <BitcoinPriceCard price={currentPrice} priceChange={priceChange} />
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

      <TradeTable
        trades={trades}
        onNewTrade={() => setOpenNewTrade(true)}
        onDeleteTrade={handleDeleteTrade}
        onCloseTrade={(trade: Trade) => {
          setTradeToClose(trade as any)
          setOpenCloseTrade(true)
        }}
      />

      <NewTradeDialog 
        open={openNewTrade}
        onClose={() => setOpenNewTrade(false)}
        onSubmit={handleNewTrade}
        currentBtcPrice={currentPrice}
      />

      <CloseTradeModal
        open={openCloseTrade}
        trade={tradeToClose}
        onClose={() => {
          setOpenCloseTrade(false)
          setTradeToClose(null)
        }}
        onSubmit={handleCloseTrade}
        currentBtcPrice={currentPrice}
      />
    </Box>
  )
}

