import { useState } from 'react'
import { Trade, TradeForm, CloseTradeForm } from '@/types/supabase'
import { TradeService } from '@/services/TradeService'
import { useTrades } from './useTrades'

export const useTradeManagement = (currentBtcPrice: number) => {
  const [openNewTrade, setOpenNewTrade] = useState(false)
  const [openCloseTrade, setOpenCloseTrade] = useState(false)
  const [tradeToClose, setTradeToClose] = useState<Trade | null>(null)
  const { trades, setTrades } = useTrades(currentBtcPrice)
  const tradeService = new TradeService()

  const handleNewTrade = async (formData: TradeForm) => {
    try {
      const newTrade = await tradeService.createTrade(formData, currentBtcPrice)
      setTrades(prevTrades => [...prevTrades, newTrade])
      setOpenNewTrade(false)
    } catch (error) {
      console.error('Error creating trade:', error)
    }
  }

  const handleCloseTrade = async (data: CloseTradeForm) => {
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

  const handleDeleteTrade = (tradeId: number) => {
    setTrades(prevTrades => prevTrades.filter(trade => trade.id !== tradeId))
  }

  return {
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
  }
} 