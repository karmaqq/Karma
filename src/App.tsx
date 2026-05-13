import { useEffect, useState } from 'react'
import { GameLayout } from './components/layout/GameLayout'
import { useGameLoop, useAutoSave, useOfflineProgress } from './hooks/useGameLoop'
import { useGameStore } from './store/gameStore'

export default function App() {
  const [ready, setReady] = useState(false)
  const loadGame = useGameStore(s => s.loadGame)

  useEffect(() => {
    loadGame()
    setReady(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useGameLoop()
  useAutoSave()
  useOfflineProgress()

  if (!ready) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a1a] text-gray-400">
        Yükleniyor...
      </div>
    )
  }

  return <GameLayout />
}
