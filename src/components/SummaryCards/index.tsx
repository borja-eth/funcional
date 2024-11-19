import { Grid } from '@mui/material'
import BitcoinPriceCard from '@/components/BitcoinPriceCard'
import PnLSummaryCard from '@/components/PnLSummaryCard'

interface SummaryCardsProps {
  currentPrice: number
  priceChange: number
  cumulativePnL: {
    unrealized: { btc: number; usd: number }
    realized: { btc: number; usd: number }
  }
}

export function SummaryCards({ currentPrice, priceChange, cumulativePnL }: SummaryCardsProps) {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <BitcoinPriceCard price={currentPrice} priceChange={priceChange} />
      </Grid>
      <Grid item xs={12} md={4}>
        <PnLSummaryCard
          title="Unrealized P&L"
          btcValue={cumulativePnL.unrealized.btc}
          usdValue={cumulativePnL.unrealized.usd}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <PnLSummaryCard
          title="Realized P&L"
          btcValue={cumulativePnL.realized.btc}
          usdValue={cumulativePnL.realized.usd}
        />
      </Grid>
    </Grid>
  )
} 