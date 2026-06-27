<template>
  <div class="user-profile">
    <div class="user-profile__header">
      <div class="user-profile__avatar">
        <img
          :src="user.avatar || '/images/default-avatar.png'"
          alt="头像"
          class="user-profile__avatar-img"
        />
      </div>
      <div class="user-profile__info">
        <h2 class="user-profile__name">{{ user.username }}</h2>
        <p class="user-profile__email">{{ user.email }}</p>
      </div>
    </div>

    <div class="user-profile__stats">
      <div class="user-profile__stat">
        <span class="user-profile__stat-value">{{ favoritesCount }}</span>
        <span class="user-profile__stat-label">收藏</span>
      </div>
      <div class="user-profile__stat">
        <span class="user-profile__stat-value">{{ historyCount }}</span>
        <span class="user-profile__stat-label">浏览</span>
      </div>
      <div class="user-profile__stat">
        <span class="user-profile__stat-value">{{ joinDays }}</span>
        <span class="user-profile__stat-label">加入天数</span>
      </div>
    </div>

    <div class="user-profile__actions">
      <BaseButton variant="secondary" @click="$emit('viewFavorites')">
        我的收藏
      </BaseButton>
      <BaseButton variant="secondary" @click="$emit('viewHistory')">
        浏览历史
      </BaseButton>
      <BaseButton variant="secondary" @click="$emit('viewSettings')">
        账号设置
      </BaseButton>
      <BaseButton variant="outline" @click="$emit('logout')">
        退出登录
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  favorites: {
    type: Array,
    default: () => []
  },
  history: {
    type: Array,
    default: () => []
  },
  settings: {
    type: Object,
    default: () => {}
  }
})

defineEmits(['viewFavorites', 'viewHistory', 'viewSettings', 'logout']) 

const favoritesCount = computed(() => props.favorites.length)
const historyCount = computed(() => props.history.length)

const joinDays = computed(() => {
  if (!props.user.joinDate) return 1
  const diff = Date.now() - new Date(props.user.joinDate).getTime()
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)))
})
</script>

<style scoped>
.user-profile {
  padding: 30px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
}

.user-profile__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.user-profile__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-accent-red);
}

.user-profile__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-profile__name {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary-white);
  margin-bottom: 5px;
}

.user-profile__email {
  font-size: 14px;
  color: var(--color-light-gray);
}

.user-profile__stats {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.user-profile__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.user-profile__stat-value {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-accent-red);
}

.user-profile__stat-label {
  font-size: 12px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.user-profile__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
