import { useState, useEffect, useCallback } from 'react'
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
  const [tradeToClose, setTradeToClose] = useState<Trade | null>(null)

  const calculatePnL = useCallback((trades: Trade[]) => {
    const cumulativePnL = {
      realized: { btc: 0, usd: 0 },
      unrealized: { btc: 0, usd: 0 }
    }

    trades.forEach(trade => {
      if (trade.status === 'Open') {
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
        cumulativePnL.realized.usd += trade.realizedPnL.value
        cumulativePnL.realized.btc += trade.amount
      }
    })

    setCumulativePnL(cumulativePnL)
    return trades
  }, [currentPrice])

  const fetchTrades = useCallback(async () => {
    try {
      const fetchedTrades = await tradeService.fetchTrades()
      setTrades(fetchedTrades)
      calculatePnL(fetchedTrades)
    } catch (error) {
      console.error('Error fetching trades:', error)
    }
  }, [calculatePnL])

  useEffect(() => {
    fetchTrades()
  }, [fetchTrades])

  useEffect(() => {
    if (trades.length > 0) {
      calculatePnL(trades)
    }
  }, [currentPrice, trades, calculatePnL])

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
    try {
      if (!tradeToClose) return

      const closePrice = Number(data.closePrice)
      const closeAmount = Number(data.closeAmount)
      const entryValue = closeAmount * tradeToClose.entryPrice
      const closeValue = closeAmount * closePrice
      
      const realizedPnL = tradeToClose.type === 'Buy' 
        ? closeValue - entryValue 
        : entryValue - closeValue

      const updatedTrade: Trade = {
        ...tradeToClose,
        status: 'Closed',
        amount: closeAmount,
        realizedPnL: {
          value: realizedPnL,
          unit: 'USD' as const
        },
        unrealizedPnL: null
      }

      await tradeService.updateTrade(updatedTrade.id, updatedTrade)
      await fetchTrades()
      setTradeToClose(null)
    } catch (error) {
      console.error('Error closing trade:', error)
    }
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
    cumulativePnL,
    setTradeToClose
  }
}