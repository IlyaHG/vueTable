<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useEditableRow } from '@/composables/useEditableRow'
import { actions } from '@/constants/constants'
import { useTableStore } from '@/stores/useTableStore'
import type { IAction, ITableRow } from '@/types/table'
import { computed, ref } from 'vue'
import Input from '../ui/input/Input.vue'

interface Props {
  row: ITableRow & { id: number }
}

const props = defineProps<Props>()
const store = useTableStore()
const isHovered = ref(false)

const titleInputRef = ref<HTMLInputElement>()
const textInputRef = ref<HTMLInputElement>()
const viewsInputRef = ref<HTMLInputElement>()

const { editField, editValue, startEdit, saveEdit, cancelEdit } = useEditableRow(props.row, {
  title: titleInputRef,
  text: textInputRef,
  views: viewsInputRef,
})

const isEditing = computed(() => store.editingRowId === props.row.id && editField.value !== null)

const handleDelete = () => {
  store.deleteRow(props.row.id)
}

function getActions(): IAction[] {
  return actions.map((a) => ({
    ...a,
    onClick: a.label === 'Редактировать' ? () => startEdit('title') : handleDelete,
  }))
}

const renderedActions = getActions()
</script>

<template>
  <tr class="table-row" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <td class="table-cell">
      <div class="cell-content">
        <Input
          v-if="editField === 'title'"
          ref="inputRefs.title"
          v-model="editValue"
          class="edit-input"
          @keyup.enter="saveEdit"
          @blur="saveEdit"
        />

        <span v-else @dblclick="startEdit('title')">{{ row.title || '' }}</span>
      </div>
    </td>
    <td class="table-cell">
      <div class="cell-content">
        <span
          v-if="row.col?.color"
          class="color-marker"
          :style="{ backgroundColor: row.col.color }"
        ></span>

        <Input
          v-if="editField === 'text'"
          ref="textInputRef"
          v-model="editValue"
          class="edit-input"
          @keyup.enter="saveEdit"
          @keyup.escape="cancelEdit"
          @blur="saveEdit"
        />
        <span v-else @dblclick="startEdit('text')">{{ row.col?.text || '' }}</span>
      </div>
    </td>
    <td class="table-cell">
      <div class="cell-content">
        <Input
          v-if="editField === 'views'"
          ref="inputRefs.views"
          v-model="editValue"
          type="number"
          class="edit-input"
          @keyup.enter="saveEdit"
          @blur="saveEdit"
        />
        <span v-else @dblclick="startEdit('views')">{{ row.views || 0 }}</span>
      </div>
    </td>
    <td class="table-cell actions-cell">
      <div class="actions" v-show="!isEditing && isHovered">
        <Button v-for="(action, index) in renderedActions" :key="index" v-bind="action">
          {{ action.label }}
        </Button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.table-row:hover {
  background-color: #f8f9fa;
}

.table-cell {
  padding: 1.25rem;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  width: 2.5rem;
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-marker {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.actions-cell {
  width: 2.5rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.table-row:hover .action-btn {
  opacity: 1;
}

.edit-input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  min-width: 100px;
}

.edit-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>
