<template>
  <div class="event-detail">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载中...</span>
    </div>
    <div v-else-if="!event" class="not-found">
      <h2>事件未找到</h2>
      <p>您访问的事件不存在</p>
      <BaseButton @click="$router.push('/timeline')">返回年表</BaseButton>
    </div>
    <div v-else>
      <div class="event-detail__header">
        <FlowLines />
        <div class="container">
          <div class="header-content">
            <div class="event-meta">
              <span class="event-year">{{ event.year }}</span>
              <span class="event-era">{{ event.era }}</span>
              <span class="event-importance" :style="{ background: getImportanceColor(event.importance) }">
                {{ getImportanceName(event.importance) }}
              </span>
            </div>
            <h1 class="event-title">{{ event.title }}</h1>
            <div class="event-location">📍 {{ event.location }}</div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="event-detail__body">
          <div class="event-detail__main">
            <div class="event-description">
              <p>{{ event.description }}</p>
            </div>

            <div v-if="event.content" class="event-content" v-html="event.content"></div>

            <div v-if="event.quotes?.length" class="event-quotes">
              <h3>相关语录</h3>
              <blockquote v-for="(quote, index) in event.quotes" :key="index" class="quote">
                <p class="quote-text">「{{ quote.text }}」</p>
                <cite class="quote-author">—— {{ quote.author }}</cite>
              </blockquote>
            </div>

            <div v-if="event.related_characters?.length || event.related_factions?.length" class="event-related">
              <div v-if="event.related_characters?.length" class="related-section">
                <h3>相关人物</h3>
                <div class="related-list">
                  <span v-for="charId in event.related_characters" :key="charId" class="related-item"
                    @click="goToCharacter(charId)">
                    {{ getCharacterName(charId) }}
                  </span>
                </div>
              </div>

              <div v-if="event.related_factions?.length" class="related-section">
                <h3>相关势力</h3>
                <div class="related-list">
                  <span v-for="factionId in event.related_factions" :key="factionId" class="related-item"
                    @click="goToFaction(factionId)">
                    {{ getFactionName(factionId) }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="event.tags?.length" class="event-tags">
              <BaseTag v-for="tag in event.tags" :key="tag" variant="event" size="small">
                {{ tag }}
              </BaseTag>
            </div>
          </div>

          <aside class="event-detail__sidebar">
            <div class="sidebar-section">
              <h3>事件分类</h3>
              <div class="category-badge">
                {{ getCategoryIcon(event.category) }} {{ getCategoryName(event.category) }}
              </div>
            </div>

            <div class="sidebar-section">
              <h3>快速导航</h3>
              <ul class="nav-list">
                <li><a href="#description" class="nav-link">概述</a></li>
                <li v-if="event.content"><a href="#content" class="nav-link">详细内容</a></li>
                <li v-if="event.quotes?.length"><a href="#quotes" class="nav-link">相关语录</a></li>
                <li v-if="event.related_characters?.length || event.related_factions?.length">
                  <a href="#related" class="nav-link">关联对象</a>
                </li>
              </ul>
            </div>

            <div class="sidebar-section">
              <h3>分享</h3>
              <div class="share-buttons">
                <button class="share-btn" @click="copyLink">复制链接</button>
                <button class="share-btn" @click="shareToSocial">分享到社交</button>
              </div>
            </div>
          </aside>
        </div>

        <div class="event-detail__footer">
          <BaseButton variant="ghost" @click="$router.push('/timeline')">← 返回年表</BaseButton>
          <div class="nav-buttons">
            <BaseButton v-if="prevEvent" variant="outline" @click="goToEvent(prevEvent)">
              ← {{ prevEvent.title }}
            </BaseButton>
            <BaseButton v-if="nextEvent" variant="outline" @click="goToEvent(nextEvent)">
              {{ nextEvent.title }} →
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import FlowLines from '@/components/animations/FlowLines.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isLoading = ref(true)
const event = ref(null)
const events = ref([])
const characters = ref([])
const factions = ref([])
const categories = ref({})
const importanceLevels = ref({})

const eventId = computed(() => route.params.id)

const prevEvent = computed(() => {
  const index = events.value.findIndex(e => e.id === eventId.value)
  return index > 0 ? events.value[index - 1] : null
})

const nextEvent = computed(() => {
  const index = events.value.findIndex(e => e.id === eventId.value)
  return index >= 0 && index < events.value.length - 1 ? events.value[index + 1] : null
})

const getCategoryName = (categoryId) => {
  return categories.value[categoryId]?.name || categoryId
}

const getCategoryIcon = (categoryId) => {
  return categories.value[categoryId]?.icon || '📌'
}

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

const goToCharacter = (charId) => {
  userStore.addHistory({ id: charId, name: getCharacterName(charId), type: 'character' })
  router.push(`/characters/${charId}`)
}

const goToFaction = (factionId) => {
  userStore.addHistory({ id: factionId, name: getFactionName(factionId), type: 'faction' })
  router.push(`/factions/${factionId}`)
}

const goToEvent = (eventItem) => {
  router.push(`/events/${eventItem.id}`)
}

const copyLink = () => {
  const url = `${window.location.origin}/events/${eventId.value}`
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制')
  })
}

