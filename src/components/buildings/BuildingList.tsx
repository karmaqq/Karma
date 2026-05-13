import { useGameStore } from '../../store/gameStore'
import { BUILDINGS } from '../../data/buildings'
import { ResourceType } from '../../types/resources'
import { checkUnlock } from '../../utils/calculations'
import { BuildingCard } from './BuildingCard'
import { SupportBuildingCard } from './SupportBuildingCard'

export function BuildingList() {
  const resources = useGameStore(s => s.resources)
  const buildings = useGameStore(s => s.buildings)
  const totalKarma = useGameStore(s => s.karmaEarned)

  const mainBuildings = BUILDINGS.filter(b => b.type === 'main')
  const supportBuildings = BUILDINGS.filter(b => b.type === 'support')

  function getLockReason(def: (typeof BUILDINGS)[number]): string {
    if (!def.unlockCondition) return ''
    const c = def.unlockCondition
    switch (c.type) {
      case 'karma':
        return `${formatAmount(c.amount)} Karma biriktir`
      case 'resource':
        return `${formatAmount(c.amount)} ${c.resource} üret`
      case 'building': {
        const bDef = BUILDINGS.find(b => b.id === c.buildingId)
        return `${bDef?.name ?? c.buildingId} satın al (${c.amount} adet)`
      }
      default:
        return ''
    }
  }

  const mainIds = mainBuildings.map(b => b.id)
  const mainBuildingsToShow = mainBuildings
  const supportBuildingsToShow = supportBuildings

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold px-1 mb-2">
          Binalar
        </h2>
        <div className="flex flex-col gap-2">
          {mainBuildingsToShow.map(def => {
            const unlocked = def.unlockCondition
              ? checkUnlock(def.unlockCondition, resources, Object.fromEntries(
                  Object.entries(buildings).map(([k, v]) => [k, v.count])
                ), totalKarma)
              : true
            return (
              <BuildingCard
                key={def.id}
                def={def}
                isUnlocked={unlocked}
                lockReason={unlocked ? '' : getLockReason(def)}
              />
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold px-1 mb-2">
          Destek Binaları
        </h2>
        <div className="flex flex-col gap-2">
          {supportBuildingsToShow.map(def => {
            const unlocked = def.unlockCondition
              ? checkUnlock(def.unlockCondition, resources, Object.fromEntries(
                  Object.entries(buildings).map(([k, v]) => [k, v.count])
                ), totalKarma)
              : true
            return (
              <SupportBuildingCard
                key={def.id}
                def={def}
                isUnlocked={unlocked}
                lockReason={unlocked ? '' : getLockReason(def)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatAmount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}
