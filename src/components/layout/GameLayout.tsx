import { LeftPanel } from './LeftPanel'
import { CenterPanel } from './CenterPanel'
import { RightPanel } from './RightPanel'

export function GameLayout() {
  return (
    <div className="h-full w-full grid grid-cols-[240px_1fr_240px] bg-[#0a0a1a]">
      <div className="border-r border-gray-800/60">
        <LeftPanel />
      </div>
      <div className="overflow-hidden">
        <CenterPanel />
      </div>
      <div className="border-l border-gray-800/60">
        <RightPanel />
      </div>
    </div>
  )
}
