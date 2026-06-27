<template>
  <g class="node" :transform="`translate(${position.x}, ${position.y})`" @click="$emit('click')">
    <template v-if="node.type === 'location'">
      <rect :x="-45" :y="-18" width="90" height="36" rx="18" :fill="node.color || '#4A90E2'"
        class="node__shape node__shape--location" :class="{ 'is-selected': isSelected }" />
      <text class="node__label">{{ node.label }}</text>
    </template>

    <template v-else-if="node.type === 'department'">
      <rect :x="-35" :y="-14" width="70" height="28" rx="14" :fill="node.color || '#4A90E2'"
        class="node__shape node__shape--department" :class="{ 'is-selected': isSelected }" />
      <text class="node__label node__label--department">{{ node.label }}</text>
    </template>

    <template v-else>
      <circle r="24" :fill="node.color || '#dc2626'" class="node__shape node__shape--person"
        :class="{ 'is-selected': isSelected }" />
      <circle r="20" fill="rgba(10, 10, 15, 0.8)" />
      <text class="node__initial">{{ node.label?.[0] || '?' }}</text>
      <text class="node__name">{{ node.label }}</text>
    </template>
  </g>
</template>

<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  },
  position: {
    type: Object,
    default: () => ({ x: 100, y: 100 })
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.node {
  cursor: pointer;
  transition: all 0.3s;
}

.node__shape {
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 2;
  transition: all 0.3s;
}

.node__shape:hover {
  opacity: 0.8;
  stroke-width: 3;
}

.node__shape.is-selected {
  stroke-width: 3;
  stroke: #f87171;
  filter: url(#nodeGlow);
}

.node__shape--location {
  opacity: 0.8;
}

.node__shape--department {
  opacity: 0.6;
  stroke-width: 2;
  stroke: rgba(255, 255, 255, 0.4);
}

.node__shape--department:hover {
  opacity: 0.85;
}

.node__shape--person {
  filter: url(#nodeGlow);
}

.node__shape--person:hover,
.node__shape--person.is-selected {
  transform: scale(1.1);
}

.node__label {
  fill: var(--color-primary-white);
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
}

.node__label--department {
  font-size: 11px;
  font-weight: 500;
}

.node__initial {
  fill: var(--color-primary-white);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
}

.node__name {
  fill: var(--color-light-gray);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: text-before-edge;
  pointer-events: none;
  transform: translateY(25px);
}

.node:hover .node__name,
.node.is-selected .node__name {
  fill: var(--color-primary-white);
}
</style>