<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useEditableRow } from '@/composables/useEditableRow'
import { actions } from '@/constants/constants'
import { useTableStore } from '@/stores/useTableStore'
import type { IAction, ITableRow } from '@/types/table'
import { computed, ref } from 'vue'
import DataTableCell from './DataTableCell.vue'

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

const handleStartEdit = (field: string) => {
  startEdit(field as 'title' | 'text' | 'views')
}

const updateEditValue = (value: string | number) => {
  editValue.value = value
}
</script>

<template>
  <tr class="table-row" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <DataTableCell
      field="title"
      :value="row.title || ''"
      :edit-field="editField"
      :edit-value="editValue"
      input-type="text"
      @start-edit="handleStartEdit"
      @save-edit="saveEdit"
      @cancel-edit="cancelEdit"
      @update:edit-value="updateEditValue"
    />

    <DataTableCell
      field="text"
      :value="row.col?.text || ''"
      :edit-field="editField"
      :edit-value="editValue"
      input-type="text"
      :prefix="true"
      :color="row.col?.color"
      @start-edit="handleStartEdit"
      @save-edit="saveEdit"
      @cancel-edit="cancelEdit"
      @update:edit-value="updateEditValue"
    />

    <DataTableCell
      field="views"
      :value="row.views || 0"
      :edit-field="editField"
      :edit-value="editValue"
      input-type="number"
      @start-edit="handleStartEdit"
      @save-edit="saveEdit"
      @cancel-edit="cancelEdit"
      @update:edit-value="updateEditValue"
    />

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
  gap: 0.5rem;
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
  gap: 0.5rem;
}

.action-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.table-row:hover .action-btn {
  opacity: 1;
}

.edit-input {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  font-size: 14px;
  min-width: 100px;
}

.edit-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>
