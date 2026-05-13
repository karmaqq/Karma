import { useGameStore } from '../../store/gameStore'
import type { BuildingDef } from '../../types/buildings'
import { getBuildingCost } from '../../utils/calculations'
import { formatNumber } from '../../utils/formatters'
import { ResourceType, RESOURCE_ICONS, RESOURCE_COLORS } from '../../types/resources'

interface Props {
  def: BuildingDef
  isUnlocked: boolean
  lockReason: string
}

export function BuildingCard({ def, isUnlocked, lockReason }: Props) {
  const resources = useGameStore(s => s.resources)
  const buildings = useGameStore(s => s.buildings)
  const purchaseBuilding = useGameStore(s => s.purchaseBuilding)

  const state = buildings[def.id]
  const count = state?.count ?? 0
  const cost = getBuildingCost(def, count)
  const canBuy = isUnlocked && cost.every(c => (resources[c.resource] ?? 0) >= c.amount)

  return (
    <div
      className={`
        relative rounded-lg border p-3 transition-all duration-150
        ${!isUnlocked ? 'opacity-40 border-gray-800' : canBuy
          ? 'border-amber-700/50 bg-amber-900/10 hover:bg-amber-900/20 cursor-pointer'
          : 'border-gray-800 bg-gray-900/30 cursor-not-allowed'}
      `}
      onClick={() => {
        if (isUnlocked && canBuy) purchaseBuilding(def.id)
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{def.icon}</span>
          <div>
            <div className="text-sm font-medium text-gray-200">{def.name}</div>
            <div className="text-xs text-gray-500">{def.description}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-200">x{count}</div>
          <div className="text-xs text-green-400">
            +{formatNumber(def.baseProduction)}/s
          </div>
        </div>
      </div>

      {!isUnlocked && lockReason && (
        <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <span>🔒</span> {lockReason}
        </div>
      )}

      {isUnlocked && (
        <div className="mt-2 flex items-center gap-2">
          {cost.map((c, i) => (
            <span
              key={i}
              className="text-xs tabular-nums"
              style={{
                color: (resources[c.resource] ?? 0) >= c.amount
                  ? RESOURCE_COLORS[c.resource]
                  : '#666',
              }}
            >
              {RESOURCE_ICONS[c.resource]} {formatNumber(c.amount)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
