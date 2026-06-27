<template>
  <div class="character-card" @click="$emit('click', character)">
    <div class="character-card__image-container">
      <img :src="character.portrait || '/images/placeholder.webp'" :alt="character.name"
        class="character-card__image" loading="lazy" />
      <div class="character-card__overlay">
        <span class="character-card__faction">{{ getFactionName(character.faction) }}</span>
      </div>
    </div>

    <div class="character-card__info">
      <h3 class="character-card__name">{{ character.name }}</h3>
      <div class="character-card__meta">
        <BaseTag v-if="character.race" variant="character" size="small">
          {{ character.race }}
        </BaseTag>
        <BaseTag v-if="character.position" variant="default" size="small">
          {{ character.position }}
        </BaseTag>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseTag from '@/components/ui/BaseTag.vue'

defineProps({
  character: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const factionNames = {
  rhodes: '罗德岛',
  reunion: '整合运动',
  lungmen: '龙门',
  penguin: '企鹅物流',
  kelthazad: '凯尔希',
  Babel: '巴别塔'
}

const getFactionName = (factionId) => {
  return factionNames[factionId] || factionId
}
</script>

<style scoped>
.character-card {
  display: flex;
  flex-direction: column;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-tech-blue-dim);
  transition: var(--transition-normal);
  cursor: pointer;
  overflow: hidden;
}

.character-card:hover {
  border-color: var(--color-tech-blue);
  box-shadow: var(--shadow-glow-blue);
  transform: translateY(-5px);
}

.character-card__image-container {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--color-primary-black);
}

.character-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.character-card:hover .character-card__image {
  transform: scale(1.05);
}

.character-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
}

.character-card__faction {
  font-size: 11px;
  color: var(--color-tech-blue);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.character-card__info {
  padding: 15px;
}

.character-card__name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-white);
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.character-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
