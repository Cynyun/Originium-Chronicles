<template>
  <div class="select" :class="{ 'select--open': isOpen }">
    <div ref="triggerRef" class="select__trigger" @click="toggle" @blur="handleBlur" tabindex="0">
      <span class="select__value">{{ displayValue }}</span>
      <span class="select__arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </div>

    <div v-if="isOpen" class="select__dropdown" ref="dropdownRef">
      <div v-for="option in options" :key="option.value" class="select__option"
        :class="{ 'select__option--selected': isSelected(option) }" @mousedown="isClickingOnDropdown.value = true"
        @click="selectOption(option)">
        <span class="select__option-label">{{ option.label }}</span>
        <span v-if="isSelected(option)" class="select__option-check">✓</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null
  },
  options: {
    type: Array,
    required: true,
    validator: (val) => val.every(option => option.value !== undefined && option.label !== undefined)
  },
  placeholder: {
    type: String,
    default: '请选择...'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)
const triggerRef = ref(null)
const isClickingOnDropdown = ref(false)

const displayValue = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

const isSelected = (option) => {
  return option.value === props.modelValue
}

const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleBlur = () => {
  setTimeout(() => {
    if (!isClickingOnDropdown.value) {
      isOpen.value = false
    }
  }, 200)
}

const handleClickOutside = (e) => {
  isClickingOnDropdown.value = false
  if (dropdownRef.value && !dropdownRef.value.contains(e.target) && triggerRef.value && !triggerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.select {
  position: relative;
  display: inline-block;
  min-width: 160px;
  font-family: var(--font-body);
}

.select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-mid-gray);
  color: var(--color-primary-white);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-normal);
  user-select: none;
}

.select__trigger:hover {
  border-color: var(--color-accent-dark-red);
  box-shadow: 0 0 10px rgba(139, 0, 0, 0.2);
}

.select--open .select__trigger {
  border-color: var(--color-accent-red);
  box-shadow: 0 0 15px rgba(139, 0, 0, 0.4);
}

.select__value {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--color-light-gray);
  transition: transform var(--transition-normal);
}

.select--open .select__arrow {
  transform: rotate(180deg);
  color: var(--color-accent-red);
}

.select__arrow svg {
  width: 16px;
  height: 16px;
}

.select__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(10, 10, 15, 0.98);
  border: 1px solid var(--color-accent-dark-red);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 0, 0, 0.15);
  z-index: 1000;
  max-height: 280px;
  overflow-y: auto;
  animation: dropdownOpen 0.2s ease-out;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.select__dropdown::-webkit-scrollbar {
  display: none;
}

@keyframes dropdownOpen {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  color: var(--color-light-gray);
  cursor: pointer;
  transition: all var(--transition-fast);
  border-bottom: 1px solid rgba(139, 0, 0, 0.1);
}

.select__option:last-child {
  border-bottom: none;
}

.select__option:hover {
  background: rgba(139, 0, 0, 0.1);
  color: var(--color-primary-white);
}

.select__option--selected {
  background: rgba(139, 0, 0, 0.2);
  color: var(--color-accent-red);
}

.select__option-label {
  flex: 1;
  text-align: left;
}

.select__option-check {
  color: var(--color-accent-red);
  font-size: 14px;
  font-weight: bold;
}
</style>
