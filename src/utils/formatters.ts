const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc']

export function formatNumber(n: number): string {
  if (n < 1000) return Math.floor(n).toString()

  let tier = 0
  let value = n
  while (value >= 1000 && tier < SUFFIXES.length - 1) {
    value /= 1000
    tier++
  }

  if (tier === 0) return Math.floor(n).toString()

  return value.toFixed(1) + SUFFIXES[tier]
}

export function formatPerSecond(n: number): string {
  if (n === 0) return '0/s'
  return `${n > 0 ? '+' : ''}${formatNumber(n)}/s`
}
