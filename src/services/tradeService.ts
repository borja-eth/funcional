import { supabase } from '@/lib/supabase'
import type { Trade } from '@/types/supabase'

export const tradeService = {
  fetchTrades: async () => {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('entry_date', { ascending: false })

    if (error) throw error

    return data.map(trade => ({
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
  },

  createTrade: async (trade: Trade) => {
    const { error } = await supabase
      .from('trades')
      .insert({
        id: trade.id,
        type: trade.type,
        entry_date: trade.entryDate.toISOString(),
        entry_price: trade.entryPrice,
        amount: trade.amount,
        realized_pnl: trade.realizedPnL,
        unrealized_pnl: trade.unrealizedPnL,
        status: trade.status,
        cash_value: trade.cashValue,
      })

    if (error) throw error
    return trade
  },

  deleteTrade: async (id: number) => {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 