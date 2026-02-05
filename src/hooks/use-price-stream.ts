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

// How often to add NEW points (ms) - should match socket interval
const NEW_POINT_INTERVAL = 1000
// How often to update the last point's value for smooth price transitions (ms)
const VALUE_UPDATE_INTERVAL = 50
// Smoothing factor for price interpolation
const SMOOTHING = 0.1

export function usePriceStream(): UsePriceStreamReturn {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [latestPrice, setLatestPrice] = useState<PriceData | null>(null)
  const [tickerInfo, setTickerInfo] = useState<TickerInfo | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const dataRef = useRef<PriceData[]>([])
  const targetPriceRef = useRef<number>(84.65)
  const displayPriceRef = useRef<number>(84.65)
  const valueUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const newPointIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef<boolean>(false)
  const currentTimeRef = useRef<number>(0)

  // Handle incoming price updates from socket
  const handleMessage = useCallback((message: { type: string; data: PriceData; ticker: TickerInfo }) => {
    if (message.type === 'price_update') {
      if (!isInitializedRef.current) {
        // Initial historical data
        dataRef.current = [...dataRef.current, message.data]
        displayPriceRef.current = message.data.value
        targetPriceRef.current = message.data.value
        currentTimeRef.current = message.data.time
        setPriceHistory([...dataRef.current])
      } else {
        // New target price
        targetPriceRef.current = message.data.value
      }
      
      setTickerInfo(message.ticker)
    }
  }, [])

  const startUpdateLoops = useCallback(() => {
    if (valueUpdateIntervalRef.current) return

    isInitializedRef.current = true
    
    // Get starting time from last data point
    if (dataRef.current.length > 0) {
      currentTimeRef.current = dataRef.current[dataRef.current.length - 1].time
    }

    // Loop 1: Update last point's VALUE frequently for smooth price changes
    valueUpdateIntervalRef.current = setInterval(() => {
      if (dataRef.current.length === 0) return

      // Interpolate price
      const diff = targetPriceRef.current - displayPriceRef.current
      if (Math.abs(diff) > 0.001) {
        displayPriceRef.current += diff * SMOOTHING
      }

      // Update last point's value only
      const lastIndex = dataRef.current.length - 1
      dataRef.current[lastIndex] = {
        ...dataRef.current[lastIndex],
        value: parseFloat(displayPriceRef.current.toFixed(3)),
      }

      setPriceHistory([...dataRef.current])
      setLatestPrice(dataRef.current[lastIndex])
    }, VALUE_UPDATE_INTERVAL)

    // Loop 2: Add NEW points less frequently for steady horizontal movement
    newPointIntervalRef.current = setInterval(() => {
      currentTimeRef.current += NEW_POINT_INTERVAL / 1000

      const newPoint: PriceData = {
        time: currentTimeRef.current,
        value: parseFloat(displayPriceRef.current.toFixed(3)),
      }

      dataRef.current = [...dataRef.current, newPoint].slice(-200)
      setPriceHistory([...dataRef.current])
      setLatestPrice(newPoint)
    }, NEW_POINT_INTERVAL)
  }, [])

  useEffect(() => {
    const connect = () => {
      mockWebSocket.connect()
      setIsConnected(true)
    }
    
    connect()
    const unsubscribe = mockWebSocket.subscribe(handleMessage)
    
    const startTimer = setTimeout(() => {
      startUpdateLoops()
    }, 300)

    return () => {
      clearTimeout(startTimer)
      unsubscribe()
      mockWebSocket.disconnect()
      setIsConnected(false)
      
      if (valueUpdateIntervalRef.current) {
        clearInterval(valueUpdateIntervalRef.current)
        valueUpdateIntervalRef.current = null
      }
      if (newPointIntervalRef.current) {
        clearInterval(newPointIntervalRef.current)
        newPointIntervalRef.current = null
      }
      
      dataRef.current = []
      isInitializedRef.current = false
    }
  }, [handleMessage, startUpdateLoops])

  return {
    priceHistory,
    latestPrice,
    tickerInfo,
    isConnected,
  }
}
