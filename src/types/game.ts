import { ResourceType } from './resources'
import type { BuildingMap } from './buildings'

export interface GameState {
  resources: Record<ResourceType, number>
  buildings: BuildingMap
  karmaPerClick: number
  totalClicks: number
  lastTick: number
}

export interface GameActions {
  clickKarma: () => void
  purchaseBuilding: (buildingId: string) => void
  getResourcePerSecond: () => Partial<Record<ResourceType, number>>
  saveGame: () => void
  loadGame: () => boolean
  resetGame: () => void
}
