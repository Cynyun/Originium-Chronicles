<template>
  <div class="timeline-page">
    <div class="timeline-page__header">
      <FlowLines />
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">历史年表</h1>
          <p class="page-subtitle">泰拉世界的大事记</p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="timeline-page__filters">
        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="搜索事件..." class="search-input" />
        </div>
        <div class="filter-row">
          <div class="tag-filters-label">
            <span class="filter-label">标签筛选：</span>
          </div>
          <div class="tag-filters">
            <BaseTag v-for="tag in allTags" :key="tag" :variant="selectedTags.includes(tag) ? 'event' : 'default'"
              size="small" :clickable="true" @click="toggleTag(tag)">
              {{ tag }}
            </BaseTag>
          </div>
        </div>
      </div>

      <div class="timeline-page__main">
        <Timeline @select="selectEvent" />
      </div>

      <div class="timeline-page__content">
        <div class="timeline-page__list" v-if="filteredEvents.length">
          <div v-for="event in filteredEvents" :key="event.id" class="event-card"
            :class="{ 'event-card--active': selectedEvent?.id === event.id }" @click="selectEvent(event)">
            <div class="event-card__header">
              <span class="event-card__year">{{ event.year }}</span>
              <span class="event-card__era">{{ event.era }}</span>
              <span class="event-card__importance" :style="{ color: getImportanceColor(event.importance) }">
                {{ getImportanceName(event.importance) }}
              </span>
            </div>
            <div class="event-card__body">
              <div class="event-card__meta">
                <span class="event-card__location">📍 {{ event.location }}</span>
              </div>
              <h3 class="event-card__title">{{ event.title }}</h3>
              <p class="event-card__description">{{ event.description }}</p>
              <div v-if="event.content" class="event-card__content" v-html="event.content"></div>
              <div v-if="event.quotes?.length" class="event-card__quotes">
                <blockquote v-for="(quote, index) in event.quotes" :key="index" class="quote">
                  <p class="quote__text">「{{ quote.text }}」</p>
                  <cite class="quote__author">—— {{ quote.author }}</cite>
                </blockquote>
              </div>
              <div class="event-card__related"
                v-if="event.related_characters?.length || event.related_factions?.length">
                <div v-if="event.related_characters?.length" class="related-group">
                  <span class="related-group__label">相关人物：</span>
                  <span class="related-group__items">
                    <span v-for="charId in event.related_characters" :key="charId" class="related-item">
                      {{ getCharacterName(charId) }}
                    </span>
                  </span>
                </div>
                <div v-if="event.related_factions?.length" class="related-group">
                  <span class="related-group__label">相关势力：</span>
                  <span class="related-group__items">
                    <span v-for="factionId in event.related_factions" :key="factionId" class="related-item">
                      {{ getFactionName(factionId) }}
                    </span>
                  </span>
                </div>
              </div>
              <div class="event-card__tags">
                <BaseTag v-for="tag in event.tags" :key="tag" variant="event" size="small">
                  {{ tag }}
                </BaseTag>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredEvents.length === 0" class="empty-state">
          <p>未找到匹配的事件</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Timeline from '@/components/data-display/Timeline.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import FlowLines from '@/components/animations/FlowLines.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const events = ref([])
const importanceLevels = ref({})
const characters = ref([])
const factions = ref([])
const searchQuery = ref('')
const selectedTags = ref([])
const selectedEvent = ref(null)

const allTags = computed(() => {
  const tags = new Set()
  events.value.forEach(event => {
    event.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = !searchQuery.value ||
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.content.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesTags = selectedTags.value.length === 0 ||
      selectedTags.value.some(tag => event.tags?.includes(tag))

    return matchesSearch && matchesTags
  })
})

const getImportanceColor = (importanceId) => {
  return importanceLevels.value[importanceId]?.color || '#808080'
}

const getImportanceName = (importanceId) => {
  return importanceLevels.value[importanceId]?.name || importanceId
}

const getCharacterName = (charId) => {
  const char = characters.value.find(c => c.id === charId)
  return char?.name || charId
}

const getFactionName = (factionId) => {
  const faction = factions.value.find(f => f.id === factionId)
  return faction?.name || factionId
}

