export interface Faction {
  id: string
  name: string
  type: 'location' | 'organization'
  color: string
  description?: string
}

export interface Character {
  id: string
  name: string
  faction: string
  race?: string
  position?: string
  description?: string
  relationships?: Relationship[]
  portrait?: string
}

export interface Relationship {
  target: string
  type: string
  description?: string
}

export interface Node {
  id: string
  label: string
  type: 'person' | 'location'
  group?: string
  color?: string
  metadata: Record<string, unknown>
}

export interface Edge {
  id: string
  source: string
  target: string
  label: string
  direction: 'unidirectional' | 'bidirectional'
  metadata?: Record<string, unknown>
}

export interface RelationGraphData {
  nodes: Node[]
  edges: Edge[]
}
