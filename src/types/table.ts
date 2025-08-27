type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface IAction {
  label: string
  variant: ButtonVariant
  size: ButtonSize
  class?: string
  onClick?: () => void
}

export interface IRawTableRow {
  id?: string
  title?: string
  views?: number
  [key: `col${string}`]: { color?: string; text: string }
}

export interface IUpdateRowPatch {
  title?: string
  views?: number
  [columnKey: string]: { color?: string; text: string } | string | number | undefined
}

export interface ITableRow {
  id?: number
  title: string
  views: number
  col: {
    color?: string
    text: string
    columnKey: string
  }
}
