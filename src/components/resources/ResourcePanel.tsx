import { useGameStore } from '../../store/gameStore'
import { ResourceType } from '../../types/resources'
import { ResourceBar } from './ResourceBar'

export function ResourcePanel() {
  const resources = useGameStore(s => s.resources)
  const getResourcePerSecond = useGameStore(s => s.getResourcePerSecond)
  const rps = getResourcePerSecond()

  const types = [ResourceType.Karma, ResourceType.Odun, ResourceType.Maden]

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold px-1 mb-1">
        Kaynaklar
      </h2>
      {types.map(t => (
        <ResourceBar
          key={t}
          type={t}
          amount={resources[t] ?? 0}
          perSecond={rps[t] ?? 0}
        />
      ))}
    </div>
  )
}
