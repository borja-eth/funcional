import { supabase } from '@/lib/supabase'
import type { Trade, TradeForm, CloseTradeForm } from '@/types/supabase'

export class TradeService {
  calculateUnrealizedPnL(trade: Trade, currentPrice: number) {
    if (trade.type === 'Buy') {
      const pnlValue = (currentPrice - trade.entryPrice) * trade.amount
      return {
        value: pnlValue,
        unit: 'USD' as const
      }
    } else {
      const btcValue = trade.amount * ((trade.entryPrice - currentPrice) / currentPrice)
      return {
        value: btcValue,
        unit: 'BTC' as const
      }
    }
  }

  calculateRealizedPnL(trade: Trade, closePrice: number, closeAmount: number) {
    if (trade.type === 'Buy') {
      const pnlValue = (closePrice - trade.entryPrice) * closeAmount
      return {
        value: pnlValue,
        unit: 'USD' as const
      }
    } else {
      const btcValue = closeAmount * ((trade.entryPrice - closePrice) / closePrice)
      return {
        value: btcValue,
        unit: 'BTC' as const
      }
    }
  }

  async createTrade(formData: TradeForm, currentBtcPrice: number): Promise<Trade> {
    const newTrade: Trade = {
      id: Date.now(),
      type: formData.type,
      entryDate: new Date(),
      entryPrice: Number(formData.price),
      amount: Number(formData.amount),
      realizedPnL: null,
      unrealizedPnL: null,
      status: 'Open',
      cashValue: formData.type === 'Sell' ? Number(formData.price) * Number(formData.amount) : undefined
    }

    if (currentBtcPrice > 0) {
      newTrade.unrealizedPnL = this.calculateUnrealizedPnL(newTrade, currentBtcPrice)
    }

    const { error } = await supabase
      .from('trades')
      .insert({
        id: newTrade.id,
        type: newTrade.type,
        entry_date: newTrade.entryDate.toISOString(),
        entry_price: newTrade.entryPrice,
        amount: newTrade.amount,
        realized_pnl: newTrade.realizedPnL,
        unrealized_pnl: newTrade.unrealizedPnL,
        status: newTrade.status,
        cash_value: newTrade.cashValue,
      })

    if (error) throw error
    return newTrade
  }

  async closeTrade(trade: Trade, formData: CloseTradeForm): Promise<Trade[]> {
    const closePrice = Number(formData.closePrice)
    const closeAmount = Number(formData.closeAmount)

    const realizedPnL = this.calculateRealizedPnL(trade, closePrice, closeAmount)
    const remainingAmount = trade.amount - closeAmount

    // Actualizar el trade existente
    const updatedTrade: Trade = {
      ...trade,
      amount: remainingAmount,
      realizedPnL: realizedPnL,
      status: remainingAmount <= 0 ? 'Closed' : 'Open'
    }

    const { error } = await supabase
      .from('trades')
      .update({
        amount: updatedTrade.amount,
        realized_pnl: updatedTrade.realizedPnL,
        status: updatedTrade.status
      })
      .eq('id', trade.id)

    if (error) throw error

    // Obtener todos los trades actualizados
    const { data: updatedTrades, error: fetchError } = await supabase
      .from('trades')
      .select('*')
      .order('entry_date', { ascending: false })

    if (fetchError) throw fetchError

    return updatedTrades.map(trade => ({
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
  }
} 