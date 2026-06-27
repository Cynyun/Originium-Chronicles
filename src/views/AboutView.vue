<template>
  <div class="about-page">
    <div class="about-page__header">
      <FlowLines />
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">项目说明</h1>
          <p class="page-subtitle">了解源石纪事的初衷与愿景</p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="about-page__content">
        <div class="about-section">
          <h2 class="section-title">关于源石纪事</h2>
          <p class="section-text">
            源石纪事是一个基于《明日方舟》世界观的非商业性粉丝项目。我们致力于将游戏中庞大而复杂的世界观、角色关系和事件脉络，以一种清晰、直观、美观的方式呈现给每一位热爱泰拉世界的博士。
          </p>
        </div>

        <div class="about-section">
          <h2 class="section-title">项目目标</h2>
          <ul class="feature-list">
            <li class="feature-item">
              <span class="feature-icon">📚</span>
              <div class="feature-content">
                <h3 class="feature-title">全面的知识整合</h3>
                <p class="feature-desc">整合游戏官方发布的剧情、角色档案、活动故事等各类信息</p>
              </div>
            </li>
            <li class="feature-item">
              <span class="feature-icon">🔗</span>
              <div class="feature-content">
                <h3 class="feature-title">清晰的关系网络</h3>
                <p class="feature-desc">可视化展示角色、势力、事件之间的关联</p>
              </div>
            </li>
            <li class="feature-item">
              <span class="feature-icon">🎨</span>
              <div class="feature-content">
                <h3 class="feature-title">沉浸式的视觉体验</h3>
                <p class="feature-desc">符合游戏美学风格的界面设计，带来更好的浏览体验</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="about-section">
          <h2 class="section-title">技术栈</h2>
          <div class="tech-stack">
            <div class="tech-item">
              <span class="tech-label">前端框架</span>
              <span class="tech-value">Vue 3 + Vite</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">状态管理</span>
              <span class="tech-value">Pinia</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">路由</span>
              <span class="tech-value">Vue Router</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">样式</span>
              <span class="tech-value">CSS Custom Properties</span>
            </div>
          </div>
        </div>

        <div class="about-section about-section--notice">
          <div class="notice-icon">⚠️</div>
          <div class="notice-content">
            <h3 class="notice-title">版权声明</h3>
            <p class="notice-text">
              本项目仅为粉丝创作的非商业性质作品。《明日方舟》及其相关的所有内容、角色、设定等版权属于Hypergryph/鹰角网络。本项目不用于任何商业用途，仅供爱好者学习和交流使用。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FlowLines from '@/components/animations/FlowLines.vue'
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}

.about-page__header {
  padding: 60px 0 40px;
  background: linear-gradient(180deg, rgba(139, 0, 0, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-mid-gray);
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  display: inline-block;
  padding: 20px 40px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary-white);
  letter-spacing: 4px;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--color-light-gray);
}

.about-page__content {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px 80px;
}

.about-section {
  margin-bottom: 60px;
  padding: 40px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
}

.about-section:last-child {
  margin-bottom: 0;
}

.about-section--notice {
  background: rgba(139, 0, 0, 0.1);
  border-color: var(--color-accent-dark-red);
  display: flex;
  gap: 20px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-primary-white);
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.section-text {
  font-size: 15px;
  color: var(--color-light-gray);
  line-height: 1.9;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 20px;
  background: var(--color-primary-black);
  border-left: 3px solid var(--color-accent-red);
}

.feature-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 16px;
  color: var(--color-primary-white);
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 14px;
  color: var(--color-light-gray);
  line-height: 1.7;
  margin: 0;
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
}

.tech-label {
  font-size: 13px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tech-value {
  font-size: 14px;
  color: var(--color-primary-white);
  font-weight: 500;
}

.notice-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
}

.notice-title {
  font-size: 18px;
  color: var(--color-accent-red);
  margin-bottom: 10px;
}

.notice-text {
  font-size: 14px;
  color: var(--color-light-gray);
  line-height: 1.8;
  margin: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .about-section {
    padding: 25px;
  }

  .tech-stack {
    grid-template-columns: 1fr;
  }

  .about-section--notice {
    flex-direction: column;
  }
}
</style>
