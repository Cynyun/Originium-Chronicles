<template>
  <div class="changelog-page">
    <div class="changelog-page__header">
      <FlowLines />
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">更新日志</h1>
          <p class="page-subtitle">记录源石纪事的每一步成长</p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="changelog-page__content">
        <div class="changelog-list">
          <div class="changelog-item">
            <div class="changelog-header">
              <span class="changelog-date">2026.05</span>
              <span class="changelog-version">v1.0.0</span>
            </div>
            <h3 class="changelog-title">项目初始化发布</h3>
            <ul class="changelog-changes">
              <li>基础页面框架搭建</li>
              <li>派系档案页面完成</li>
              <li>人物网络页面完成</li>
              <li>历史年表页面完成</li>
              <li>用户中心基础功能</li>
            </ul>
          </div>

          <div class="changelog-item">
            <div class="changelog-header">
              <span class="changelog-date">2026.05</span>
              <span class="changelog-version">v0.9.0</span>
            </div>
            <h3 class="changelog-title">主要功能开发</h3>
            <ul class="changelog-changes">
              <li>优化整体数据加载方式</li>
              <li>添加加载动画与过渡效果</li>
              <li>丰富派系展示内容</li>
              <li>重构角色展示模块</li>
              <li>完善干员头像组件</li>
            </ul>
          </div>

          <div class="changelog-item">
            <div class="changelog-header">
              <span class="changelog-date">2026.04</span>
              <span class="changelog-version">v0.5.0</span>
            </div>
            <h3 class="changelog-title">页面结构与样式</h3>
            <ul class="changelog-changes">
              <li>完成基础布局组件</li>
              <li>设计整体视觉风格</li>
              <li>配置颜色变量系统</li>
              <li>实现响应式布局</li>
            </ul>
          </div>

          <div class="changelog-item">
            <div class="changelog-header">
              <span class="changelog-date">2026.04</span>
              <span class="changelog-version">v0.1.0</span>
            </div>
            <h3 class="changelog-title">项目启动</h3>
            <ul class="changelog-changes">
              <li>项目初始化</li>
              <li>技术栈选型与配置</li>
              <li>基础数据结构设计</li>
            </ul>
          </div>
        </div>

        <div class="changelog-footer">
          <div class="roadmap-card">
            <h3 class="roadmap-title">🎯 未来规划</h3>
            <div class="roadmap-items">
              <div class="roadmap-item">
                <span class="roadmap-dot"></span>
                <span class="roadmap-text">增加更多角色档案</span>
              </div>
              <div class="roadmap-item">
                <span class="roadmap-dot"></span>
                <span class="roadmap-text">完善历史年表时间线</span>
              </div>
              <div class="roadmap-item">
                <span class="roadmap-dot"></span>
                <span class="roadmap-text">添加关系图谱功能</span>
              </div>
              <div class="roadmap-item">
                <span class="roadmap-dot roadmap-dot--pending"></span>
                <span class="roadmap-text">更多交互与动画</span>
              </div>
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
.changelog-page {
  min-height: 100vh;
}

.changelog-page__header {
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

.changelog-page__content {
  max-width: 700px;
  margin: 0 auto;
  padding: 60px 20px 80px;
}

.changelog-list {
  position: relative;
  padding-left: 40px;
  margin-bottom: 60px;
}

.changelog-list::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-accent-red), var(--color-mid-gray));
}

.changelog-item {
  position: relative;
  margin-bottom: 50px;
  padding: 30px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
}

.changelog-item::before {
  content: "";
  position: absolute;
  left: -35px;
  top: 35px;
  width: 12px;
  height: 12px;
  background: var(--color-accent-red);
  border-radius: 50%;
  border: 3px solid var(--color-primary-black);
}

.changelog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.changelog-date {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-light-gray);
}

.changelog-version {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent-red);
  padding: 4px 12px;
  background: rgba(139, 0, 0, 0.15);
  border: 1px solid var(--color-accent-dark-red);
}

.changelog-title {
  font-size: 18px;
  color: var(--color-primary-white);
  margin-bottom: 15px;
}

.changelog-changes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.changelog-changes li {
  font-size: 14px;
  color: var(--color-light-gray);
  padding-left: 18px;
  position: relative;
  line-height: 1.6;
}

.changelog-changes li::before {
  content: "+";
  position: absolute;
  left: 0;
  color: var(--color-accent-red);
  font-weight: 700;
}

.changelog-footer {
  padding-top: 20px;
}

.roadmap-card {
  padding: 35px;
  background: rgba(0, 191, 255, 0.05);
  border: 1px solid var(--color-tech-blue);
}

.roadmap-title {
  font-size: 18px;
  color: var(--color-primary-white);
  margin-bottom: 20px;
}

.roadmap-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.roadmap-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.roadmap-dot {
  width: 8px;
  height: 8px;
  background: var(--color-tech-blue);
  border-radius: 50%;
  flex-shrink: 0;
}

.roadmap-dot--pending {
  background: transparent;
  border: 2px solid var(--color-mid-gray);
}

.roadmap-text {
  font-size: 14px;
  color: var(--color-light-gray);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .changelog-item {
    padding: 25px;
  }

  .roadmap-card {
    padding: 25px;
  }
}
</style>
