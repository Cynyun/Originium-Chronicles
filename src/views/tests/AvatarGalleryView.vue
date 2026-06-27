<template>
  <div class="avatar-gallery-page">
    <div class="avatar-gallery-page__header">
      <GridAnimation />
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">头像展示</h1>
          <p class="page-subtitle">多种头像组件展示</p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="avatar-gallery-page__section">
        <div class="section-header">
          <h2 class="section-title">核心成员头像</h2>
          <p class="section-desc">带有发光效果和核心徽章的头像展示</p>
        </div>
        <div class="avatar-grid avatar-grid--core">
          <CoreMemberAvatar v-for="char in coreMembers" :key="char.id" :character="char"
            @click="handleCharacterClick" />
        </div>
      </div>

      <div class="avatar-gallery-page__section">
        <div class="section-header">
          <h2 class="section-title">普通角色头像</h2>
          <p class="section-desc">简洁的角色头像展示</p>
        </div>
        <div class="avatar-grid avatar-grid--basic">
          <BasicCharacterAvatar v-for="char in allCharacters" :key="char.id" :character="char"
            @click="handleCharacterClick" />
        </div>
      </div>

      <div class="avatar-gallery-page__section">
        <div class="section-header">
          <h2 class="section-title">干员头像</h2>
          <p class="section-desc">带有部署费用和标签的干员头像</p>
        </div>
        <div class="avatar-grid avatar-grid--operator">
          <OperatorAvatar v-for="char in operators" :key="char.id" :character="char" :operative="getOperative(char.id)"
            @click="handleCharacterClick" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GridAnimation from '@/components/animations/GridAnimation.vue'
import CoreMemberAvatar from '@/components/avatars/CoreMemberAvatar.vue'
import BasicCharacterAvatar from '@/components/avatars/BasicCharacterAvatar.vue'
import OperatorAvatar from '@/components/avatars/OperatorAvatar.vue'

const router = useRouter()

const characters = ref([])
const operatives = ref([])

const coreMembers = computed(() => {
  return characters.value.filter(c => c.position && c.position.includes('领袖') || c.position.includes('总监'))
})

const allCharacters = computed(() => {
  return characters.value
})

const operators = computed(() => {
  const operativeIds = new Set(operatives.value.map(o => o.id))
  return characters.value.filter(c => operativeIds.has(c.id))
})

const getOperative = (charId) => {
  return operatives.value.find(o => o.id === charId)
}

const handleCharacterClick = (character) => {
  router.push(`/characters/${character.id}`)
}

const loadData = async () => {
  try {
    const [charsRes, operativesRes] = await Promise.all([
      fetch('/data/characters.json'),
      fetch('/data/operatives.json')
    ])

    const charsData = await charsRes.json()
    const operativesData = await operativesRes.json()

    characters.value = charsData.characters || []
    operatives.value = operativesData.operatives || []
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.avatar-gallery-page__header {
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

.avatar-gallery-page__section {
  padding: 40px 0;
  border-bottom: 1px solid var(--color-mid-gray);
}

.avatar-gallery-page__section:last-child {
  border-bottom: none;
}

.section-header {
  margin-bottom: 30px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--color-primary-white);
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.section-desc {
  font-size: 14px;
  color: var(--color-light-gray);
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.avatar-grid--core {
  gap: 40px;
}

.avatar-grid--basic {
  gap: 25px;
}

.avatar-grid--operator {
  gap: 30px;
}

.avatar-grid--elite {
  gap: 35px;
}
</style>