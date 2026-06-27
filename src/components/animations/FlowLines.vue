<template>
  <div class="flow-lines">
    <div v-for="i in lineCount" :key="i" class="flow-line" :style="getLineStyle(i)">
      <div class="flow-line__segment"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lineCount: {
    type: Number,
    default: 5
  },
  speed: {
    type: Number,
    default: 3
  },
  color: {
    type: String,
    default: '#8B0000'
  }
})

const lines = ref([])

const getLineStyle = (index) => {
  const height = 2 + Math.random() * 4
  const top = (index / 5) * 80 + Math.random() * 10
  const delay = Math.random() * 2
  const duration = 3 + Math.random() * 2

  return {
    height: `${height}px`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.flow-lines {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.4;
}

.flow-line {
  position: absolute;
  left: -100%;
  width: 300%;
  background: linear-gradient(90deg, transparent, var(--color-accent-red), transparent, var(--color-accent-red), transparent);
  animation: flowLine 3s linear infinite;
}

.flow-line__segment {
  width: 100%;
  height: 100%;
  background: inherit;
  filter: blur(1px);
}

@keyframes flowLine {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(66.67%);
  }
}
</style>
