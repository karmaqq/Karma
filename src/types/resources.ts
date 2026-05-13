export enum ResourceType {
  Karma = 'karma',
  Odun = 'odun',
  Maden = 'maden',
}

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  [ResourceType.Karma]: 'Karma',
  [ResourceType.Odun]: 'Odun',
  [ResourceType.Maden]: 'Maden',
}

export const RESOURCE_ICONS: Record<ResourceType, string> = {
  [ResourceType.Karma]: '⚡',
  [ResourceType.Odun]: '🪵',
  [ResourceType.Maden]: '⛏️',
}

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  [ResourceType.Karma]: '#f59e0b',
  [ResourceType.Odun]: '#8b5cf6',
  [ResourceType.Maden]: '#ef4444',
}
