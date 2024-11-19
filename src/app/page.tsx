'use client'

import { Box, Grid } from '@mui/material'

// Hooks personalizados
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice'
import { useTradeColumns } from '@/hooks/useTradeColumns'
import { useTradeManagement } from '@/hooks/useTradeManagement'

// Componentes
import PnLSummaryCard from '@/components/PnLSummaryCard'
import CloseTradeModal from '@/components/CloseTradeModal'
import BitcoinPriceCard from '@/components/BitcoinPriceCard'
import NewTradeDialog from '@/components/NewTradeDialog'
import TreasuryTradesSection from '@/components/TreasuryTradesSection'

// Utilidades
import { calculateCumulativePnL } from '@/utils/pnlCalculator'

export default function Dashboard() {
  const { currentBtcPrice, priceChange } = useBitcoinPrice()
  const {
    trades,
    openNewTrade,
    openCloseTrade,
    tradeToClose,
    setOpenNewTrade,
    setOpenCloseTrade,
    setTradeToClose,
    handleNewTrade,
    handleCloseTrade,
    handleDeleteTrade
  } = useTradeManagement(currentBtcPrice)

  const columns = useTradeColumns({
    onDeleteTrade: handleDeleteTrade,
    onCloseTrade: (trade) => {
      setTradeToClose(trade)
      setOpenCloseTrade(true)
    }
  })

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

      <TreasuryTradesSection
        trades={trades}
        columns={columns}
        openNewTrade={openNewTrade}
        setOpenNewTrade={setOpenNewTrade}
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
    </Box>
  )
}