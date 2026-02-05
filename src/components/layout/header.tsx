import clsx from 'clsx'

export function Header() {
  const navItems = [
    'Trending', 'Breaking', 'New', 'Politics', 'Sports', 'Crypto', 
    'Finance', 'Geopolitics', 'Earnings', 'Tech', 'Culture', 'World'
  ]

  return (
    <header className="bg-slate-900 border-b border-slate-800">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-slate-900 font-bold text-lg">⬡</span>
          </div>
          <span className="text-white font-semibold text-lg">Polymarket</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search polymarket"
              className="w-full bg-slate-800 text-gray-300 placeholder-gray-500 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-blue-500" />
            How it works
          </button>
          <button className="text-gray-400 hover:text-white">Log In</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
            Sign Up
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
        {navItems.map((item, index) => (
          <button
            key={item}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors',
              index === 0 
                ? 'text-white font-medium' 
                : 'text-gray-400 hover:text-white hover:bg-slate-800'
            )}
          >
            {index === 0 && <span className="mr-1">↗</span>}
            {item}
          </button>
        ))}
      </nav>
    </header>
  )
}
