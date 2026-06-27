<template>
  <div class="basic-character-avatar" @click="handleClick">
    <div class="basic-character-avatar__wrapper">
      <img 
        v-if="hasAvatar" 
        :src="character.avatar" 
        :alt="character.name"
        class="basic-character-avatar__img"
        @error="handleAvatarError"
      />
      <div v-else class="basic-character-avatar__placeholder">
        <span class="basic-character-avatar__initial">{{ initialChar }}</span>
      </div>
    </div>
    <div class="basic-character-avatar__info">
      <span class="basic-character-avatar__name">{{ character.name }}</span>
      <span class="basic-character-avatar__race">{{ character.race }}</span>
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

const handleClick = () => {
  emit('click', props.character)
}

const handleAvatarError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.basic-character-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--transition-normal);
}

.basic-character-avatar:hover {
  transform: translateY(-3px);
}

.basic-character-avatar__wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-mid-gray) 0%, var(--color-deep-gray) 100%);
  transition: var(--transition-normal);
}

.basic-character-avatar:hover .basic-character-avatar__wrapper {
  box-shadow: var(--shadow-glow-blue);
}

.basic-character-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.basic-character-avatar__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-mid-gray) 0%, var(--color-deep-gray) 100%);
}

.basic-character-avatar__initial {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary-white);
}

.basic-character-avatar__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.basic-character-avatar__name {
  font-size: 12px;
  color: var(--color-primary-white);
}

.basic-character-avatar__race {
  font-size: 10px;
  color: var(--color-light-gray);
}
</style>