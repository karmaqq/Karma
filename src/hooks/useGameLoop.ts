import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { GAME_CONFIG } from '../data/constants'
import { ResourceType } from '../types'

export function useGameLoop() {
  const tick = useGameStore(s => s.tick)
  const tickRef = useRef(tick)
  tickRef.current = tick

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current()
    }, GAME_CONFIG.GAME_LOOP_INTERVAL)
    return () => clearInterval(interval)
  }, [])
}

export function useAutoSave() {
  const saveGame = useGameStore(s => s.saveGame)
  const saveRef = useRef(saveGame)
  saveRef.current = saveGame

  useEffect(() => {
    const interval = setInterval(() => {
      saveRef.current()
    }, GAME_CONFIG.SAVE_INTERVAL)
    return () => clearInterval(interval)
  }, [])
}

export function useOfflineProgress() {
  const loadGame = useGameStore(s => s.loadGame)
  const tick = useGameStore(s => s.tick)
  const lastTick = useGameStore(s => s.lastTick)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    const loaded = loadGame()
    if (loaded) {
      const now = Date.now()
      const elapsed = Math.max(0, now - lastTick)
      const offlineSeconds = Math.floor(elapsed / 1000)
      if (offlineSeconds > 0) {
        const MAX_OFFLINE = 72 * 3600
        const capped = Math.min(offlineSeconds, MAX_OFFLINE)
        for (let i = 0; i < Math.min(capped, 300); i++) {
          tick()
        }
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
