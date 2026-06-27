<template>
  <div class="user-page">
    <div class="user-page__header">
      <div class="container">
        <h1 class="page-title">用户中心</h1>
        <p class="page-subtitle">管理您的个人数据与探索记录</p>
      </div>
    </div>

    <div class="container">
      <div class="user-page__content">
        <div v-if="!isLoggedIn" class="login-section">
          <LoginForm @success="handleLoginSuccess" />
        </div>

        <div v-else class="user-section">
          <!-- 顶部统计卡片 -->
          <div class="user-dashboard">
            <div class="dashboard-card">
              <div class="dashboard-card__icon">📚</div>
              <div class="dashboard-card__info">
                <span class="dashboard-card__value">{{ stats.totalItems }}</span>
                <span class="dashboard-card__label">探索内容</span>
              </div>
            </div>
            <div class="dashboard-card">
              <div class="dashboard-card__icon">⭐</div>
              <div class="dashboard-card__info">
                <span class="dashboard-card__value">{{ stats.factionsCount + stats.charactersCount }}</span>
                <span class="dashboard-card__label">已收藏</span>
              </div>
            </div>
            <div class="dashboard-card">
              <div class="dashboard-card__icon">📖</div>
              <div class="dashboard-card__info">
                <span class="dashboard-card__value">{{ stats.eventsCount }}</span>
                <span class="dashboard-card__label">浏览事件</span>
              </div>
            </div>
            <div class="dashboard-card">
              <div class="dashboard-card__icon">🔥</div>
              <div class="dashboard-card__info">
                <span class="dashboard-card__value">{{ stats.joinDays }}</span>
                <span class="dashboard-card__label">连续天数</span>
              </div>
            </div>
          </div>

          <!-- 用户信息 -->
          <UserProfile :user="user" :favorites="favorites" :history="history" :settings="settings"
            @viewFavorites="activeTab = 'favorites'" @viewHistory="activeTab = 'history'"
            @viewSettings="activeTab = 'settings'" @logout="handleLogout" />

          <!-- 标签页 -->
          <div class="user-tabs">
            <div class="user-tabs__nav">
              <button class="user-tabs__tab" :class="{ 'user-tabs__tab--active': activeTab === 'favorites' }"
                @click="activeTab = 'favorites'">
                <span class="tab-icon">⭐</span>
                我的收藏
                <span v-if="favorites.length" class="tab-badge">{{ favorites.length }}</span>
              </button>
              <button class="user-tabs__tab" :class="{ 'user-tabs__tab--active': activeTab === 'history' }"
                @click="activeTab = 'history'">
                <span class="tab-icon">📖</span>
                浏览历史
                <span v-if="history.length" class="tab-badge">{{ history.length }}</span>
              </button>
              <button class="user-tabs__tab" :class="{ 'user-tabs__tab--active': activeTab === 'stats' }"
                @click="activeTab = 'stats'">
                <span class="tab-icon">📊</span>
                数据统计
              </button>
              <button class="user-tabs__tab" :class="{ 'user-tabs__tab--active': activeTab === 'settings' }"
                @click="activeTab = 'settings'">
                <span class="tab-icon">⚙️</span>
                账号设置
              </button>
            </div>

            <div class="user-tabs__content">
              <!-- 收藏列表 -->
              <div v-if="activeTab === 'favorites'" class="favorites-wrapper">
                <div class="favorites-header">
                  <h3>我的收藏</h3>
                  <!-- <div class="favorites-filter">
                    <button v-for="type in ['all', 'faction', 'character', 'event']" :key="type" class="filter-btn"
                      :class="{ 'filter-btn--active': favoriteFilter === type }" @click="favoriteFilter = type">
                      {{ getFilterLabel(type) }}
                    </button>
                  </div> -->
                </div>

                <div v-if="filteredFavorites.length === 0" class="empty-state">
                  <div class="empty-icon">💫</div>
                  <p>还没有收藏任何内容</p>
                  <div class="empty-actions">
                    <BaseButton variant="outline" @click="$router.push('/factions')">
                      探索势力
                    </BaseButton>
                    <BaseButton variant="outline" @click="$router.push('/characters')">
                      探索人物
                    </BaseButton>
                  </div>
                </div>
                <div v-else class="favorites-grid">
                  <div v-for="item in filteredFavorites" :key="`${item.type}-${item.id}`" class="favorite-card"
                    @click="goToItem(item)">
                    <div class="favorite-card__header">
                      <span class="favorite-card__type">{{ getTypeIcon(item.type) }} {{ getTypeName(item.type) }}</span>
                      <button class="favorite-card__remove" @click.stop="removeFavorite(item)" title="取消收藏">
                        ✕
                      </button>
                    </div>
                    <h4 class="favorite-card__name">{{ item.name }}</h4>
                    <div class="favorite-card__footer">
                      <span class="favorite-card__date">
                        收藏于 {{ formatShortDate(item.addedAt) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 浏览历史 -->
              <div v-if="activeTab === 'history'" class="history-wrapper">
                <div class="history-header">
                  <h3>浏览历史</h3>
                  <BaseButton variant="ghost" size="small" @click="clearHistory" :disabled="history.length === 0">
                    清空历史
                  </BaseButton>
                </div>

                <div v-if="history.length === 0" class="empty-state">
                  <div class="empty-icon">📜</div>
                  <p>暂无浏览记录</p>
                  <BaseButton variant="outline" @click="$router.push('/')">
                    开始探索
                  </BaseButton>
                </div>
                <div v-else class="history-timeline">
                  <div v-for="(group, date) in groupedHistory" :key="date" class="history-group">
                    <h4 class="history-group__date">{{ formatGroupDate(date) }}</h4>
                    <div class="history-group__items">
                      <div v-for="item in group" :key="`${item.type}-${item.id}`" class="history-card"
                        @click="goToItem(item)">
                        <div class="history-card__icon">{{ getTypeIcon(item.type) }}</div>
                        <div class="history-card__info">
                          <span class="history-card__type">{{ getTypeName(item.type) }}</span>
                          <h4 class="history-card__name">{{ item.name }}</h4>
                        </div>
                        <span class="history-card__time">{{ formatTime(item.viewedAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 数据统计 -->
              <div v-if="activeTab === 'stats'" class="stats-wrapper">
                <h3>探索统计</h3>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-card__icon">🏰</div>
                    <div class="stat-card__info">
                      <span class="stat-card__value">{{ stats.factionsCount }}</span>
                      <span class="stat-card__label">势力</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-card__icon">👤</div>
                    <div class="stat-card__info">
                      <span class="stat-card__value">{{ stats.charactersCount }}</span>
                      <span class="stat-card__label">人物</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-card__icon">📅</div>
                    <div class="stat-card__info">
                      <span class="stat-card__value">{{ stats.eventsCount }}</span>
                      <span class="stat-card__label">事件</span>
                    </div>
                  </div>
                </div>

                <div class="stats-section">
                  <h4>最近活动</h4>
                  <div class="activity-list">
                    <div class="activity-item">
                      <span class="activity-icon">⭐</span>
                      <span class="activity-text">收藏了 {{ recentActivity.favoriteCount }} 个内容</span>
                      <span class="activity-time">{{ formatShortDate(recentActivity.latestFavorite) }}</span>
                    </div>
                    <div class="activity-item">
                      <span class="activity-icon">👀</span>
                      <span class="activity-text">浏览了 {{ recentActivity.viewCount }} 个内容</span>
                      <span class="activity-time">{{ formatShortDate(recentActivity.latestView) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 账号设置 -->
              <div v-if="activeTab === 'settings'" class="settings-wrapper">
                <UserSettings @cancel="activeTab = 'favorites'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/user/LoginForm.vue'
import UserProfile from '@/components/user/UserProfile.vue'
import UserSettings from '@/components/user/UserSettings.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('favorites')
const favoriteFilter = ref('all')

const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)
const favorites = computed(() => userStore.favorites)
const history = computed(() => userStore.history)

const stats = computed(() => {
  const factionsCount = favorites.value.filter(f => f.type === 'faction').length
  const charactersCount = favorites.value.filter(f => f.type === 'character').length
  const eventsCount = history.value.filter(h => h.type === 'event').length
  const joinDays = user.value?.joinDate ?
    Math.max(1, Math.floor((Date.now() - new Date(user.value.joinDate).getTime()) / (1000 * 60 * 60 * 24))) : 1

  return {
    factionsCount,
    charactersCount,
    eventsCount,
    joinDays,
    totalItems: factionsCount + charactersCount + history.value.length
  }
})

const recentActivity = computed(() => {
  const latestFavorite = favorites.value.length > 0 ?
    favorites.value[favorites.value.length - 1].addedAt : null
  const latestView = history.value.length > 0 ?
    history.value[0].viewedAt : null

  return {
    favoriteCount: favorites.value.length,
    viewCount: history.value.length,
    latestFavorite,
    latestView
  }
})

const filteredFavorites = computed(() => {
  return favorites.value.filter(f => f.type === 'character')
})

const groupedHistory = computed(() => {
  const groups = {}
  history.value.forEach(item => {
    const date = new Date(item.viewedAt).toDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  })
  return groups
})

const handleLoginSuccess = (userData) => {
  userStore.login(userData)
}

const handleLogout = () => {
  userStore.logout()
}

const removeFavorite = (item) => {
  userStore.removeFavorite(item.id, item.type)
}

const clearHistory = () => {
  if (confirm('确定要清空所有浏览历史吗？')) {
    userStore.clearHistory()
  }
}

const goToItem = (item) => {
  if (item.type === 'faction') {
    router.push(`/factions/${item.id}`)
  } else if (item.type === 'character') {
    router.push(`/characters/${item.id}`)
  } else if (item.type === 'event') {
    router.push(`/events/${item.id}`)
  }
}

const getFilterLabel = (type) => {
  const labels = { all: '全部', faction: '势力', character: '人物', event: '事件' }
  return labels[type] || type
}

const getTypeName = (type) => {
  const names = { faction: '势力', character: '人物', event: '事件' }
  return names[type] || type
}

const getTypeIcon = (type) => {
  const icons = { faction: '🏰', character: '👤', event: '📅' }
  return icons[type] || '📦'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatShortDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const formatGroupDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString('zh-CN')
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.user-page__header {
  padding: 60px 0 40px;
  background: linear-gradient(180deg, rgba(139, 0, 0, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-mid-gray);
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

.user-page__content {
  padding: 40px 0 60px;
  max-width: 1000px;
  margin: 0 auto;
}

.login-section {
  display: flex;
  justify-content: center;
}

.user-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 顶部仪表盘 */
.user-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.dashboard-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  transition: var(--transition-normal);
}

.dashboard-card:hover {
  border-color: var(--color-accent-red);
}

.dashboard-card__icon {
  font-size: 32px;
}

.dashboard-card__info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dashboard-card__value {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-white);
}

.dashboard-card__label {
  font-size: 12px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 标签页 */
.user-tabs {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
}

.user-tabs__nav {
  display: flex;
  border-bottom: 1px solid var(--color-mid-gray);
  width: 100%;
}

.user-tabs__tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 15px 20px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-light-gray);
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
}

.tab-icon {
  font-size: 16px;
}

.tab-badge {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--color-accent-red);
  color: white;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-tabs__tab:hover {
  color: var(--color-primary-white);
  background: rgba(255, 255, 255, 0.02);
}

.user-tabs__tab--active {
  color: var(--color-accent-red);
  border-bottom: 2px solid var(--color-accent-red);
  margin-bottom: -1px;
}

.user-tabs__content {
  padding: 30px;
}

/* 收藏页面 */
.favorites-wrapper,
.history-wrapper,
.stats-wrapper {
  width: 100%;
}

.favorites-header,
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.favorites-header h3,
.history-header h3,
.stats-wrapper h3 {
  font-size: 18px;
  color: var(--color-primary-white);
  margin: 0;
}

.favorites-filter {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 6px 14px;
  font-size: 13px;
  color: var(--color-light-gray);
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-fast);
}

.filter-btn:hover {
  color: var(--color-primary-white);
  border-color: var(--color-light-gray);
}

.filter-btn--active {
  color: var(--color-accent-red);
  border-color: var(--color-accent-red);
  background: rgba(139, 0, 0, 0.1);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.favorite-card {
  padding: 18px;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-normal);
}

.favorite-card:hover {
  border-color: var(--color-accent-red);
  transform: translateY(-2px);
}

.favorite-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.favorite-card__type {
  font-size: 11px;
  color: var(--color-accent-red);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.favorite-card__remove {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--color-light-gray);
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
  border-radius: 50%;
}

.favorite-card__remove:hover {
  color: var(--color-accent-red);
  background: rgba(139, 0, 0, 0.1);
}

.favorite-card__name {
  font-size: 15px;
  color: var(--color-primary-white);
  margin-bottom: 10px;
}

.favorite-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-card__date {
  font-size: 12px;
  color: var(--color-light-gray);
}

/* 历史页面 */
.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.history-group__date {
  font-size: 13px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding-left: 5px;
  border-left: 3px solid var(--color-accent-red);
}

.history-group__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-normal);
}

.history-card:hover {
  border-color: var(--color-accent-red);
}

.history-card__icon {
  font-size: 24px;
}

.history-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.history-card__type {
  font-size: 11px;
  color: var(--color-accent-red);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.history-card__name {
  font-size: 14px;
  color: var(--color-primary-white);
  margin: 0;
}

.history-card__time {
  font-size: 12px;
  color: var(--color-light-gray);
  font-family: var(--font-mono);
}

/* 统计页面 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
}

.stat-card__icon {
  font-size: 32px;
}

.stat-card__info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-card__value {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-accent-red);
}

.stat-card__label {
  font-size: 12px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stats-section {
  padding: 25px;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
}

.stats-section h4 {
  font-size: 15px;
  color: var(--color-primary-white);
  margin-bottom: 15px;
  margin-top: 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.02);
}

.activity-icon {
  font-size: 16px;
}

.activity-text {
  flex: 1;
  font-size: 14px;
  color: var(--color-light-gray);
}

.activity-time {
  font-size: 12px;
  color: var(--color-light-gray);
  font-family: var(--font-mono);
}

/* 通用样式 */
.settings-wrapper {
  max-width: 100%;
  min-width: 350px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state p {
  color: var(--color-light-gray);
  margin-bottom: 25px;
  font-size: 15px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .user-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .user-tabs__nav {
    flex-wrap: wrap;
  }

  .user-tabs__tab {
    flex: 1 1 50%;
  }
}

@media (max-width: 600px) {
  .user-dashboard {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .favorites-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .favorites-filter {
    flex-wrap: wrap;
  }
}
</style>
