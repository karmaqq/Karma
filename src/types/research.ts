export interface ResearchDef {
  id: string
  name: string
  description: string
  icon: string
  baseCost: number
  unlocks: string[]
}

export interface ResearchState {
  completed: boolean
}

export type ResearchMap = Record<string, ResearchState>
