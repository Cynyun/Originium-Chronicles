<template>
  <div class="info-display">
    <div class="info-display__header">
      <h2 class="info-display__title">{{ title }}</h2>
      <p class="info-display__subtitle">{{ subtitle }}</p>
    </div>

    <div class="info-display__content" v-if="type === 'faction'">
      <div class="info-display__grid">
        <div v-for="item in items" :key="item.id" class="info-card faction-info-card" @click="$emit('itemClick', item)">
          <div class="info-card__header">
            <div class="info-card__icon-wrapper">
              <img v-if="item.icon && item.icon.includes('.')" :src="item.icon" :alt="item.name"
                class="info-card__icon-image" />
              <span v-else class="info-card__icon-text">{{ item.icon || '◇' }}</span>
            </div>
            <div class="info-card__title-group">
              <h3 class="info-card__title">{{ item.name }}</h3>
              <span class="info-card__leader">领袖: {{ item.leader }}</span>
            </div>
          </div>

          <p class="info-card__description">{{ item.description }}</p>

          <div class="info-card__details">
            <div class="info-card__detail-item">
              <span class="info-card__detail-label">成立时间</span>
              <span class="info-card__detail-value">{{ item.founded }}</span>
            </div>
            <div class="info-card__detail-item">
              <span class="info-card__detail-label">位置</span>
              <span class="info-card__detail-value">{{ item.location }}</span>
            </div>
          </div>

          <div class="info-card__relations" v-if="item.related_factions?.length">
            <span class="info-card__relations-label">关联势力:</span>
            <div class="info-card__relations-list">
              <span v-for="relId in item.related_factions" :key="relId" class="info-card__relation-tag">
                {{ getFactionName(relId) }}
              </span>
            </div>
          </div>

          <div class="info-card__members" v-if="item.key_members?.length">
            <span class="info-card__members-label">核心成员:</span>
            <div class="info-card__members-list">
              <span v-for="member in item.key_members.slice(0, 4)" :key="member" class="info-card__member-tag">
                {{ member }}
              </span>
              <span v-if="item.key_members.length > 4" class="info-card__member-more">
                +{{ item.key_members.length - 4 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-display__content" v-else-if="type === 'character'">
      <div class="info-display__faction-section" v-if="factions.length">
        <h3 class="info-display__faction-title">按派系浏览</h3>
        <div class="info-display__faction-tabs">
          <button v-for="faction in factions" :key="faction.id" class="info-display__faction-tab"
            :class="{ 'is-active': selectedFaction === faction.id }"
            @click="selectedFaction = selectedFaction === faction.id ? '' : faction.id">
            <span v-if="faction.icon && faction.icon.includes('.')">
              <img :src="faction.icon" :alt="faction.name" class="info-display__faction-tab-icon" />
            </span>
            <span v-else>{{ faction.icon }}</span>
            {{ faction.name }}
          </button>
        </div>
      </div>

      <div class="info-display__divider">
        <div class="info-display__divider-line"></div>
        <div class="info-display__count">
          <span class="info-display__count-label">共收录</span>
          <span class="info-display__count-number">{{ filteredCharacters.length }}</span>
          <span class="info-display__count-label">位角色</span>
        </div>
        <div class="info-display__divider-line"></div>
      </div>

      <div class="info-display__grid characters-grid">
        <div v-for="item in filteredCharacters" :key="item.id" class="info-card character-info-card"
          @click="$emit('itemClick', item)">
          <div class="character-info-card__portrait-wrapper">
            <img :src="item.portrait" :alt="item.name" class="character-info-card__portrait" />
            <div class="character-info-card__status-bar">
              <div class="character-info-card__faction-badge" :style="{ background: getFactionColor(item.faction) }">
                {{ getFactionName(item.faction) }}
              </div>
            </div>
          </div>

          <div class="character-info-card__content">
            <div class="character-info-card__header">
              <h3 class="character-info-card__name">{{ item.name }}</h3>
              <div class="character-info-card__meta">
                <span class="character-info-card__race">{{ item.race }}</span>
                <span class="character-info-card__position">{{ item.position }}</span>
              </div>
            </div>

            <p class="character-info-card__description">{{ item.description }}</p>

            <div class="character-info-card__relationships" v-if="item.relationships?.length">
              <span class="character-info-card__relationships-label">关联人物</span>
              <div class="character-info-card__relationships-list">
                <div v-for="rel in item.relationships.slice(0, 3)" :key="rel.target"
                  class="character-info-card__relationship-item">
                  <span class="character-info-card__relationship-badge" :class="`relationship-${rel.type}`">
                    <span class="character-info-card__relationship-dot"></span>
                    {{ getCharacterName(rel.target) }}
                  </span>
                </div>
                <span v-if="item.relationships.length > 3" class="character-info-card__relationship-more">
                  +{{ item.relationships.length - 3 }}
                </span>
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

const props = defineProps({
  title: {
    type: String,
    default: '信息展示'
  },
  subtitle: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    default: 'faction',
    validator: (value) => ['faction', 'character'].includes(value)
  },
  factions: {
    type: Array,
    default: () => []
  },
  characters: {
    type: Array,
    default: () => []
  }
})

defineEmits(['itemClick'])

const selectedFaction = ref('')

const filteredCharacters = computed(() => {
  if (!selectedFaction.value) return props.items
  return props.items.filter(item => item.faction === selectedFaction.value)
})

const factionColors = {
  'rhodes': 'linear-gradient(135deg, #A52A2A, #8B0000)',
  'reunion': 'linear-gradient(135deg, #444444, #222222)',
  'lungmen': 'linear-gradient(135deg, #00BFFF, #007ACC)',
  'penguin': 'linear-gradient(135deg, #FFD700, #FFA500)',
  'babel': 'linear-gradient(135deg, #9400D3, #4B0082)',
  'kjerag': 'linear-gradient(135deg, #87CEEB, #5F9EA0)',
  'kazdel': 'linear-gradient(135deg, #800080, #4B0082)'
}

const getFactionName = (factionId) => {
  if (!factionId) return '未知'
  const faction = props.factions.find(f => f.id === factionId)
  return faction?.name || factionId
}

const getFactionColor = (factionId) => {
  return factionColors[factionId] || 'linear-gradient(135deg, #666666, #444444)'
}

const getCharacterName = (characterId) => {
  if (!characterId) return '未知'
  const character = props.characters.find(c => c.id === characterId)
  return character?.name || characterId
}
</script>

<style scoped>
.info-display {
  width: 100%;
}

.info-display__header {
  margin-bottom: 30px;
}

.info-display__title {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-primary-white);
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.info-display__subtitle {
  font-size: 14px;
  color: var(--color-light-gray);
}

.info-display__content {
  width: 100%;
}

.info-display__grid {
  display: grid;
  gap: 20px;
}

.faction-info-card {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 24px;
  cursor: pointer;
  transition: var(--transition-normal);
}

.faction-info-card:hover {
  border-color: var(--color-accent-red);
  box-shadow: var(--shadow-card-hover);
}

.info-card__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.info-card__icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid var(--color-accent-dark-red);
}

