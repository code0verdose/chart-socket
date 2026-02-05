'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { mockWebSocket } from '@/lib/mock-websocket'
import type { PriceData, TickerInfo } from '@/types/chart'

interface UsePriceStreamReturn {
  priceHistory: PriceData[]
  latestPrice: PriceData | null
  tickerInfo: TickerInfo | null
  isConnected: boolean
}

// Throttle interval for adding new data points (ms)
const DATA_POINT_INTERVAL = 400

export function usePriceStream(): UsePriceStreamReturn {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [latestPrice, setLatestPrice] = useState<PriceData | null>(null)
  const [tickerInfo, setTickerInfo] = useState<TickerInfo | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const dataRef = useRef<PriceData[]>([])
  const lastAddTimeRef = useRef<number>(0)
  const rafIdRef = useRef<number | null>(null)
  const pendingUpdateRef = useRef<{ price: PriceData; ticker: TickerInfo } | null>(null)

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) return

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      
      const pending = pendingUpdateRef.current
      if (!pending) return

      const { price, ticker } = pending
      const now = Date.now()
      
      // Add new point only if enough time has passed
      if (now - lastAddTimeRef.current >= DATA_POINT_INTERVAL) {
        lastAddTimeRef.current = now
        
        // Add new data point
        dataRef.current = [...dataRef.current, price].slice(-400)
        setPriceHistory([...dataRef.current])
      } else if (dataRef.current.length > 0) {
        // Update the last point's value for smooth animation
        const lastIndex = dataRef.current.length - 1
        dataRef.current[lastIndex] = {
          ...dataRef.current[lastIndex],
          value: price.value,
        }
        setPriceHistory([...dataRef.current])
      }

      setLatestPrice(price)
      setTickerInfo(ticker)
    })
  }, [])

  const handleMessage = useCallback((message: { type: string; data: PriceData; ticker: TickerInfo }) => {
    if (message.type === 'price_update') {
      pendingUpdateRef.current = { price: message.data, ticker: message.ticker }
      scheduleUpdate()
    }
  }, [scheduleUpdate])

  useEffect(() => {
    const connectAndSubscribe = () => {
      mockWebSocket.connect()
      setIsConnected(true)
    }

    connectAndSubscribe()
    const unsubscribe = mockWebSocket.subscribe(handleMessage)

    return () => {
      unsubscribe()
      mockWebSocket.disconnect()
      setIsConnected(false)
      dataRef.current = []
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [handleMessage])

  return {
    priceHistory,
    latestPrice,
    tickerInfo,
    isConnected,
  }
}
