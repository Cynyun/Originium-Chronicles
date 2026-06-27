<template>
  <div class="operator-avatar" @click="handleClick">
    <div class="operator-avatar__wrapper">
      <div class="operator-avatar__parallelogram" :class="[`operator-avatar__parallelogram--${rarityClass}`]">
        <img :src="displayImage" :alt="character.name" class="operator-avatar__img"
          :class="{ 'operator-avatar__img--placeholder': isPlaceholder }" />
      </div>
      <div v-if="operative" class="operator-avatar__cost">
        <span class="operator-avatar__cost-icon">⚡</span>
        <span class="operator-avatar__cost-value">{{ operative.cost }}</span>
      </div>
    </div>
    <div class="operator-avatar__stars">
      <span v-for="i in (operative?.rarity || 3)" :key="i" class="operator-avatar__star"
        :class="[`operator-avatar__star--${rarityClass}`]">★</span>
    </div>
    <span class="operator-avatar__name">{{ character.name }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  character: { type: Object, required: true },
  operative: { type: Object, default: null }
})

const emit = defineEmits(['click'])

const isImage = (path) => path && (path.endsWith('.png') || path.endsWith('.svg') || path.endsWith('.webp') || path.endsWith('.jpg'))

const displayImage = computed(() => {
  if (props.character.operator_art && isImage(props.character.operator_art)) {
    return props.character.operator_art
  }
  return '/images/operators/placeholder.svg'
})

const isPlaceholder = computed(() => {
  return displayImage.value === '/images/operators/placeholder.svg'
})

const rarityClass = computed(() => {
  const rarity = props.operative?.rarity || 3
  if (rarity >= 6) return 'legendary'
  if (rarity >= 5) return 'epic'
  if (rarity >= 4) return 'rare'
  return 'common'
})

const handleClick = () => emit('click', props.character)
</script>

<style scoped>
.operator-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: var(--transition-normal);
  width: 90px;
  height: 140px;
}

.operator-avatar:hover {
  transform: translateY(-5px);
}

.operator-avatar__wrapper {
  position: relative;
  width: 72px;
  height: 120px;
}

.operator-avatar__parallelogram {
  width: 70px;
  height: 120px;
  transform: skew(-12deg);
  overflow: hidden;
}

.operator-avatar__parallelogram--legendary {
  box-shadow: 0 0 15px rgba(230, 126, 34, 0.4);
}

.operator-avatar__parallelogram--epic {
  box-shadow: 0 0 15px rgba(155, 89, 182, 0.4);
}

.operator-avatar__parallelogram--rare {
  box-shadow: 0 0 15px rgba(52, 152, 219, 0.4);
}

.operator-avatar__parallelogram--common {
  background: linear-gradient(135deg, var(--color-mid-gray) 0%, var(--color-deep-gray) 100%);
}

.operator-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transform: skew(12deg);
}

.operator-avatar__img--placeholder {
  transform: skew(12deg) scale(1.5) !important;
  margin-left: -8%;
  object-fit: cover !important;
}

.operator-avatar__cost {
  position: absolute;
  bottom: 0;
  right: -12px;
  display: flex;
  align-items: center;
  gap: 1px;
}

.operator-avatar__cost-icon {
  font-size: 10px;
  color: var(--color-star-epic);
}

.operator-avatar__cost-value {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-star-epic);
}

.operator-avatar__stars {
  display: flex;
  gap: 1px;
}

.operator-avatar__star {
  font-size: 12px;
}

.operator-avatar__star--legendary {
  color: var(--color-star-legendary);
  text-shadow: 0 0 8px rgba(230, 126, 34, 0.8);
}

.operator-avatar__star--epic {
  color: var(--color-star-epic);
  text-shadow: 0 0 8px rgba(243, 156, 18, 0.8);
}

.operator-avatar__star--rare {
  color: var(--color-star-rare);
  text-shadow: 0 0 8px rgba(52, 152, 219, 0.8);
}

.operator-avatar__star--common {
  color: var(--color-star-common);
}

.operator-avatar__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-white);
}
</style>