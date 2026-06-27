<template>
  <section class="timeline-preview section" ref="sectionRef">
    <div class="container">
      <div class="section__header">
        <BaseSectionTitle :visible="titleVisible">历史年表</BaseSectionTitle>
        <BaseButton variant="ghost" @click="$router.push('/timeline')" :class="{ 'btn--visible': titleVisible }">
          查看全部 →
        </BaseButton>
      </div>
      <div :class="{ 'timeline-container--visible': contentVisible }">
        <Timeline @select="$emit('selectEvent', $event)" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSectionTitle from '@/components/ui/BaseSectionTitle.vue'
import Timeline from '@/components/data-display/Timeline.vue'

const props = defineProps({
  canStartAnimation: { type: Boolean, default: true }
})

defineEmits(['selectEvent'])

const sectionRef = ref(null)
const titleVisible = ref(false)
const contentVisible = ref(false)
let observer = null

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
}

onMounted(() => {
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
.section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section__header button {
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.5s ease-out;
}

.section__header .btn--visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline-preview {
  margin: 0 -20px;
  padding: 0 20px;
}

.timeline-preview>.container>div:nth-child(2) {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.timeline-preview>.container>div:nth-child(2).timeline-container--visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
