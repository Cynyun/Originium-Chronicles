import type { Character } from '@/types/relation-graph'

export async function fetchCharacters(): Promise<Character[]> {
  const response = await fetch('/data/characters.json')
  if (!response.ok) {
    throw new Error('Failed to fetch characters')
  }
  const data = await response.json()
  return data.characters || []
}
