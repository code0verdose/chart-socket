'use client'

import { useState } from 'react'
import clsx from 'clsx'

type ViewMode = 'chart' | 'list'

export function ChartControls() {
  const [viewMode, setViewMode] = useState<ViewMode>('chart')

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg">
      <button
        onClick={() => setViewMode('chart')}
        className={clsx(
          'flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200',
          viewMode === 'chart'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        )}
        aria-label="Chart view"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={clsx(
          'flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200',
          viewMode === 'list'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        )}
        aria-label="List view"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  )
}
