<template>
  <div class="character-detail-page">
    <div class="character-detail-page__header">
      <GridAnimation />
      <div class="container">
        <div class="header-content">
          <button class="back-btn" @click="$router.back()">← 返回</button>
          <div class="title-row">
            <h1 class="page-title">{{ character?.name || '角色档案' }}</h1>
            <div v-if="operative" class="operative-badge" :class="[`operative-badge--${rarityClass}`]">
              <span v-for="i in operative.rarity" :key="i" class="star">★</span>
            </div>
          </div>
          <p class="page-subtitle">完整角色信息</p>
        </div>
      </div>
    </div>

    <div class="container" v-if="character">
      <div class="character-detail">
        <div class="character-detail__sidebar">
          <div class="character-detail__portrait-wrapper">
            <img :src="character.portrait || '/images/placeholder.webp'" :alt="character.name"
              class="character-detail__portrait" />
            <div class="character-detail__faction-badge" :style="{ background: getFactionColor(character.faction) }">
              {{ getFactionName(character.faction) }}
            </div>
          </div>

          <div class="character-detail__avatar-section">
            <div class="character-detail__avatar-wrapper" :style="{ borderColor: getFactionColor(character.faction) }">
              <img v-if="hasAvatar" :src="character.avatar" :alt="character.name" class="character-detail__avatar" />
              <span v-else class="character-detail__avatar-text">{{ character.name.charAt(0) }}</span>
            </div>
          </div>

          <div class="character-detail__stats">
            <div class="stat-item">
              <span class="stat-label">种族</span>
              <span class="stat-value">{{ character.race || '未知' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">职位</span>
              <span class="stat-value">{{ character.position || '未知' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">部门</span>
              <span class="stat-value">{{ character.department || '未知' }}</span>
            </div>
          </div>

          <div v-if="operative" class="character-detail__operative-info">
            <h3 class="operative-title">干员信息</h3>
            <div class="operative-grid">
              <div class="operative-item">
                <span class="operative-label">职业</span>
                <span class="operative-value operative-class">{{ getClassName(operative.class) }}</span>
              </div>
              <div class="operative-item">
                <span class="operative-label">费用</span>
                <span class="operative-value operative-cost">⚡ {{ operative.cost }}</span>
              </div>
              <div class="operative-item">
                <span class="operative-label">稀有度</span>
                <div class="operative-stars">
                  <span v-for="i in operative.rarity" :key="i" class="star" :class="[`star--${rarityClass}`]">★</span>
                </div>
              </div>
            </div>
            <div v-if="operative.tags?.length" class="operative-tags">
              <span v-for="tag in operative.tags" :key="tag" class="operative-tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <div class="character-detail__content">
          <div class="character-detail__basic">
            <h2 class="section-title">角色简介</h2>
            <p class="character-detail__description">{{ character.description }}</p>
          </div>

          <div class="character-detail__relationships" v-if="hasRelationships">
            <h2 class="section-title">人物关系</h2>
            <div class="relationships-grid">
              <div v-for="rel in character.internal_relationships" :key="rel.target" class="relationship-card"
                @click="navigateToCharacter(rel.target)">
                <div class="relationship-card__avatar">
                  {{ getCharacterById(rel.target)?.name.charAt(0) || '?' }}
                </div>
                <div class="relationship-card__info">
                  <span class="relationship-card__name">{{ getCharacterById(rel.target)?.name || rel.target }}</span>
                  <span class="relationship-card__type">{{ rel.type }}</span>
                </div>
                <p class="relationship-card__desc">{{ rel.description }}</p>
              </div>
            </div>
          </div>

          <div class="character-detail__external-relations" v-if="hasExternalRelationships">
            <h2 class="section-title">外部关系</h2>
            <div class="external-relations-list">
              <div v-for="rel in character.external_relationships" :key="rel.target" class="external-relation-item">
                <span class="external-relation__target">{{ getTargetName(rel.target) }}</span>
                <span class="external-relation__type" :class="getRelationClass(rel.type)">{{ rel.type }}</span>
                <p class="external-relation__desc">{{ rel.description }}</p>
              </div>
            </div>
          </div>

          <div class="character-detail__actions">
            <BaseButton :variant="isFavorite ? 'outline' : 'primary'" @click="toggleFavorite">
              {{ isFavorite ? '取消收藏' : '添加收藏' }}
            </BaseButton>
            <BaseButton variant="ghost" @click="$router.push('/characters')">
              返回人物列表
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-state">
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import GridAnimation from '@/components/animations/GridAnimation.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const character = ref(null)
const characters = ref([])
const factions = ref([])
const operatives = ref([])

const operative = computed(() => {
  if (!character.value) return null
  return operatives.value.find(o => o.id === character.value.id)
})

const rarityClass = computed(() => {
  const rarity = operative.value?.rarity || 3
  if (rarity >= 6) return 'legendary'
  if (rarity >= 5) return 'epic'
  if (rarity >= 4) return 'rare'
  return 'common'
})

const hasAvatar = computed(() => {
  return character.value?.avatar && isImage(character.value.avatar)
})

const hasRelationships = computed(() => {
  return character.value?.internal_relationships?.length > 0
})

const hasExternalRelationships = computed(() => {
  return character.value?.external_relationships?.length > 0
})

const isFavorite = computed(() => {
  return character.value ? userStore.isFavorite(character.value.id, 'character') : false
})

const isImage = (path) => {
  return path && (path.endsWith('.png') || path.endsWith('.svg') || path.endsWith('.webp') || path.endsWith('.jpg'))
}

const getFactionColor = (factionId) => {
  const colors = {
    rhodes: '#e74c3c',
    reunion: '#9b59b6',
    lungmen: '#3498db',
    penguin: '#f39c12',
    kjerag: '#95a5a6',
    kazdel: '#c0392b'
  }
  return colors[factionId] || '#666'
}

const getFactionName = (factionId) => {
  const faction = factions.value.find(f => f.id === factionId)
  return faction?.name || factionId
}

const getClassName = (classId) => {
  const classNames = {
    guard: '近卫',
    vanguard: '先锋',
    defender: '重装',
    medic: '医疗',
    caster: '术师',
    sniper: '狙击',
    supporter: '辅助',
    specialist: '特种'
  }
  return classNames[classId] || classId
}

const getCharacterById = (charId) => {
  return characters.value.find(c => c.id === charId)
}

const getTargetName = (target) => {
  const char = getCharacterById(target)
  if (char) return char.name

  const faction = factions.value.find(f => f.id === target)
  if (faction) return faction.name

  return target
}

const getRelationClass = (type) => {
  const classes = {
    '信任': 'relation-trust',
    '合作': 'relation-cooperation',
    '敌对': 'relation-hostile',
    '复杂': 'relation-complex',
    '忠诚': 'relation-loyal',
    '警惕': 'relation-cautious',
    '搭档': 'relation-partner',
    '依赖': 'relation-dependent',
    '守护': 'relation-protect'
  }
  return classes[type] || 'relation-default'
}

const navigateToCharacter = (charId) => {
  router.push(`/characters/${charId}`)
}

const toggleFavorite = () => {
  if (!character.value) return

  if (isFavorite.value) {
    userStore.removeFavorite(character.value.id, 'character')
  } else {
    userStore.addFavorite({ id: character.value.id, name: character.value.name, type: 'character' })
  }
}

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

    const charId = route.params.id
    character.value = characters.value.find(c => c.id === charId)
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.character-detail-page__header {
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

.title-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin-bottom: 15px;
  font-size: 14px;
  color: var(--color-light-gray);
  background: transparent;
  border: 1px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-fast);
}

.back-btn:hover {
  border-color: var(--color-tech-blue);
  color: var(--color-tech-blue);
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

.operative-badge {
  display: flex;
  gap: 1px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.operative-badge .star {
  font-size: 14px;
}

.operative-badge--legendary .star {
  color: var(--color-star-legendary);
}

.operative-badge--epic .star {
  color: var(--color-star-epic);
}

.operative-badge--rare .star {
  color: var(--color-star-rare);
}

.operative-badge--common .star {
  color: var(--color-star-common);
}

.character-detail {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  padding: 40px 0;
}

.character-detail__sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.character-detail__portrait-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.character-detail__portrait {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border: 1px solid var(--color-mid-gray);
}

.character-detail__faction-badge {
  position: absolute;
  bottom: 15px;
  left: 15px;
  padding: 5px 12px;
  font-size: 11px;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.character-detail__avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.character-detail__avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid;
  overflow: hidden;
  background: var(--color-primary-black);
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-detail__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-detail__avatar-text {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary-white);
}

.character-detail__stats {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 20px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-mid-gray);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 12px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 14px;
  color: var(--color-primary-white);
  font-weight: 500;
}

.character-detail__operative-info {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 20px;
}

.operative-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-white);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.operative-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.operative-item {
  text-align: center;
}

.operative-label {
  display: block;
  font-size: 11px;
  color: var(--color-light-gray);
  margin-bottom: 5px;
}

.operative-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-white);
}

.operative-class {
  color: var(--color-tech-blue);
}

.operative-cost {
  color: var(--color-star-epic);
}

.operative-stars {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.operative-stars .star {
  font-size: 12px;
}

.star--legendary {
  color: var(--color-star-legendary);
}

.star--epic {
  color: var(--color-star-epic);
}

.star--rare {
  color: var(--color-star-rare);
}

.star--common {
  color: var(--color-star-common);
}

.operative-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.operative-tag {
  padding: 4px 10px;
  font-size: 12px;
  color: var(--color-light-gray);
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
}

.character-detail__content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--color-primary-white);
  letter-spacing: 2px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.character-detail__description {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-light-gray);
}

