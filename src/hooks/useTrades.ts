import { useState, useEffect } from 'react'
import { tradeService } from '@/services/tradeService'
import type { Trade, TradeForm, CloseTradeForm } from '@/types/supabase'

export default function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [cumulativePnL, setCumulativePnL] = useState({
    realized: { btc: 0, usd: 0 },
    unrealized: { btc: 0, usd: 0 }
  })

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    try {
      const fetchedTrades = await tradeService.fetchTrades()
      setTrades(fetchedTrades)
      calculatePnL(fetchedTrades)
    } catch (error) {
      console.error('Error fetching trades:', error)
    }
  }

  const calculatePnL = (trades: Trade[]) => {
    const pnl = trades.reduce((acc, trade) => {
      if (trade.realizedPnL && trade.realizedPnL.unit === 'BTC') {
        acc.realized.btc += trade.realizedPnL.value
      } else if (trade.realizedPnL && trade.realizedPnL.unit === 'USD') {
        acc.realized.usd += trade.realizedPnL.value
      }

      if (trade.unrealizedPnL && trade.unrealizedPnL.unit === 'BTC') {
        acc.unrealized.btc += trade.unrealizedPnL.value
      } else if (trade.unrealizedPnL && trade.unrealizedPnL.unit === 'USD') {
        acc.unrealized.usd += trade.unrealizedPnL.value
      }

      return acc
    }, {
      realized: { btc: 0, usd: 0 },
      unrealized: { btc: 0, usd: 0 }
    })

    setCumulativePnL(pnl)
  }

  const handleNewTrade = async (data: TradeForm) => {
    try {
      const newTrade: Trade = {
        id: Date.now(),
        type: data.type,
        entryDate: new Date(),
        entryPrice: Number(data.price),
        amount: Number(data.amount),
        realizedPnL: null,
        unrealizedPnL: null,
        status: 'Open'
      }
      
      await tradeService.createTrade(newTrade)
      await fetchTrades()
    } catch (error) {
      console.error('Error creating trade:', error)
    }
  }

  const handleCloseTrade = async (data: CloseTradeForm) => {
    // Implementation for closing trade
    console.log('Closing trade with data:', data)
  }

  const handleDeleteTrade = async (id: number) => {
    try {
      await tradeService.deleteTrade(id)
      await fetchTrades()
    } catch (error) {
      console.error('Error deleting trade:', error)
    }
  }

  return {
    trades,
    handleNewTrade,
    handleCloseTrade,
    handleDeleteTrade,
    cumulativePnL
  }
} 