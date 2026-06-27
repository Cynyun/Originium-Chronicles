<template>
  <div class="character-avatar" :class="[`character-avatar--${size}`]" @click="handleClick">
    <div class="character-avatar__wrapper" :style="avatarStyle">
      <img 
        v-if="shouldShowImage" 
        :src="character.avatar" 
        :alt="character.name"
        class="character-avatar__img"
        @error="handleAvatarError"
      />
      <div v-else class="character-avatar__placeholder" :style="placeholderStyle">
        <span class="character-avatar__initial">{{ initialChar }}</span>
      </div>
    </div>
    <span v-if="showName" class="character-avatar__name">{{ character.name }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  character: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  showName: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const isImage = (path) => {
  return path && (path.endsWith('.png') || path.endsWith('.svg') || path.endsWith('.webp') || path.endsWith('.jpg'))
}

const shouldShowImage = computed(() => {
  return props.character.avatar && isImage(props.character.avatar)
})

const initialChar = computed(() => {
  return props.character.name?.charAt(0) || '?'
})

const avatarStyle = computed(() => {
  const colors = {
    rhodes: '#e74c3c',
    reunion: '#9b59b6',
    lungmen: '#3498db',
    penguin: '#f39c12',
    kjerag: '#95a5a6',
    kazdel: '#c0392b'
  }
  const borderColor = colors[props.character.faction] || '#666'
  return {
    borderColor: borderColor
  }
})

const placeholderStyle = computed(() => {
  const colors = {
    rhodes: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    reunion: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
    lungmen: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    penguin: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    kjerag: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
    kazdel: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)'
  }
  return {
    background: colors[props.character.faction] || 'linear-gradient(135deg, #666 0%, #444 100%)'
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
.character-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--transition-normal);
  user-select: none;
}

.character-avatar:hover {
  transform: translateY(-5px);
}

.character-avatar:hover .character-avatar__wrapper {
  box-shadow: var(--shadow-card-hover);
}

.character-avatar__wrapper {
  position: relative;
  border-radius: 50%;
  border: 2px solid;
  overflow: hidden;
  background: var(--color-primary-black);
  transition: var(--transition-normal);
}

.character-avatar--sm .character-avatar__wrapper {
  width: 48px;
  height: 48px;
}

.character-avatar--md .character-avatar__wrapper {
  width: 64px;
  height: 64px;
}

.character-avatar--lg .character-avatar__wrapper {
  width: 80px;
  height: 80px;
}

.character-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-avatar__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-avatar__initial {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-primary-white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.character-avatar--sm .character-avatar__initial {
  font-size: 20px;
}

.character-avatar--md .character-avatar__initial {
  font-size: 28px;
}

.character-avatar--lg .character-avatar__initial {
  font-size: 36px;
}

.character-avatar__name {
  font-size: 13px;
  color: var(--color-primary-white);
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.character-avatar--sm .character-avatar__name {
  font-size: 12px;
  max-width: 48px;
}

.character-avatar--md .character-avatar__name {
  font-size: 13px;
  max-width: 64px;
}

.character-avatar--lg .character-avatar__name {
  font-size: 14px;
  max-width: 80px;
}
</style>