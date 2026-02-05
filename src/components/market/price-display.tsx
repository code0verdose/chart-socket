export function PriceDisplay() {
  return (
    <div className="flex items-center gap-8 mb-4">
      {/* Price to Beat */}
      <div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">Price to Beat</span>
        <div className="text-2xl font-bold text-white">$66,180.03</div>
      </div>

      {/* Current Price */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Current Price</span>
          <span className="text-xs text-red-500 font-medium">▼ $1007</span>
        </div>
        <div className="text-2xl font-bold text-emerald-400">$65,173.47</div>
      </div>
    </div>
  )
}
