<template>
  <div class="input-wrapper" :class="{ 'input-wrapper--error': error }">
    <label v-if="label" :for="inputId" class="input__label">{{ label }}</label>
    <div class="input__container">
      <span v-if="$slots.prefix" class="input__prefix">
        <slot name="prefix"></slot>
      </span>
      <input
        :id="inputId"
        class="input"
        :class="{ 'input--has-prefix': $slots.prefix, 'input--has-suffix': $slots.suffix }"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <span v-if="$slots.suffix" class="input__suffix">
        <slot name="suffix"></slot>
      </span>
    </div>
    <span v-if="error" class="input__error">{{ error }}</span>
    <span v-else-if="hint" class="input__hint">{{ hint }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'focus', 'blur'])

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 9)}`)
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input__label {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  color: var(--color-light-gray);
  text-transform: uppercase;
}

.input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-primary-white);
  background: var(--color-primary-black);
  border: 1px solid var(--color-mid-gray);
  transition: var(--transition-normal);
}

.input::placeholder {
  color: var(--color-light-gray);
}

.input:focus {
  border-color: var(--color-tech-blue);
  box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input--has-prefix {
  padding-left: 44px;
}

.input--has-suffix {
  padding-right: 44px;
}

.input__prefix,
.input__suffix {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 100%;
  color: var(--color-light-gray);
}

.input__prefix {
  left: 0;
}

.input__suffix {
  right: 0;
}

.input-wrapper--error .input {
  border-color: var(--color-accent-red);
}

.input__error {
  font-size: 12px;
  color: var(--color-accent-red);
}

.input__hint {
  font-size: 12px;
  color: var(--color-light-gray);
}
</style>
