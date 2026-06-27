<template>
    <section class="intro section" ref="sectionRef">
        <div class="container">
            <BaseSectionTitle :visible="titleVisible">关于泰拉世界</BaseSectionTitle>
            <p class="intro__text" :class="{ 'intro__text--visible': textVisible }">
                <span v-for="(char, index) in textChars" :key="index"
                    :class="{ 'intro__char--visible': charVisible[index] }">{{ char }}</span>
            </p>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import BaseSectionTitle from '@/components/ui/BaseSectionTitle.vue'

const props = defineProps({
  canStartAnimation: { type: Boolean, default: true }
})

const fullText = '在这片名为泰拉的大陆上，源石驱动着文明的演进，也带来了致命的源石病。感染者们在夹缝中求生，各大势力明争暗斗，历史的车轮滚滚向前。这里记录着每一个值得关注的名字，每一段不应被遗忘的故事。'
const textChars = fullText.split('')
const charVisible = ref(new Array(textChars.length).fill(false))

const sectionRef = ref(null)
const titleVisible = ref(false)
const textVisible = ref(false)
let observer = null

const typeText = () => {
  textChars.forEach((_, index) => {
    setTimeout(() => {
      charVisible.value[index] = true
    }, index * 30)
  })
}

const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        titleVisible.value = true
        setTimeout(() => {
          textVisible.value = true
          typeText()
        }, 400)
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
</script>

<style scoped>
.intro__text {
    font-size: 16px;
    line-height: 2;
    color: var(--color-light-gray);
    max-width: 800px;
    margin-top: 30px;
    min-height: 120px;
}

.intro__text--visible .intro__char--visible {
    opacity: 1;
}

.intro__char--visible {
    opacity: 1;
}

.intro__text span {
    opacity: 0;
    transition: opacity 0.1s ease-out;
}
</style>