const shareToSocial = () => {
  if (navigator.share) {
    navigator.share({
      title: event.value.title,
      text: event.value.description,
      url: `${window.location.origin}/events/${eventId.value}`
    })
  } else {
    copyLink()
    alert('链接已复制，请手动分享')
  }
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
    categories.value = timelineData.categories || {}
    importanceLevels.value = timelineData.importanceLevels || {}
    characters.value = charsData.characters || []
    factions.value = factionsData.factions || []

    event.value = events.value.find(e => e.id === eventId.value)
  } catch (error) {
    console.error('Failed to load event:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.event-detail {
  min-height: 100vh;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-primary-black);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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

.not-found {
  text-align: center;
  padding: 100px 20px;
}

.not-found h2 {
  font-size: 28px;
  color: var(--color-primary-white);
  margin-bottom: 15px;
}

.not-found p {
  color: var(--color-light-gray);
  margin-bottom: 30px;
}

.event-detail__header {
  padding: 60px 0 40px;
  background: linear-gradient(180deg, rgba(139, 0, 0, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-mid-gray);
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  padding: 20px 40px;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.event-year {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-accent-red);
}

.event-era {
  font-size: 14px;
  color: var(--color-light-gray);
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
}

.event-importance {
  font-size: 12px;
  font-weight: 600;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
}

.event-title {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--color-primary-white);
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.event-location {
  font-size: 14px;
  color: var(--color-light-gray);
}

.event-detail__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
  padding: 50px 0;
}

.event-detail__main {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 40px;
}

.event-description {
  font-size: 16px;
  color: var(--color-primary-white);
  line-height: 1.8;
  margin-bottom: 30px;
}

.event-content {
  font-size: 15px;
  color: var(--color-light-gray);
  line-height: 1.9;
  margin-bottom: 30px;
  padding: 25px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 4px solid var(--color-accent-dark-red);
}

.event-content p {
  margin-bottom: 15px;
}

.event-content p:last-child {
  margin-bottom: 0;
}

.event-quotes {
  margin-bottom: 30px;
}

.event-quotes h3 {
  font-size: 18px;
  color: var(--color-primary-white);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.quote {
  padding: 20px;
  background: rgba(139, 0, 0, 0.1);
  border-left: 4px solid var(--color-accent-red);
  margin-bottom: 15px;
}

.quote:last-child {
  margin-bottom: 0;
}

.quote-text {
  font-size: 16px;
  font-style: italic;
  color: var(--color-primary-white);
  margin-bottom: 10px;
}

.quote-author {
  font-size: 13px;
  color: var(--color-light-gray);
}

.event-related {
  margin-bottom: 30px;
}

.related-section {
  margin-bottom: 25px;
}

.related-section:last-child {
  margin-bottom: 0;
}

.related-section h3 {
  font-size: 16px;
  color: var(--color-primary-white);
  margin-bottom: 15px;
}

.related-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.related-item {
  font-size: 14px;
  color: var(--color-tech-blue);
  padding: 8px 15px;
  background: rgba(0, 191, 255, 0.1);
  cursor: pointer;
  transition: var(--transition-fast);
}

.related-item:hover {
  background: rgba(0, 191, 255, 0.2);
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.event-detail__sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.sidebar-section {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 25px;
  margin-bottom: 20px;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-section h3 {
  font-size: 15px;
  color: var(--color-primary-white);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.category-badge {
  display: inline-block;
  font-size: 14px;
  color: var(--color-primary-white);
  padding: 10px 15px;
  background: rgba(139, 0, 0, 0.2);
  border-left: 3px solid var(--color-accent-red);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: block;
  font-size: 14px;
  color: var(--color-light-gray);
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-decoration: none;
  transition: var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-accent-red);
}

.share-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.share-btn {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  color: var(--color-primary-white);
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-normal);
}

.share-btn:hover {
  border-color: var(--color-accent-red);
  color: var(--color-accent-red);
}

.event-detail__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0;
  border-top: 1px solid var(--color-mid-gray);
  margin-bottom: 50px;
}

.nav-buttons {
  display: flex;
  gap: 15px;
}

@media (max-width: 900px) {
  .event-detail__body {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .event-title {
    font-size: 32px;
  }

  .event-detail__main {
    padding: 25px;
  }
}

@media (max-width: 500px) {
  .event-meta {
    flex-wrap: wrap;
  }

  .event-title {
    font-size: 26px;
  }

  .event-detail__footer {
    flex-direction: column;
    gap: 20px;
  }

  .nav-buttons {
    flex-direction: column;
    width: 100%;
  }
}
</style>
