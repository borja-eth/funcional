'use client'

import { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { TradeTable } from '@/components/TradeTable/TradeTable'
import { NewTradeDialog } from '@/components/NewTradeDialog'
import CloseTradeModal from '@/components/CloseTradeModal'
import BitcoinPriceCard from '@/components/BitcoinPriceCard'
import PnLSummaryCard from '@/components/PnLSummaryCard'
import useTrades from '@/hooks/useTrades'
import useBitcoinPrice from '@/hooks/useBitcoinPrice'
import type { Trade } from '@/types/supabase'
import { SummaryCards } from '@/components/SummaryCards'
import { TradeModals } from '@/components/TradeModals'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useTradeModals } from '@/hooks/useTradeModals'

export default function Dashboard() {
  const { trades, handleNewTrade, handleCloseTrade, handleDeleteTrade, cumulativePnL } = useTrades()
  const { currentPrice, priceChange } = useBitcoinPrice()
  const {
    openNewTrade,
    openCloseTrade,
    tradeToClose,
    handleOpenNewTrade,
    handleCloseNewTrade,
    handleOpenCloseTrade,
    handleCloseTradeModal
  } = useTradeModals()

  return (
    <DashboardLayout>
      <SummaryCards 
        currentPrice={currentPrice}
        priceChange={priceChange}
        cumulativePnL={cumulativePnL}
      />

      <TradeTable
        trades={trades}
        onNewTrade={handleOpenNewTrade}
        onDeleteTrade={handleDeleteTrade}
        onCloseTrade={handleOpenCloseTrade}
      />

      <TradeModals 
        openNewTrade={openNewTrade}
        openCloseTrade={openCloseTrade}
        tradeToClose={tradeToClose}
        currentBtcPrice={currentPrice}
        onNewTradeClose={handleCloseNewTrade}
        onCloseTradeClose={handleCloseTradeModal}
        onNewTradeSubmit={handleNewTrade}
        onCloseTradeSubmit={handleCloseTrade}
      />
    </DashboardLayout>
  )
}