.info-card__icon-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.info-card__icon-text {
  font-size: 32px;
  color: var(--color-accent-red);
}

.info-card__title-group {
  flex: 1;
}

.info-card__title {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--color-primary-white);
  margin-bottom: 4px;
}

.info-card__leader {
  font-size: 13px;
  color: var(--color-tech-blue);
}

.info-card__description {
  font-size: 14px;
  color: var(--color-light-gray);
  line-height: 1.7;
  margin-bottom: 16px;
}

.info-card__details {
  display: flex;
  gap: 30px;
  margin-bottom: 16px;
}

.info-card__detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-card__detail-label {
  font-size: 11px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-card__detail-value {
  font-size: 14px;
  color: var(--color-primary-white);
}

.info-card__relations,
.info-card__members {
  margin-bottom: 12px;
}

.info-card__relations-label,
.info-card__members-label {
  font-size: 12px;
  color: var(--color-light-gray);
  display: block;
  margin-bottom: 8px;
}

.info-card__relations-list,
.info-card__members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-card__relation-tag {
  padding: 4px 12px;
  background: rgba(0, 191, 255, 0.15);
  border: 1px solid var(--color-tech-blue);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-tech-blue);
}

.info-card__member-tag {
  padding: 4px 12px;
  background: rgba(165, 42, 42, 0.15);
  border: 1px solid var(--color-accent-red);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-accent-red);
}

.info-card__member-more {
  padding: 4px 12px;
  background: var(--color-mid-gray);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-light-gray);
}

.info-display__faction-section {
  margin-bottom: 30px;
}

.info-display__faction-title {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--color-light-gray);
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.info-display__faction-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.info-display__faction-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  border-radius: 20px;
  color: var(--color-light-gray);
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition-normal);
}

