<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { getNextColumnKey } from '@/lib/formatFetchData'
import { useTableStore } from '@/stores/useTableStore'
import { onMounted } from 'vue'
import DataTableRow from './DataTableRow.vue'

const store = useTableStore()

onMounted(() => {
  store.fetchData()
})

const handleAdd = () => {
  const nextColumnKey = getNextColumnKey(store.data)

  const newRow = {
    title: 'Новая строка',
    views: 0,
    col: {
      color: '#3b82f6',
      text: 'Новая колонка',
      columnKey: nextColumnKey,
    },
  }
  store.addRow(newRow)
}
</script>

<template>
  <div class="data-table-container">
    <div class="table-header">
      <h2>Таблица данных</h2>
      <Button @click="handleAdd" class="add-btn"> Добавить запись </Button>
    </div>

    <div v-if="store.loading" class="loading">Загрузка...</div>

    <div v-else-if="store.error" class="error">Ошибка: {{ store.error }}</div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Текст</th>
            <th>Просмотры</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <DataTableRow v-for="row in store.data" :key="row.id" :row="row" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.data-table-container {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.add-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
}

.add-btn:hover {
  background-color: #0056b3;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

.table-wrapper {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  table-layout: fixed;
}

.data-table th {
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.data-table th:first-child {
  width: 20%;
}

.data-table th:nth-child(2) {
  width: 30%;
}

.data-table th:nth-child(3) {
  width: 15%;
}

.data-table th:last-child {
  width: 35%;
  text-align: center;
}
</style>
