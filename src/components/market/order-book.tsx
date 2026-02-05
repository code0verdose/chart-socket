'use client'

import { useState } from 'react'
import clsx from 'clsx'

export function OrderBook() {
  const [tab, setTab] = useState<'up' | 'down'>('up')

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h3 className="text-white font-medium">Order Book</h3>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>$56.1k Vol.</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 px-4 py-2 border-b border-slate-800">
        <button
          onClick={() => setTab('up')}
          className={clsx(
            'font-medium',
            tab === 'up' ? 'text-white' : 'text-gray-500'
          )}
        >
          Trade Up
        </button>
        <button
          onClick={() => setTab('down')}
          className={clsx(
            'font-medium',
            tab === 'down' ? 'text-white' : 'text-gray-500'
          )}
        >
          Trade Down
        </button>

        <div className="ml-auto flex items-center gap-4">
          <span className="text-emerald-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Maker Rebate
          </span>
          <span className="text-gray-500 text-sm">↻ 0.1¢</span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-4 px-4 py-2 text-xs text-gray-500 uppercase">
        <div className="flex items-center gap-1">
          Trade Up
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
        <div className="text-center">Price</div>
        <div className="text-center">Shares</div>
        <div className="text-right">Total</div>
      </div>

      {/* No asks */}
      <div className="px-4 py-4 text-center text-gray-500 text-sm border-b border-slate-800">
        No asks
      </div>

      {/* Spread */}
      <div className="flex items-center justify-between px-4 py-2 text-sm border-b border-slate-800">
        <span className="text-gray-500">Last: 65.0¢</span>
        <span className="text-gray-500">Spread: 0.0¢</span>
      </div>

      {/* No bids */}
      <div className="px-4 py-4 text-center text-gray-500 text-sm">
        No bids
      </div>
    </div>
  )
}
