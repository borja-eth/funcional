import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

interface PnLSummaryCardProps {
  title: string
  btcValue: number | null
  usdValue: number | null
}

export default function PnLSummaryCard({ title, btcValue = 0, usdValue = 0 }: PnLSummaryCardProps) {
  const btc = btcValue ?? 0
  const usd = usdValue ?? 0

  return (
    <Card sx={{ 
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 2,
      height: '100%' 
    }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {btc >= 0 ? (
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
            )}
            <Typography
              variant="h5"
              color={btc >= 0 ? 'success.main' : 'error.main'}
            >
              {btc >= 0 ? '+' : ''}{btc.toFixed(8)} BTC
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {usd >= 0 ? (
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
            )}
            <Typography
              variant="h5"
              color={usd >= 0 ? 'success.main' : 'error.main'}
            >
              {usd >= 0 ? '+' : ''}${Math.abs(usd).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
} 