import type { Trade } from '@/types/supabase'

export const calculateCumulativePnL = (trades: Trade[]) => {
  let totalUnrealizedBTC = 0
  let totalUnrealizedUSD = 0
  let totalRealizedBTC = 0
  let totalRealizedUSD = 0

  trades.forEach(trade => {
    if (trade.unrealizedPnL && trade.status === 'Open') {
      if (trade.unrealizedPnL.unit === 'BTC') {
        totalUnrealizedBTC += trade.unrealizedPnL.value
      } else {
        totalUnrealizedUSD += trade.unrealizedPnL.value
      }
    }

    if (trade.realizedPnL) {
      if (trade.realizedPnL.unit === 'BTC') {
        totalRealizedBTC += trade.realizedPnL.value
      } else {
        totalRealizedUSD += trade.realizedPnL.value
      }
    }
  })

  return {
    unrealized: {
      btc: totalUnrealizedBTC || 0,
      usd: totalUnrealizedUSD || 0
    },
    realized: {
      btc: totalRealizedBTC || 0,
      usd: totalRealizedUSD || 0
    }
  }
}