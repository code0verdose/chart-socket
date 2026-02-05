'use client'

import { useState } from 'react'
import clsx from 'clsx'

export function TradeForm() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [direction, setDirection] = useState<'up' | 'down'>('up')

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
      {/* Buy/Sell tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setMode('buy')}
            className={clsx(
              'font-medium',
              mode === 'buy' ? 'text-white' : 'text-gray-500'
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setMode('sell')}
            className={clsx(
              'font-medium',
              mode === 'sell' ? 'text-white' : 'text-gray-500'
            )}
          >
            Sell
          </button>
        </div>
        <button className="flex items-center gap-1 text-gray-400 text-sm">
          Market
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Up/Down buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setDirection('up')}
          className={clsx(
            'flex-1 py-3 rounded-lg font-medium transition-colors',
            direction === 'up'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-gray-400'
          )}
        >
          Up 0¢
        </button>
        <button
          onClick={() => setDirection('down')}
          className={clsx(
            'flex-1 py-3 rounded-lg font-medium transition-colors',
            direction === 'down'
              ? 'bg-slate-600 text-white'
              : 'bg-slate-800 text-gray-400'
          )}
        >
          Down 0¢
        </button>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-gray-400 text-sm mb-2">Amount</div>
        <div className="text-right text-3xl font-bold text-white mb-3">$0</div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 text-sm">+$1</button>
          <button className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 text-sm">+$20</button>
          <button className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 text-sm">+$100</button>
          <button className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 text-sm">Max</button>
        </div>
      </div>

      {/* Trade button */}
      <button className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium mb-4">
        Trade
      </button>

      {/* Terms */}
      <p className="text-center text-gray-500 text-xs">
        By trading, you agree to the <span className="text-blue-400 underline">Terms of Use</span>.
      </p>
    </div>
  )
}
