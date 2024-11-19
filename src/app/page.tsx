'use client'
import { TradeTable } from '@/components/TradeTable/TradeTable'
import useTrades from '@/hooks/useTrades'
import useBitcoinPrice from '@/hooks/useBitcoinPrice'
import { SummaryCards } from '@/components/SummaryCards'
import { TradeModals } from '@/components/TradeModals'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useTradeModals } from '@/hooks/useTradeModals'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { trades, handleNewTrade, handleCloseTrade, handleDeleteTrade, cumulativePnL, setTradeToClose } = useTrades()
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

  useEffect(() => {
    setTradeToClose(tradeToClose)
  }, [tradeToClose, setTradeToClose])

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

