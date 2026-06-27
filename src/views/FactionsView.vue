<template>
  <div class="factions-page">
    <div class="factions-page__header">
      <GridAnimation />
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">派系档案</h1>
          <p class="page-subtitle">泰拉世界的主要势力与组织</p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="factions-page__filters">
        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="搜索派系..." class="search-input" />
        </div>
        <div class="filter-tabs">
          <button v-for="tab in viewTabs" :key="tab.id" class="filter-tab"
            :class="{ 'filter-tab--active': activeTab === tab.id }" @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="factions-page__overview" v-if="filteredFactions.length">
        <div class="overview-card overview-card--stats">
          <div class="overview-card__header">
            <h3>势力概览</h3>
          </div>
          <div class="overview-card__body">
            <div class="stat-grid">
              <div class="stat-item">
                <span class="stat-value">{{ filteredFactions.length }}</span>
                <span class="stat-label">派系总数</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ totalMembers }}</span>
                <span class="stat-label">核心成员</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ totalRelations }}</span>
                <span class="stat-label">关联关系</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="factions-page__main" v-if="filteredFactions.length">
        <div class="factions-page__primary">
          <FactionLeaderCard :faction="selectedFaction" :characters="characters" />

          <div class="factions-page__detail-cards">
            <FactionStatsCard :faction="selectedFaction" />
            <FactionRelationCard :centralFaction="selectedFaction" :allFactions="factions" />
          </div>
        </div>

        <div class="factions-page__secondary">
          <div class="section-header">
            <h2 class="section-title">派系列表</h2>
            <span class="section-count">{{ filteredFactions.length }} 个派系</span>
          </div>

          <div class="factions-list" v-if="activeTab === 'grid'">
            <FactionCard v-for="faction in filteredFactions" :key="faction.id" :faction="faction"
              :class="{ 'faction-card--selected': selectedFaction?.id === faction.id }"
              @click="selectFaction(faction)" />
          </div>

          <div class="factions-list--compact" v-else>
            <div v-for="faction in filteredFactions" :key="faction.id" class="faction-item"
              :class="{ 'faction-item--selected': selectedFaction?.id === faction.id }" @click="selectFaction(faction)">
              <img v-if="isImage(faction.icon)" :src="faction.icon" :alt="faction.name" class="faction-item__icon" />
              <span v-else class="faction-item__icon-text">{{ faction.icon || '◇' }}</span>
              <div class="faction-item__info">
                <span class="faction-item__name">{{ faction.name }}</span>
                <span class="faction-item__desc">{{ faction.description }}</span>
              </div>
              <div class="faction-item__leader">
                <span>{{ faction.leader }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredFactions.length === 0" class="empty-state">
        <p>未找到匹配的派系</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FactionCard from '@/components/data-display/FactionCard.vue'
import FactionLeaderCard from '@/components/cards/FactionLeaderCard.vue'
import FactionStatsCard from '@/components/cards/FactionStatsCard.vue'
import FactionRelationCard from '@/components/cards/FactionRelationCard.vue'
import GridAnimation from '@/components/animations/GridAnimation.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const factions = ref([])
const characters = ref([])
const searchQuery = ref('')
const selectedFaction = ref(null)
const activeTab = ref('grid')

const viewTabs = [
  { id: 'grid', label: '网格视图' },
  { id: 'list', label: '列表视图' }
]

const filteredFactions = computed(() => {
  if (!searchQuery.value) return factions.value
  const query = searchQuery.value.toLowerCase()
  return factions.value.filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.description.toLowerCase().includes(query)
  )
})

const totalMembers = computed(() => {
  return filteredFactions.value.reduce((sum, f) => sum + (f.key_members?.length || 0), 0)
})

const totalRelations = computed(() => {
  return filteredFactions.value.reduce((sum, f) => sum + (f.related_factions?.length || 0), 0)
})

const isImage = (icon) => {
  return icon && (icon.endsWith('.png') || icon.endsWith('.svg') || icon.endsWith('.webp'))
}

const selectFaction = (faction) => {
  selectedFaction.value = faction
  userStore.addHistory({ id: faction.id, name: faction.name, type: 'faction' })
}

const loadData = async () => {
  try {
    const [factionsRes, charactersRes] = await Promise.all([
      fetch('/data/factions.json'),
      fetch('/data/characters.json')
    ])

    const factionsData = await factionsRes.json()
    const charactersData = await charactersRes.json()

    factions.value = factionsData.factions
    characters.value = charactersData.characters

    const defaultFaction = factions.value.find(f => f.id === 'rhodes')
    if (defaultFaction) {
      selectedFaction.value = defaultFaction
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.factions-page__header {
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

.factions-page__filters {
  padding: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.search-box {
  max-width: 400px;
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
  border-color: var(--color-tech-blue);
}

.search-input::placeholder {
  color: var(--color-light-gray);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-light-gray);
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-fast);
}

.filter-tab:hover {
  border-color: var(--color-accent-red);
  color: var(--color-primary-white);
}

.filter-tab--active {
  background: var(--color-accent-red);
  border-color: var(--color-accent-red);
  color: var(--color-primary-white);
}

.factions-page__overview {
  margin-bottom: 30px;
}

.overview-card {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  overflow: hidden;
}

.overview-card__header {
  padding: 15px 20px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.overview-card__header h3 {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-primary-white);
  letter-spacing: 1px;
}

.overview-card__body {
  padding: 20px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-accent-red);
}

.stat-label {
  font-size: 12px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.factions-page__main {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 30px;
  padding-bottom: 60px;
}

.factions-page__primary {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.factions-page__detail-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.factions-page__secondary {
  min-width: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--color-primary-white);
  letter-spacing: 2px;
}

.section-count {
  font-size: 13px;
  color: var(--color-light-gray);
}

.factions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.faction-card--selected {
  border-color: var(--color-accent-red);
  box-shadow: 0 0 20px rgba(139, 0, 0, 0.3);
}

.factions-list--compact {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faction-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-fast);
}

.faction-item:hover {
  border-color: var(--color-accent-red);
}

.faction-item--selected {
  border-color: var(--color-accent-red);
  background: rgba(139, 0, 0, 0.1);
}

.faction-item__icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
}

.faction-item__icon-text {
  font-size: 28px;
  color: var(--color-accent-red);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.faction-item__info {
  flex: 1;
  min-width: 0;
}

.faction-item__name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary-white);
  margin-bottom: 4px;
}

.faction-item__desc {
  display: block;
  font-size: 13px;
  color: var(--color-light-gray);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.faction-item__leader {
  font-size: 13px;
  color: var(--color-tech-blue);
  font-weight: 500;
  padding: 5px 12px;
  background: rgba(0, 150, 255, 0.1);
  /* border-radius: 15px; */
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-light-gray);
}
</style>
