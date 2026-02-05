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

export function usePriceStream(): UsePriceStreamReturn {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [latestPrice, setLatestPrice] = useState<PriceData | null>(null)
  const [tickerInfo, setTickerInfo] = useState<TickerInfo | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const priceMapRef = useRef<Map<number, PriceData>>(new Map())

  const handleMessage = useCallback((message: { type: string; data: PriceData; ticker: TickerInfo }) => {
    if (message.type === 'price_update') {
      const newPrice = message.data

      // Use Map to ensure unique timestamps (overwrites if same time)
      priceMapRef.current.set(newPrice.time, newPrice)

      // Keep only last 200 points for performance
      if (priceMapRef.current.size > 200) {
        const sortedKeys = Array.from(priceMapRef.current.keys()).sort((a, b) => a - b)
        const keysToDelete = sortedKeys.slice(0, sortedKeys.length - 200)
        keysToDelete.forEach(key => priceMapRef.current.delete(key))
      }

      // Convert map to sorted array
      const sortedData = Array.from(priceMapRef.current.values())
        .sort((a, b) => a.time - b.time)

      setPriceHistory(sortedData)
      setLatestPrice(newPrice)
      setTickerInfo(message.ticker)
    }
  }, [])

  useEffect(() => {
    const priceMap = priceMapRef.current

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
      priceMap.clear()
    }
  }, [handleMessage])

  return {
    priceHistory,
    latestPrice,
    tickerInfo,
    isConnected,
  }
}
