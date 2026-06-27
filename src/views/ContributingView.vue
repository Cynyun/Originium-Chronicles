<template>
  <div class="contributing-page">
    <div class="contributing-page__header">
      <FlowLines />
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">贡献指南</h1>
          <p class="page-subtitle">参与源石纪事的建设与完善</p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="contributing-page__content">
        <div class="contributing-section">
          <h2 class="section-title">如何贡献</h2>
          <div class="contribute-step">
            <div class="step-number">01</div>
            <div class="step-content">
              <h3 class="step-title">发现问题或提出建议</h3>
              <p class="step-desc">如果发现内容错误、信息缺失，或者有任何改进建议，欢迎提出</p>
            </div>
          </div>
          <div class="contribute-step">
            <div class="step-number">02</div>
            <div class="step-content">
              <h3 class="step-title">补充内容</h3>
              <p class="step-desc">可以补充角色档案、事件记录、势力信息等内容</p>
            </div>
          </div>
          <div class="contribute-step">
            <div class="step-number">03</div>
            <div class="step-content">
              <h3 class="step-title">改进代码</h3>
              <p class="step-desc">如果你是开发者，欢迎提交代码改进、功能优化、样式调整</p>
            </div>
          </div>
        </div>

        <div class="contributing-section">
          <h2 class="section-title">内容贡献</h2>
          <div class="contribute-categories">
            <div class="category-card">
              <div class="category-icon">📝</div>
              <h3 class="category-title">数据完善</h3>
              <p class="category-desc">补充角色档案、事件详情、势力介绍</p>
            </div>
            <div class="category-card">
              <div class="category-icon">🎨</div>
              <h3 class="category-title">设计优化</h3>
              <p class="category-desc">界面设计、图标、动效</p>
            </div>
            <div class="category-card">
              <div class="category-icon">📖</div>
              <h3 class="category-title">文档编写</h3>
              <p class="category-desc">教程、文档、说明文案</p>
            </div>
            <div class="category-card">
              <div class="category-icon">🔧</div>
              <h3 class="category-title">功能开发</h3>
              <p class="category-desc">新功能、工具、特性</p>
            </div>
          </div>
        </div>

        <div class="contributing-section contributing-section--info">
          <h2 class="section-title">提交说明</h2>
          <div class="info-card">
            <h3 class="info-title">💡 提交前</h3>
            <ul class="info-list">
              <li>请确保内容来源可靠，基于游戏官方发布的信息</li>
              <li>尊重原设定，不要添加未经证实的内容</li>
              <li>内容格式请保持一致</li>
            </ul>
          </div>
          <div class="info-card">
            <h3 class="info-title">📋 内容规范</h3>
            <ul class="info-list">
              <li>保持中立客观的描述方式</li>
              <li>准确的角色名称、事件名称等</li>
              <li>清晰的分类和标签</li>
            </ul>
          </div>
        </div>

        <div class="contributing-section contributing-section--cta">
          <div class="cta-icon">✨</div>
          <div class="cta-content">
            <h3 class="cta-title">加入我们</h3>
            <p class="cta-text">
              每一份贡献都会让源石纪事变得更好。无论是小的错别字修正，还是大的功能添加，我们都欢迎！
            </p>
            <div class="cta-placeholder">
              <span class="cta-label">待完善区域</span>
              <span class="cta-hint">（此处后续可放置仓库链接或联系方式）</span>
            </div>
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
.contributing-page {
  min-height: 100vh;
}

.contributing-page__header {
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

.contributing-page__content {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px 80px;
}

.contributing-section {
  margin-bottom: 50px;
  padding: 40px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
}

.contributing-section:last-child {
  margin-bottom: 0;
}

.contributing-section--info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 40px;
}

.contributing-section--cta {
  display: flex;
  gap: 25px;
  background: rgba(0, 191, 255, 0.08);
  border-color: var(--color-tech-blue);
}

.section-title {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-primary-white);
  margin-bottom: 25px;
  letter-spacing: 2px;
}

.contribute-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 25px 0;
  border-bottom: 1px dashed var(--color-mid-gray);
}

.contribute-step:last-child {
  border-bottom: none;
}

.step-number {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-accent-red);
  line-height: 1;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 18px;
  color: var(--color-primary-white);
  margin-bottom: 8px;
}

.step-desc {
  font-size: 14px;
  color: var(--color-light-gray);
  line-height: 1.7;
  margin: 0;
}

.contribute-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.category-card {
  padding: 30px;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  text-align: center;
  transition: var(--transition-normal);
}

.category-card:hover {
  border-color: var(--color-accent-red);
  transform: translateY(-3px);
}

.category-icon {
  font-size: 36px;
  margin-bottom: 15px;
}

.category-title {
  font-size: 16px;
  color: var(--color-primary-white);
  margin-bottom: 10px;
}

.category-desc {
  font-size: 13px;
  color: var(--color-light-gray);
  line-height: 1.6;
  margin: 0;
}

.info-card {
  padding: 25px;
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
}

.info-title {
  font-size: 16px;
  color: var(--color-primary-white);
  margin-bottom: 15px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-list li {
  font-size: 14px;
  color: var(--color-light-gray);
  padding-left: 20px;
  position: relative;
  line-height: 1.6;
}

.info-list li::before {
  content: "•";
  position: absolute;
  left: 5px;
  color: var(--color-accent-red);
}

.cta-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.cta-content {
  flex: 1;
}

.cta-title {
  font-size: 22px;
  color: var(--color-tech-blue);
  margin-bottom: 12px;
}

.cta-text {
  font-size: 15px;
  color: var(--color-light-gray);
  line-height: 1.8;
  margin-bottom: 20px;
}

.cta-placeholder {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}

.cta-label {
  font-size: 13px;
  color: var(--color-light-gray);
}

.cta-hint {
  font-size: 12px;
  color: var(--color-mid-gray);
  font-style: italic;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .contributing-section {
    padding: 25px;
  }

  .contributing-section--info {
    grid-template-columns: 1fr;
  }

  .contribute-categories {
    grid-template-columns: 1fr;
  }

  .contributing-section--cta {
    flex-direction: column;
    text-align: center;
  }
}
</style>
