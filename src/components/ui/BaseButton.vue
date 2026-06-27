<template>
  <button
    class="btn"
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--disabled': disabled, 'btn--loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn__loader"></span>
    <span class="btn__content" :class="{ 'btn__content--hidden': loading }">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition-normal);
  overflow: hidden;
}

.btn--small {
  padding: 8px 16px;
  font-size: 12px;
}

.btn--medium {
  padding: 12px 24px;
  font-size: 14px;
}

.btn--large {
  padding: 16px 32px;
  font-size: 16px;
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-accent-dark-red), var(--color-accent-red));
  color: var(--color-primary-white);
  border-color: var(--color-accent-red);
}

.btn--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-bright-red));
  box-shadow: var(--shadow-glow-red);
}

.btn--secondary {
  background: var(--color-deep-gray);
  color: var(--color-primary-white);
  border-color: var(--color-mid-gray);
}

.btn--secondary:hover:not(:disabled) {
  border-color: var(--color-tech-blue);
  box-shadow: var(--shadow-glow-blue);
}

.btn--outline {
  background: transparent;
  color: var(--color-accent-red);
  border-color: var(--color-accent-dark-red);
}

.btn--outline:hover:not(:disabled) {
  background: rgba(139, 0, 0, 0.1);
  box-shadow: var(--shadow-glow-red);
}

.btn--ghost {
  background: transparent;
  color: var(--color-light-gray);
  border-color: transparent;
}

.btn--ghost:hover:not(:disabled) {
  color: var(--color-primary-white);
  background: rgba(255, 255, 255, 0.05);
}

.btn--disabled,
.btn--loading {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn__content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn__content--hidden {
  visibility: hidden;
}

.btn__loader {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
