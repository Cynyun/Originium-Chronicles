<template>
  <section class="changelog section" ref="sectionRef">
    <div class="container">
      <BaseSectionTitle :visible="titleVisible">更新日志</BaseSectionTitle>
      <div class="changelog__list" :class="{ 'changelog__list--visible': contentVisible }">
        <div v-for="(version, index) in versions" :key="version.version" class="changelog__item"
          :class="{ 'item--visible': itemVisible[index] }">
          <span class="changelog__date">{{ formatDate(version.date) }}</span>
          <BaseTag variant="faction" size="small">{{ version.version }}</BaseTag>
          <p class="changelog__text">{{ version.title }}</p>
          <ul class="changelog__changes">
            <li v-for="(change, changeIndex) in version.changes.slice(0, 3)" :key="changeIndex">
              {{ change }}
            </li>
            <li v-if="version.changes.length > 3" class="changelog__more">
              +{{ version.changes.length - 3 }} 项更多更新
            </li>
          </ul>
        </div>
      </div>
      <div class="changelog__footer" :class="{ 'changelog__footer--visible': contentVisible }">
        <BaseButton variant="ghost" size="small" @click="$router.push('/changelog')">
          查看全部更新 →
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSectionTitle from '@/components/ui/BaseSectionTitle.vue'

const props = defineProps({
  canStartAnimation: { type: Boolean, default: true }
})

const sectionRef = ref(null)
const titleVisible = ref(false)
const contentVisible = ref(false)
const itemVisible = ref({})
const versions = ref([])
let observer = null

const loadData = async () => {
  try {
    const response = await fetch('/data/changelog.json')
    const data = await response.json()
    versions.value = data.versions.slice(0, 3)
  } catch (error) {
    console.error('Failed to load changelog data:', error)
    versions.value = []
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        titleVisible.value = true
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  })

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
}

const showContent = () => {
  contentVisible.value = true
  versions.value.forEach((_, index) => {
    setTimeout(() => {
      itemVisible.value[index] = true
    }, 150 * index)
  })
}

onMounted(async () => {
  await loadData()
  if (props.canStartAnimation) {
    setupObserver()
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

watch(() => props.canStartAnimation, (newVal) => {
  if (newVal) {
    setupObserver()
  }
})

watch(titleVisible, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      showContent()
    }, 400)
  }
})
</script>

<style scoped>
.changelog__list {
  margin-top: 20px;
  max-width: 600px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.changelog__list--visible {
  opacity: 1;
  transform: translateY(0);
}

.changelog__item {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  margin-top: 15px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

.changelog__item:first-child {
  margin-top: 0;
}

.changelog__item.item--visible {
  opacity: 1;
  transform: translateY(0);
}

.changelog__date {
  font-size: 12px;
  color: var(--color-light-gray);
  font-family: var(--font-mono);
}

.changelog__text {
  width: 100%;
  font-size: 15px;
  color: var(--color-primary-white);
  margin: 10px 0 15px;
  font-weight: 500;
}

.changelog__changes {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.changelog__changes li {
  font-size: 13px;
  color: var(--color-light-gray);
  padding-left: 18px;
  position: relative;
}

.changelog__changes li::before {
  content: "+";
  position: absolute;
  left: 0;
  color: var(--color-accent-red);
  font-weight: 600;
}

.changelog__more {
  opacity: 0.7;
  font-style: italic;
}

.changelog__footer {
  margin-top: 25px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease-out;
  transition-delay: 0.5s;
}

.changelog__footer--visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
