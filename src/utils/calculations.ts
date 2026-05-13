import type { BuildingDef, ResourceCost } from '../types/buildings'
import { ResourceType } from '../types/resources'
import { BUILDING_MAP } from '../data/buildings'

export function getBuildingCost(building: BuildingDef, countOrLevel: number): ResourceCost[] {
  return building.baseCosts.map(cost => ({
    ...cost,
    amount: Math.floor(cost.amount * Math.pow(building.costMultiplier, countOrLevel)),
  }))
}

export function getProductionBonus(resourceType: ResourceType, supportLevels: Record<string, number>): number {
  let bonus = 0
  for (const [id, level] of Object.entries(supportLevels)) {
    const def = BUILDING_MAP.get(id)
    if (def && def.type === 'support' && def.resourceType === resourceType) {
      bonus += level * def.baseProduction
    }
  }
  return bonus
}

export function getResourceProduction(
  resourceType: ResourceType,
  buildingCounts: Record<string, number>,
  supportLevels: Record<string, number>,
): number {
  let production = 0
  for (const [id, count] of Object.entries(buildingCounts)) {
    const def = BUILDING_MAP.get(id)
    if (def && def.type === 'main' && def.resourceType === resourceType && count > 0) {
      const bonus = getProductionBonus(resourceType, supportLevels)
      production += count * def.baseProduction * (1 + bonus)
    }
  }
  return production
}

export function canAfford(
  resources: Record<ResourceType, number>,
  costs: ResourceCost[],
): boolean {
  return costs.every(cost => (resources[cost.resource] ?? 0) >= cost.amount)
}

export function checkUnlock(
  condition: { type: string; buildingId?: string; resource?: ResourceType; amount: number } | null,
  resources: Record<ResourceType, number>,
  buildingCounts: Record<string, number>,
  totalKarma: number,
): boolean {
  if (!condition) return true
  switch (condition.type) {
    case 'karma':
      return totalKarma >= condition.amount
    case 'resource':
      return (resources[condition.resource!] ?? 0) >= condition.amount
    case 'building': {
      const state = buildingCounts[condition.buildingId!]
      return state !== undefined && state >= condition.amount
    }
    default:
      return false
  }
}
