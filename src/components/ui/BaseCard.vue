<template>
  <div class="card" :class="[`card--${variant}`, { 'card--clickable': clickable }]" @click="handleClick">
    <div v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </div>
    <div class="card__body" :class="{ 'card__body--no-padding': noPadding }">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'faction', 'character', 'timeline'].includes(v)
  },
  clickable: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.card {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  transition: var(--transition-normal);
}

.card--default:hover {
  border-color: var(--color-light-gray);
}

.card--faction {
  border-color: var(--color-accent-dark-red);
}

.card--faction:hover {
  border-color: var(--color-accent-red);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-3px);
}

.card--character {
  border-color: var(--color-tech-blue-dim);
}

.card--character:hover {
  border-color: var(--color-tech-blue);
  box-shadow: var(--shadow-glow-blue);
  transform: translateY(-3px);
}

.card--timeline {
  border-left: 3px solid var(--color-accent-red);
}

.card--timeline:hover {
  background: rgba(139, 0, 0, 0.1);
}

.card--clickable {
  cursor: pointer;
}

.card__header {
  padding: 15px 20px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.card__body {
  padding: 20px;
}

.card__body--no-padding {
  padding: 0;
}

.card__footer {
  padding: 15px 20px;
  border-top: 1px solid var(--color-mid-gray);
}
</style>
