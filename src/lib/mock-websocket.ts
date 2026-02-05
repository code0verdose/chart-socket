import type { PriceData, TickerInfo, WebSocketMessage } from '@/types/chart'

type MessageHandler = (message: WebSocketMessage) => void

class MockWebSocketService {
  private listeners: MessageHandler[] = []
  private priceIntervalId: NodeJS.Timeout | null = null
  private targetPrice: number = 84.65
  private priceToBeat: number = 88.46
  private isRunning: boolean = false

  connect() {
    if (this.isRunning) return

    this.isRunning = true

    // Generate initial historical data
    this.generateHistoricalData()

    // Send new target price every second
    this.priceIntervalId = setInterval(() => {
      this.generateNewPrice()
    }, 1000)
  }

  disconnect() {
    if (this.priceIntervalId) {
      clearInterval(this.priceIntervalId)
      this.priceIntervalId = null
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
    const now = Math.floor(Date.now() / 1000)
    const historicalPoints = 60
    let historicalPrice = 84.65

    for (let i = historicalPoints; i >= 0; i--) {
      const time = now - i

      // Random walk for history
      if (Math.random() > 0.35) {
        const randomWalk = (Math.random() - 0.5) * 0.04
        historicalPrice = Math.max(84.3, Math.min(85.3, historicalPrice + randomWalk))
      }

      this.emit({
        type: 'price_update',
        data: {
          time,
          value: parseFloat(historicalPrice.toFixed(2)),
        },
        ticker: this.getTickerInfo(historicalPrice),
      })
    }

    this.targetPrice = historicalPrice
  }

  private generateNewPrice() {
    // 40% chance to stay at current price
    if (Math.random() < 0.4) {
      this.emitCurrentPrice()
      return
    }

    // Small price movement
    const volatility = 0.06
    const drift = 0.001
    const randomChange = (Math.random() - 0.5) * volatility + drift

    this.targetPrice = Math.max(84.2, Math.min(85.6, this.targetPrice + randomChange))
    this.emitCurrentPrice()
  }

  private emitCurrentPrice() {
    const message: WebSocketMessage = {
      type: 'price_update',
      data: {
        time: Math.floor(Date.now() / 1000),
        value: parseFloat(this.targetPrice.toFixed(2)),
      },
      ticker: this.getTickerInfo(this.targetPrice),
    }

    this.emit(message)
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
