'use client'

import { useEffect, useState, useRef } from 'react'
import { mockWebSocket } from '@/lib/mock-websocket'
import type { PriceData, TickerInfo } from '@/types/chart'

interface UsePriceStreamReturn {
  priceHistory: PriceData[]
  latestPrice: PriceData | null
  tickerInfo: TickerInfo | null
  isConnected: boolean
}

// Chart time moves at this rate (seconds per real second)
const TIME_SPEED = 0.1
// How smoothly price changes (higher = faster catch up)
const PRICE_SMOOTHING = 0.04
// Add a new fixed point every N seconds of chart time
const POINT_INTERVAL = 0.05

export function usePriceStream(): UsePriceStreamReturn {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [latestPrice, setLatestPrice] = useState<PriceData | null>(null)
  const [tickerInfo, setTickerInfo] = useState<TickerInfo | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const dataRef = useRef<PriceData[]>([])
  const targetPriceRef = useRef<number>(84.65)
  const displayPriceRef = useRef<number>(84.65)
  const currentTimeRef = useRef<number>(0)
  const lastPointTimeRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)
  const animationRef = useRef<number | null>(null)
  const isInitializedRef = useRef<boolean>(false)

  useEffect(() => {
    const animate = (timestamp: number) => {
      // Calculate delta time
      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = timestamp
      }
      const deltaTime = (timestamp - lastFrameTimeRef.current) / 1000
      lastFrameTimeRef.current = timestamp

      // Smooth price interpolation
      const priceDiff = targetPriceRef.current - displayPriceRef.current
      displayPriceRef.current += priceDiff * PRICE_SMOOTHING

      // Advance time smoothly
      currentTimeRef.current += deltaTime * TIME_SPEED

      // Check if we need to add a new fixed point
      const timeSinceLastPoint = currentTimeRef.current - lastPointTimeRef.current
      
      if (timeSinceLastPoint >= POINT_INTERVAL) {
        // Add new fixed point
        const newPoint: PriceData = {
          time: currentTimeRef.current,
          value: displayPriceRef.current,
        }
        dataRef.current = [...dataRef.current.slice(-199), newPoint]
        lastPointTimeRef.current = currentTimeRef.current
      }

      // Always update the "live" point (last point moves smoothly)
      const livePoint: PriceData = {
        time: currentTimeRef.current,
        value: displayPriceRef.current,
      }

      // Combine fixed points with live point
      const historyWithLive = [...dataRef.current.slice(0, -1), livePoint]
      
      setPriceHistory(historyWithLive)
      setLatestPrice(livePoint)

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMessage = (message: { type: string; data: PriceData; ticker: TickerInfo }) => {
      if (message.type === 'price_update') {
        if (!isInitializedRef.current) {
          // Initialize with first data point
          dataRef.current = [message.data]
          displayPriceRef.current = message.data.value
          targetPriceRef.current = message.data.value
          currentTimeRef.current = message.data.time
          lastPointTimeRef.current = message.data.time
          isInitializedRef.current = true
          
          // Start animation loop
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Just update target price
          targetPriceRef.current = message.data.value
        }
        setTickerInfo(message.ticker)
      }
    }

    mockWebSocket.connect()
    const unsubscribe = mockWebSocket.subscribe((message) => {
      setIsConnected(true)
      handleMessage(message)
    })

    return () => {
      unsubscribe()
      mockWebSocket.disconnect()
      setIsConnected(false)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      
      dataRef.current = []
      isInitializedRef.current = false
      lastFrameTimeRef.current = 0
    }
  }, [])

  return {
    priceHistory,
    latestPrice,
    tickerInfo,
    isConnected,
  }
}
