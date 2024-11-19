import { useState } from 'react'
import type { Trade } from '@/types/supabase'

export function useTradeModals() {
  const [openNewTrade, setOpenNewTrade] = useState(false)
  const [openCloseTrade, setOpenCloseTrade] = useState(false)
  const [tradeToClose, setTradeToClose] = useState<Trade | null>(null)

  const handleOpenNewTrade = () => setOpenNewTrade(true)
  const handleCloseNewTrade = () => setOpenNewTrade(false)
  
  const handleOpenCloseTrade = (trade: Trade) => {
    setTradeToClose(trade)
    setOpenCloseTrade(true)
  }
  
  const handleCloseTradeModal = () => {
    setOpenCloseTrade(false)
    setTradeToClose(null)
  }

  return {
    openNewTrade,
    openCloseTrade,
    tradeToClose,
    handleOpenNewTrade,
    handleCloseNewTrade,
    handleOpenCloseTrade,
    handleCloseTradeModal
  }
}