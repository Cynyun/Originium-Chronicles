<template>
  <g class="edge" :class="`edge--${edge.type}`">
    <path v-if="edge.type === 'faction'" :d="factionEdgePath" :stroke="edgeColor" stroke-width="2"
      class="edge__line edge__line--faction" />
    <line v-else-if="edge.type === 'department'" :x1="sourcePos.x" :y1="sourcePos.y" :x2="targetPos.x" :y2="targetPos.y" 
      :stroke="edgeColor" stroke-width="1.5" class="edge__line edge__line--department" />
    <line v-else-if="edge.type === 'internal'" :x1="sourcePos.x" :y1="sourcePos.y" :x2="targetPos.x" :y2="targetPos.y" 
      :stroke="edgeColor" stroke-width="2" class="edge__line edge__line--internal" />
    <line v-else :x1="sourcePos.x" :y1="sourcePos.y" :x2="targetPos.x" :y2="targetPos.y" :stroke="edgeColor" 
      stroke-width="2" :stroke-dasharray="dashArray" class="edge__line" marker-end="url(#arrowhead)" />
    <text v-if="showLabel" :x="labelPosition.x" :y="labelPosition.y" class="edge__label">{{ edge.label }}</text>
  </g>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  edge: {
    type: Object,
    required: true
  },
  nodePositions: {
    type: Object,
    required: true
  }
})

const sourcePos = computed(() => {
  return props.nodePositions[props.edge.source] || { x: 100, y: 100 }
})

const targetPos = computed(() => {
  return props.nodePositions[props.edge.target] || { x: 200, y: 200 }
})

const labelPosition = computed(() => {
  if (props.edge.type === 'faction') {
    const midX = (sourcePos.value.x + targetPos.value.x) / 2
    const midY = (sourcePos.value.y + targetPos.value.y) / 2
    return { x: midX, y: midY - 8 }
  }
  return {
    x: (sourcePos.value.x + targetPos.value.x) / 2,
    y: (sourcePos.value.y + targetPos.value.y) / 2 - 10
  }
})

const factionEdgePath = computed(() => {
  const x1 = sourcePos.value.x
  const y1 = sourcePos.value.y
  const x2 = targetPos.value.x
  const y2 = targetPos.value.y
  
  const midX = (x1 + x2) / 2
  const controlOffset = Math.abs(x2 - x1) * 0.3
  
  return `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`
})

const showLabel = computed(() => {
  if (props.edge.type === 'faction' || props.edge.type === 'department') return false
  return props.edge.label && !['member', '合作', '敌对'].includes(props.edge.label)
})

const edgeColor = computed(() => {
  if (props.edge.type === 'faction') {
    return props.edge.color || '#888888'
  }
  const colors = {
    alliance: '#3b82f6',
    enemy: '#dc2626',
    family: '#f59e0b',
    mentor: '#9ca3af',
    trust: '#10b981',
    cooperation: '#8b5cf6',
    partner: '#10b981',
    '依赖': '#f59e0b',
    '守护': '#3b82f6',
    '忠诚': '#10b981',
    '敌对': '#dc2626',
    '搭档': '#8b5cf6',
    '同事': '#6b7280',
    '亲情': '#f59e0b',
    '警惕': '#f97316',
    '复杂': '#9ca3af',
    '友好': '#10b981',
    default: '#dc2626'
  }
  return colors[props.edge.label] || colors.default
})

const dashArray = computed(() => {
  if (props.edge.type === 'faction') return ''
  const dashes = {
    enemy: '8, 4',
    mentor: '4, 2',
    '敌对': '8, 4',
    '警惕': '4, 2',
    default: ''
  }
  return dashes[props.edge.label] || dashes.default
})
</script>

<style scoped>
.edge {
  pointer-events: none;
}

.edge__line {
  opacity: 0.6;
  transition: all 0.3s;
}

.edge--faction .edge__line--faction {
  opacity: 0.35;
  stroke-width: 2;
}

.edge--department .edge__line--department {
  opacity: 0.4;
  stroke-width: 1.5;
}

.edge--internal .edge__line--internal {
  opacity: 0.75;
  stroke-width: 2;
  stroke-dasharray: 6, 3;
}

.edge--external .edge__line {
  opacity: 0.6;
  stroke-width: 2;
}

.edge--relation .edge__line {
  opacity: 0.7;
}

.edge:hover .edge__line {
  opacity: 1;
  stroke-width: 3;
}

.edge--faction:hover .edge__line--faction {
  opacity: 0.7;
  stroke-width: 3;
}

.edge--internal:hover .edge__line--internal {
  opacity: 1;
  stroke-width: 3;
}

.edge__label {
  fill: var(--color-light-gray);
  font-size: 10px;
  font-weight: 500;
  text-anchor: middle;
  background: rgba(10, 10, 15, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}
</style>