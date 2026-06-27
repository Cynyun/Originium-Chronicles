<template>
  <div class="relation-graph">
    <div class="relation-graph__header">
      <h3 class="relation-graph__title">{{ title }}</h3>
      <p class="relation-graph__subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="relation-graph__container">
      <svg class="relation-graph__svg" :viewBox="`0 0 ${containerWidth} ${containerHeight}`">
        <line
          v-for="(relation, index) in props.relations"
          :key="'rel-' + index"
          :x1="getNodePosition(relation.source).x"
          :y1="getNodePosition(relation.source).y"
          :x2="getNodePosition(relation.target).x"
          :y2="getNodePosition(relation.target).y"
          :stroke="getRelationColor(relation.type)"
          stroke-width="2"
          :stroke-dasharray="getRelationDash(relation.type)"
          class="relation-line"
        />
        
        <g v-for="faction in props.factions" :key="faction.id">
          <polygon
            :points="getDiamondPoints(getNodePosition(faction.id))"
            :fill="faction.color || '#3b82f6'"
            class="faction-node"
            @click="handleFactionClick(faction)"
          />
          <text
            :x="getNodePosition(faction.id).x"
            :y="getNodePosition(faction.id).y"
            class="node-label"
          >{{ faction.name }}</text>
        </g>
        
        <g v-for="character in props.characters" :key="character.id">
          <circle
            :cx="getNodePosition(character.id).x"
            :cy="getNodePosition(character.id).y"
            r="24"
            :fill="character.color || '#dc2626'"
            class="character-node"
            :class="{ 'is-selected': selectedId === character.id }"
            @click="handleCharacterClick(character)"
          />
          <circle
            :cx="getNodePosition(character.id).x"
            :cy="getNodePosition(character.id).y"
            r="20"
            fill="rgba(10, 10, 15, 0.8)"
          />
          <text
            :x="getNodePosition(character.id).x"
            :y="getNodePosition(character.id).y"
            class="character-initial"
          >{{ character.name?.[0] || '?' }}</text>
          <text
            :x="getNodePosition(character.id).x"
            :y="getNodePosition(character.id).y + 35"
            class="character-name"
          >{{ character.name }}</text>
        </g>
      </svg>
    </div>
    
    <div class="relation-graph__legend">
      <div class="legend-item">
        <span class="legend-symbol legend-symbol--faction"></span>
        <span class="legend-text">派系</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol legend-symbol--character"></span>
        <span class="legend-text">人物</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '人物关系图谱'
  },
  subtitle: {
    type: String,
    default: '点击节点查看详情'
  },
  factions: {
    type: Array,
    default: () => []
  },
  characters: {
    type: Array,
    default: () => []
  },
  relations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['factionSelect', 'characterSelect'])

const selectedId = ref(null)
const containerWidth = ref(800)
const containerHeight = ref(500)

const nodePositions = computed(() => {
  const positions = {}
  const allNodes = [...props.factions, ...props.characters]
  const cols = Math.min(4, Math.ceil(Math.sqrt(allNodes.length)))
  const rows = Math.ceil(allNodes.length / cols)
  const cellWidth = containerWidth.value / (cols + 1)
  const cellHeight = containerHeight.value / (rows + 1)
  
  allNodes.forEach((node, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    positions[node.id] = {
      x: cellWidth * (col + 1),
      y: cellHeight * (row + 1)
    }
  })
  
  return positions
})

const getNodePosition = (id) => {
  return nodePositions.value[id] || { x: 100, y: 100 }
}

const getDiamondPoints = (pos) => {
  const size = 30
  return `${pos.x},${pos.y - size} ${pos.x + size},${pos.y} ${pos.x},${pos.y + size} ${pos.x - size},${pos.y}`
}

const getRelationColor = (type) => {
  const colors = {
    alliance: '#3b82f6',
    enemy: '#dc2626',
    family: '#f59e0b',
    mentor: '#9ca3af',
    default: '#dc2626'
  }
  return colors[type] || colors.default
}

const getRelationDash = (type) => {
  const dashes = {
    enemy: '8, 4',
    mentor: '4, 2',
    default: ''
  }
  return dashes[type] || dashes.default
}

const handleFactionClick = (faction) => {
  emit('factionSelect', faction)
}

const handleCharacterClick = (character) => {
  selectedId.value = selectedId.value === character.id ? null : character.id
  emit('characterSelect', character)
}
</script>

<style scoped>
.relation-graph {
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid var(--color-accent-dark-red);
  padding: 24px;
  margin-top: 24px;
}

.relation-graph__header {
  text-align: center;
  margin-bottom: 20px;
}

.relation-graph__title {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--color-primary-white);
  margin-bottom: 4px;
}

.relation-graph__subtitle {
  font-size: 13px;
  color: var(--color-light-gray);
}

.relation-graph__container {
  position: relative;
  min-height: 500px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.relation-graph__svg {
  width: 100%;
  height: 500px;
}

.relation-line {
  opacity: 0.6;
  transition: all 0.3s;
}

.relation-line:hover {
  opacity: 1;
  stroke-width: 3;
}

.faction-node {
  cursor: pointer;
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 2;
  transition: all 0.3s;
}

.faction-node:hover {
  opacity: 0.8;
  stroke-width: 3;
}

.character-node {
  cursor: pointer;
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 2;
  transition: all 0.3s;
}

.character-node:hover {
  transform: scale(1.1);
}

.character-node.is-selected {
  stroke-width: 3;
  stroke: #f87171;
}

.node-label {
  fill: var(--color-primary-white);
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
}

.character-initial {
  fill: var(--color-primary-white);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
}

.character-name {
  fill: var(--color-light-gray);
  font-size: 11px;
  text-anchor: middle;
  pointer-events: none;
}

.character-node:hover + circle + text + text,
.character-node.is-selected + circle + text + text {
  fill: var(--color-primary-white);
}

.relation-graph__legend {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-mid-gray);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-symbol {
  width: 16px;
  height: 16px;
}

.legend-symbol--faction {
  background: linear-gradient(135deg, var(--color-tech-blue) 0%, var(--color-accent-blue) 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.legend-symbol--character {
  background: linear-gradient(135deg, var(--color-accent-red) 0%, var(--color-accent-dark-red) 100%);
  border-radius: 50%;
}

.legend-text {
  font-size: 12px;
  color: var(--color-light-gray);
}
</style>