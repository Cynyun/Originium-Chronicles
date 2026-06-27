<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
      <button class="modal-close" @click="$emit('close')">×</button>
      
      <div class="modal-header">
        <div class="modal-logo">
          <img src="/favicon.ico" alt="Logo" class="modal-logo-icon" />
        </div>
        <h2 class="modal-title">{{ isLogin ? '登录' : '注册' }}</h2>
        <p class="modal-subtitle">欢迎来到源石纪事</p>
      </div>

      <form class="modal-form" @submit.prevent="handleSubmit">
        <div class="form-group" v-if="!isLogin">
          <label class="form-label">用户名</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-input" 
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">账号</label>
          <input 
            v-model="account" 
            type="text" 
            class="form-input" 
            placeholder="请输入账号"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">密码</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-input" 
            placeholder="请输入密码"
            required
          />
        </div>

        <div class="form-group" v-if="!isLogin">
          <label class="form-label">确认密码</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            class="form-input" 
            placeholder="请再次输入密码"
            required
          />
        </div>

        <div class="form-group form-group--checkbox" v-if="isLogin">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkbox-custom"></span>
            <span>记住我</span>
          </label>
        </div>

        <button type="submit" class="form-submit">
          {{ isLogin ? '登录' : '注册' }}
        </button>

        <div class="form-error" v-if="error">{{ error }}</div>
      </form>

      <div class="modal-footer">
        <span>{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
        <button class="modal-toggle" @click="toggleMode">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </button>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'loggedIn'])

const userStore = useUserStore()

const isLogin = ref(true)
const username = ref('')
const account = ref('')
const password = ref('')
const confirmPassword = ref('')
const rememberMe = ref(false)
const error = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}

const handleSubmit = async () => {
  error.value = ''
  
  if (!isLogin.value && password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  try {
    if (isLogin.value) {
      await userStore.login(account.value, password.value, rememberMe.value)
    } else {
      await userStore.register(username.value, account.value, password.value)
    }
    
    emit('loggedIn')
    emit('close')
    
    username.value = ''
    account.value = ''
    password.value = ''
    confirmPassword.value = ''
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999;
  /* padding: 15vh 20px 20px; */
  /* margin-top: 100px; */
  animation: fadeIn 0.2s ease;
  overflow-y: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-accent-red);
  border-radius: 8px;
  width: 100%;
  max-width: 420px;
  position: relative;
  animation: slideUp 0.3s ease;
  margin-top: 30px;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--color-light-gray);
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
  z-index: 1;
}

.modal-close:hover {
  color: var(--color-accent-red);
}

.modal-header {
  text-align: center;
  padding: 35px 30px 25px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.modal-logo {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-accent-dark-red);
  border-radius: 8px;
}

.modal-logo-icon {
  width: 40px;
  height: 40px;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--color-primary-white);
  margin-bottom: 5px;
}

.modal-subtitle {
  font-size: 14px;
  color: var(--color-light-gray);
}

.modal-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group--checkbox {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 12px;
  color: var(--color-light-gray);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-primary-white);
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  border-radius: 6px;
  transition: var(--transition-normal);
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-tech-blue);
}

.form-input::placeholder {
  color: var(--color-light-gray);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--color-light-gray);
  cursor: pointer;
}

.checkbox-label input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 1px solid var(--color-mid-gray);
  border-radius: 4px;
  position: relative;
  transition: var(--transition-fast);
}

.checkbox-label input:checked + .checkbox-custom {
  background: var(--color-accent-red);
  border-color: var(--color-accent-red);
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #ffffff;
}

.form-submit {
  width: 100%;
  padding: 14px;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  background: var(--color-accent-red);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition-normal);
  letter-spacing: 2px;
}

.form-submit:hover {
  background: var(--color-accent-bright-red);
  box-shadow: 0 0 20px rgba(139, 0, 0, 0.4);
}

.form-error {
  margin-top: 15px;
  padding: 12px;
  background: rgba(165, 42, 42, 0.2);
  border: 1px solid var(--color-accent-red);
  border-radius: 4px;
  font-size: 13px;
  color: var(--color-accent-red);
  text-align: center;
}

.modal-footer {
  padding: 20px 30px 30px;
  text-align: center;
  font-size: 14px;
  color: var(--color-light-gray);
}

.modal-toggle {
  display: inline-block;
  margin-left: 8px;
  padding: 4px 12px;
  background: none;
  border: 1px solid var(--color-tech-blue);
  border-radius: 4px;
  font-size: 13px;
  color: var(--color-tech-blue);
  cursor: pointer;
  transition: var(--transition-normal);
}

.modal-toggle:hover {
  background: rgba(0, 191, 255, 0.1);
}
</style>
