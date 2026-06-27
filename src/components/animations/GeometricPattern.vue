<template>
  <div class="geometric-pattern">
    <div v-for="shape in shapes" :key="shape.id" class="geometric-shape" :class="shape.type" :style="shape.style"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const shapes = ref([])

const generateShapes = () => {
  const types = ['diamond', 'triangle', 'hexagon', 'square']
  const newShapes = []

  for (let i = 0; i < 12; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const size = 20 + Math.random() * 60

    newShapes.push({
      id: i,
      type,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 90}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${8 + Math.random() * 7}s`,
        opacity: 0.1 + Math.random() * 0.2
      }
    })
  }

  shapes.value = newShapes
}

onMounted(() => {
  generateShapes()
})
</script>

<style scoped>
.geometric-pattern {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.geometric-shape {
  position: absolute;
  border: 1px solid var(--color-tech-blue);
  animation: geometricFloat 10s ease-in-out infinite;
}

.geometric-shape.diamond {
  transform: rotate(45deg);
}

.geometric-shape.triangle {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 52px solid var(--color-tech-blue);
  background: transparent;
}

.geometric-shape.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.geometric-shape.square {
  transform: rotate(15deg);
}

@keyframes geometricFloat {

  0%,
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }

  25% {
    transform: translateY(-20px) rotate(90deg) scale(1.1);
  }

  50% {
    transform: translateY(0) rotate(180deg) scale(0.9);
  }

  75% {
    transform: translateY(20px) rotate(270deg) scale(1.05);
  }
}
</style>
