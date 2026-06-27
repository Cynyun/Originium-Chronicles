<template>
  <div class="relationship-graph" ref="container">
    <svg ref="svgRef" class="relationship-graph__svg">
      <defs>
        <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#A52A2A" />
        </marker>
        <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#00BFFF" />
        </marker>
        <marker id="arrowhead-gray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#888888" />
        </marker>
      </defs>
      <g ref="linksGroup"></g>
      <g ref="nodesGroup"></g>
    </svg>
    <div class="relationship-graph__legend">
      <div class="relationship-graph__legend-item">
        <span class="relationship-graph__legend-color" style="background: #A52A2A"></span>
        <span>敌对</span>
      </div>
      <div class="relationship-graph__legend-item">
        <span class="relationship-graph__legend-color" style="background: #00BFFF"></span>
        <span>合作</span>
      </div>
      <div class="relationship-graph__legend-item">
        <span class="relationship-graph__legend-color" style="background: #888888"></span>
        <span>中立</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  nodes: {
    type: Array,
    required: true
  },
  links: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    default: 'faction'
  }
})

const emit = defineEmits(['nodeClick'])

const svgRef = ref(null)
const linksGroup = ref(null)
const nodesGroup = ref(null)
const container = ref(null)

let simulation = null
let width = 800
let height = 500

const relationshipColors = {
  '敌对': '#A52A2A',
  '合作': '#00BFFF',
  '信任': '#00BFFF',
  '中立': '#888888',
  '未知': '#444444',
  '依赖': '#00BFFF',
  '守护': '#00BFFF',
  '忠诚': '#00BFFF',
  '友好': '#00BFFF',
  '搭档': '#00BFFF',
  '复杂': '#888888'
}

const nodeColors = {
  faction: '#A52A2A',
  character: '#00BFFF'
}

class ForceNode {
  constructor(data, index) {
    this.id = data.id
    this.name = data.name
    this.data = data
    this.x = width / 2 + (Math.random() - 0.5) * 400
    this.y = height / 2 + (Math.random() - 0.5) * 300
    this.vx = 0
    this.vy = 0
    this.radius = props.type === 'faction' ? 35 : 25
    this.index = index
  }
}

class ForceLink {
  constructor(source, target, type) {
    this.source = source
    this.target = target
    this.type = type
  }
}

const initSimulation = () => {
  if (!props.nodes.length) return

  const nodes = props.nodes.map((n, i) => new ForceNode(n, i))
  const nodeMap = {}
  nodes.forEach(n => nodeMap[n.id] = n)

  const links = props.links
    .filter(l => nodeMap[l.source] && nodeMap[l.target])
    .map(l => new ForceLink(nodeMap[l.source], nodeMap[l.target], l.type))

  simulation = {
    nodes,
    links,
    alpha: 1,
    alphaMin: 0.001,
    alphaDecay: 0.02,
    velocityDecay: 0.4
  }

  return simulation
}

const simulationStep = () => {
  if (!simulation || simulation.alpha < simulation.alphaMin) return

  const { nodes, links } = simulation

  links.forEach(link => {
    const dx = link.target.x - link.source.x
    const dy = link.target.y - link.source.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const force = -100 / (dist * dist)

    link.source.vx += dx / dist * force * simulation.alpha
    link.source.vy += dy / dist * force * simulation.alpha
    link.target.vx -= dx / dist * force * simulation.alpha
    link.target.vy -= dy / dist * force * simulation.alpha
  })

  nodes.forEach(node => {
    node.vx += (width / 2 - node.x) * 0.001 * simulation.alpha
    node.vy += (height / 2 - node.y) * 0.001 * simulation.alpha
  })

  nodes.forEach(node => {
    node.x += node.vx * simulation.velocityDecay
    node.y += node.vy * simulation.velocityDecay

    node.x = Math.max(node.radius, Math.min(width - node.radius, node.x))
    node.y = Math.max(node.radius, Math.min(height - node.radius, node.y))
  })

  simulation.alpha *= (1 - simulation.alphaDecay)
}

const render = () => {
  if (!simulation || !linksGroup.value || !nodesGroup.value) return

  const { nodes, links } = simulation
  const color = nodeColors[props.type] || '#A52A2A'

  linksGroup.value.innerHTML = ''
  links.forEach(link => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', link.source.x)
    line.setAttribute('y1', link.source.y)
    line.setAttribute('x2', link.target.x)
    line.setAttribute('y2', link.target.y)
    line.setAttribute('stroke', relationshipColors[link.type] || '#888888')
    line.setAttribute('stroke-width', '2')
    line.setAttribute('stroke-opacity', '0.6')

    const markerId = link.type === '敌对' ? 'arrowhead-red' :
                     link.type === '中立' ? 'arrowhead-gray' : 'arrowhead-blue'
    line.setAttribute('marker-end', `url(#${markerId})`)

    linksGroup.value.appendChild(line)
  })

  nodesGroup.value.innerHTML = ''
  nodes.forEach(node => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('class', 'node')
    g.style.cursor = 'pointer'
    g.addEventListener('click', () => emit('nodeClick', node.data))

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', node.x)
    circle.setAttribute('cy', node.y)
    circle.setAttribute('r', node.radius)
    circle.setAttribute('fill', color)
    circle.setAttribute('stroke', '#222')
    circle.setAttribute('stroke-width', '2')

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', node.x)
    text.setAttribute('y', node.y + node.radius + 18)
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('fill', '#fff')
    text.setAttribute('font-size', '12')
    text.setAttribute('font-family', 'Orbitron, sans-serif')
    text.textContent = node.name

    g.appendChild(circle)
    g.appendChild(text)
    nodesGroup.value.appendChild(g)
  })
}

let animationId = null

const animate = () => {
  simulationStep()
  render()
  if (simulation && simulation.alpha >= simulation.alphaMin) {
    animationId = requestAnimationFrame(animate)
  }
}

const updateDimensions = () => {
  if (container.value) {
    width = container.value.clientWidth
    height = 500
    if (svgRef.value) {
      svgRef.value.setAttribute('width', width)
      svgRef.value.setAttribute('height', height)
    }
  }
}

const startSimulation = async () => {
  await nextTick()
  updateDimensions()

  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  initSimulation()

  if (simulation && simulation.nodes.length) {
    for (let i = 0; i < 100; i++) {
      simulationStep()
    }
    render()
    animate()
  }
}

let resizeObserver = null

watch(() => props.nodes, () => {
  startSimulation()
}, { deep: true })

onMounted(() => {
  startSimulation()

  resizeObserver = new ResizeObserver(() => {
    updateDimensions()
    if (simulation) {
      for (let i = 0; i < 50; i++) {
        simulationStep()
      }
      render()
    }
  })

  if (container.value) {
    resizeObserver.observe(container.value)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
.relationship-graph {
  position: relative;
  width: 100%;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  overflow: hidden;
}

.relationship-graph__svg {
  display: block;
  width: 100%;
}

.relationship-graph__legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 20px;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--color-mid-gray);
}

.relationship-graph__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-light-gray);
}

.relationship-graph__legend-color {
  width: 12px;
  height: 12px;
}

:deep(.node) {
  transition: transform 0.2s ease;
}

:deep(.node:hover circle) {
  filter: brightness(1.3);
}

:deep(.node:hover) {
  transform-origin: center;
  transform: scale(1.1);
}
</style>
