<template>
  <div class="login-form">
    <div class="login-form__header">
      <h2 class="login-form__title">{{ isRegister ? '注册' : '登录' }}</h2>
      <p class="login-form__subtitle">
        {{ isRegister ? '创建您的账户' : '欢迎回来，博士' }}
      </p>
    </div>

    <form class="login-form__form" @submit.prevent="handleSubmit">
      <div class="login-form__field" v-if="isRegister">
        <BaseInput
          v-model="formData.username"
          label="用户名"
          placeholder="请输入用户名"
          :error="errors.username"
        />
      </div>

      <div class="login-form__field">
        <BaseInput
          v-model="formData.email"
          type="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :error="errors.email"
        />
      </div>

      <div class="login-form__field">
        <BaseInput
          v-model="formData.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          :error="errors.password"
        />
      </div>

      <div class="login-form__field" v-if="isRegister">
        <BaseInput
          v-model="formData.confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          :error="errors.confirmPassword"
        />
      </div>

      <div class="login-form__actions">
        <BaseButton type="submit" variant="primary" size="large" :loading="isLoading">
          {{ isRegister ? '注册' : '登录' }}
        </BaseButton>
      </div>

      <div class="login-form__toggle">
        <span @click="toggleMode">
          {{ isRegister ? '已有账户？立即登录' : '没有账户？立即注册' }}
        </span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits(['success'])

const isRegister = ref(false)
const isLoading = ref(false)

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateForm = () => {
  let isValid = true

  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (isRegister.value && !formData.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = '请输入邮箱'
    isValid = false
  } else if (!validateEmail(formData.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }

  if (!formData.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = '密码长度至少为6位'
    isValid = false
  }

  if (isRegister.value && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  await new Promise(resolve => setTimeout(resolve, 1000))

  const user = {
    username: formData.username || formData.email.split('@')[0],
    email: formData.email
  }

  localStorage.setItem('user', JSON.stringify(user))
  isLoading.value = false
  emit('success', user)
}

const toggleMode = () => {
  isRegister.value = !isRegister.value
  Object.keys(errors).forEach(key => errors[key] = '')
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  min-width: 300px;
  margin: 0 auto;
  padding: 40px;
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
}

.login-form__header {
  text-align: center;
  margin-bottom: 30px;
}

.login-form__title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-primary-white);
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.login-form__subtitle {
  font-size: 14px;
  color: var(--color-light-gray);
}

.login-form__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-form__actions {
  margin-top: 10px;
}

.login-form__actions :deep(.btn) {
  width: 100%;
}

.login-form__toggle {
  text-align: center;
  margin-top: 20px;
}

.login-form__toggle span {
  font-size: 14px;
  color: var(--color-tech-blue);
  cursor: pointer;
  transition: var(--transition-fast);
}

.login-form__toggle span:hover {
  color: var(--color-accent-red);
}
</style>
