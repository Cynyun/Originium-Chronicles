<template>
  <svg class="character-grid__connections">
    <defs>
      <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="var(--color-accent-red)" stop-opacity="0.8" />
        <stop offset="50%" stop-color="var(--color-accent-bright-red)" stop-opacity="1" />
        <stop offset="100%" stop-color="var(--color-accent-red)" stop-opacity="0.8" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <line
      v-for="(link, index) in links"
      :key="index"
      :x1="getPosition(link.source).x + 28"
      :y1="getPosition(link.source).y + 28"
      :x2="getPosition(link.target).x + 28"
      :y2="getPosition(link.target).y + 28"
      :class="getLinkClass(link)"
      filter="url(#glow)"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  links: {
    type: Array,
    required: true
  },
  nodePositions: {
    type: Object,
    required: true
  }
})

const getPosition = (charId) => {
  const pos = props.nodePositions[charId]
  if (pos) return pos
  return { x: 0, y: 0 }
}

const getLinkClass = (link) => {
  return `connection-line connection-${link.type || 'default'}`
}
</script>

<style scoped>
.character-grid__connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.connection-line {
  stroke: var(--color-accent-red);
  stroke-width: 2;
  fill: none;
  opacity: 0.6;
  transition: all var(--transition-normal);
}

.connection-alliance {
  stroke: var(--color-tech-blue);
}

.connection-enemy {
  stroke: var(--color-accent-red);
  stroke-dasharray: 8, 4;
}

.connection-family {
  stroke: var(--color-accent-gold);
}

.connection-mentor {
  stroke: var(--color-light-gray);
  stroke-dasharray: 4, 2;
}
</style>