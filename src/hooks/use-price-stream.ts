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

// 30fps for smooth animation
const FRAME_INTERVAL = 33
// Extremely slow time step
const TIME_STEP = 0.001
// Very smooth price interpolation (lower = smoother transitions)
const SMOOTHING = 0.015

export function usePriceStream(): UsePriceStreamReturn {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [latestPrice, setLatestPrice] = useState<PriceData | null>(null)
  const [tickerInfo, setTickerInfo] = useState<TickerInfo | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const dataRef = useRef<PriceData[]>([])
  const targetPriceRef = useRef<number>(84.65)
  const displayPriceRef = useRef<number>(84.65)
  const animationRef = useRef<number | null>(null)
  const isInitializedRef = useRef<boolean>(false)
  const currentTimeRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)

  useEffect(() => {
    // Handle incoming price updates from socket
    const handleMessage = (message: { type: string; data: PriceData; ticker: TickerInfo }) => {
      if (message.type === 'price_update') {
        if (!isInitializedRef.current) {
          // Initial historical data
          dataRef.current = [...dataRef.current, message.data]
          displayPriceRef.current = message.data.value
          targetPriceRef.current = message.data.value
          currentTimeRef.current = message.data.time
          setPriceHistory([...dataRef.current])
        } else {
          // New target price from socket
          targetPriceRef.current = message.data.value
        }
        
        setTickerInfo(message.ticker)
      }
    }

    // Animation loop
    const animate = (timestamp: number) => {
      if (!isInitializedRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Throttle to ~30fps
      if (timestamp - lastFrameTimeRef.current < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = timestamp

      // Smooth price interpolation
      const diff = targetPriceRef.current - displayPriceRef.current
      if (Math.abs(diff) > 0.0005) {
        displayPriceRef.current += diff * SMOOTHING
      } else {
        displayPriceRef.current = targetPriceRef.current
      }

      // Advance time by small fixed step
      currentTimeRef.current += TIME_STEP

      // Add new point
      const newPoint: PriceData = {
        time: currentTimeRef.current,
        value: parseFloat(displayPriceRef.current.toFixed(3)),
      }

      dataRef.current = [...dataRef.current, newPoint].slice(-600)
      
      setPriceHistory([...dataRef.current])
      setLatestPrice(newPoint)

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    const startAnimation = () => {
      isInitializedRef.current = true
      
      if (dataRef.current.length > 0) {
        currentTimeRef.current = dataRef.current[dataRef.current.length - 1].time
      }

      lastFrameTimeRef.current = performance.now()
      animationRef.current = requestAnimationFrame(animate)
    }

    // Connect and subscribe
    const connect = () => {
      mockWebSocket.connect()
      setIsConnected(true)
    }
    connect()
    const unsubscribe = mockWebSocket.subscribe(handleMessage)
    
    // Start animation after initial data loads
    const startTimer = setTimeout(startAnimation, 200)

    return () => {
      clearTimeout(startTimer)
      unsubscribe()
      mockWebSocket.disconnect()
      setIsConnected(false)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      
      dataRef.current = []
      isInitializedRef.current = false
    }
  }, [])

  return {
    priceHistory,
    latestPrice,
    tickerInfo,
    isConnected,
  }
}
