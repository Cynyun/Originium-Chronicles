<template>
  <div class="relation-graph">
    <div class="relation-graph__header">
      <h3 class="relation-graph__title">{{ title }}</h3>
      <p class="relation-graph__subtitle">{{ subtitle }}</p>
    </div>

    <div class="relation-graph__controls">
      <div class="relation-graph__filter">
        <label class="relation-graph__filter-label">选择派系</label>
        <BaseSelect 
          v-model="localFaction"
          :options="availableFactions"
          placeholder="请选择派系"
        />
      </div>
    </div>

    <div class="relation-graph__container">
      <svg class="relation-graph__svg" :viewBox="`0 0 ${containerWidth} ${containerHeight}`">
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--color-accent-red)" stop-opacity="0.8" />
            <stop offset="50%" stop-color="var(--color-accent-bright-red)" stop-opacity="1" />
            <stop offset="100%" stop-color="var(--color-accent-red)" stop-opacity="0.8" />
          </linearGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Edge
          v-for="edge in graphData.edges"
          :key="edge.id"
          :edge="edge"
          :nodes="graphData.nodes"
          :nodePositions="nodePositions"
        />

        <Node
          v-for="node in graphData.nodes"
          :key="node.id"
          :node="node"
          :position="nodePositions[node.id]"
          :is-selected="selectedId === node.id"
          @click="handleNodeClick(node)"
        />
      </svg>
    </div>

    <Legend />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Node from './Node.vue'
import Edge from './Edge.vue'
import Legend from './Legend.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const props = defineProps({
  title: {
    type: String,
    default: '人物关系图谱'
  },
  subtitle: {
    type: String,
    default: '点击节点查看详情'
  },
  graphData: {
    type: Object,
    required: true
  },
  availableFactions: {
    type: Array,
    default: () => []
  },
  selectedFaction: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['nodeSelect', 'factionChange'])

const selectedId = ref(null)
const containerWidth = ref(1000)
const containerHeight = ref(550)
const localFaction = ref(props.selectedFaction)

watch(() => props.selectedFaction, (newVal) => {
  localFaction.value = newVal
})

watch(localFaction, (newVal) => {
  if (newVal !== props.selectedFaction) {
    emit('factionChange', newVal)
  }
})

const nodePositions = computed(() => {
  const positions = {}
  const nodes = props.graphData.nodes || []

  const departmentNodes = nodes.filter(n => n.type === 'department')
  const personNodes = nodes.filter(n => n.type === 'person')

  if (departmentNodes.length === 0 && personNodes.length === 0) {
    return positions
  }

  const leftColumnX = 120
  const rightStartX = 250
  const rightWidth = containerWidth.value - rightStartX - 50

  if (departmentNodes.length > 0) {
    const deptRows = Math.max(departmentNodes.length, 1)
    const deptRowHeight = containerHeight.value / (deptRows + 1)
    
    departmentNodes.forEach((node, index) => {
      positions[node.id] = {
        x: leftColumnX,
        y: deptRowHeight * (index + 1)
      }
    })
  }

  const personCount = personNodes.length
  if (personCount > 0) {
    const personCols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(personCount))))
    const personRows = Math.ceil(personCount / personCols)
    const personCellWidth = rightWidth / personCols
    const personCellHeight = containerHeight.value / (personRows + 1)

    const departments = [...new Set(personNodes.map(n => n.department))]
    const sortedByDept = [...personNodes].sort((a, b) => {
      const deptOrder = departments.indexOf(a.department) - departments.indexOf(b.department)
      return deptOrder !== 0 ? deptOrder : personNodes.indexOf(a) - personNodes.indexOf(b)
    })

    sortedByDept.forEach((node, index) => {
      const col = index % personCols
      const row = Math.floor(index / personCols)
      positions[node.id] = {
        x: rightStartX + col * personCellWidth + personCellWidth / 2,
        y: personCellHeight * (row + 1)
      }
    })
  }

  return positions
})

const handleNodeClick = (node) => {
  selectedId.value = selectedId.value === node.id ? null : node.id
  emit('nodeSelect', node)
}

const handleFactionChange = (factionId) => {
  emit('factionChange', factionId)
}

const updateContainerSize = () => {
  const container = document.querySelector('.relation-graph__container')
  if (container) {
    containerWidth.value = Math.max(container.clientWidth, 1000)
    containerHeight.value = 550
  }
}

onMounted(() => {
  updateContainerSize()
  window.addEventListener('resize', updateContainerSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerSize)
})

watch(() => props.graphData, () => {
  selectedId.value = null
}, { deep: true })
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
  margin-bottom: 16px;
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

.relation-graph__controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  flex-wrap: wrap;
}

.relation-graph__filter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.relation-graph__filter-label {
  font-size: 14px;
  color: var(--color-light-gray);
}

.relation-graph__container {
  position: relative;
  min-height: 550px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: hidden;
}

.relation-graph__svg {
  width: 100%;
  min-width: 1000px;
  height: 550px;
}
</style>