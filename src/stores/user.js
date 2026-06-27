import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const favorites = ref([])
  const history = ref([])

  const isLoggedIn = computed(() => !!user.value)

  const init = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }

    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      favorites.value = JSON.parse(storedFavorites)
    }

    const storedHistory = localStorage.getItem('history')
    if (storedHistory) {
      history.value = JSON.parse(storedHistory)
    }
  }

  const login = (userData) => {
    user.value = {
      ...userData,
      joinDate: userData.joinDate || new Date().toISOString()
    }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    favorites.value = []
    history.value = []
    localStorage.removeItem('user')
    localStorage.removeItem('favorites')
    localStorage.removeItem('history')
  }

  const updateUser = (userData) => {
    if (user.value) {
      user.value = {
        ...user.value,
        ...userData,
        joinDate: user.value.joinDate || new Date().toISOString()
      }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const addFavorite = (item) => {
    const type = item.type || 'unknown'
    const id = item.id

    if (!favorites.value.find(f => f.id === id && f.type === type)) {
      favorites.value.push({ ...item, type, addedAt: new Date().toISOString() })
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }
  }

  const removeFavorite = (id, type) => {
    favorites.value = favorites.value.filter(f => !(f.id === id && f.type === type))
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const isFavorite = (id, type) => {
    return favorites.value.some(f => f.id === id && f.type === type)
  }

  const addHistory = (item) => {
    const type = item.type || 'unknown'
    const id = item.id

    history.value = history.value.filter(h => !(h.id === id && h.type === type))

    history.value.unshift({
      ...item,
      type,
      viewedAt: new Date().toISOString()
    })

    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }

    localStorage.setItem('history', JSON.stringify(history.value))
  }

  const clearHistory = () => {
    history.value = []
    localStorage.removeItem('history')
  }

  init()

  return {
    user,
    favorites,
    history,
    isLoggedIn,
    login,
    logout,
    updateUser,
    addFavorite,
    removeFavorite,
    isFavorite,
    addHistory,
    clearHistory
  }
})
