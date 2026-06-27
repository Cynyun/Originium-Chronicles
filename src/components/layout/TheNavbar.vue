<template>
  <header class="navbar">
    <div class="navbar__container">
      <div class="navbar__brand">
        <router-link to="/" class="navbar__logo">
          <img src="/favicon.ico" alt="Logo" class="navbar__logo-icon" />
          <span class="navbar__logo-text">
            <span class="navbar__title">源石纪事</span>
            <span class="navbar__subtitle">Originium Chronicles</span>
          </span>
        </router-link>
      </div>

      <button class="navbar__toggle" @click="isMenuOpen = !isMenuOpen" :class="{ 'is-active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="navbar__nav" :class="{ 'is-open': isMenuOpen }">
        <ul class="navbar__menu" :class="{ 'is-searching': isSearchOpen }">
          <li v-for="item in navItems" :key="item.path" class="navbar__item">
            <router-link :to="item.path" class="navbar__link" @click="handleNavClick">
              <span class="navbar__link-icon">{{ item.icon }}</span>
              <span class="navbar__link-text">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>

        <div class="navbar__actions">
          <div class="navbar__search-wrapper" :class="{ 'is-open': isSearchOpen }">
            <div v-if="!isSearchOpen" class="navbar__search" @click="toggleSearch">
              <span class="navbar__search-icon">⌕</span>
            </div>

            <div v-else class="navbar__search-box">
              <input ref="searchInputRef" v-model="searchQuery" type="text" class="navbar__search-input"
                placeholder="搜索..." @blur="handleSearchBlur" @focus="showResults = true" />
              <button class="navbar__search-close" @click="closeSearch">X</button>

              <div v-if="showResults && searchQuery" class="navbar__search-results">
                <div v-if="searchResults.factions.length" class="search-group">
                  <h4 class="search-group__title">派系</h4>
                  <div v-for="faction in searchResults.factions" :key="faction.id" class="search-item"
                    @mousedown="goToFaction(faction)">
                    <span class="search-item__icon faction">◆</span>
                    <span class="search-item__name">{{ faction.name }}</span>
                  </div>
                </div>

                <div v-if="searchResults.characters.length" class="search-group">
                  <h4 class="search-group__title">人物</h4>
                  <div v-for="char in searchResults.characters" :key="char.id" class="search-item"
                    @mousedown="goToCharacter(char)">
                    <span class="search-item__icon character">{{ char.name[0] }}</span>
                    <span class="search-item__name">{{ char.name }}</span>
                  </div>
                </div>

                <div v-if="searchResults.events.length" class="search-group">
                  <h4 class="search-group__title">事件</h4>
                  <div v-for="event in searchResults.events" :key="event.id" class="search-item"
                    @mousedown="goToEvent(event)">
                    <span class="search-item__icon event">▣</span>
                    <span class="search-item__name">{{ event.title }}</span>
                  </div>
                </div>

                <div v-if="!hasResults" class="search-empty">
                  未找到相关结果
                </div>
              </div>
            </div>
          </div>

          <div class="navbar__user" @click="handleUserClick">
            <span class="navbar__user-icon">▲</span>
            <span class="navbar__user-name">{{ isLoggedIn ? username : '登录' }}</span>
          </div>
        </div>
      </nav>
    </div>

    <LoginModal :isOpen="isLoginModalOpen" @close="isLoginModalOpen = false" @loggedIn="handleLoggedIn" />
  </header>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LoginModal from '@/components/user/LoginModal.vue'

const router = useRouter()
const userStore = useUserStore()
const isMenuOpen = ref(false)
const isLoginModalOpen = ref(false)
const isSearchOpen = ref(false)
const showResults = ref(false)
const searchInputRef = ref(null)

const searchQuery = ref('')

const navItems = [
  { path: '/', name: '首页', icon: '◉' },
  { path: '/factions', name: '派系', icon: '■' },
  { path: '/characters', name: '角色', icon: '△' },
  { path: '/timeline', name: '事件', icon: '▶' }
]

const isLoggedIn = computed(() => userStore.isLoggedIn)
const username = computed(() => userStore.user?.username || '用户')

const searchResults = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return { factions: [], characters: [], events: [] }

  return {
    factions: factions.value.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.description?.toLowerCase().includes(query)
    ).slice(0, 3),

    characters: characters.value.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    ).slice(0, 5),

    events: events.value.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.description?.toLowerCase().includes(query)
    ).slice(0, 3)
  }
})

const hasResults = computed(() => {
  const { factions, characters, events } = searchResults.value
  return factions.length > 0 || characters.length > 0 || events.length > 0
})

let factions = []
let characters = []
let events = []

const loadData = async () => {
  try {
    const [factionsRes, charactersRes, timelineRes] = await Promise.all([
      fetch('/data/factions.json'),
      fetch('/data/characters.json'),
      fetch('/data/timeline.json')
    ])

    const factionsData = await factionsRes.json()
    const charactersData = await charactersRes.json()
    const timelineData = await timelineRes.json()

    factions = factionsData.factions || []
    characters = charactersData.characters || []
    events = timelineData.events || []
  } catch (error) {
    console.error('Failed to load search data:', error)
  }
}

loadData()

const toggleSearch = async () => {
  isSearchOpen.value = true
  await nextTick()
  searchInputRef.value?.focus()
}

const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
  showResults.value = false
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

const handleNavClick = () => {
  isMenuOpen.value = false
}

const handleUserClick = () => {
  if (isLoggedIn.value) {
    router.push('/user')
  } else {
    isLoginModalOpen.value = true
  }
  isMenuOpen.value = false
}

const handleLoggedIn = () => {
}

const goToFaction = (faction) => {
  userStore.addHistory({ id: faction.id, name: faction.name, type: 'faction' })
  router.push(`/factions/${faction.id}`)
  closeSearch()
}

