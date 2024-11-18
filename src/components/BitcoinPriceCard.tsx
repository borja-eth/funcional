import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

interface BitcoinPriceCardProps {
  price: number
  priceChange?: number
}

export default function BitcoinPriceCard({ price, priceChange }: BitcoinPriceCardProps) {
  return (
    <Card sx={{ 
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 2,
      height: '100%' 
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <img 
            src="/bitcoin-logo.png" 
            alt="Bitcoin" 
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
          <Typography variant="h6" color="text.secondary">
            Bitcoin Price
          </Typography>
        </Box>

        <Typography variant="h4" component="div" gutterBottom>
          ${price.toLocaleString()}
        </Typography>

        {typeof priceChange === 'number' && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {priceChange >= 0 ? (
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
            )}
            <Typography
              variant="body2"
              color={priceChange >= 0 ? 'success.main' : 'error.main'}
            >
              {priceChange >= 0 ? '+' : ''}
              {priceChange.toFixed(2)}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}