const markets = [
  { icon: '◇', name: 'Ethereum Up or Down', color: 'bg-blue-500', chance: '<1%', direction: 'Up' },
  { icon: '═', name: 'Solana Up or Down', color: 'bg-purple-500', chance: '<1%', direction: 'Up' },
  { icon: '✕', name: 'XRP Up or Down', color: 'bg-slate-600', chance: '<1%', direction: 'Up' },
]

export function OtherMarkets() {
  return (
    <div className="space-y-2">
      {markets.map((market) => (
        <div
          key={market.name}
          className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className={`w-10 h-10 ${market.color} rounded-lg flex items-center justify-center text-white font-bold`}>
            {market.icon}
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">{market.name}</div>
          </div>
          <div className="text-right">
            <div className="text-white font-medium">{market.chance}</div>
            <div className="text-gray-500 text-xs">{market.direction}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
