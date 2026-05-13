import { ResourceType, RESOURCE_LABELS, RESOURCE_ICONS, RESOURCE_COLORS } from '../../types/resources'
import { NumberDisplay } from '../common/NumberDisplay'

interface Props {
  type: ResourceType
  amount: number
  perSecond: number
}

export function ResourceBar({ type, amount, perSecond }: Props) {
  const color = RESOURCE_COLORS[type]
  const icon = RESOURCE_ICONS[type]
  const label = RESOURCE_LABELS[type]

  return (
    <div
      className="flex items-center justify-between px-4 py-2 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <NumberDisplay value={amount} color={color} />
        {perSecond > 0 && (
          <span className="text-xs text-green-400 tabular-nums">
            +{perSecond.toFixed(2)}/s
          </span>
        )}
      </div>
    </div>
  )
}
