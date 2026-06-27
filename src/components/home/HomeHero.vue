<template>
  <section class="hero">
    <div class="hero__background" :class="{ 'hero__background--visible': showBackground }"></div>
    <div class="hero__content">
      <h1 class="hero__title"
        :class="{ 'hero__title--visible': animationPhase >= 1, 'hero__title--glow': showTitleGlow }">
        <span class="hero__title-cn" :style="titleCnStyle">{{ titleCnText }}</span>
        <span class="hero__title-en" :style="titleEnStyle">{{ titleEnText }}</span>
      </h1>
      <p class="hero__subtitle" :class="{ 'hero__subtitle--visible': animationPhase >= 2 }">
        <span class="hero__subtitle-line1">{{ subtitleLine1 }}</span><br>
        <span class="hero__subtitle-line2">{{ subtitleLine2 }}</span>
      </p>

      <div class="hero__search">
        <div v-if="showResults && searchQuery" class="search-results">
          <div v-if="searchResults.factions.length" class="search-group">
            <h4 class="search-group__title">派系</h4>
            <div v-for="faction in searchResults.factions" :key="faction.id" class="search-item"
              @mousedown="$emit('selectFaction', faction)">
              <span class="search-item__icon faction">{{ getFactionIcon(faction) }}</span>
              <span class="search-item__name">{{ faction.name }}</span>
              <BaseTag variant="faction" size="small">派系</BaseTag>
            </div>
          </div>

          <div v-if="searchResults.characters.length" class="search-group">
            <h4 class="search-group__title">人物</h4>
            <div v-for="char in searchResults.characters" :key="char.id" class="search-item"
              @mousedown="$emit('selectCharacter', char)">
              <span class="search-item__icon character">{{ char.name[0] }}</span>
              <span class="search-item__name">{{ char.name }}</span>
              <BaseTag variant="character" size="small">人物</BaseTag>
            </div>
          </div>

          <div v-if="searchResults.events.length" class="search-group">
            <h4 class="search-group__title">事件</h4>
            <div v-for="event in searchResults.events" :key="event.id" class="search-item"
              @mousedown="$emit('selectEvent', event)">
              <span class="search-item__icon event">▣</span>
              <span class="search-item__name">{{ event.title }}</span>
              <BaseTag variant="event" size="small">{{ event.year }}</BaseTag>
            </div>
          </div>

          <div v-if="!hasResults" class="search-empty">
            未找到 "{{ searchQuery }}" 相关结果
          </div>
        </div>
      </div>

      <div class="hero__actions" :class="{ 'hero__actions--visible': animationPhase >= 3 }">
        <BaseButton variant="primary" size="large" @click="$emit('startExplore')">
          开始探索
        </BaseButton>
      </div>
    </div>
    <div class="hero__scroll-hint" :class="{ 'hero__scroll-hint--visible': showScrollHint }">
      <span>↓</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTag from '@/components/ui/BaseTag.vue'

const props = defineProps({
  factions: { type: Array, default: () => [] },
  characters: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
  canStartAnimation: { type: Boolean, default: true }
})

defineEmits(['selectFaction', 'selectCharacter', 'selectEvent', 'startExplore'])

const searchQuery = ref('')
const showResults = ref(false)

const searchResults = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return { factions: [], characters: [], events: [] }

  return {
    factions: props.factions.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.description?.toLowerCase().includes(query)
    ).slice(0, 3),

    characters: props.characters.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    ).slice(0, 5),

    events: props.events.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.description?.toLowerCase().includes(query)
    ).slice(0, 3)
  }
})

const hasResults = computed(() => {
  const { factions, characters, events } = searchResults.value
  return factions.length > 0 || characters.length > 0 || events.length > 0
})

const getFactionIcon = (faction) => {
  if (faction.icon && faction.icon.startsWith('/')) {
    return '◆'
  }
  return faction.icon || '◆'
}

const animationPhase = ref(0)
const titleCnText = ref('')
const titleEnText = ref('')
const subtitleLine1 = ref('')
const subtitleLine2 = ref('')
const showScrollHint = ref(false)
const showTitleGlow = ref(false)
const showBackground = ref(false)