const goToCharacter = (character) => {
  userStore.addHistory({ id: character.id, name: character.name, type: 'character' })
  router.push(`/characters/${character.id}`)
  closeSearch()
}

const goToEvent = (event) => {
  userStore.addHistory({ id: event.id, name: event.title, type: 'event' })
  router.push(`/timeline?event=${event.id}`)
  closeSearch()
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 100%);
  border-bottom: 1px solid var(--color-accent-dark-red);
  backdrop-filter: blur(10px);
}

.navbar__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.navbar__brand {
  flex-shrink: 0;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-primary-white);
  text-decoration: none;
}

.navbar__logo-icon {
  width: 36px;
  height: 36px;
  background: var(--color-accent-red);
  border-radius: 4px;
  padding: 4px;
  border: 1px solid var(--color-accent-dark-red);
  animation: borderGlow 2s infinite;
}

.navbar__logo-text {
  display: flex;
  flex-direction: column;
}

.navbar__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--color-primary-white);
}

.navbar__subtitle {
  font-family: var(--font-display);
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--color-light-gray);
  text-transform: uppercase;
}

.navbar__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

.navbar__toggle span {
  display: block;
  width: 25px;
  height: 2px;
  background: var(--color-primary-white);
  transition: var(--transition-normal);
}

.navbar__toggle.is-active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar__toggle.is-active span:nth-child(2) {
  opacity: 0;
}

.navbar__toggle.is-active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar__menu {
  display: flex;
  gap: 8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar__menu.is-searching {
  gap: 4px;
}

.navbar__menu.is-searching .navbar__link {
  padding: 10px 12px;
  font-size: 14px;
}

.navbar__menu.is-searching .navbar__link-text {
  display: none;
}

.navbar__menu.is-searching .navbar__link-icon {
  font-size: 14px;
}

.navbar__item {
  position: relative;
}

.navbar__link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: var(--color-primary-white);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 1px;
  text-decoration: none;
  border: 1px solid transparent;
  transition: var(--transition-normal);
}

.navbar__link:hover,
.navbar__link.router-link-active {
  color: var(--color-accent-red);
}

.navbar__link-icon {
  font-size: 12px;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar__search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.navbar__search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 36px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: var(--transition-normal);
}

.navbar__search:hover {
  border-color: var(--color-accent-red);
  background: rgba(139, 0, 0, 0.1);
  box-shadow: 0 0 8px rgba(139, 0, 0, 0.3);
}

.navbar__search-icon {
  font-size: 18px;
  color: var(--color-light-gray);
}

.navbar__search-box {
  display: flex;
  align-items: center;
  position: relative;
  animation: expandSearch 0.3s ease forwards;
}

@keyframes expandSearch {
  from {
    width: 40px;
    opacity: 0;
  }

  to {
    width: 280px;
    opacity: 1;
  }
}

.navbar__search-input {
  width: 280px;
  padding: 8px 40px 8px 15px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-primary-white);
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--color-accent-red);
  border-radius: 6px;
  outline: none;
  transition: var(--transition-normal);
}

.navbar__search-input::placeholder {
  color: var(--color-light-gray);
}

.navbar__search-close {
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--color-light-gray);
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.navbar__search-close:hover {
  color: var(--color-accent-red);
}

.navbar__search-results {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: rgba(20, 20, 20, 0.98);
  border: 1px solid var(--color-mid-gray);
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.search-group {
  padding: 12px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.search-group:last-child {
  border-bottom: none;
}

.search-group__title {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-item:hover {
  background: rgba(139, 0, 0, 0.1);
}

.search-item__icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
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
  font-size: 13px;
  color: var(--color-primary-white);
  text-align: left;
}

.search-empty {
  padding: 20px;
  text-align: center;
  color: var(--color-light-gray);
  font-size: 13px;
}

.navbar__user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 15px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: var(--transition-normal);
}

.navbar__user:hover {
  border-color: var(--color-accent-red);
  background: rgba(139, 0, 0, 0.1);
  box-shadow: 0 0 8px rgba(139, 0, 0, 0.3);
}

.navbar__user-icon {
  font-size: 16px;
  color: var(--color-accent-red);
}

.navbar__user-name {
  font-size: 14px;
  color: var(--color-primary-white);
}

@media (max-width: 900px) {
  .navbar {
    background: rgba(10, 10, 15, 0.99);
    backdrop-filter: blur(20px);
    border-bottom: 2px solid var(--color-accent-dark-red);
    box-shadow: 0 4px 20px rgba(139, 0, 0, 0.3);
  }

  .navbar__toggle {
    display: flex;
  }

  .navbar__nav,
  .navbar__nav.is-open {
    height: 500%;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background: linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(5, 5, 10, 0.98) 100%) !important;
    box-shadow: inset 0 0 40px rgba(139, 0, 0, 0.2), 0 0 30px rgba(139, 0, 0, 0.15) !important;
    z-index: 999;
  }

  .navbar__nav {
    transform: translateX(100%);
    transition: transform var(--transition-normal);
  }

  .navbar__nav.is-open {
    transform: translateX(0);
  }

  .navbar__menu {
    flex-direction: column;
    width: 100%;
  }

  .navbar__menu.is-searching {
    flex-direction: row;
  }

  .navbar__menu.is-searching .navbar__link {
    padding: 10px 20px;
  }

  .navbar__menu.is-searching .navbar__link-text {
    display: inline;
  }

  .navbar__link {
    width: 100%;
    padding: 15px 20px;
  }

  .navbar__actions {
    width: 100%;
    justify-content: center;
  }

  .navbar__search-results {
    left: 0;
    right: 0;
    width: auto;
  }
}
</style>
