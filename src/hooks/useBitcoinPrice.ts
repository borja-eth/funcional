import { useState, useEffect } from 'react'

export default function useBitcoinPrice() {
  const [currentPrice, setCurrentPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
        const data = await response.json()
        setCurrentPrice(data.bitcoin.usd)
        setPriceChange(data.bitcoin.usd_24h_change)
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return { currentPrice, priceChange }
} 