const loadData = async () => {
  try {
    const [timelineRes, charsRes, factionsRes] = await Promise.all([
      fetch('/data/timeline.json'),
      fetch('/data/characters.json'),
      fetch('/data/factions.json')
    ])

    const timelineData = await timelineRes.json()
    const charsData = await charsRes.json()
    const factionsData = await factionsRes.json()

    events.value = timelineData.events || []
    importanceLevels.value = timelineData.importanceLevels || {}
    characters.value = charsData.characters || []
    factions.value = factionsData.factions || []

    if (route.query.event) {
      const event = events.value.find(e => e.id === route.query.event)
      if (event) selectedEvent.value = event
    }
  } catch (error) {
    console.error('Failed to load timeline:', error)
  }
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const selectEvent = (event) => {
  selectedEvent.value = event
  userStore.addHistory({ id: event.id, name: event.title, type: 'event' })
  router.push(`/events/${event.id}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.timeline-page__header {
  padding: 60px 0 40px;
  background: linear-gradient(180deg, rgba(139, 0, 0, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-mid-gray);
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  display: inline-block;
  padding: 20px 40px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary-white);
  letter-spacing: 4px;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--color-light-gray);
}

.timeline-page__filters {
  padding: 30px 0;
}

.search-box {
  max-width: 400px;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-primary-white);
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  transition: var(--transition-normal);
}

.search-input:focus {
  border-color: var(--color-accent-red);
}

.search-input::placeholder {
  color: var(--color-light-gray);
}

.filter-row {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-filters-label {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 14px;
  color: var(--color-light-gray);
  font-weight: 500;
}

.timeline-page__main {
  margin-bottom: 40px;
  overflow: hidden;
}

.timeline-page__content {
  padding-bottom: 60px;
}

.timeline-page__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.event-card {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  border-left: 4px solid var(--color-accent-dark-red);
  transition: var(--transition-normal);
}

.event-card:hover,
.event-card--active {
  border-color: var(--color-accent-red);
  border-left-color: var(--color-accent-red);
  background: rgba(139, 0, 0, 0.05);
}

.event-card__header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--color-mid-gray);
}

.event-card__year {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-accent-red);
}

.event-card__era {
  font-size: 13px;
  color: var(--color-light-gray);
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
}

.event-card__importance {
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
}

.event-card__body {
  padding: 20px;
}

.event-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.event-card__location {
  font-size: 12px;
  color: var(--color-light-gray);
}

.event-card__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-white);
  margin-bottom: 10px;
}

.event-card__description {
  font-size: 14px;
  color: var(--color-light-gray);
  line-height: 1.7;
  margin-bottom: 15px;
}

.event-card__content {
  font-size: 14px;
  color: var(--color-light-gray);
  line-height: 1.8;
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid var(--color-accent-dark-red);
}

.event-card__content p {
  margin-bottom: 10px;
}

.event-card__content p:last-child {
  margin-bottom: 0;
}

.event-card__quotes {
  margin-bottom: 15px;
}

.quote {
  padding: 12px 15px;
  background: rgba(139, 0, 0, 0.1);
  border-left: 3px solid var(--color-accent-red);
  margin-bottom: 10px;
}

.quote:last-child {
  margin-bottom: 0;
}

.quote__text {
  font-size: 14px;
  font-style: italic;
  color: var(--color-primary-white);
  margin-bottom: 5px;
}

.quote__author {
  font-size: 12px;
  color: var(--color-light-gray);
}

.event-card__related {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.related-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.related-group__label {
  font-size: 12px;
  color: var(--color-light-gray);
}

.related-group__items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.related-item {
  font-size: 12px;
  color: var(--color-tech-blue);
  padding: 4px 10px;
  background: rgba(0, 191, 255, 0.1);
  cursor: pointer;
  transition: var(--transition-fast);
}

.related-item:hover {
  background: rgba(0, 191, 255, 0.2);
}

.event-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-light-gray);
}

@media (max-width: 768px) {
  .event-card__header {
    flex-wrap: wrap;
  }

  .event-card__year {
    font-size: 18px;
  }

  .filter-row {
    flex-direction: column;
  }
}
</style>
