import { create } from 'zustand'
import { ResourceType } from '../types/resources'
import type { GameState, GameActions } from '../types/game'
import type { BuildingDef } from '../types/buildings'
import { BUILDINGS, BUILDING_MAP } from '../data/buildings'
import { GAME_CONFIG, SAVE_KEY } from '../data/constants'
import { getBuildingCost, canAfford, getResourceProduction, checkUnlock } from '../utils/calculations'

function initialResources(): Record<ResourceType, number> {
  return {
    [ResourceType.Karma]: 0,
    [ResourceType.Odun]: 0,
    [ResourceType.Maden]: 0,
  }
}

function initialBuildings(): Record<string, { count: number; level: number }> {
  const map: Record<string, { count: number; level: number }> = {}
  for (const b of BUILDINGS) {
    map[b.id] = { count: 0, level: 0 }
  }
  return map
}

interface StoreState extends GameState {
  karmaEarned: number
  lastSave: number
}

interface StoreActions extends GameActions {
  tick: () => void
  setKarmaEarned: (v: number) => void
}

const defaultState = {
  resources: initialResources(),
  buildings: initialBuildings(),
  karmaPerClick: GAME_CONFIG.KARMA_PER_CLICK_BASE,
  totalClicks: 0,
  karmaEarned: 0,
  lastTick: Date.now(),
  lastSave: Date.now(),
}

export const useGameStore = create<StoreState & StoreActions>((set, get) => ({
  ...defaultState,

  clickKarma: () => {
    const state = get()
    const kpc = state.karmaPerClick
    set({
      resources: {
        ...state.resources,
        [ResourceType.Karma]: state.resources[ResourceType.Karma] + kpc,
      },
      totalClicks: state.totalClicks + 1,
      karmaEarned: state.karmaEarned + kpc,
    })
  },

  purchaseBuilding: (buildingId: string) => {
    const state = get()
    const def = BUILDING_MAP.get(buildingId)
    if (!def) return

    if (def.type === 'support') {
      const current = state.buildings[buildingId]
      if (current.level >= (def.maxLevel ?? 5)) return
      const cost = getBuildingCost(def, current.level)
      if (!canAfford(state.resources, cost)) return

      const newResources = { ...state.resources }
      for (const c of cost) {
        newResources[c.resource] -= c.amount
      }

      set({
        resources: newResources,
        buildings: {
          ...state.buildings,
          [buildingId]: { ...current, level: current.level + 1 },
        },
      })
    } else {
      const current = state.buildings[buildingId]
      const cost = getBuildingCost(def, current.count)
      if (!canAfford(state.resources, cost)) return

      const newResources = { ...state.resources }
      for (const c of cost) {
        newResources[c.resource] -= c.amount
      }

      set({
        resources: newResources,
        buildings: {
          ...state.buildings,
          [buildingId]: { ...current, count: current.count + 1 },
        },
      })
    }
  },

  getResourcePerSecond: () => {
    const { buildings } = get()

    const supportLevels: Record<string, number> = {}
    for (const [id, bs] of Object.entries(buildings)) {
      const def = BUILDING_MAP.get(id)
      if (def && def.type === 'support' && bs.level > 0) {
        supportLevels[id] = bs.level
      }
    }

    const mainCounts: Record<string, number> = {}
    for (const [id, bs] of Object.entries(buildings)) {
      const def = BUILDING_MAP.get(id)
      if (def && def.type === 'main' && bs.count > 0) {
        mainCounts[id] = bs.count
      }
    }

    const allResourceTypes = [ResourceType.Odun, ResourceType.Maden]
    const result: Partial<Record<ResourceType, number>> = {}

    for (const rt of allResourceTypes) {
      result[rt] = getResourceProduction(rt, mainCounts, supportLevels)
    }

    return result
  },

  tick: () => {
    const state = get()
    const now = Date.now()
    const rps = state.getResourcePerSecond()
    const newResources = { ...state.resources }

    let changed = false
    for (const [rtStr, amount] of Object.entries(rps)) {
      const rt = rtStr as ResourceType
      if (amount && amount > 0) {
        newResources[rt] = (newResources[rt] ?? 0) + amount
        changed = true
      }
    }

    if (changed) {
      set({ resources: newResources, lastTick: now })
    }
  },

  saveGame: () => {
    const state = get()
    const data = {
      resources: state.resources,
      buildings: state.buildings,
      karmaPerClick: state.karmaPerClick,
      totalClicks: state.totalClicks,
      karmaEarned: state.karmaEarned,
      lastTick: Date.now(),
      lastSave: Date.now(),
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
      set({ lastSave: Date.now() })
    } catch {
      console.warn('Save failed')
    }
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return false
      const data = JSON.parse(raw)

      const mergedResources = { ...initialResources(), ...data.resources }
      const mergedBuildings = { ...initialBuildings(), ...data.buildings }

      set({
        resources: mergedResources,
        buildings: mergedBuildings,
        karmaPerClick: data.karmaPerClick ?? GAME_CONFIG.KARMA_PER_CLICK_BASE,
        totalClicks: data.totalClicks ?? 0,
        karmaEarned: data.karmaEarned ?? 0,
        lastTick: data.lastTick ?? Date.now(),
        lastSave: Date.now(),
      })
      return true
    } catch {
      return false
    }
  },

  resetGame: () => {
    localStorage.removeItem(SAVE_KEY)
    set({ ...defaultState, lastTick: Date.now(), lastSave: Date.now() })
  },

  setKarmaEarned: (v: number) => set({ karmaEarned: v }),
}))
