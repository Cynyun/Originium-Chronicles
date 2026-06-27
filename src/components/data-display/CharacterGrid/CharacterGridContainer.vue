<template>
  <div class="character-grid__container">
    <div class="character-grid__nodes">
      <slot name="nodes"></slot>
    </div>
    <slot name="connections"></slot>
  </div>
</template>

<style scoped>
.character-grid__container {
  position: relative;
  min-height: 400px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.character-grid__nodes {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>