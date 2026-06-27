<template>
  <div class="character-grid__legend">
    <div v-for="item in legendItems" :key="item.type" class="legend-item">
      <span :class="['legend-color', `relationship-${item.type}`]"></span>
      <span class="legend-text">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
const legendItems = [
  { type: 'alliance', label: '同盟' },
  { type: 'enemy', label: '敌对' },
  { type: 'family', label: '亲属' },
  { type: 'mentor', label: '师徒' }
]
</script>

<style scoped>
.character-grid__legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-mid-gray);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 3px;
  border-radius: 2px;
}

.legend-color.relationship-alliance {
  background: var(--color-tech-blue);
}

.legend-color.relationship-enemy {
  background: var(--color-accent-red);
  background-image: repeating-linear-gradient(90deg,
      var(--color-accent-red),
      var(--color-accent-red) 6px,
      transparent 6px,
      transparent 10px);
}

.legend-color.relationship-family {
  background: var(--color-accent-gold);
}

.legend-color.relationship-mentor {
  background: var(--color-light-gray);
  background-image: repeating-linear-gradient(90deg,
      var(--color-light-gray),
      var(--color-light-gray) 3px,
      transparent 3px,
      transparent 5px);
}

.legend-text {
  font-size: 12px;
  color: var(--color-light-gray);
}
</style>