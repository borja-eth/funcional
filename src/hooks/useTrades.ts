import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Trade } from '@/types/supabase'
import { TradeService } from '@/services/TradeService'

export const useTrades = (currentBtcPrice: number) => {
  const [trades, setTrades] = useState<Trade[]>([])
  const tradeService = new TradeService()

  useEffect(() => {
    fetchTrades()
  }, [])

  useEffect(() => {
    if (currentBtcPrice <= 0) return

    setTrades(prevTrades => 
      prevTrades.map(trade => {
        if (trade.status === 'Open') {
          return {
            ...trade,
            unrealizedPnL: tradeService.calculateUnrealizedPnL(trade, currentBtcPrice)
          }
        }
        return trade
      })
    )
  }, [currentBtcPrice])

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('entry_date', { ascending: false })

      if (error) throw error

      const formattedTrades = data.map(trade => ({
        id: trade.id,
        type: trade.type as 'Buy' | 'Sell',
        entryDate: new Date(trade.entry_date),
        entryPrice: Number(trade.entry_price),
        amount: Number(trade.amount),
        realizedPnL: trade.realized_pnl,
        unrealizedPnL: trade.unrealized_pnl,
        status: trade.status as 'Open' | 'Closed',
        cashValue: trade.cash_value ? Number(trade.cash_value) : undefined,
      }))

      setTrades(formattedTrades)
    } catch (error) {
      console.error('Error fetching trades:', error)
    }
  }

  return { trades, setTrades }
} 