<template>
  <div class="faction-card" @click="$emit('click', faction)">
    <div class="faction-card__header">
      <img 
        v-if="isImage(faction.icon)" 
        :src="faction.icon" 
        :alt="faction.name"
        class="faction-card__icon faction-card__icon--image"
      />
      <span v-else class="faction-card__icon faction-card__icon--text">{{ faction.icon || '◇' }}</span>
      <div class="faction-card__title-group">
        <h3 class="faction-card__name">{{ faction.name }}</h3>
        <span class="faction-card__id">{{ faction.id }}</span>
      </div>
    </div>

    <div class="faction-card__body">
      <p class="faction-card__description">{{ faction.description }}</p>

      <div class="faction-card__info">
        <div class="faction-card__info-item" v-if="faction.leader">
          <span class="faction-card__info-label">领袖</span>
          <span class="faction-card__info-value">{{ faction.leader }}</span>
        </div>
        <div class="faction-card__info-item" v-if="faction.location">
          <span class="faction-card__info-label">位置</span>
          <span class="faction-card__info-value">{{ faction.location }}</span>
        </div>
      </div>

      <div class="faction-card__members" v-if="faction.key_members?.length">
        <span class="faction-card__members-label">核心成员</span>
        <div class="faction-card__members-list">
          <BaseTag v-for="member in faction.key_members.slice(0, 3)" :key="member" variant="character" size="small">
            {{ member }}
          </BaseTag>
          <BaseTag v-if="faction.key_members.length > 3" variant="default" size="small">
            +{{ faction.key_members.length - 3 }}
          </BaseTag>
        </div>
      </div>
    </div>

    <div class="faction-card__footer">
      <div class="faction-card__relations" v-if="faction.related_factions?.length">
        <span class="faction-card__relations-label">相关势力</span>
        <div class="faction-card__relations-list">
          <BaseTag v-for="rel in faction.related_factions.slice(0, 2)" :key="rel" variant="faction" size="small">
            {{ rel }}
          </BaseTag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseTag from '@/components/ui/BaseTag.vue'

defineProps({
  faction: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const isImage = (icon) => {
  return icon && (icon.endsWith('.png') || icon.endsWith('.svg') || icon.endsWith('.webp'))
}
</script>

<style scoped>
.faction-card {
  display: flex;
  flex-direction: column;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-accent-dark-red);
  transition: var(--transition-normal);
  cursor: pointer;
  height: 100%;
}

.faction-card:hover {
  border-color: var(--color-accent-red);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-5px);
}

.faction-card__header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.faction-card__icon {
  flex-shrink: 0;
}

.faction-card__icon--image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(139, 0, 0, 0.5));
}

.faction-card__icon--text {
  font-size: 32px;
  color: var(--color-accent-red);
}

.faction-card__title-group {
  flex: 1;
}

.faction-card__name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-white);
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.faction-card__id {
  font-size: 12px;
  color: var(--color-light-gray);
  font-family: var(--font-mono);
}

.faction-card__body {
  padding: 20px;
  flex: 1;
}

.faction-card__description {
  font-size: 14px;
  color: var(--color-light-gray);
  line-height: 1.7;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.faction-card__info {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.faction-card__info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.faction-card__info-label {
  font-size: 10px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.faction-card__info-value {
  font-size: 14px;
  color: var(--color-primary-white);
  font-weight: 500;
}

.faction-card__members {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faction-card__members-label {
  font-size: 10px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.faction-card__members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.faction-card__footer {
  padding: 15px 20px;
  border-top: 1px solid var(--color-mid-gray);
}

.faction-card__relations {
  display: flex;
  align-items: center;
  gap: 10px;
}

.faction-card__relations-label {
  font-size: 11px;
  color: var(--color-light-gray);
}

.faction-card__relations-list {
  display: flex;
  gap: 6px;
}
</style>
