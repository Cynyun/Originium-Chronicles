<template>
  <div class="character-grid">
    <div v-for="faction in groupedFactions" :key="faction.id" class="character-grid__group">
      <div class="character-grid__group-header">
        <div class="character-grid__faction-icon" :style="{ background: addAlpha(faction.color, 0.2) }">
          <img v-if="isImage(faction.icon)" :src="faction.icon" :alt="faction.name"
            class="character-grid__faction-icon-img" @error="handleIconError" />
          <span v-else>{{ faction.icon || '◇' }}</span>
        </div>
        <div class="character-grid__group-info">
          <h3 class="character-grid__group-name">{{ faction.name }}</h3>
          <span class="character-grid__group-count">{{ faction.characters.length }} 人</span>
        </div>
        <button v-if="faction.characters.length > maxDisplay" class="character-grid__toggle-btn"
          @click="toggleFaction(faction.id)">
          {{ expandedFactions.includes(faction.id) ? '收起' : `显示全部 (${faction.characters.length})` }}
        </button>
      </div>

      <div class="character-grid__avatars">
        <template v-if="isOperativesOnly">
          <OperatorAvatar v-for="(char, index) in getDisplayCharacters(faction)" :key="char.id" :character="char"
            :operative="getOperativeForCharacter(char.id)" :style="{ animationDelay: `${index * 80}ms` }"
            @click="handleCharacterClick" />
        </template>
        <template v-else>
          <CharacterAvatar v-for="(char, index) in getDisplayCharacters(faction)" :key="char.id" :character="char"
            :style="{ animationDelay: `${index * 80}ms` }" @click="handleCharacterClick" />
        </template>
      </div>

      <div v-if="faction.characters.length > maxDisplay && !expandedFactions.includes(faction.id)"
        class="character-grid__more-hint">
        <span>{{ faction.characters.length - maxDisplay }} 人未展示</span>
      </div>
    </div>

    <div v-if="orphanCharacters.length > 0" class="character-grid__group">
      <div class="character-grid__group-header">
        <div class="character-grid__faction-icon" style="background: var(--color-mid-gray)">
          ?
        </div>
        <div class="character-grid__group-info">
          <h3 class="character-grid__group-name">其他角色</h3>
          <span class="character-grid__group-count">{{ orphanCharacters.length }} 人</span>
        </div>
      </div>

      <div class="character-grid__avatars">
        <template v-if="isOperativesOnly">
          <OperatorAvatar v-for="(char, index) in orphanCharacters" :key="char.id" :character="char"
            :operative="getOperativeForCharacter(char.id)" :style="{ animationDelay: `${index * 80}ms` }"
            @click="handleCharacterClick" />
        </template>
        <template v-else>
          <CharacterAvatar v-for="(char, index) in orphanCharacters" :key="char.id" :character="char"
            :style="{ animationDelay: `${index * 80}ms` }" @click="handleCharacterClick" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CharacterAvatar from '@/components/cards/CharacterAvatar.vue'
import OperatorAvatar from '@/components/avatars/OperatorAvatar.vue'

const router = useRouter()

const props = defineProps({
  characters: {
    type: Array,
    required: true
  },
  factions: {
    type: Array,
    default: () => []
  },
  operatives: {
    type: Array,
    default: () => []
  },
  maxDisplay: {
    type: Number,
    default: 12
  },
  isOperativesOnly: {
    type: Boolean,
    default: false
  }
})

const expandedFactions = ref([])

const groupedFactions = computed(() => {
  const groups = []

  props.factions.forEach(faction => {
    const factionChars = props.characters.filter(c => c.faction === faction.id)
    if (factionChars.length > 0) {
      groups.push({
        ...faction,
        characters: factionChars
      })
    }
  })

  return groups.sort((a, b) => b.characters.length - a.characters.length)
})

const orphanCharacters = computed(() => {
  const factionIds = new Set(props.factions.map(f => f.id))
  return props.characters.filter(c => !factionIds.has(c.faction))
})

const getDisplayCharacters = (faction) => {
  if (expandedFactions.value.includes(faction.id)) {
    return faction.characters
  }
  return faction.characters.slice(0, props.maxDisplay)
}

const toggleFaction = (factionId) => {
  const index = expandedFactions.value.indexOf(factionId)
  if (index > -1) {
    expandedFactions.value.splice(index, 1)
  } else {
    expandedFactions.value.push(factionId)
  }
}

const handleCharacterClick = (character) => {
  router.push(`/characters/${character.id}`)
}

const getOperativeForCharacter = (charId) => {
  return props.operatives.find(o => o.id === charId)
}

const addAlpha = (color, alpha) => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}

const isImage = (path) => {
  return path && (path.endsWith('.png') || path.endsWith('.svg') || path.endsWith('.webp') || path.endsWith('.jpg'))
}

const handleIconError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.character-grid {
  display: flex;
  flex-direction: column;
  gap: 35px;
}

.character-grid__group {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 25px;
}

.character-grid__group-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.character-grid__faction-icon {
  width: 48px;
  height: 48px;
  /* border-radius: 8px; */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  font-weight: 700;
}

.character-grid__faction-icon-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.character-grid__group-info {
  flex: 1;
}

.character-grid__group-name {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--color-primary-white);
  letter-spacing: 1px;
  margin-bottom: 3px;
}

.character-grid__group-count {
  font-size: 13px;
  color: var(--color-light-gray);
}

.character-grid__toggle-btn {
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-tech-blue);
  background: transparent;
  border: 1px solid var(--color-tech-blue-dim);
  cursor: pointer;
  transition: var(--transition-fast);
}

.character-grid__toggle-btn:hover {
  border-color: var(--color-tech-blue);
  background: rgba(0, 191, 255, 0.1);
}

.character-grid__avatars {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 20px;
}

.character-grid__more-hint {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-mid-gray);
}

.character-grid__more-hint span {
  font-size: 12px;
  color: var(--color-light-gray);
}
</style>