'use client'

import { usePriceStream } from '@/hooks/use-price-stream'
import { PriceChart } from './price-chart'

export function ChartContainer() {
  const { priceHistory } = usePriceStream()

  return (
    <div className="h-full w-full">
      <PriceChart data={priceHistory} />
    </div>
  )
}
