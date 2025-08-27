// composables/useFetch.ts
import { formatFetchData } from '@/lib/formatFetchData'
import type { IRawTableRow, ITableRow } from '@/types/table'
import axios, { AxiosError } from 'axios'
import { ref } from 'vue'

export function useFetch(baseUrl: string) {
  const data = ref<ITableRow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

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
      console.error(err)
    }
  }

  const updateRow = async (id: number, payload: Partial<ITableRow>) => {
    try {
      await axios.patch(`${baseUrl}/${id}`, payload)
      data.value = data.value.map((row) => (row.id === id ? { ...row, ...payload } : row))
    } catch (err) {
      console.error(err)
    }
  }

  const addRow = async (payload: ITableRow) => {
    try {
      const response = await axios.post(baseUrl, payload)
      data.value.push(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  return { data, loading, error, fetchData, deleteRow, updateRow, addRow }
}
