import { ResourceType } from './resources'

export interface ProfessionDef {
  id: string
  name: string
  description: string
  icon: string
  resourceType: ResourceType
  baseProduction: number
  unlockBuildingId: string
}

export interface ProfessionAssignment {
  assigned: number
}

export type ProfessionMap = Record<string, ProfessionAssignment>
