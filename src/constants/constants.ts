import type { IAction } from '@/types/table'

export const baseUrl = 'http://localhost:3000/rows'

export const actions: Omit<IAction, 'onClick'>[] = [
  {
    label: 'Редактировать',
    variant: 'outline',
    size: 'sm',
    class: 'action-btn edit-btn',
  },
  {
    label: 'Удалить',
    variant: 'destructive',
    size: 'sm',
    class: 'action-btn delete-btn',
  },
]
