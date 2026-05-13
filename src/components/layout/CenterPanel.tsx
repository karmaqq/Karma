import { ClickButton } from '../clicker/ClickButton'
import { BuildingList } from '../buildings/BuildingList'

export function CenterPanel() {
  return (
    <div className="p-4 overflow-y-auto h-full flex flex-col gap-6">
      <ClickButton />
      <BuildingList />
    </div>
  )
}
