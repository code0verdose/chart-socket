'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createChart, LineSeries, LineStyle, LineType } from 'lightweight-charts'
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts'
import type { PriceData } from '@/types/chart'

interface PriceChartProps {
  data: PriceData[]
}

// How many seconds of data to show on screen
const VISIBLE_RANGE_SECONDS = 30

export function PriceChart({ data }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const lastTimeRef = useRef<number>(0)
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
          top: 0.2,
          bottom: 0.2,
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

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#f59e0b',
      lineWidth: 2,
      lineType: LineType.Curved,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    chartRef.current = chart
    seriesRef.current = lineSeries

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

  useEffect(() => {
    const cleanup = initChart()
    return () => {
      cleanup?.()
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
      }
      lastTimeRef.current = 0
    }
  }, [initChart])

  // Update chart data
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || data.length === 0) return

    const lastPoint = data[data.length - 1]

    // Only update if time has changed
    if (lastPoint.time > lastTimeRef.current) {
      seriesRef.current.update({
        time: lastPoint.time as Time,
        value: lastPoint.value,
      })
      lastTimeRef.current = lastPoint.time
    }

    // Set visible range
    const timeScale = chartRef.current.timeScale()
    timeScale.setVisibleRange({
      from: (lastPoint.time - VISIBLE_RANGE_SECONDS) as Time,
      to: (lastPoint.time + 2) as Time,
    })

    // Update dot position
    const x = timeScale.timeToCoordinate(lastPoint.time as Time)
    const y = seriesRef.current.priceToCoordinate(lastPoint.value)
    
    if (x !== null && y !== null) {
      setDotPosition({ x, y })
    }
  }, [data])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      
      {dotPosition && (
        <div
          className="absolute pointer-events-none w-5 h-5"
          style={{
            left: dotPosition.x,
            top: dotPosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping" />
          <div className="absolute inset-0.5 rounded-full bg-orange-500/50 animate-pulse" />
          <div className="absolute inset-1 rounded-full bg-orange-500 border-2 border-orange-300" />
        </div>
      )}
    </div>
  )
}
