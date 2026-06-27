<template>
  <h2 class="section__title" :class="{ 'section__title--visible': visible }">
    <slot></slot>
  </h2>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.section__title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-primary-white);
  letter-spacing: 2px;
  position: relative;
  padding-left: 20px;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s ease-out;
}

.section__title--visible {
  opacity: 1;
  transform: translateX(0);
}

.section__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 32px;
  background: var(--color-accent-red);
  opacity: 0;
  transition: opacity 0.8s ease-out;
}

.section__title--visible::before {
  opacity: 1;
}
</style>