import type { PriceData, TickerInfo, WebSocketMessage } from '@/types/chart'

type MessageHandler = (message: WebSocketMessage) => void

class MockWebSocketService {
  private listeners: MessageHandler[] = []
  private animationId: number | null = null
  private targetPrice: number = 84.65
  private displayPrice: number = 84.65
  private priceToBeat: number = 88.46
  private isRunning: boolean = false
  private lastTimestamp: number = 0
  private priceChangeTimer: number = 0
  
  // Settings
  private readonly SMOOTHING = 0.02 // Lower = smoother (0.01-0.05)
  private readonly PRICE_CHANGE_INTERVAL = 1500 // ms between target price changes

  connect() {
    if (this.isRunning) return

    this.isRunning = true
    this.lastTimestamp = performance.now()

    // Generate initial historical data
    this.generateHistoricalData()

    // Start animation loop
    this.animate(performance.now())
  }

  disconnect() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
    this.listeners = []
  }

  subscribe(handler: MessageHandler) {
    this.listeners.push(handler)
    return () => {
      this.listeners = this.listeners.filter(l => l !== handler)
    }
  }

  private generateHistoricalData() {
    const now = Date.now()
    const historicalPoints = 150
    let historicalPrice = 84.65

    for (let i = historicalPoints; i >= 0; i--) {
      const time = now - i * 100

      // Gentle random walk for history
      if (Math.random() > 0.3) {
        const randomWalk = (Math.random() - 0.5) * 0.015
        historicalPrice = Math.max(84.3, Math.min(85.3, historicalPrice + randomWalk))
      }

      this.emit({
        type: 'price_update',
        data: {
          time: Math.floor(time / 1000),
          value: parseFloat(historicalPrice.toFixed(3)),
        },
        ticker: this.getTickerInfo(historicalPrice),
      })
    }

    this.targetPrice = historicalPrice
    this.displayPrice = historicalPrice
  }

  private animate = (timestamp: number) => {
    if (!this.isRunning) return

    const deltaTime = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp

    // Update target price periodically
    this.priceChangeTimer += deltaTime
    if (this.priceChangeTimer >= this.PRICE_CHANGE_INTERVAL) {
      this.priceChangeTimer = 0
      this.generateNewTargetPrice()
    }

    // Smooth interpolation toward target
    const diff = this.targetPrice - this.displayPrice
    if (Math.abs(diff) > 0.0001) {
      this.displayPrice += diff * this.SMOOTHING
    }

    // Emit current price
    const message: WebSocketMessage = {
      type: 'price_update',
      data: {
        time: Math.floor(Date.now() / 1000),
        value: parseFloat(this.displayPrice.toFixed(3)),
      },
      ticker: this.getTickerInfo(this.displayPrice),
    }

    this.emit(message)

    // Continue animation
    this.animationId = requestAnimationFrame(this.animate)
  }

  private generateNewTargetPrice() {
    // 40% chance to stay at current price
    if (Math.random() < 0.4) return

    // Small, gentle movement
    const volatility = 0.08
    const drift = 0.001
    const randomChange = (Math.random() - 0.5) * volatility + drift

    this.targetPrice = Math.max(84.2, Math.min(85.6, this.targetPrice + randomChange))
  }

  private getTickerInfo(price: number): TickerInfo {
    const priceDiff = this.priceToBeat - price
    return {
      priceToBeat: this.priceToBeat,
      finalPrice: parseFloat(price.toFixed(2)),
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
