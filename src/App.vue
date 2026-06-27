<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TheNavbar from './components/layout/TheNavbar.vue'
import TheFooter from './components/layout/TheFooter.vue'
</script>

<template>
  <div class="app">
    <TheNavbar />
    <main class="main-content">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<style>
@import './assets/main.css';

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-top: 70px;
}
</style>