const titleCnStyle = computed(() => {
  if (animationPhase.value >= 1) {
    return {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
  return {
    opacity: 0.2,
    transform: 'translateY(-20px)'
  }
})

const titleEnStyle = computed(() => {
  if (animationPhase.value >= 1) {
    return {
      opacity: 1
    }
  }
  return {
    opacity: 0
  }
})

const typeText = (text, targetRef, speed = 50) => {
  return new Promise((resolve) => {
    let index = 0
    targetRef.value = ''
    const timer = setInterval(() => {
      if (index < text.length) {
        targetRef.value += text[index]
        index++
      } else {
        clearInterval(timer)
        resolve()
      }
    }, speed)
  })
}

const startAnimation = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))

  animationPhase.value = 1

  await typeText('源石纪事', titleCnText, 80)

  await new Promise(resolve => setTimeout(resolve, 200))

  await new Promise(resolve => setTimeout(resolve, 300))

  await typeText('Originium Chronicles', titleEnText, 40)

  animationPhase.value = 2

  await new Promise(resolve => setTimeout(resolve, 200))

  await typeText('追溯源石之下的真相', subtitleLine1, 60)

  await new Promise(resolve => setTimeout(resolve, 100))

  await typeText('探索泰拉世界的每一个角落', subtitleLine2, 60)

  // 等待最后的文本动画稳定（包括 animationPhase 2 的过渡动画）
  await new Promise(resolve => setTimeout(resolve, 400))

  // 所有下方内容都完成后再显示背景
  showBackground.value = true

  // 背景显示后，显示红色闪烁边框
  showTitleGlow.value = true

  // 背景显示后，再显示按钮
  await new Promise(resolve => setTimeout(resolve, 200))

  animationPhase.value = 3
}

defineExpose({
  setScrollHint: (val) => { showScrollHint.value = val }
})

onMounted(() => {
  if (props.canStartAnimation) {
    startAnimation()
  }
})

watch(() => props.canStartAnimation, (newVal) => {
  if (newVal) {
    startAnimation()
  }
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 60px;
  overflow: hidden;
}

.hero__background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at center, rgba(139, 0, 0, 0.15) 0%, transparent 70%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%);
  z-index: -1;
  opacity: 0;
  transition: opacity 1s ease-out;
}

.hero__background--visible {
  opacity: 1;
}

.hero__background::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0;
  transition: opacity 1s ease-out 0.3s;
}

.hero__background--visible::before {
  opacity: 1;
}

.hero__content {
  text-align: center;
  max-width: 800px;
}

.hero__title {
  margin-bottom: 30px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.8s ease-out;
}

.hero__title--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__title-cn {
  display: inline-block;
  font-family: var(--font-display);
  font-size: clamp(48px, 10vw, 80px);
  font-weight: 700;
  letter-spacing: 8px;
  color: var(--color-primary-white);
  opacity: 0.2;
  transform: translateY(-20px);
  transition: all 0.6s ease-out;
  padding: 10px 40px;
}

.hero__title--glow .hero__title-cn {
  box-shadow: 0 0 20px rgba(139, 0, 0, 0.6), inset 0 0 20px rgba(139, 0, 0, 0.3);
  animation: borderGlow 2s infinite;
  border: 2px solid rgba(139, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.4);
}

.hero__title--visible .hero__title-cn {
  opacity: 1;
  transform: translateY(0);
}

.hero__title-en {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(14px, 3vw, 20px);
  font-weight: 400;
  letter-spacing: 6px;
  color: var(--color-light-gray);
  margin-top: 15px;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.hero__title--visible .hero__title-en {
  opacity: 1;
}

.hero__subtitle {
  font-size: 18px;
  line-height: 2;
  color: var(--color-light-gray);
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease-out;
}

.hero__subtitle--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__subtitle-line1,
.hero__subtitle-line2 {
  display: inline;
}

.hero__actions {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

.hero__actions--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__search {
  max-width: 500px;
  margin: 0 auto 40px;
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 10px;
  background: rgba(20, 20, 20, 0.98);
  border: 1px solid var(--color-mid-gray);
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.search-group {
  padding: 15px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.search-group:last-child {
  border-bottom: none;
}

.search-group__title {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-item:hover {
  background: rgba(139, 0, 0, 0.1);
}

.search-item__icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  border-radius: 4px;
}

.search-item__icon.faction {
  color: var(--color-accent-red);
}

.search-item__icon.character {
  color: var(--color-tech-blue);
  font-weight: 600;
}

.search-item__icon.event {
  color: var(--color-accent-gold);
}

.search-item__name {
  flex: 1;
  font-size: 14px;
  color: var(--color-primary-white);
  text-align: left;
}

.search-item__tag {
  font-size: 11px;
  color: var(--color-light-gray);
  padding: 2px 8px;
  border: 1px solid var(--color-mid-gray);
}

.search-empty {
  padding: 30px;
  text-align: center;
  color: var(--color-light-gray);
  font-size: 14px;
}

.hero__actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__scroll-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.hero__scroll-hint--visible {
  opacity: 1;
}

.hero__scroll-hint span {
  font-size: 36px;
  color: var(--color-accent-red);
}

@keyframes bounce {

  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  50% {
    transform: translateX(-50%) translateY(10px);
  }
}
</style>