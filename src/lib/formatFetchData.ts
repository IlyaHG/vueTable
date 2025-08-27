import type { IRawTableRow, ITableRow } from '@/types/table'

export function formatFetchData(
  rawData: IRawTableRow[],
  existingData: ITableRow[] = [],
): ITableRow[] {
  const maxId = existingData.reduce((max, row) => {
    const num = parseInt(row.id, 10)
    return Math.max(max, isNaN(num) ? 0 : num)
  }, 0)

  let nextId = maxId + 1

  return rawData.map((row) => {
    const colKey = Object.keys(row).find((key) => key.startsWith('col'))
    const colData = colKey ? row[colKey] : { text: '' }

    const numericId = row.id ? parseInt(row.id, 10) : nextId++

    return {
      id: Number(numericId),
      title: row.title || '',
      views: row.views || 0,
      col: {
        color: colData.color,
        text: colData.text,
        columnKey: colKey!,
      },
    }
  })
}

export function getNextColumnKey(existingData: ITableRow[]): string {
  const colNumbers = existingData.map((row) => {
    const num = parseInt(row.col.columnKey.replace('col', ''), 10)
    return isNaN(num) ? 0 : num
  })
  const maxNum = colNumbers.length ? Math.max(...colNumbers) : 0

  return `col${maxNum + 1}`
}
