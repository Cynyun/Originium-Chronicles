<template>
  <div class="grid-animation">
    <div class="grid-animation__container">
      <div 
        v-for="line in horizontalLines" 
        :key="'h-' + line.id" 
        class="grid-animation__line grid-animation__line--horizontal"
        :style="line.style"
      ></div>
      <div 
        v-for="line in verticalLines" 
        :key="'v-' + line.id" 
        class="grid-animation__line grid-animation__line--vertical"
        :style="line.style"
      ></div>
      <div 
        v-for="node in nodes" 
        :key="'n-' + node.id" 
        class="grid-animation__node"
        :style="node.style"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const horizontalLines = ref([])
const verticalLines = ref([])
const nodes = ref([])

const generateGrid = () => {
  const hLines = []
  const vLines = []
  const gridNodes = []
  
  for (let i = 0; i < 8; i++) {
    hLines.push({
      id: i,
      style: {
        top: `${(i + 1) * 12.5}%`,
        animationDelay: `${i * 0.2}s`
      }
    })
  }
  
  for (let i = 0; i < 12; i++) {
    vLines.push({
      id: i,
      style: {
        left: `${(i + 1) * 8}%`,
        animationDelay: `${i * 0.15}s`
      }
    })
  }
  
  for (let i = 0; i < 15; i++) {
    gridNodes.push({
      id: i,
      style: {
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 90 + 5}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`
      }
    })
  }
  
  horizontalLines.value = hLines
  verticalLines.value = vLines
  nodes.value = gridNodes
}

onMounted(() => {
  generateGrid()
})
</script>

<style scoped>
.grid-animation {
  position: absolute;
  inset: 0;
  overflow: hidden;
  perspective: 1000px;
}

.grid-animation__container {
  position: absolute;
  inset: -50%;
  transform-style: preserve-3d;
  animation: gridRotate 30s linear infinite;
}

.grid-animation__line {
  position: absolute;
  background: var(--color-accent-red);
  opacity: 0.15;
  animation: gridPulse 4s ease-in-out infinite;
}

.grid-animation__line--horizontal {
  left: 0;
  right: 0;
  height: 1px;
}

.grid-animation__line--vertical {
  top: 0;
  bottom: 0;
  width: 1px;
}

.grid-animation__node {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--color-accent-red);
  border-radius: 50%;
  animation: nodePulse 3s ease-in-out infinite;
}

@keyframes gridRotate {
  0% {
    transform: rotateX(60deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(60deg) rotateZ(360deg);
  }
}

@keyframes gridPulse {
  0%, 100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes nodePulse {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.8;
  }
}
</style>
