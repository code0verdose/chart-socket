export interface PriceData {
  time: number
  value: number
}

export interface TickerInfo {
  priceToBeat: number
  finalPrice: number
  priceDiff: number
  isUp: boolean
}

export interface WebSocketMessage {
  type: 'price_update'
  data: PriceData
  ticker: TickerInfo
}
