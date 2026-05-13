import { formatNumber } from '../../utils/formatters'

interface Props {
  value: number
  color?: string
  icon?: string
  suffix?: string
}

export function NumberDisplay({ value, color, icon, suffix }: Props) {
  return (
    <span style={{ color }} className="tabular-nums">
      {icon && <span className="mr-1">{icon}</span>}
      {formatNumber(value)}
      {suffix && <span className="ml-0.5 opacity-60">{suffix}</span>}
    </span>
  )
}
