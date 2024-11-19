import { useState, useEffect } from 'react'

export const useBitcoinPrice = () => {
  const [currentBtcPrice, setCurrentBtcPrice] = useState(0)
  const [priceChange, setPriceChange] = useState<number | null>(null)

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
        const data = await response.json()
        
        setCurrentBtcPrice(data.bitcoin.usd)
        setPriceChange(data.bitcoin.usd_24h_change || null)
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error)
        setPriceChange(null)
      }
    }

    fetchBitcoinPrice()
    const interval = setInterval(fetchBitcoinPrice, 60000)

    return () => clearInterval(interval)
  }, [])

  return { currentBtcPrice, priceChange }
} 