<template>
  <div class="faction-stats-card">
    <div class="faction-stats-card__header">
      <h3 class="faction-stats-card__title">派系数据统计</h3>
      <p class="faction-stats-card__subtitle">综合实力评估</p>
    </div>

    <div class="faction-stats-card__stats">
      <div class="faction-stats-card__stat-item">
        <div class="faction-stats-card__stat-icon">👥</div>
        <div class="faction-stats-card__stat-info">
          <span class="faction-stats-card__stat-value">{{ memberCount }}</span>
          <span class="faction-stats-card__stat-label">核心成员</span>
        </div>
      </div>

      <div class="faction-stats-card__stat-item">
        <div class="faction-stats-card__stat-icon">🔗</div>
        <div class="faction-stats-card__stat-info">
          <span class="faction-stats-card__stat-value">{{ relationCount }}</span>
          <span class="faction-stats-card__stat-label">关联势力</span>
        </div>
      </div>
    </div>

    <div class="faction-stats-card__power-section">
      <div class="faction-stats-card__power-header">
        <span class="faction-stats-card__power-label">势力等级</span>
        <span class="faction-stats-card__power-value">{{ powerLevel }}</span>
      </div>
      <div class="faction-stats-card__power-bar">
        <div class="faction-stats-card__power-fill" :style="{ width: `${powerPercent}%`, background: powerGradient }">
        </div>
      </div>
    </div>

    <div class="faction-stats-card__traits">
      <div class="faction-stats-card__traits-header">
        <span>特色标签</span>
      </div>
      <div class="faction-stats-card__traits-list">
        <span v-for="trait in traits" :key="trait" class="faction-stats-card__trait"
          :style="{ borderColor: faction.color, color: faction.color }">
          {{ trait }}
        </span>
      </div>
    </div>

    <div class="faction-stats-card__activity">
      <div class="faction-stats-card__activity-header">
        <span>近期活跃度</span>
        <span class="faction-stats-card__activity-status" :class="activityClass">{{ activityStatus }}</span>
      </div>
      <div class="faction-stats-card__activity-chart">
        <div v-for="(val, index) in activityData" :key="index" class="faction-stats-card__activity-bar" :style="{
          height: `${val}%`,
          background: faction.color,
          animationDelay: `${index * 100}ms`
        }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  faction: {
    type: Object,
    required: true
  }
})

const memberCount = computed(() => props.faction.key_members?.length || 0)
const relationCount = computed(() => props.faction.related_factions?.length || 0)

const powerLevel = computed(() => {
  const count = memberCount.value + relationCount.value * 2
  if (count >= 12) return 'S'
  if (count >= 9) return 'A'
  if (count >= 6) return 'B'
  if (count >= 3) return 'C'
  return 'D'
})

const powerPercent = computed(() => {
  const levels = { 'S': 100, 'A': 80, 'B': 60, 'C': 40, 'D': 20 }
  return levels[powerLevel.value]
})

const powerGradient = computed(() => {
  return `linear-gradient(90deg, ${props.faction.color}, ${props.faction.color}80)`
})

const traits = computed(() => {
  const memberCount = props.faction.key_members?.length || 0
  const traits = []

  if (memberCount >= 5) traits.push('精英云集')
  if (props.faction.related_factions?.length >= 2) traits.push('人脉广阔')
  if (props.faction.founded === '巴别塔事件后') traits.push('新兴势力')
  if (props.faction.founded === '远古时代') traits.push('历史悠久')
  if (props.faction.location === '移动城市') traits.push('机动灵活')
  if (props.faction.location === '龙门') traits.push('商业中心')

  return traits.length ? traits : ['神秘组织']
})

const activityData = computed(() => {
  return [40, 65, 45, 80, 55, 70, 90].map(v => v + Math.random() * 20)
})

const activityStatus = computed(() => {
  const avg = activityData.value.reduce((a, b) => a + b, 0) / activityData.value.length
  if (avg >= 75) return '活跃'
  if (avg >= 50) return '正常'
  return '低迷'
})

const activityClass = computed(() => {
  const status = activityStatus.value
  if (status === '活跃') return 'status-active'
  if (status === '正常') return 'status-normal'
  return 'status-low'
})
</script>

<style scoped>
.faction-stats-card {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 24px;
}

.faction-stats-card__header {
  margin-bottom: 20px;
}

.faction-stats-card__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-white);
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.faction-stats-card__subtitle {
  font-size: 13px;
  color: var(--color-light-gray);
}

.faction-stats-card__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.faction-stats-card__stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: var(--color-primary-black);
  border-radius: 8px;
}

.faction-stats-card__stat-icon {
  font-size: 24px;
}

.faction-stats-card__stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.faction-stats-card__stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-white);
}

.faction-stats-card__stat-label {
  font-size: 11px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.faction-stats-card__power-section {
  margin-bottom: 20px;
}

.faction-stats-card__power-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.faction-stats-card__power-label {
  font-size: 12px;
  color: var(--color-light-gray);
}

.faction-stats-card__power-value {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-accent-red);
}

.faction-stats-card__power-bar {
  height: 8px;
  background: var(--color-primary-black);
  border-radius: 4px;
  overflow: hidden;
}

.faction-stats-card__power-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-out;
}

.faction-stats-card__traits {
  margin-bottom: 20px;
}

.faction-stats-card__traits-header {
  font-size: 12px;
  color: var(--color-light-gray);
  margin-bottom: 10px;
}

.faction-stats-card__traits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.faction-stats-card__trait {
  padding: 6px 12px;
  border: 1px solid;
  border-radius: 20px;
  font-size: 12px;
}

.faction-stats-card__activity {
  padding-top: 15px;
  border-top: 1px solid var(--color-mid-gray);
}

.faction-stats-card__activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 12px;
  color: var(--color-light-gray);
}

.faction-stats-card__activity-status {
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
}

.faction-stats-card__activity-status.status-active {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.2);
}

.faction-stats-card__activity-status.status-normal {
  color: #FF9800;
  background: rgba(255, 152, 0, 0.2);
}

.faction-stats-card__activity-status.status-low {
  color: #f44336;
  background: rgba(244, 67, 54, 0.2);
}

.faction-stats-card__activity-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 60px;
  gap: 6px;
}

.faction-stats-card__activity-bar {
  flex: 1;
  min-width: 20px;
  border-radius: 4px;
  opacity: 0;
  animation: growBar 0.5s ease-out forwards;
}

@keyframes growBar {
  from {
    opacity: 0;
    height: 0;
  }

  to {
    opacity: 0.7;
  }
}
</style>