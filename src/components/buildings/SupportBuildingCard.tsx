import { useGameStore } from '../../store/gameStore'
import type { BuildingDef } from '../../types/buildings'
import { ResourceType } from '../../types/resources'
import { getBuildingCost } from '../../utils/calculations'
import { formatNumber } from '../../utils/formatters'
import { RESOURCE_ICONS, RESOURCE_COLORS } from '../../types/resources'

interface Props {
  def: BuildingDef
  isUnlocked: boolean
  lockReason: string
}

export function SupportBuildingCard({ def, isUnlocked, lockReason }: Props) {
  const resources = useGameStore(s => s.resources)
  const buildings = useGameStore(s => s.buildings)
  const purchaseBuilding = useGameStore(s => s.purchaseBuilding)

  const state = buildings[def.id]
  const level = state?.level ?? 0
  const maxLevel = def.maxLevel ?? 5
  const cost = getBuildingCost(def, level)
  const canBuy = isUnlocked && level < maxLevel && cost.every(c => (resources[c.resource] ?? 0) >= c.amount)

  const progressPercent = (level / maxLevel) * 100

  return (
    <div
      className={`
        relative rounded-lg border p-3 transition-all duration-150
        ${!isUnlocked ? 'opacity-40 border-gray-800' : canBuy
          ? 'border-purple-700/50 bg-purple-900/10 hover:bg-purple-900/20 cursor-pointer'
          : level >= maxLevel
            ? 'border-green-800/50 bg-green-900/10'
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
          <div className="text-sm font-bold text-amber-400">
            Seviye {level}/{maxLevel}
          </div>
          <div className="text-xs text-green-400">
            +{level * 10}% bonus
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
          }}
        />
      </div>

      {!isUnlocked && lockReason && (
        <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <span>🔒</span> {lockReason}
        </div>
      )}

      {isUnlocked && level < maxLevel && (
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

      {level >= maxLevel && (
        <div className="mt-2 text-xs text-green-500">MAX SEVİYE</div>
      )}
    </div>
  )
}
