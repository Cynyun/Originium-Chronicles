<template>
  <div class="legend">
    <div class="legend__section">
      <h4 class="legend__title">节点类型</h4>
      <div class="legend__items">
        <div class="legend__item">
          <span class="legend__symbol legend__symbol--location"></span>
          <span class="legend__text">阵营/地点</span>
        </div>
        <div class="legend__item">
          <span class="legend__symbol legend__symbol--person"></span>
          <span class="legend__text">人物</span>
        </div>
      </div>
    </div>

    <div class="legend__section">
      <h4 class="legend__title">关系类型</h4>
      <div class="legend__items">
        <div v-for="item in relationTypes" :key="item.type" class="legend__item">
          <span class="legend__line" :style="{ background: item.color, backgroundImage: item.dashed ? dashedPattern : 'none' }"></span>
          <span class="legend__text">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const relationTypes = [
  { type: 'alliance', label: '同盟', color: '#3b82f6', dashed: false },
  { type: 'enemy', label: '敌对', color: '#dc2626', dashed: true },
  { type: 'family', label: '亲属', color: '#f59e0b', dashed: false },
  { type: 'mentor', label: '师徒', color: '#9ca3af', dashed: true },
  { type: 'trust', label: '信任', color: '#10b981', dashed: false },
  { type: 'cooperation', label: '合作', color: '#8b5cf6', dashed: false }
]

const dashedPattern = 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 6px, transparent 6px, transparent 10px)'
</script>

<style scoped>
.legend {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-mid-gray);
  flex-wrap: wrap;
}

.legend__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend__title {
  font-size: 13px;
  color: var(--color-accent-red);
  font-weight: 600;
  margin-bottom: 4px;
}

.legend__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend__symbol {
  width: 16px;
  height: 16px;
}

.legend__symbol--location {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  border-radius: 9px;
  width: 24px;
}

.legend__symbol--person {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border-radius: 50%;
}

.legend__line {
  width: 32px;
  height: 3px;
  border-radius: 2px;
}

.legend__text {
  font-size: 12px;
  color: var(--color-light-gray);
}
</style>