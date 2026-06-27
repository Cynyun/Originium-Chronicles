<template>
  <div class="animation-test-page">
    <div class="animation-test-page__header">
      <div class="container">
        <h1 class="page-title">动画效果展示</h1>
        <p class="page-subtitle">展示所有可用的动画组件</p>
      </div>
    </div>

    <div class="container">
      <div class="animation-test-page__sections">
        <div class="animation-section">
          <h2 class="animation-section__title">线条流动动画</h2>
          <p class="animation-section__description">FlowLines - 红色系线条从左向右流动，营造科技感</p>
          <div class="animation-section__demo">
            <FlowLines />
          </div>
        </div>

        <div class="animation-section">
          <h2 class="animation-section__title">几何图形动画</h2>
          <p class="animation-section__description">GeometricPattern - 菱形、三角形等几何图形随机分布，缓慢旋转浮动</p>
          <div class="animation-section__demo">
            <GeometricPattern />
          </div>
        </div>

        <div class="animation-section">
          <h2 class="animation-section__title">3D网格动画</h2>
          <p class="animation-section__description">GridAnimation - 动态网格线条，带3D透视效果和节点脉冲</p>
          <div class="animation-section__demo">
            <GridAnimation />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FlowLines from '@/components/animations/FlowLines.vue'
import GeometricPattern from '@/components/animations/GeometricPattern.vue'
import GridAnimation from '@/components/animations/GridAnimation.vue'
</script>

<style scoped>
.animation-test-page__header {
  padding: 60px 0 40px;
  background: linear-gradient(180deg, rgba(139,0,0,0.1) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-mid-gray);
}

.animation-test-page__sections {
  padding: 40px 0;
}

.animation-section {
  margin-bottom: 60px;
}

.animation-section:last-child {
  margin-bottom: 0;
}

.animation-section__title {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-primary-white);
  margin-bottom: 10px;
}

.animation-section__description {
  font-size: 14px;
  color: var(--color-light-gray);
  margin-bottom: 20px;
}

.animation-section__demo {
  height: 250px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animation-section__demo > * {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
