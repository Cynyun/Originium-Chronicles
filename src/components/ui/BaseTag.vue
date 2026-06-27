<template>
  <span class="tag" :class="[`tag--${variant}`, `tag--${size}`]" @click="handleClick">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'faction', 'character', 'event', 'status'].includes(v)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v)
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-body);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid transparent;
  transition: var(--transition-fast);
}

.tag--small {
  padding: 2px 8px;
  font-size: 10px;
}

.tag--medium {
  padding: 4px 12px;
  font-size: 12px;
}

.tag--large {
  padding: 6px 16px;
  font-size: 14px;
}

.tag--default {
  color: var(--color-light-gray);
  border-color: var(--color-mid-gray);
  background: transparent;
}

.tag--faction {
  color: var(--color-accent-red);
  border-color: var(--color-accent-dark-red);
  background: rgba(139, 0, 0, 0.1);
}

.tag--character {
  color: var(--color-tech-blue);
  border-color: var(--color-tech-blue-dim);
  background: rgba(0, 122, 204, 0.1);
}

.tag--event {
  color: var(--color-primary-white);
  border-color: var(--color-accent-red);
  background: var(--color-accent-dark-red);
}

.tag--status {
  color: var(--color-primary-white);
  border-color: var(--color-mid-gray);
  background: var(--color-deep-gray);
}

.tag[clickable] {
  cursor: pointer;
}

.tag[clickable]:hover {
  opacity: 0.8;
}
</style>
