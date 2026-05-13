import { useState, useCallback } from 'react'
import { useGameStore } from '../../store/gameStore'
import { formatNumber } from '../../utils/formatters'

export function ClickButton() {
  const clickKarma = useGameStore(s => s.clickKarma)
  const karma = useGameStore(s => s.resources.karma)
  const kpc = useGameStore(s => s.karmaPerClick)
  const [floating, setFloating] = useState<number[]>([])

  const handleClick = useCallback(() => {
    clickKarma()
    const id = Date.now()
    setFloating(prev => [...prev, id])
    setTimeout(() => setFloating(prev => prev.filter(f => f !== id)), 700)
  }, [clickKarma])

  return (
    <div className="relative flex flex-col items-center justify-center gap-4 select-none">
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">Karma</div>
        <div className="text-3xl font-bold tabular-nums" style={{ color: '#f59e0b' }}>
          {formatNumber(karma)}
        </div>
      </div>

      <button
        onClick={handleClick}
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-700
                   hover:from-amber-400 hover:to-orange-600 active:scale-90
                   transition-all duration-100 shadow-lg shadow-amber-900/40
                   flex items-center justify-center text-5xl cursor-pointer
                   select-none"
      >
        ⚡
        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
      </button>

      <div className="text-xs text-gray-500">
        Tıkla: +{kpc} karma
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
        {floating.map(id => (
          <div
            key={id}
            className="text-amber-400 font-bold text-lg animate-float-up"
            style={{ animation: 'float-up 0.7s ease-out forwards' }}
          >
            +{kpc}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-80px) scale(1.3); }
        }
      `}</style>
    </div>
  )
}
