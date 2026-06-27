import { ref, computed } from 'vue'
import factionsData from '/data/factions.json'
import charactersData from '/data/characters.json'
import timelineData from '/data/timeline.json'

const searchQuery = ref('')
const showResults = ref(false)

const factions = ref(factionsData.factions || [])
const characters = ref(charactersData.characters || [])
const events = ref(timelineData.events || [])

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

const openSearch = () => {
  showResults.value = true
}

const closeSearch = () => {
  showResults.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  showResults.value = false
}

export function useGlobalSearch() {
  return {
    searchQuery,
    showResults,
    searchResults,
    hasResults,
    openSearch,
    closeSearch,
    clearSearch
  }
}
