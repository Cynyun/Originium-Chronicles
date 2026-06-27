<template>
  <div class="core-member-avatar" @click="handleClick">
    <div class="core-member-avatar__glow" :style="glowStyle"></div>
    <div class="core-member-avatar__wrapper">
      <img v-if="hasAvatar" :src="character.avatar" :alt="character.name" class="core-member-avatar__img"
        @error="handleAvatarError" />
      <div v-else class="core-member-avatar__placeholder" :style="placeholderStyle">
        <span class="core-member-avatar__initial">{{ initialChar }}</span>
      </div>
    </div>
    <div class="core-member-avatar__mark">
      <span class="core-member-avatar__symbol">◆</span>
    </div>
    <div class="core-member-avatar__info">
      <span class="core-member-avatar__name">{{ character.name }}</span>
      <span class="core-member-avatar__title">{{ character.position }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  character: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const isImage = (path) => {
  return path && (path.endsWith('.png') || path.endsWith('.svg') || path.endsWith('.webp') || path.endsWith('.jpg'))
}

const hasAvatar = computed(() => {
  return props.character.avatar && isImage(props.character.avatar)
})

const initialChar = computed(() => {
  return props.character.name?.charAt(0) || '?'
})

const glowStyle = computed(() => {
  const colors = {
    rhodes: 'rgba(241, 196, 15, 0.4)',
    reunion: 'rgba(155, 89, 182, 0.4)',
    lungmen: 'rgba(52, 152, 219, 0.4)',
    penguin: 'rgba(243, 156, 18, 0.4)',
    kjerag: 'rgba(149, 165, 166, 0.4)',
    kazdel: 'rgba(192, 57, 43, 0.4)'
  }
  return {
    background: colors[props.character.faction] || 'rgba(102, 102, 102, 0.4)'
  }
})

const placeholderStyle = computed(() => {
  const colors = {
    rhodes: 'linear-gradient(135deg, var(--color-accent-red) 0%, var(--color-accent-dark-red) 100%)',
    reunion: 'linear-gradient(135deg, #9b59b6 0%, #6c3483 100%)',
    lungmen: 'linear-gradient(135deg, var(--color-tech-blue) 0%, var(--color-tech-blue-dim) 100%)',
    penguin: 'linear-gradient(135deg, #f39c12 0%, #d68910 100%)',
    kjerag: 'linear-gradient(135deg, var(--color-mid-gray) 0%, #5d6d7e 100%)',
    kazdel: 'linear-gradient(135deg, #c0392b 0%, #8b0000 100%)'
  }
  return {
    background: colors[props.character.faction] || 'linear-gradient(135deg, var(--color-mid-gray) 0%, #444 100%)'
  }
})

const handleClick = () => {
  emit('click', props.character)
}

const handleAvatarError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.core-member-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
}

.core-member-avatar:hover {
  transform: translateY(-8px);
}

.core-member-avatar__glow {
  position: absolute;
  top: 20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.core-member-avatar:hover .core-member-avatar__glow {
  opacity: 1;
}

.core-member-avatar__wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-primary-black);
  transition: var(--transition-normal);
}

.core-member-avatar:hover .core-member-avatar__wrapper {
  box-shadow: var(--shadow-card-hover);
}

.core-member-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.core-member-avatar__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.core-member-avatar__initial {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary-white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.core-member-avatar__mark {
  position: absolute;
  top: 55px;
  right: -5px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.core-member-avatar__symbol {
  font-size: 14px;
  color: var(--color-primary-white);
  font-weight: 700;
}

.core-member-avatar__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.core-member-avatar__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-white);
}

.core-member-avatar__title {
  font-size: 11px;
  color: var(--color-light-gray);
}
</style>