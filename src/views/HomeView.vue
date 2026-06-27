<template>
  <div class="home">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-text">
        <span v-for="(char, index) in loadingText" :key="index"
          :class="{ 'loading-char--visible': charVisible[index] }">{{ char }}</span>
      </div>
    </div>
    <div v-if="!isLoading">
      <HomeHero :factions="factions" :characters="characters" :events="events" @selectFaction="goToFaction"
        @selectCharacter="goToCharacter" @selectEvent="goToEvent" @startExplore="handleStartExplore" ref="heroSection"
        :canStartAnimation="!isLoading" />
      <IntroSection :canStartAnimation="!isLoading" />
      <FactionsPreview :factions="factions" @selectFaction="goToFaction" :canStartAnimation="!isLoading" />
      <CharactersPreview :characters="characters" @selectCharacter="goToCharacter" :canStartAnimation="!isLoading" />
      <TimelinePreview @selectEvent="goToEvent" :canStartAnimation="!isLoading" />
      <ChangelogSection :canStartAnimation="!isLoading" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeHero from '@/components/home/HomeHero.vue'
import IntroSection from '@/components/home/IntroSection.vue'
import FactionsPreview from '@/components/home/FactionsPreview.vue'
import CharactersPreview from '@/components/home/CharactersPreview.vue'
import TimelinePreview from '@/components/home/TimelinePreview.vue'
import ChangelogSection from '@/components/home/ChangelogSection.vue'

const router = useRouter()
const userStore = useUserStore()

const heroSection = ref(null)
const factions = ref([])
const characters = ref([])
const isLoading = ref(true)

const loadingText = '加载中...'.split('')
const charVisible = ref(new Array(loadingText.length).fill(false))

const typeLoadingText = () => {
  loadingText.forEach((_, index) => {
    setTimeout(() => {
      charVisible.value[index] = true
    }, index * 100)
  })
}

const loadData = async () => {
  typeLoadingText()

  try {
    const [factionsRes, charactersRes] = await Promise.all([
      fetch('/data/factions.json'),
      fetch('/data/characters.json')
    ])

    const factionsData = await factionsRes.json()
    const charactersData = await charactersRes.json()

    factions.value = factionsData.factions
    characters.value = charactersData.characters

    await new Promise(resolve => setTimeout(resolve, 500))

    isLoading.value = false
  } catch (error) {
    console.error('Failed to load data:', error)
    isLoading.value = false
  }
}

const goToFaction = (faction) => {
  userStore.addHistory({ id: faction.id, name: faction.name, type: 'faction' })
  router.push(`/factions/${faction.id}`)
}

const goToCharacter = (character) => {
  userStore.addHistory({ id: character.id, name: character.name, type: 'character' })
  router.push(`/characters/${character.id}`)
}

const goToEvent = (event) => {
  userStore.addHistory({ id: event.id, name: event.title, type: 'event' })
  router.push(`/timeline?event=${event.id}`)
}

const handleStartExplore = () => {
  if (heroSection.value) {
    heroSection.value.setScrollHint(true)
  }

  setTimeout(() => {
    const currentPosition = window.scrollY
    const targetPosition = currentPosition + 150

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }, 300)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home {
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
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-text {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-primary-white);
  letter-spacing: 4px;
}

.loading-text span {
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.loading-char--visible {
  opacity: 1 !important;
}
</style>