<template>
  <div class="user-settings">
    <div class="settings-header">
      <h2 class="settings-title">个人设置</h2>
      <p class="settings-subtitle">管理您的账号信息</p>
    </div>

    <form class="settings-form" @submit.prevent="handleSubmit">
      <div class="avatar-upload">
        <div class="avatar-container" @click="triggerUpload">
          <img
            :src="avatarPreview || formData.avatar || '/images/default-avatar.png'"
            alt="头像"
            class="avatar-img"
          />
          <div class="avatar-overlay">
            <span class="avatar-icon">+</span>
            <span class="avatar-text">上传头像</span>
          </div>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="avatar-input"
          @change="handleAvatarChange"
        />
        <span class="avatar-hint">支持 JPG、PNG、WebP 格式，建议尺寸 120x120</span>
      </div>

      <div class="form-group">
        <label class="form-label">用户名</label>
        <input
          v-model="formData.username"
          type="text"
          class="form-input"
          placeholder="请输入用户名"
        />
      </div>

      <div class="form-group">
        <label class="form-label">账号</label>
        <input
          v-model="formData.account"
          type="text"
          class="form-input"
          placeholder="请输入账号"
          disabled
        />
        <span class="form-hint">账号无法修改</span>
      </div>

      <div class="form-group">
        <label class="form-label">邮箱</label>
        <input
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="请输入邮箱"
        />
      </div>

      <div class="form-group">
        <label class="form-label">个人简介</label>
        <textarea
          v-model="formData.bio"
          class="form-textarea"
          placeholder="介绍一下自己..."
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">所在地</label>
        <input
          v-model="formData.location"
          type="text"
          class="form-input"
          placeholder="请输入所在地"
        />
      </div>

      <div class="form-divider"></div>

      <div class="form-group">
        <label class="form-label">修改密码</label>
        <input
          v-model="formData.newPassword"
          type="password"
          class="form-input"
          placeholder="请输入新密码（不修改请留空）"
        />
      </div>

      <div class="form-group">
        <label class="form-label">确认密码</label>
        <input
          v-model="formData.confirmPassword"
          type="password"
          class="form-input"
          placeholder="请再次输入新密码"
        />
      </div>

      <div class="form-error" v-if="error">{{ error }}</div>
      <div class="form-success" v-if="success">{{ success }}</div>

      <div class="form-actions">
        <button type="submit" class="btn-save">保存修改</button>
        <button type="button" class="btn-cancel" @click="$emit('cancel')">取消</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'

defineEmits(['cancel', 'saved'])

const userStore = useUserStore()

const fileInput = ref(null)
const avatarPreview = ref('')

const formData = reactive({
  avatar: userStore.user?.avatar || '',
  username: userStore.user?.username || '',
  account: userStore.user?.account || '',
  email: userStore.user?.email || '',
  bio: userStore.user?.bio || '',
  location: userStore.user?.location || '',
  newPassword: '',
  confirmPassword: ''
})

const error = ref('')
const success = ref('')

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      error.value = '头像文件大小不能超过 2MB'
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result
    }
    reader.readAsDataURL(file)
    error.value = ''
  }
}

const handleSubmit = () => {
  error.value = ''
  success.value = ''

  if (!formData.username.trim()) {
    error.value = '用户名不能为空'
    return
  }

  if (formData.newPassword) {
    if (formData.newPassword.length < 6) {
      error.value = '密码长度不能少于6位'
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      error.value = '两次输入的密码不一致'
      return
    }
  }

  const updateData = {
    username: formData.username,
    email: formData.email,
    bio: formData.bio,
    location: formData.location
  }

  if (avatarPreview.value) {
    updateData.avatar = avatarPreview.value
  }

  if (formData.newPassword) {
    updateData.password = formData.newPassword
  }

  userStore.updateUser(updateData)

  success.value = '保存成功！'
  formData.newPassword = ''
  formData.confirmPassword = ''

  setTimeout(() => {
    success.value = ''
  }, 3000)
}
</script>

<style scoped>
.user-settings {
  background: var(--color-deep-gray);
  border: 1px solid var(--color-mid-gray);
  padding: 30px;
}

.settings-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-mid-gray);
}

.settings-title {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--color-primary-white);
  margin-bottom: 5px;
}

.settings-subtitle {
  font-size: 14px;
  color: var(--color-light-gray);
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-mid-gray);
  cursor: pointer;
  transition: var(--transition-normal);
}

.avatar-container:hover {
  border-color: var(--color-accent-red);
  box-shadow: 0 0 15px rgba(139, 0, 0, 0.3);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: var(--transition-normal);
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-icon {
  font-size: 32px;
  color: var(--color-accent-red);
  font-weight: 300;
}

.avatar-text {
  font-size: 12px;
  color: var(--color-primary-white);
  margin-top: 5px;
}

.avatar-input {
  display: none;
}

.avatar-hint {
  font-size: 11px;
  color: var(--color-light-gray);
  margin-top: 10px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 12px;
  color: var(--color-light-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-input,
.form-textarea {
  padding: 12px 15px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-primary-white);
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  border-radius: 6px;
  transition: var(--transition-normal);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-tech-blue);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-light-gray);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  font-size: 11px;
  color: var(--color-light-gray);
}

.form-divider {
  height: 1px;
  background: var(--color-mid-gray);
  margin: 10px 0;
}

.form-error {
  padding: 12px;
  background: rgba(165, 42, 42, 0.2);
  border: 1px solid var(--color-accent-red);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-accent-red);
}

.form-success {
  padding: 12px;
  background: rgba(0, 139, 0, 0.2);
  border: 1px solid #008B00;
  border-radius: 6px;
  font-size: 13px;
  color: #00CC00;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn-save,
.btn-cancel {
  flex: 1;
  padding: 12px 20px;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition-normal);
}

.btn-save {
  background: var(--color-accent-red);
  color: #ffffff;
  border: none;
}

.btn-save:hover {
  background: var(--color-accent-bright-red);
  box-shadow: 0 0 15px rgba(139, 0, 0, 0.4);
}

.btn-cancel {
  background: transparent;
  color: var(--color-light-gray);
  border: 1px solid var(--color-mid-gray);
}

.btn-cancel:hover {
  border-color: var(--color-light-gray);
  color: var(--color-primary-white);
}
</style>
