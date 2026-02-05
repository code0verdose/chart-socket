'use client'

import { ChartContainer } from '@/components/chart'

export function ChartWrapper() {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
      {/* Target badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1 bg-slate-700 text-white px-3 py-1 rounded text-sm">
          Target
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[280px] relative">
        <ChartContainer />
      </div>

      {/* Time controls */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-800">
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 text-sm">
          Past
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="w-3 h-3 rounded-full bg-red-500" />
        </div>

        <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 text-sm">2:15 PM</button>
        <button className="px-3 py-1.5 rounded-full bg-slate-700 text-white text-sm flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          2:30 PM
        </button>
        <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 text-sm">2:45 PM</button>
        <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 text-sm">3 PM</button>
        <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 text-sm flex items-center gap-1">
          More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button className="p-2 rounded-lg bg-slate-800 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg bg-orange-500 text-white">
            <span className="font-bold">₿</span>
          </button>
        </div>
      </div>
    </div>
  )
}
