import type { PriceData, TickerInfo, WebSocketMessage } from '@/types/chart'

type MessageHandler = (message: WebSocketMessage) => void

class MockWebSocketService {
  private listeners: MessageHandler[] = []
  private intervalId: NodeJS.Timeout | null = null
  private currentPrice: number = 84.65
  private priceToBeat: number = 88.46
  private startTime: number = Date.now()
  private isRunning: boolean = false
  
  // Stability settings
  private stableTicks: number = 0
  private stableTicksRemaining: number = 0

  connect() {
    if (this.isRunning) return

    this.isRunning = true
    this.startTime = Date.now()

    // Generate initial historical data
    this.generateHistoricalData()

    // Start streaming live data
    this.intervalId = setInterval(() => {
      this.generatePriceUpdate()
    }, 500) // Update every 500ms for smooth animation
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    this.listeners = []
    this.stableTicksRemaining = 0
  }

  subscribe(handler: MessageHandler) {
    this.listeners.push(handler)
    return () => {
      this.listeners = this.listeners.filter(l => l !== handler)
    }
  }

  private generateHistoricalData() {
    const now = Date.now()
    const historicalPoints = 50
    let localStableRemaining = 0

    for (let i = historicalPoints; i >= 0; i--) {
      const time = now - i * 500

      // Stability logic for historical data
      if (localStableRemaining > 0) {
        localStableRemaining--
      } else {
        // 30% chance to enter stable period
        if (Math.random() < 0.3) {
          localStableRemaining = Math.floor(Math.random() * 5) + 2 // 2-6 ticks stable
        } else {
          const randomWalk = (Math.random() - 0.5) * 0.15
          this.currentPrice = Math.max(84.0, Math.min(86.0, this.currentPrice + randomWalk))
        }
      }

      this.emit({
        type: 'price_update',
        data: {
          time: Math.floor(time / 1000),
          value: parseFloat(this.currentPrice.toFixed(2)),
        },
        ticker: this.getTickerInfo(),
      })
    }
  }

  private generatePriceUpdate() {
    // Check if we're in a stable period
    if (this.stableTicksRemaining > 0) {
      this.stableTicksRemaining--
    } else {
      // 25% chance to enter a stable period (price stays the same)
      if (Math.random() < 0.25) {
        // Stay stable for 3-8 ticks (1.5s - 4s)
        this.stableTicksRemaining = Math.floor(Math.random() * 6) + 3
        this.stableTicks++
      } else {
        // Normal price movement
        const volatility = 0.06
        const drift = 0.001
        const randomChange = (Math.random() - 0.5) * volatility + drift

        this.currentPrice = Math.max(84.0, Math.min(87.0, this.currentPrice + randomChange))
      }
    }

    const message: WebSocketMessage = {
      type: 'price_update',
      data: {
        time: Math.floor(Date.now() / 1000),
        value: parseFloat(this.currentPrice.toFixed(2)),
      },
      ticker: this.getTickerInfo(),
    }

    this.emit(message)
  }

  private getTickerInfo(): TickerInfo {
    const priceDiff = this.priceToBeat - this.currentPrice
    return {
      priceToBeat: this.priceToBeat,
      finalPrice: parseFloat(this.currentPrice.toFixed(2)),
      priceDiff: parseFloat(priceDiff.toFixed(2)),
      isUp: priceDiff < 0,
    }
  }

  private emit(message: WebSocketMessage) {
    this.listeners.forEach(handler => handler(message))
  }
}

// Singleton instance
export const mockWebSocket = new MockWebSocketService()
