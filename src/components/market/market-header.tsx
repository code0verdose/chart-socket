export function MarketHeader() {
  return (
    <div className="flex items-start gap-4 mb-4">
      {/* Bitcoin icon */}
      <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <span className="text-white text-2xl font-bold">₿</span>
      </div>

      {/* Title and info */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-white text-xl font-semibold">Bitcoin Up or Down</h1>
          <button className="text-gray-500 hover:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-1">February 5, 2:15-2:30PM ET</p>
      </div>
    </div>
  )
}
