import { NewTradeDialog } from '@/components/NewTradeDialog'
import CloseTradeModal from '@/components/CloseTradeModal'
import type { Trade, TradeForm } from '@/types/supabase'

interface TradeModalsProps {
  openNewTrade: boolean
  openCloseTrade: boolean
  tradeToClose: Trade | null
  currentBtcPrice: number
  onNewTradeClose: () => void
  onCloseTradeClose: () => void
  onNewTradeSubmit: (data: TradeForm) => Promise<void>
  onCloseTradeSubmit: (data: { closePrice: string; closeAmount: string }) => Promise<void>
}

export function TradeModals({
  openNewTrade,
  openCloseTrade,
  tradeToClose,
  currentBtcPrice,
  onNewTradeClose,
  onCloseTradeClose,
  onNewTradeSubmit,
  onCloseTradeSubmit
}: TradeModalsProps) {
  return (
    <>
      <NewTradeDialog 
        open={openNewTrade}
        onClose={onNewTradeClose}
        onSubmit={onNewTradeSubmit}
        currentBtcPrice={currentBtcPrice}
      />

      <CloseTradeModal
        open={openCloseTrade}
        trade={tradeToClose}
        onClose={onCloseTradeClose}
        onSubmit={onCloseTradeSubmit}
        currentBtcPrice={currentBtcPrice}
      />
    </>
  )
} 