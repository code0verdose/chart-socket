'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createChart, LineSeries, LineStyle, LineType } from 'lightweight-charts'
import type { IChartApi, ISeriesApi, LineData, Time } from 'lightweight-charts'
import type { PriceData } from '@/types/chart'

interface PriceChartProps {
  data: PriceData[]
}

export function PriceChart({ data }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const lastDataLengthRef = useRef<number>(0)
  const isInitializedRef = useRef<boolean>(false)
  const [dotPosition, setDotPosition] = useState<{ x: number; y: number } | null>(null)

  const initChart = useCallback(() => {
    if (!containerRef.current || chartRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#6b7280',
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: {
          color: 'rgba(107, 114, 128, 0.15)',
          style: LineStyle.Dashed,
        },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: 'rgba(156, 163, 175, 0.3)',
          width: 1,
          style: LineStyle.Dashed,
          labelVisible: false,
        },
        horzLine: {
          color: 'rgba(156, 163, 175, 0.3)',
          width: 1,
          style: LineStyle.Dashed,
          labelVisible: true,
        },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.3,
          bottom: 0.3,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: true,
        rightOffset: 5,
        tickMarkFormatter: (time: Time) => {
          const date = new Date((time as number) * 1000)
          return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
        },
      },
      handleScale: false,
      handleScroll: false,
    })

    // Main price line - curved for smooth appearance
    const lineSeries = chart.addSeries(LineSeries, {
      color: '#a855f7',
      lineWidth: 2,
      lineType: LineType.Curved,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    chartRef.current = chart
    seriesRef.current = lineSeries

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Initialize chart
  useEffect(() => {
    const cleanup = initChart()
    return () => {
      cleanup?.()
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
      }
      isInitializedRef.current = false
      lastDataLengthRef.current = 0
    }
  }, [initChart])

  // Update data - use update() for incremental changes
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || data.length === 0) return

    const lastPoint = data[data.length - 1]
    
    // Initial load or significant data change - use setData
    if (!isInitializedRef.current || data.length < lastDataLengthRef.current) {
      const uniqueData = data.reduce<PriceData[]>((acc, curr) => {
        const existingIndex = acc.findIndex(item => item.time === curr.time)
        if (existingIndex >= 0) {
          acc[existingIndex] = curr
        } else {
          acc.push(curr)
        }
        return acc
      }, [])

      uniqueData.sort((a, b) => a.time - b.time)

      const chartData: LineData<Time>[] = uniqueData.map(d => ({
        time: d.time as Time,
        value: d.value,
      }))

      seriesRef.current.setData(chartData)
      isInitializedRef.current = true
    } else {
      // Incremental update - just update the last point
      seriesRef.current.update({
        time: lastPoint.time as Time,
        value: lastPoint.value,
      })
    }

    lastDataLengthRef.current = data.length

    // Update dot position
    if (lastPoint) {
      const timeScale = chartRef.current.timeScale()
      const x = timeScale.timeToCoordinate(lastPoint.time as Time)
      const y = seriesRef.current.priceToCoordinate(lastPoint.value)
      
      if (x !== null && y !== null) {
        setDotPosition({ x, y })
      }
    }

    chartRef.current.timeScale().scrollToRealTime()
  }, [data])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      
      {/* Animated pulsing dot at the end of the line */}
      {dotPosition && (
        <div
          className="absolute pointer-events-none w-6 h-6 transition-all duration-100 ease-linear"
          style={{
            left: `${dotPosition.x}px`,
            top: `${dotPosition.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
          {/* Middle glow */}
          <div className="absolute inset-1 rounded-full bg-purple-500/50 animate-pulse" />
          {/* Inner solid dot */}
          <div className="absolute inset-1.5 rounded-full bg-purple-500 border-2 border-purple-300 shadow-lg shadow-purple-500/50" />
        </div>
      )}
    </div>
  )
}
