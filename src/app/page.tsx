import { Header } from '@/components/layout'
import { 
  MarketHeader, 
  PriceDisplay, 
  ChartWrapper, 
  TradeForm, 
  OrderBook, 
  OtherMarkets 
} from '@/components/market'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Market info and chart */}
          <div className="lg:col-span-2 space-y-4">
            <MarketHeader />
            <PriceDisplay />
            <ChartWrapper />
            <OrderBook />
          </div>

          {/* Right column - Trade form and other markets */}
          <div className="space-y-4">
            <TradeForm />
            <OtherMarkets />
          </div>
        </div>
      </main>
    </div>
  )
}
