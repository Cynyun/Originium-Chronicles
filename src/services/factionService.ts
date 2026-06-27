import type { Faction } from '@/types/relation-graph'

export async function fetchFactions(): Promise<Faction[]> {
  const response = await fetch('/data/factions.json')
  if (!response.ok) {
    throw new Error('Failed to fetch factions')
  }
  const data = await response.json()
  return data.factions || []
}