.relationships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.relationship-card {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 15px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.relationship-card:hover {
  border-color: var(--color-tech-blue);
}

.relationship-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary-black);
  border: 2px solid var(--color-tech-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary-white);
  margin-bottom: 12px;
}

.relationship-card__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.relationship-card__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-white);
}

.relationship-card__type {
  font-size: 11px;
  color: var(--color-tech-blue);
  padding: 2px 8px;
  border: 1px solid var(--color-tech-blue-dim);
}

.relationship-card__desc {
  font-size: 13px;
  color: var(--color-light-gray);
  line-height: 1.5;
}

.external-relations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.external-relation-item {
  padding: 15px;
  background: var(--color-deep-gray);
  border-left: 3px solid var(--color-mid-gray);
}

.external-relation__target {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary-white);
  margin-bottom: 5px;
}

.external-relation__type {
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  margin-bottom: 8px;
  border: 1px solid;
}

.relation-trust {
  color: #4CAF50;
  border-color: rgba(76, 175, 80, 0.5);
}

.relation-cooperation {
  color: #2196F3;
  border-color: rgba(33, 150, 243, 0.5);
}

.relation-hostile {
  color: #f44336;
  border-color: rgba(244, 67, 54, 0.5);
}

.relation-complex {
  color: #9c27b0;
  border-color: rgba(156, 39, 176, 0.5);
}

.relation-loyal {
  color: #FF9800;
  border-color: rgba(255, 152, 0, 0.5);
}

.relation-cautious {
  color: #795548;
  border-color: rgba(121, 85, 72, 0.5);
}

.relation-partner {
  color: #00BCD4;
  border-color: rgba(0, 188, 212, 0.5);
}

.relation-dependent {
  color: #E91E63;
  border-color: rgba(233, 30, 99, 0.5);
}

.relation-protect {
  color: #607D8B;
  border-color: rgba(96, 125, 139, 0.5);
}

.relation-default {
  color: var(--color-light-gray);
  border-color: var(--color-mid-gray);
}

.external-relation__desc {
  font-size: 13px;
  color: var(--color-light-gray);
}

.character-detail__actions {
  display: flex;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid var(--color-mid-gray);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-light-gray);
}
</style>