.info-display__faction-tab:hover {
  border-color: var(--color-accent-red);
  color: var(--color-primary-white);
}

.info-display__faction-tab.is-active {
  background: var(--color-accent-red);
  border-color: var(--color-accent-red);
  color: #ffffff;
}

.info-display__faction-tab-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.info-display__divider {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.info-display__divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-mid-gray), transparent);
}

.info-display__count {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.info-display__count-label {
  font-size: 12px;
  color: var(--color-light-gray);
}

.info-display__count-number {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-accent-red);
}

.characters-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.character-info-card {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-normal);
  overflow: hidden;
}

.character-info-card:hover {
  border-color: var(--color-accent-red);
  box-shadow: var(--shadow-card-hover);
}

.character-info-card__portrait-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.character-info-card__portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-info-card__status-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 15px 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
}

.character-info-card__faction-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  color: #ffffff;
  font-weight: 500;
}

.character-info-card__content {
  padding: 20px;
}

.character-info-card__header {
  margin-bottom: 12px;
}

.character-info-card__name {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--color-primary-white);
  margin-bottom: 8px;
}

.character-info-card__meta {
  display: flex;
  gap: 10px;
}

.character-info-card__race {
  font-size: 12px;
  color: var(--color-tech-blue);
  padding: 3px 10px;
  background: rgba(0, 191, 255, 0.15);
  border: 1px solid var(--color-tech-blue);
  border-radius: 4px;
}

.character-info-card__position {
  font-size: 12px;
  color: var(--color-accent-red);
  padding: 3px 10px;
  background: rgba(165, 42, 42, 0.15);
  border: 1px solid var(--color-accent-red);
  border-radius: 4px;
}

.character-info-card__description {
  font-size: 13px;
  color: var(--color-light-gray);
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.character-info-card__relationships {
  padding-top: 15px;
  border-top: 1px solid var(--color-mid-gray);
}

.character-info-card__relationships-label {
  font-size: 11px;
  color: var(--color-light-gray);
  display: block;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.character-info-card__relationships-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.character-info-card__relationship-item {
  display: flex;
}

.character-info-card__relationship-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: rgba(136, 136, 136, 0.15);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-light-gray);
}

.character-info-card__relationship-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-light-gray);
}

.character-info-card__relationship-more {
  padding: 5px 10px;
  background: var(--color-mid-gray);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-light-gray);
}

.character-info-card__relationship-badge.relationship-敌对 {
  background: rgba(165, 42, 42, 0.15);
  color: #A52A2A;
}

.character-info-card__relationship-badge.relationship-敌对 .character-info-card__relationship-dot {
  background: #A52A2A;
}

.character-info-card__relationship-badge.relationship-合作,
.character-info-card__relationship-badge.relationship-信任,
.character-info-card__relationship-badge.relationship-友好,
.character-info-card__relationship-badge.relationship-搭档 {
  background: rgba(0, 191, 255, 0.15);
  color: #00BFFF;
}

.character-info-card__relationship-badge.relationship-合作 .character-info-card__relationship-dot,
.character-info-card__relationship-badge.relationship-信任 .character-info-card__relationship-dot,
.character-info-card__relationship-badge.relationship-友好 .character-info-card__relationship-dot,
.character-info-card__relationship-badge.relationship-搭档 .character-info-card__relationship-dot {
  background: #00BFFF;
}

.character-info-card__relationship-badge.relationship-复杂,
.character-info-card__relationship-badge.relationship-中立 {
  background: rgba(136, 136, 136, 0.15);
  color: #888888;
}

.character-info-card__relationship-badge.relationship-依赖,
.character-info-card__relationship-badge.relationship-守护,
.character-info-card__relationship-badge.relationship-忠诚,
.character-info-card__relationship-badge.relationship-亲情 {
  background: rgba(0, 255, 128, 0.15);
  color: #00FF80;
}

.character-info-card__relationship-badge.relationship-依赖 .character-info-card__relationship-dot,
.character-info-card__relationship-badge.relationship-守护 .character-info-card__relationship-dot,
.character-info-card__relationship-badge.relationship-忠诚 .character-info-card__relationship-dot,
.character-info-card__relationship-badge.relationship-亲情 .character-info-card__relationship-dot {
  background: #00FF80;
}

@media (max-width: 768px) {
  .info-display__grid {
    grid-template-columns: 1fr;
  }

  .info-card__details {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
