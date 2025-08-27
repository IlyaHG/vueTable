import { baseUrl } from '@/constants/constants'
import { formatFetchData } from '@/lib/formatFetchData'
import type { IRawTableRow, ITableRow, IUpdateRowPatch } from '@/types/table'
import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTableStore = defineStore('table', () => {
  const data = ref<ITableRow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const editingRowId = ref<number | null>(null)

  const updateRow = async (id: number, payload: Partial<ITableRow>) => {
    try {
      const existingRow = data.value.find((row) => row.id === id)
      if (!existingRow) return

      const newData: IUpdateRowPatch = {}

      if (payload.title !== undefined) newData.title = payload.title
      if (payload.views !== undefined) newData.views = payload.views

      if (payload.col) {
        const columnKey = existingRow.col.columnKey
        newData[columnKey] = {
          color: payload.col.color || existingRow.col.color,
          text: payload.col.text || existingRow.col.text,
        }
      }

      await axios.patch(`${baseUrl}/${id}`, newData)

      const rowIndex = data.value.findIndex((row) => row.id === id)
      if (rowIndex !== -1) {
        data.value[rowIndex] = { ...data.value[rowIndex], ...payload }
      }

      editingRowId.value = null
    } catch (err) {
      console.error('Ошибка обновления:', err)
    }
  }

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get<IRawTableRow[]>(baseUrl)
      data.value = formatFetchData(response.data)
    } catch (err) {
      const e = err as AxiosError
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const deleteRow = async (id: number) => {
    try {
      await axios.delete(`${baseUrl}/${id}`)
      data.value = data.value.filter((row) => row.id !== id)
    } catch (err) {
      console.error('Ошибка удаления:', err)
    }
  }

  const addRow = async (payload: ITableRow) => {
    const lastRow = data.value[data.value.length - 1]
    const newId = (lastRow?.id ?? 0) + 1
    try {
      const newData = {
        id: newId,
        title: payload.title,
        views: payload.views,
        [payload.col.columnKey]: {
          color: payload.col.color,
          text: payload.col.text,
        },
      }

      const response = await axios.post(baseUrl, newData)
      data.value.push(formatFetchData([response.data])[0])
    } catch (err) {
      console.error('Ошибка добавления:', err)
    }
  }

  const startEditing = (id: number) => {
    editingRowId.value = id
  }

  const cancelEditing = () => {
    editingRowId.value = null
  }

  return {
    data,
    loading,
    error,
    editingRowId,
    fetchData,
    deleteRow,
    updateRow,
    addRow,
    startEditing,
    cancelEditing,
  }
})
