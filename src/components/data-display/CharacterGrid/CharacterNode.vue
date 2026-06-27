<template>
  <div
    class="character-grid__node"
    :class="{ 'is-selected': isSelected }"
    :style="style"
    @click="handleClick"
  >
    <div class="character-grid__avatar">
      <span class="character-grid__avatar-initial">{{ character.name[0] }}</span>
    </div>
    <span class="character-grid__name">{{ character.name }}</span>
  </div>
</template>

<script setup>
defineProps({
  character: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.character-grid__node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 10;
}

.character-grid__node:hover {
  transform: scale(1.1);
}

.character-grid__node.is-selected {
  transform: scale(1.15);
}

.character-grid__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-dark-red) 0%, var(--color-accent-red) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-accent-dark-red);
  transition: all var(--transition-normal);
  box-shadow: 0 0 15px rgba(139, 0, 0, 0.4);
}

.character-grid__node:hover .character-grid__avatar,
.character-grid__node.is-selected .character-grid__avatar {
  box-shadow: 0 0 25px rgba(139, 0, 0, 0.6);
  border-color: var(--color-accent-bright-red);
}

.character-grid__avatar-initial {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary-white);
}

.character-grid__name {
  font-size: 12px;
  color: var(--color-light-gray);
  margin-top: 8px;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.character-grid__node:hover .character-grid__name,
.character-grid__node.is-selected .character-grid__name {
  color: var(--color-primary-white);
}
</style>