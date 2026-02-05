import clsx from 'clsx'
import type { TickerInfo } from '@/types/chart'

interface PriceHeaderProps {
  tickerInfo: TickerInfo | null
}

export function PriceHeader({ tickerInfo }: PriceHeaderProps) {
  if (!tickerInfo) {
    return (
      <div className="flex items-center gap-8 px-6 py-4">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
          <div className="h-8 w-20 bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  const { priceToBeat, finalPrice, priceDiff, isUp } = tickerInfo

  return (
    <div className="flex items-center gap-8 px-6 py-4">
      {/* Price to Beat */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Price to Beat
        </span>
        <span className="text-2xl font-bold text-white">
          ${priceToBeat.toFixed(2)}
        </span>
      </div>

      {/* Divider */}
      <div className="h-12 w-px bg-gray-700" />

      {/* Final Price */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Final Price
          </span>
          <span
            className={clsx(
              'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded',
              isUp ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            <svg
              className={clsx('h-3 w-3', isUp ? 'rotate-180' : '')}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            ${Math.abs(priceDiff).toFixed(2)}
          </span>
        </div>
        <span className="text-2xl font-bold text-white">
          ${finalPrice.toFixed(2)}
        </span>
      </div>

    </div>
  )
}
