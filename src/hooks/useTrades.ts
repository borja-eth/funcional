import { useState, useEffect } from 'react'
import { tradeService } from '@/services/tradeService'
import type { Trade, TradeForm, CloseTradeForm } from '@/types/supabase'
import useBitcoinPrice from './useBitcoinPrice'

export default function useTrades() {
  const { currentPrice } = useBitcoinPrice()
  const [trades, setTrades] = useState<Trade[]>([])
  const [cumulativePnL, setCumulativePnL] = useState({
    realized: { btc: 0, usd: 0 },
    unrealized: { btc: 0, usd: 0 }
  })

  useEffect(() => {
    fetchTrades()
  }, [])

  useEffect(() => {
    if (trades.length > 0) {
      calculatePnL(trades)
    }
  }, [currentPrice, trades])

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
    const cumulativePnL = {
      realized: { btc: 0, usd: 0 },
      unrealized: { btc: 0, usd: 0 }
    }

    trades.forEach(trade => {
      if (trade.status === 'Open') {
        // Calcular P&L no realizado para operaciones abiertas
        const currentValue = trade.amount * currentPrice
        const entryValue = trade.amount * trade.entryPrice
        const unrealizedPnL = trade.type === 'Buy' 
          ? currentValue - entryValue 
          : entryValue - currentValue

        trade.unrealizedPnL = {
          value: unrealizedPnL,
          unit: 'USD'
        }

        cumulativePnL.unrealized.usd += unrealizedPnL
        cumulativePnL.unrealized.btc += trade.amount
      } else if (trade.realizedPnL) {
        // Acumular P&L realizado para operaciones cerradas
        cumulativePnL.realized.usd += trade.realizedPnL.value
        cumulativePnL.realized.btc += trade.amount
      }
    })

    setCumulativePnL(cumulativePnL)
    return trades
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
        unrealizedPnL: {
          value: 0,
          unit: 'USD'
        },
        status: 'Open'
      }
      
      await tradeService.createTrade(newTrade)
      const updatedTrades = [...trades, newTrade]
      calculatePnL(updatedTrades)
      setTrades(updatedTrades)
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
      // Since deleteTrade doesn't exist on tradeService, we'll need to handle deletion differently
      // This is a placeholder - you'll need to implement the actual delete functionality in tradeService
      console.warn('Delete trade functionality not implemented')
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