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
  const rafIdRef = useRef<number | null>(null)
  const pendingUpdateRef = useRef<{ price: PriceData; ticker: TickerInfo } | null>(null)

  // Throttled update using RAF
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) return

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      
      const pending = pendingUpdateRef.current
      if (!pending) return

      const { price, ticker } = pending
      
      // Update map
      priceMapRef.current.set(price.time, price)

      // Keep only last 300 points
      if (priceMapRef.current.size > 300) {
        const sortedKeys = Array.from(priceMapRef.current.keys()).sort((a, b) => a - b)
        const keysToDelete = sortedKeys.slice(0, sortedKeys.length - 300)
        keysToDelete.forEach(key => priceMapRef.current.delete(key))
      }

      // Convert to sorted array
      const sortedData = Array.from(priceMapRef.current.values())
        .sort((a, b) => a.time - b.time)

      setPriceHistory(sortedData)
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
