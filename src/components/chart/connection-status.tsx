import clsx from 'clsx'

interface ConnectionStatusProps {
  isConnected: boolean
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="absolute top-4 left-6 flex items-center gap-2">
      <div
        className={clsx(
          'h-2 w-2 rounded-full',
          isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
        )}
      />
      <span className="text-xs text-gray-500">
        {isConnected ? 'Live' : 'Disconnected'}
      </span>
    </div>
  )
}
