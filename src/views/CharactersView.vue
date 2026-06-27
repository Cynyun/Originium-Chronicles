<template>
  <div class="characters-page">
    <div class="characters-page__header">
      <GeometricPattern />
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">人物档案</h1>
          <p class="page-subtitle">泰拉世界的关键人物</p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="characters-page__filters">
        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="搜索人物..." class="search-input" />
        </div>

        <div class="view-tabs">
          <button v-for="tab in viewTabs" :key="tab.id" class="view-tab"
            :class="{ 'view-tab--active': activeTab === tab.id }" @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </div>

        <div class="filter-group">
          <BaseSelect v-model="selectedFaction" :options="factionOptions" placeholder="全部派系" />
          <BaseSelect v-model="selectedRace" :options="raceOptions" placeholder="全部种族" />
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <p>加载中...</p>
      </div>

      <div v-else-if="filteredCharacters.length" class="characters-page__content">
        <div class="characters-page__stats">
          <div class="stat-card">
            <span class="stat-value">{{ filteredCharacters.length }}</span>
            <span class="stat-label">角色总数</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ uniqueFactions }}</span>
            <span class="stat-label">所属派系</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ uniqueRaces }}</span>
            <span class="stat-label">种族类型</span>
          </div>
        </div>

        <div class="characters-page__grid-section">
          <div class="section-header">
            <h2 class="section-title">{{ currentViewTitle }}</h2>
            <span class="section-count">{{ filteredCharacters.length }} 人</span>
          </div>

          <CharacterGrid :characters="filteredCharacters" :factions="factions" :operatives="operatives"
            :max-display="12" :is-operatives-only="activeTab === 'operatives'" />
        </div>
      </div>

      <div v-else class="empty-state">
        <p>未找到匹配的人物</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CharacterGrid from '@/components/data-display/CharacterGrid.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import GeometricPattern from '@/components/animations/GeometricPattern.vue'

const characters = ref([])
const factions = ref([])
const operatives = ref([])
const searchQuery = ref('')
const selectedFaction = ref('')
const selectedRace = ref('')
const activeTab = ref('all')
const isLoading = ref(true)

const viewTabs = [
  { id: 'all', label: '全角色' },
  { id: 'operatives', label: '干员' }
]

const races = computed(() => {
  const uniqueRaces = new Set(characters.value.map(c => c.race).filter(Boolean))
  return Array.from(uniqueRaces).sort()
})

const uniqueFactions = computed(() => {
  const factionIds = new Set(filteredCharacters.value.map(c => c.faction).filter(Boolean))
  return factionIds.size
})

const uniqueRaces = computed(() => {
  const raceSet = new Set(filteredCharacters.value.map(c => c.race).filter(Boolean))
  return raceSet.size
})

const factionOptions = computed(() => [
  { value: '', label: '全部派系' },
  ...factions.value.map(f => ({ value: f.id, label: f.name }))
])

const raceOptions = computed(() => [
  { value: '', label: '全部种族' },
  ...races.value.map(r => ({ value: r, label: r }))
])

const currentViewTitle = computed(() => {
  return activeTab.value === 'all' ? '全部角色' : '可获取干员'
})

const filteredCharacters = computed(() => {
  let result = [...characters.value]

  if (activeTab.value === 'operatives') {
    const operativeIds = new Set(operatives.value.map(o => o.id))
    result = result.filter(c => operativeIds.has(c.id))
  }

  result = result.filter(char => {
    const matchesSearch = !searchQuery.value ||
      char.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      char.description?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesFaction = !selectedFaction.value || selectedFaction.value === '' || char.faction === selectedFaction.value
    const matchesRace = !selectedRace.value || selectedRace.value === '' || char.race === selectedRace.value

    return matchesSearch && matchesFaction && matchesRace
  })

  return result
})

const loadData = async () => {
  try {
    const [charsRes, factionsRes, operativesRes] = await Promise.all([
      fetch('/data/characters.json'),
      fetch('/data/factions.json'),
      fetch('/data/operatives.json')
    ])

    const charsData = await charsRes.json()
    const factionsData = await factionsRes.json()
    const operativesData = await operativesRes.json()

    characters.value = charsData.characters || []
    factions.value = factionsData.factions || []
    operatives.value = operativesData.operatives || []
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.characters-page__header {
  padding: 60px 0 40px;
  background: linear-gradient(180deg, rgba(0, 122, 204, 0.1) 0%, transparent 100%);
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

.characters-page__filters {
  padding: 30px 0;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
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

.view-tabs {
  display: flex;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
}

.view-tab {
  padding: 10px 20px;
  font-size: 14px;
  color: var(--color-light-gray);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.view-tab--active {
  color: var(--color-tech-blue);
  background: rgba(0, 191, 255, 0.1);
}

.view-tab:hover:not(.view-tab--active) {
  background: var(--color-mid-gray);
}

.filter-group {
  display: flex;
  gap: 10px;
}

.characters-page__stats {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  flex: 1;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-tech-blue);
}

.stat-label {
  font-size: 13px;
  color: var(--color-light-gray);
  margin-top: 5px;
}

.characters-page__content {
  padding-bottom: 60px;
}

.characters-page__grid-section {
  margin-top: 20px;
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
  font-size: 14px;
  color: var(--color-light-gray);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-light-gray);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-light-gray);
}
</style>