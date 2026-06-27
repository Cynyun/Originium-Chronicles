<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__main">
        <div class="footer__brand">
          <div class="footer__logo">
            <span class="footer__logo-icon">◆</span>
            <span class="footer__logo-text">源石纪事</span>
          </div>
          <p class="footer__desc">
            泰拉世界最权威、最沉浸的静态知识终端<br>
            让每一位博士都能在此追溯源石之下的真相
          </p>
        </div>

        <div class="footer__links">
          <div class="footer__column">
            <h4 class="footer__heading">导航</h4>
            <ul class="footer__list">
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/factions">派系档案</router-link></li>
              <li><router-link to="/characters">人物网络</router-link></li>
              <li><router-link to="/timeline">历史年表</router-link></li>
            </ul>
          </div>

          <div class="footer__column">
            <h4 class="footer__heading">关于</h4>
            <ul class="footer__list">
              <li><router-link to="/about">项目说明</router-link></li>
              <li><router-link to="/contributing">贡献指南</router-link></li>
              <li><router-link to="/changelog">更新日志</router-link></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="footer__copyright">
          <p>© 2026 Originium Chronicles. 非商业性粉丝作品.</p>
          <p class="footer__notice">
            所有内容基于《明日方舟》公开剧情整理 | 版权属于鹰角网络
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: var(--color-deep-gray);
  border-top: 1px solid var(--color-accent-dark-red);
  margin-top: auto;
}

.footer__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px 30px;
}

.footer__main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer__brand {
  max-width: 350px;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.footer__logo-icon {
  font-size: 24px;
  color: var(--color-accent-red);
}

.footer__logo-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--color-primary-white);
}

.footer__desc {
  font-size: 14px;
  color: var(--color-light-gray);
  line-height: 1.8;
}

.footer__links {
  display: flex;
  gap: 60px;
}

.footer__column {
  flex: 1;
}

.footer__heading {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--color-accent-red);
  margin-bottom: 20px;
  text-transform: uppercase;
}

.footer__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__list a {
  font-size: 14px;
  color: var(--color-light-gray);
  transition: var(--transition-fast);
}

.footer__list a:hover {
  color: var(--color-primary-white);
}

.footer__bottom {
  padding-top: 30px;
  border-top: 1px solid var(--color-mid-gray);
}

.footer__copyright {
  text-align: center;
}

.footer__copyright p {
  font-size: 13px;
  color: var(--color-light-gray);
  margin-bottom: 5px;
}

.footer__notice {
  font-size: 11px !important;
  color: var(--color-mid-gray) !important;
}

@media (max-width: 768px) {
  .footer__main {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer__links {
    gap: 40px;
  }
}
</style>
