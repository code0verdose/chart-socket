'use client'

import { usePriceStream } from '@/hooks/use-price-stream'
import { PriceChart } from './price-chart'
import { PriceHeader } from './price-header'
import { ChartControls } from './chart-controls'
import { ConnectionStatus } from './connection-status'

export function ChartContainer() {
  const { priceHistory, tickerInfo, isConnected } = usePriceStream()

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950">
      {/* Header */}
      <PriceHeader tickerInfo={tickerInfo} />

      {/* Chart Area */}
      <div className="flex-1 relative min-h-0">
        <PriceChart data={priceHistory} />

        {/* Connection Status */}
        <ConnectionStatus isConnected={isConnected} />
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800/50">
        <ChartControls />
        <div className="text-xs text-gray-500">
          Live Price Feed • {priceHistory.length} data points
        </div>
      </div>
    </div>
  )
}
