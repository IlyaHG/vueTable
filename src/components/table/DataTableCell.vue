<script setup lang="ts">
import type { Ref } from 'vue'
import Input from '../ui/input/Input.vue'

interface Props {
  field: string
  value: string | number
  editField: string | null
  editValue: string | number
  inputType?: 'text' | 'number'
  inputRef?: Ref<HTMLInputElement | undefined>
  prefix?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  inputType: 'text',
  prefix: false,
})

const emit = defineEmits<{
  (e: 'startEdit', field: string): void
  (e: 'saveEdit'): void
  (e: 'cancelEdit'): void
  (e: 'update:editValue', value: string | number): void
}>()

const handleDoubleClick = () => {
  emit('startEdit', props.field)
}

const handleSave = () => {
  emit('saveEdit')
}

const handleCancel = () => {
  emit('cancelEdit')
}
</script>

<template>
  <td class="table-cell">
    <div class="cell-content">
      <!-- Цветовой маркер (если нужен) -->
      <span v-if="prefix && color" class="color-marker" :style="{ backgroundColor: color }"></span>

      <!-- Инпут для редактирования -->
      <Input
        v-if="editField === field"
        :ref="inputRef"
        :model-value="editValue"
        :type="inputType"
        class="edit-input"
        @update:model-value="$emit('update:editValue', $event)"
        @keyup.enter="handleSave"
        @keyup.escape="handleCancel"
        @blur="handleSave"
      />

      <!-- Отображение значения -->
      <span v-else @dblclick="handleDoubleClick">
        {{ value || (inputType === 'number' ? 0 : '') }}
      </span>
    </div>
  </td>
</template>

<style scoped>
.table-cell {
  /* Ваши стили для ячейки */
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
</style>
