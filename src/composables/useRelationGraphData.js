import { ref } from 'vue'
import { fetchCharacters } from '@/services/characterService'
import { fetchFactions } from '@/services/factionService'

export function useRelationGraphData() {
  const allGraphData = ref({ nodes: [], edges: [] })
  const graphData = ref({ nodes: [], edges: [] })
  const isLoading = ref(false)
  const error = ref(null)
  const selectedFaction = ref(null)
  const availableFactions = ref([])

  const loadGraphData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const [characters, factions] = await Promise.all([
        fetchCharacters(),
        fetchFactions()
      ])

      availableFactions.value = factions.map(f => ({ value: f.id, label: f.name, color: f.color }))

      const factionNodes = factions.map(f => ({
        id: f.id,
        label: f.name,
        type: 'location',
        color: f.color || '#4A90E2',
        metadata: { ...f }
      }))

      const characterNodes = characters.map(c => ({
        id: c.id,
        label: c.name,
        type: 'person',
        group: c.faction,
        department: c.department,
        color: factions.find(f => f.id === c.faction)?.color || '#4A90E2',
        metadata: { ...c }
      }))

      const edges = []
      characters.forEach(char => {
        if (char.internal_relationships) {
          char.internal_relationships.forEach(rel => {
            const targetChar = characters.find(c => c.id === rel.target)
            if (targetChar && targetChar.faction === char.faction) {
              edges.push({
                id: `${char.id}-internal-${rel.target}`,
                source: char.id,
                target: rel.target,
                label: rel.type,
                type: 'internal',
                direction: 'bidirectional',
                metadata: { description: rel.description }
              })
            }
          })
        }

        if (char.external_relationships) {
          char.external_relationships.forEach(rel => {
            const targetChar = characters.find(c => c.id === rel.target)
            if (targetChar) {
              edges.push({
                id: `${char.id}-external-${rel.target}`,
                source: char.id,
                target: rel.target,
                label: rel.type,
                type: 'external',
                direction: 'bidirectional',
                metadata: { description: rel.description }
              })
            }
          })
        }

        if (char.relationships) {
          char.relationships.forEach(rel => {
            const existingEdge = edges.find(e =>
              (e.source === char.id && e.target === rel.target) ||
              (e.source === rel.target && e.target === char.id)
            )
            if (!existingEdge) {
              edges.push({
                id: `${char.id}-legacy-${rel.target}`,
                source: char.id,
                target: rel.target,
                label: rel.type,
                type: 'legacy',
                direction: 'bidirectional',
                metadata: { description: rel.description }
              })
            }
          })
        }
      })

      allGraphData.value = {
        nodes: [...factionNodes, ...characterNodes],
        edges
      }

      if (availableFactions.value.length > 0 && !selectedFaction.value) {
        selectedFaction.value = availableFactions.value[0].value
      }
      filterByFaction(selectedFaction.value)
    } catch (err) {
      error.value = err.message
      console.error('Failed to load relation graph data:', err)
    } finally {
      isLoading.value = false
    }
  }

  const filterByFaction = (factionId) => {
    selectedFaction.value = factionId

    if (!factionId) {
      graphData.value = { ...allGraphData.value }
      return
    }

    const faction = availableFactions.value.find(f => f.value === factionId)
    const factionColor = faction?.color || '#4A90E2'

    const filteredCharacterNodes = allGraphData.value.nodes.filter(n =>
      n.type === 'person' && n.group === factionId
    )

    const departments = [...new Set(filteredCharacterNodes.map(n => n.department))]
    const departmentNodes = departments.map(dept => ({
      id: `dept-${factionId}-${dept}`,
      label: dept,
      type: 'department',
      group: factionId,
      color: factionColor,
      metadata: { name: dept, faction: factionId }
    }))

    const filteredEdges = allGraphData.value.edges.filter(e => {
      if (e.type === 'external') return false
      const sourceIsSelected = filteredCharacterNodes.some(n => n.id === e.source)
      const targetIsSelected = filteredCharacterNodes.some(n => n.id === e.target)
      return sourceIsSelected && targetIsSelected
    })

    const deptEdges = []
    filteredCharacterNodes.forEach(char => {
      if (char.department) {
        const deptNodeId = `dept-${factionId}-${char.department}`
        deptEdges.push({
          id: `${char.id}-dept-${char.department}`,
          source: char.id,
          target: deptNodeId,
          label: 'member',
          type: 'department',
          color: factionColor,
          direction: 'bidirectional',
          metadata: { description: `${char.name}属于${char.department}` }
        })
      }
    })

    const allEdges = [...filteredEdges, ...deptEdges]

    const hasDepartments = departments.length > 1 || (departments.length === 1 && departments[0])
    
    graphData.value = {
      nodes: hasDepartments 
        ? [...departmentNodes, ...filteredCharacterNodes]
        : filteredCharacterNodes,
      edges: allEdges
    }
  }

  return {
    graphData,
    isLoading,
    error,
    loadGraphData,
    filterByFaction,
    selectedFaction,
    availableFactions
  }
}
