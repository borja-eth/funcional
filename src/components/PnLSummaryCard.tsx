import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

interface PnLSummaryCardProps {
  title: string
  btcValue: number
  usdValue: number
}

export default function PnLSummaryCard({ title, btcValue, usdValue }: PnLSummaryCardProps) {
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
            {btcValue >= 0 ? (
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
            )}
            <Typography
              variant="h5"
              color={btcValue >= 0 ? 'success.main' : 'error.main'}
            >
              {btcValue >= 0 ? '+' : ''}{btcValue.toFixed(8)} BTC
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {usdValue >= 0 ? (
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
            )}
            <Typography
              variant="h5"
              color={usdValue >= 0 ? 'success.main' : 'error.main'}
            >
              {usdValue >= 0 ? '+' : ''}${Math.abs(usdValue).toLocaleString(undefined, {
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