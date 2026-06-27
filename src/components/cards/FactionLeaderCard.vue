<template>
  <div class="faction-leader-card">
    <div class="faction-leader-card__bg" :style="{ background: `linear-gradient(135deg, ${faction.color}20 0%, transparent 100%)` }"></div>
    
    <div class="faction-leader-card__header">
      <div class="faction-leader-card__icon-wrapper">
        <img 
          v-if="isImage(faction.icon)" 
          :src="faction.icon" 
          :alt="faction.name"
          class="faction-leader-card__icon"
        />
        <span v-else class="faction-leader-card__icon-text">{{ faction.icon || '◇' }}</span>
      </div>
      <div class="faction-leader-card__title-group">
        <h3 class="faction-leader-card__name">{{ faction.name }}</h3>
        <span class="faction-leader-card__id">{{ faction.id }}</span>
      </div>
    </div>

    <div class="faction-leader-card__leader-section">
      <div class="faction-leader-card__leader-label">领袖</div>
      <div class="faction-leader-card__leader">
        <CharacterAvatar 
          v-if="leaderCharacter" 
          :character="leaderCharacter" 
          :size="'md'"
          @click="navigateToCharacter(leaderCharacter)"
        />
        <div v-else class="faction-leader-card__leader-avatar-wrapper" :style="{ borderColor: faction.color }">
          <span class="faction-leader-card__leader-avatar-text">{{ faction.leader?.charAt(0) || '?' }}</span>
        </div>
        <div class="faction-leader-card__leader-info">
          <span class="faction-leader-card__leader-name">{{ faction.leader || '未知' }}</span>
          <span class="faction-leader-card__leader-title">派系领袖</span>
        </div>
      </div>
    </div>

    <div class="faction-leader-card__members" v-if="faction.key_members?.length">
      <div class="faction-leader-card__members-label">核心成员 ({{ faction.key_members.length }})</div>
      <div class="faction-leader-card__members-grid">
        <CharacterAvatar 
          v-for="(member, index) in faction.key_members.slice(0, 6)" 
          :key="member"
          :character="getCharacterByName(member)" 
          :size="'sm'"
          :style="{ animationDelay: `${index * 100}ms` }"
          @click="handleMemberClick(member)"
        />
      </div>
    </div>

    <div class="faction-leader-card__footer">
      <div class="faction-leader-card__meta">
        <span class="faction-leader-card__meta-item">
          <span class="faction-leader-card__meta-icon">📍</span>
          {{ faction.location || '未知' }}
        </span>
        <span class="faction-leader-card__meta-item">
          <span class="faction-leader-card__meta-icon">📅</span>
          {{ faction.founded || '未知' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CharacterAvatar from './CharacterAvatar.vue'

const router = useRouter()

const props = defineProps({
  faction: {
    type: Object,
    required: true
  },
  characters: {
    type: Array,
    default: () => []
  }
})

const isImage = (icon) => {
  return icon && (icon.endsWith('.png') || icon.endsWith('.svg') || icon.endsWith('.webp') || icon.endsWith('.jpg'))
}

const leaderCharacter = computed(() => {
  if (!props.faction.leader) return null
  return props.characters.find(c => c.name === props.faction.leader)
})

const getCharacterByName = (name) => {
  return props.characters.find(c => c.name === name) || { name, avatar: null, faction: props.faction.id }
}

const navigateToCharacter = (character) => {
  if (character && character.id) {
    router.push(`/characters/${character.id}`)
  }
}

const handleMemberClick = (memberName) => {
  const character = getCharacterByName(memberName)
  navigateToCharacter(character)
}
</script>

<style scoped>
.faction-leader-card {
  position: relative;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  overflow: hidden;
  transition: var(--transition-normal);
  cursor: pointer;
}

.faction-leader-card:hover {
  border-color: var(--color-accent-red);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-5px);
}

.faction-leader-card__bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.faction-leader-card__header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.faction-leader-card__icon-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.faction-leader-card__icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.faction-leader-card__icon-text {
  font-size: 36px;
  color: var(--color-accent-red);
}

.faction-leader-card__title-group {
  flex: 1;
}

.faction-leader-card__name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary-white);
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.faction-leader-card__id {
  font-size: 12px;
  color: var(--color-light-gray);
  font-family: var(--font-mono);
}

.faction-leader-card__leader-section {
  position: relative;
  padding: 20px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.faction-leader-card__leader-label {
  font-size: 11px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.faction-leader-card__leader {
  display: flex;
  align-items: center;
  gap: 15px;
}

.faction-leader-card__leader-avatar-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary-black);
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.faction-leader-card__leader-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.faction-leader-card__leader-avatar-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-white);
}

.faction-leader-card__leader-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.faction-leader-card__leader-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-white);
}

.faction-leader-card__leader-title {
  font-size: 12px;
  color: var(--color-light-gray);
}

.faction-leader-card__members {
  position: relative;
  padding: 20px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.faction-leader-card__members-label {
  font-size: 11px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.faction-leader-card__members-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.faction-leader-card__member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faction-leader-card__member-avatar-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.faction-leader-card__member-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.faction-leader-card__member-avatar-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-light-gray);
}

.faction-leader-card__member-name {
  font-size: 12px;
  color: var(--color-primary-white);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.faction-leader-card__footer {
  position: relative;
  padding: 15px 20px;
}

.faction-leader-card__meta {
  display: flex;
  gap: 20px;
}

.faction-leader-card__meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-light-gray);
}

.faction-leader-card__meta-icon {
  font-size: 14px;
}
</style>