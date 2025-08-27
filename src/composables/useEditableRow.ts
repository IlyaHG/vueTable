import { useTableStore } from '@/stores/useTableStore'
import type { ITableRow } from '@/types/table'
import { nextTick, ref, type Ref } from 'vue'

type InputRefs = {
  title: Ref<HTMLInputElement | undefined>
  text: Ref<HTMLInputElement | undefined>
  views: Ref<HTMLInputElement | undefined>
}

export function useEditableRow(row: ITableRow, inputRefs: InputRefs) {
  const store = useTableStore()
  const editField = ref<'title' | 'views' | 'text' | null>(null)
  const editValue = ref<string | number>('')

  const fieldMap = {
    title: () => row.title || '',
    views: () => row.views || 0,
    text: () => row.col?.text || '',
  } as const

  type EditableField = keyof typeof fieldMap

  const startEdit = async (field: EditableField) => {
    try {
      if (!row.id) return
      store.startEditing(row.id)
      editField.value = field
      editValue.value = fieldMap[field]()

      await nextTick()

      const inputRef = inputRefs[field]
      const inputElement = inputRef.value

      if (inputElement) {
        if (typeof inputElement.focus === 'function') {
          inputElement.focus()
          if (
            (field === 'title' || field === 'text') &&
            typeof inputElement.select === 'function'
          ) {
            setTimeout(() => {
              inputElement.select()
            }, 10)
          }
        }
      }
    } catch (error) {
      console.error('ошибка:', error)
    }
  }

  const saveEdit = async () => {
    if (!editField.value) return

    try {
      if (!row.id) return

      const payload: Partial<ITableRow> = {}

      if (editField.value === 'title') {
        payload.title = editValue.value as string
      } else if (editField.value === 'views') {
        payload.views = Number(editValue.value)
      } else if (editField.value === 'text') {
        payload.col = {
          ...row.col,
          text: editValue.value as string,
        }
      }

      await store.updateRow(row.id, payload)
      editField.value = null
    } catch (error) {
      console.error('ошибка:', error)
    }
  }

  const cancelEdit = () => {
    editField.value = null
    editValue.value = ''
  }

  return {
    editField,
    editValue,
    startEdit,
    saveEdit,
    cancelEdit,
  }
}
