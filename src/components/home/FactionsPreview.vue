<template>
    <section class="factions-preview section" ref="sectionRef">
        <div class="container">
            <div class="section__header">
                <BaseSectionTitle :visible="titleVisible">主要派系</BaseSectionTitle>
                <BaseButton variant="ghost" @click="$router.push('/factions')" :class="{ 'btn--visible': titleVisible }">
                    查看全部 →
                </BaseButton>
            </div>
            <div class="factions-preview__scroll" v-if="factions.length" :class="{ 'factions-preview__scroll--visible': contentVisible }">
                <div class="factions-preview__track">
                    <FactionCard v-for="faction in factions" :key="faction.id" :faction="faction"
                        @click="$emit('selectFaction', faction)" :class="{ 'card--visible': cardVisible[faction.id] }" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSectionTitle from '@/components/ui/BaseSectionTitle.vue'
import FactionCard from '@/components/data-display/FactionCard.vue'

const props = defineProps({
  factions: { type: Array, default: () => [] },
  canStartAnimation: { type: Boolean, default: true }
})

defineEmits(['selectFaction'])

const router = useRouter()

const sectionRef = ref(null)
const titleVisible = ref(false)
const contentVisible = ref(false)
const cardVisible = ref({})
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
  props.factions.forEach((faction, index) => {
    setTimeout(() => {
      cardVisible.value[faction.id] = true
    }, index * 150)
  })
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

.factions-preview__scroll {
    overflow-x: auto;
    margin: 0 -20px;
    padding: 0 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent-dark-red) rgba(0, 0, 0, 0.3);
    min-height: 200px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
}

.factions-preview__scroll--visible {
    opacity: 1;
    transform: translateY(0);
}

.factions-preview__scroll::-webkit-scrollbar {
    height: 6px;
}

.factions-preview__scroll::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
}

.factions-preview__scroll::-webkit-scrollbar-thumb {
    background: var(--color-accent-dark-red);
    border-radius: 3px;
}

.factions-preview__track {
    display: flex;
    gap: 20px;
    padding-bottom: 10px;
}

.factions-preview__track>* {
    flex: 0 0 300px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease-out;
}

.factions-preview__track .card--visible {
    opacity: 1;
    transform: translateY(0);
}
</style>
