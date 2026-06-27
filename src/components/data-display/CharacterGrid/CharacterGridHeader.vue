<template>
  <div class="character-grid__header">
    <h3 class="character-grid__title">{{ title }}</h3>
    <p class="character-grid__subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '人物关系网络'
  },
  subtitle: {
    type: String,
    default: '点击人物查看详细关系'
  }
})
</script>

<style scoped>
.character-grid__header {
  text-align: center;
  margin-bottom: 24px;
}

.character-grid__title {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--color-primary-white);
  margin-bottom: 4px;
}

.character-grid__subtitle {
  font-size: 13px;
  color: var(--color-light-gray);
}
</style>