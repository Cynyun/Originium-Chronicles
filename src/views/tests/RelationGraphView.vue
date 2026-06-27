<template>
  <div class="relation-graph-view">
    <div v-if="isLoading" class="loading-state">
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>加载失败: {{ error }}</p>
    </div>

    <RelationGraph 
      v-else
      :graph-data="graphData"
      :available-factions="availableFactions" 
      :selected-faction="selectedFaction"
      @node-select="handleNodeSelect"
      @faction-change="handleFactionChange"
    />

    <div v-if="selectedNode" class="selected-detail">
      <h3>选中详情</h3>
      <div class="detail-content">
        <div class="detail-icon" :class="selectedNode.type"
          :style="selectedNode.color ? { background: selectedNode.color } : {}">
          {{ selectedNode.label?.[0] || selectedNode.label }}
        </div>
        <div class="detail-info">
          <h4>{{ selectedNode.label }}</h4>
          <p class="detail-type">{{ getNodeTypeLabel(selectedNode.type) }}</p>
          <p v-if="selectedNode.department" class="detail-dept">{{ selectedNode.department }}</p>
          <p v-if="selectedNode.metadata.description" class="detail-desc">
            {{ selectedNode.metadata.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RelationGraph from '@/components/relation-graph/RelationGraph.vue'
import { useRelationGraphData } from '@/composables/useRelationGraphData'

const {
  graphData,
  isLoading,
  error,
  loadGraphData,
  filterByFaction,
  selectedFaction,
  availableFactions
} = useRelationGraphData()

const selectedNode = ref(null)

const handleNodeSelect = (node) => {
  selectedNode.value = selectedNode.value?.id === node.id ? null : node
}

const handleFactionChange = (factionId) => {
  filterByFaction(factionId)
}

const getNodeTypeLabel = (type) => {
  const labels = {
    location: '阵营/地点',
    person: '人物',
    department: '部门'
  }
  return labels[type] || '未知'
}

onMounted(() => {
  loadGraphData()
})
</script>

<style scoped>
.relation-graph-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.view-header {
  text-align: center;
  margin-bottom: 32px;
}

.view-title {
  font-family: var(--font-display);
  font-size: 32px;
  color: var(--color-primary-white);
  margin-bottom: 8px;
}

.view-subtitle {
  font-size: 16px;
  color: var(--color-light-gray);
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  color: var(--color-light-gray);
}

.selected-detail {
  margin-top: 24px;
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid var(--color-accent-dark-red);
  padding: 20px;
  border-radius: 8px;
}

.selected-detail h3 {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-primary-white);
  margin-bottom: 16px;
}

.detail-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.detail-icon.location {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  border-radius: 0;
  background: linear-gradient(135deg, var(--color-tech-blue) 0%, var(--color-accent-blue) 100%);
}

.detail-icon.person {
  background: linear-gradient(135deg, var(--color-accent-red) 0%, var(--color-accent-dark-red) 100%);
}

.detail-icon.department {
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-tech-blue) 0%, var(--color-accent-blue) 100%);
}

.detail-info h4 {
  font-size: 18px;
  color: var(--color-primary-white);
  margin-bottom: 4px;
}

.detail-type {
  font-size: 12px;
  color: var(--color-accent-bright-red);
  margin-bottom: 4px;
}

.detail-dept {
  font-size: 12px;
  color: var(--color-tech-blue);
  margin-bottom: 8px;
}

.detail-desc {
  font-size: 13px;
  color: var(--color-light-gray);
  line-height: 1.6;
}
</style>
