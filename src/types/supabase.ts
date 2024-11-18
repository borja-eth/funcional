export interface Trade {
  id: number
  type: 'Buy' | 'Sell'
  entryDate: Date
  entryPrice: number
  amount: number
  realizedPnL: {
    value: number
    unit: 'USD' | 'BTC'
  } | null
  unrealizedPnL: {
    value: number
    unit: 'USD' | 'BTC'
  } | null
  status: 'Open' | 'Closed'
  cashValue?: number
}

export interface TradeForm {
  type: 'Buy' | 'Sell'
  price: string
  amount: string
}

export interface CloseTradeForm {
  closePrice: string
  closeAmount: string
} 