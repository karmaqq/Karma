import { ResourceType } from './resources'

export interface ResourceCost {
  resource: ResourceType
  amount: number
}

export interface UnlockCondition {
  type: 'resource' | 'building' | 'karma'
  buildingId?: string
  resource?: ResourceType
  amount: number
}

export type BuildingType = 'main' | 'support'

export interface BuildingDef {
  id: string
  name: string
  description: string
  icon: string
  type: BuildingType
  resourceType: ResourceType
  baseCosts: ResourceCost[]
  costMultiplier: number
  baseProduction: number
  maxLevel?: number
  unlockCondition: UnlockCondition | null
}

export interface BuildingState {
  count: number
  level: number
}

export type BuildingMap = Record<string, BuildingState>
