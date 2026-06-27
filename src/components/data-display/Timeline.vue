<template>
  <div class="timeline">
    <div v-if="isLoading" class="timeline__loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载中...</span>
    </div>
    <div v-else>
      <div class="timeline__scroll-container" ref="scrollContainer">
        <div class="timeline__track">
          <div
            v-for="(event, index) in events"
            :key="event.id || index"
            class="timeline__event"
            :class="{ 'timeline__event--active': selectedIndex === index }"
            @click="selectEvent(index)"
          >
            <div class="timeline__event-marker">
              <span class="timeline__event-dot"></span>
              <span class="timeline__event-importance" :style="{ background: getImportanceColor(event.importance) }">
                {{ getImportanceName(event.importance) }}
              </span>
            </div>
            <div class="timeline__event-content">
              <div class="timeline__event-meta">
                <span class="timeline__event-year">{{ event.year }}</span>
                <span class="timeline__event-era">{{ event.era }}</span>
              </div>
              <h4 class="timeline__event-title">{{ event.title }}</h4>
              <p class="timeline__event-description">{{ event.description }}</p>
              <div class="timeline__event-location">📍 {{ event.location }}</div>
              <div class="timeline__event-tags" v-if="event.tags?.length">
                <BaseTag v-for="tag in event.tags" :key="tag" variant="event" size="small">
                  {{ tag }}
                </BaseTag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="timeline__navigation">
        <button class="timeline__nav-btn" @click="scrollLeft" :disabled="!canScrollLeft">
          ◀
        </button>
        <div class="timeline__progress">
          <div class="timeline__progress-bar" :style="{ width: progressWidth }"></div>
        </div>
        <button class="timeline__nav-btn" @click="scrollRight" :disabled="!canScrollRight">
          ▶
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import BaseTag from '@/components/ui/BaseTag.vue'

const emit = defineEmits(['select'])

const scrollContainer = ref(null)
const selectedIndex = ref(-1)
const scrollPosition = ref(0)
const isLoading = ref(true)
const events = ref([])
const importanceLevels = ref({})

const canScrollLeft = computed(() => scrollPosition.value > 0)
const canScrollRight = computed(() => {
  if (!scrollContainer.value) return false
  const maxScroll = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth
  return scrollPosition.value < maxScroll - 10
})

const progressWidth = computed(() => {
  if (!scrollContainer.value) return '0%'
  const maxScroll = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth
  if (maxScroll <= 0) return '100%'
  return `${(scrollPosition.value / maxScroll) * 100}%`
})

const getImportanceColor = (importanceId) => {
  return importanceLevels.value[importanceId]?.color || '#808080'
}

const getImportanceName = (importanceId) => {
  return importanceLevels.value[importanceId]?.name || importanceId
}

const selectEvent = (index) => {
  selectedIndex.value = index
  emit('select', events.value[index])
}

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

const setupScrollListener = () => {
  if (scrollContainer.value) {
    scrollPosition.value = scrollContainer.value.scrollLeft
    scrollContainer.value.addEventListener('scroll', () => {
      scrollPosition.value = scrollContainer.value.scrollLeft
    })
  }
}

const loadData = async () => {
  try {
    const res = await fetch('/data/timeline.json')
    const data = await res.json()
    events.value = data.events || []
    importanceLevels.value = data.importanceLevels || {}
  } catch (error) {
    console.error('Failed to load timeline:', error)
  } finally {
    isLoading.value = false
    nextTick(() => {
      setupScrollListener()
    })
  }
}

onMounted(() => {
  loadData()
})

watch(events, () => {
  nextTick(() => {
    scrollPosition.value = 0
    if (scrollContainer.value) {
      scrollContainer.value.scrollLeft = 0
    }
  })
}, { deep: true })
</script>

<style scoped>
.timeline {
  width: 100%;
}

.timeline__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 15px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-mid-gray);
  border-top-color: var(--color-accent-red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--color-light-gray);
}

.timeline__scroll-container {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 40px 0;
}

.timeline__scroll-container::-webkit-scrollbar {
  display: none;
}

.timeline__track {
  display: flex;
  gap: 40px;
  padding: 0 20px;
  min-width: min-content;
}

.timeline__event {
  flex-shrink: 0;
  width: 320px;
  cursor: pointer;
  transition: var(--transition-normal);
}

.timeline__event-marker {
  position: relative;
  height: 50px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.timeline__event-marker::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-mid-gray);
}

.timeline__event-dot {
  position: relative;
  z-index: 1;
  width: 20px;
  height: 20px;
  background: var(--color-mid-gray);
  border: 3px solid var(--color-deep-gray);
  border-radius: 50%;
  transition: var(--transition-normal);
}

.timeline__event:hover .timeline__event-dot,
.timeline__event--active .timeline__event-dot {
  transform: scale(1.2);
  background: var(--color-accent-red);
  box-shadow: 0 0 15px var(--color-accent-red);
}

.timeline__event-importance {
  font-size: 10px;
  font-weight: 600;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
}

.timeline__event:hover .timeline__event-marker::before,
.timeline__event--active .timeline__event-marker::before {
  background: var(--color-accent-dark-red);
}

.timeline__event-content {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 20px;
  transition: var(--transition-normal);
}

.timeline__event:hover .timeline__event-content,
.timeline__event--active .timeline__event-content {
  border-color: var(--color-accent-red);
  background: rgba(139, 0, 0, 0.1);
}

.timeline__event-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.timeline__event-year {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-accent-red);
}

.timeline__event-era {
  font-size: 11px;
  color: var(--color-light-gray);
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.05);
}

.timeline__event-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-white);
  margin-bottom: 10px;
}

.timeline__event-description {
  font-size: 13px;
  color: var(--color-light-gray);
  line-height: 1.6;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.timeline__event-location {
  font-size: 11px;
  color: var(--color-light-gray);
  margin-bottom: 10px;
}

.timeline__event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.timeline__navigation {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.timeline__nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  color: var(--color-primary-white);
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition-normal);
}

.timeline__nav-btn:hover:not(:disabled) {
  border-color: var(--color-accent-red);
  color: var(--color-accent-red);
}

.timeline__nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.timeline__progress {
  flex: 1;
  height: 4px;
  background: var(--color-mid-gray);
  overflow: hidden;
}

.timeline__progress-bar {
  height: 100%;
  background: var(--color-accent-red);
  transition: width var(--transition-normal);
}
</style>
