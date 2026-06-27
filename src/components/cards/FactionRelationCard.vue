<template>
  <div class="faction-relation-card">
    <div class="faction-relation-card__header">
      <h3 class="faction-relation-card__title">势力关系图谱</h3>
      <p class="faction-relation-card__subtitle">派系间的联系与互动</p>
    </div>

    <div class="faction-relation-card__network">
      <div class="faction-relation-card__central-node" :style="{ borderColor: centralFaction.color, boxShadow: `0 0 20px ${centralFaction.color}40` }">
        <img 
          v-if="isImage(centralFaction.icon)" 
          :src="centralFaction.icon" 
          :alt="centralFaction.name"
          class="faction-relation-card__central-icon"
        />
        <span v-else class="faction-relation-card__central-icon-text">{{ centralFaction.icon || '◇' }}</span>
        <span class="faction-relation-card__central-name">{{ centralFaction.name }}</span>
      </div>

      <svg class="faction-relation-card__lines" viewBox="0 0 400 300">
        <defs>
          <linearGradient :id="'line-gradient-' + centralFaction.id" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :stop-color="centralFaction.color" />
            <stop offset="100%" :stop-color="relatedFactions[0]?.color || '#666'" />
          </linearGradient>
        </defs>
        <line 
          v-for="(rel, index) in relatedFactions" 
          :key="rel.id"
          x1="200" 
          y1="150" 
          :x2="getRelationPosition(index).x" 
          :y2="getRelationPosition(index).y"
          :stroke="`url(#line-gradient-${centralFaction.id})`"
          stroke-width="2"
          stroke-dasharray="5,5"
          class="faction-relation-card__line"
          :style="{ animationDelay: `${index * 200}ms` }"
        />
      </svg>

      <div 
        v-for="(rel, index) in relatedFactions" 
        :key="rel.id"
        class="faction-relation-card__relation-node"
        :style="{ 
          left: `${getRelationPosition(index).x}px`, 
          top: `${getRelationPosition(index).y}px`,
          borderColor: rel.color
        }"
      >
        <div class="faction-relation-card__relation-icon-wrapper">
          <img 
            v-if="isImage(rel.icon)" 
            :src="rel.icon" 
            :alt="rel.name"
            class="faction-relation-card__relation-icon"
          />
          <span v-else class="faction-relation-card__relation-icon-text">{{ rel.icon || '◇' }}</span>
        </div>
        <span class="faction-relation-card__relation-name">{{ rel.name }}</span>
      </div>
    </div>

    <div class="faction-relation-card__legend">
      <div class="faction-relation-card__legend-item">
        <span class="faction-relation-card__legend-dot" :style="{ background: centralFaction.color }"></span>
        <span>{{ centralFaction.name }}</span>
      </div>
      <div class="faction-relation-card__legend-item">
        <span class="faction-relation-card__legend-line"></span>
        <span>关联关系</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  centralFaction: {
    type: Object,
    required: true
  },
  allFactions: {
    type: Array,
    required: true
  }
})

const isImage = (icon) => {
  return icon && (icon.endsWith('.png') || icon.endsWith('.svg') || icon.endsWith('.webp'))
}

const relatedFactions = computed(() => {
  if (!props.centralFaction.related_factions) return []
  return props.centralFaction.related_factions
    .map(id => props.allFactions.find(f => f.id === id))
    .filter(Boolean)
})

const getRelationPosition = (index) => {
  const total = relatedFactions.value.length || 1
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  const radius = 100
  return {
    x: 200 + Math.cos(angle) * radius,
    y: 150 + Math.sin(angle) * radius
  }
}
</script>

<style scoped>
.faction-relation-card {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 24px;
}

.faction-relation-card__header {
  margin-bottom: 24px;
}

.faction-relation-card__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-white);
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.faction-relation-card__subtitle {
  font-size: 13px;
  color: var(--color-light-gray);
}

.faction-relation-card__network {
  position: relative;
  width: 400px;
  height: 300px;
  margin: 0 auto;
}

.faction-relation-card__central-node {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 25px;
  background: var(--color-primary-black);
  border: 3px solid;
  border-radius: 12px;
}

.faction-relation-card__central-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.faction-relation-card__central-icon-text {
  font-size: 36px;
  color: var(--color-accent-red);
}

.faction-relation-card__central-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-white);
}

.faction-relation-card__lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.faction-relation-card__line {
  opacity: 0;
  animation: drawLine 0.5s ease-out forwards;
}

@keyframes drawLine {
  from {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  to {
    stroke-dashoffset: 0;
    opacity: 0.6;
  }
}

.faction-relation-card__relation-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 15px;
  background: var(--color-primary-black);
  border: 2px solid;
  border-radius: 8px;
  opacity: 0;
  animation: fadeInScale 0.4s ease-out forwards;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.faction-relation-card__relation-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.faction-relation-card__relation-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.faction-relation-card__relation-icon-text {
  font-size: 20px;
  color: var(--color-accent-red);
}

.faction-relation-card__relation-name {
  font-size: 11px;
  color: var(--color-light-gray);
  white-space: nowrap;
}

.faction-relation-card__legend {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--color-mid-gray);
}

.faction-relation-card__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-light-gray);
}

.faction-relation-card__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.faction-relation-card__legend-line {
  width: 20px;
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    var(--color-light-gray),
    var(--color-light-gray) 4px,
    transparent 4px,
    transparent 6px
  );
}
</style>