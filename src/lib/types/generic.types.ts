import type { ButtonVariant, MantineColor } from '@mantine/core'
import type { Icon } from '@phosphor-icons/react'

export type TamsNavigation = {
  id: number
  name: string
  url: string
  img?: Icon
  hide?: boolean
  children?: TamsNavigation[]
}

export type TamsMenuItem = {
  type: 'item' | 'divider' | 'label'
  label?: string
  icon?: Icon
  onClick?: () => void
  disabled?: boolean
  color?: MantineColor
}

export type TamsTableColumn = {
  label: string
  accessor: string
  type?: 'checkbox' | 'select'
  render?: (row: TamsTableData) => React.ReactNode
  enableSorting?: boolean
  width?: number
}

export type TamsTableData = {
  [key: string | number]:
    string | number | boolean | null | string[] | number[] | boolean[]
}

export type TamsActionPopoverOption = {
  label: string
  action: () => void
  color: MantineColor
  icon?: Icon
}

export type TamsTableEmptyState = {
  icon: Icon | string
  title: string
  description?: string
  actions?: {
    label: string
    onClick: () => void
    variant?: ButtonVariant
    color?: MantineColor
  }[]
}

export type TamsTableBulkSelection = {
  label: string
  action: (rows: number[]) => void
  color?: MantineColor
  variant?: ButtonVariant
  icon?: Icon
}
export type TFormFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'phone'
  | 'textarea'
  | 'search-dropdown'
  | 'multi-select'
  | 'date'
  | 'file'
  | 'switch'

export type TamsBy2ColsFormField = {
  name: string
  label: string
  type: TFormFieldType
  options?: {
    label: string
    value: string
    icon?: Icon
    action?: () => void
  }[]
  required?: boolean
  cols: number
  alias?: string
  readonly?: boolean
  hidden?: boolean
  disabled?: boolean
}

export type TamsBy2ColsFormFields = {
  title: string
  fields: TamsBy2ColsFormField[]
}

export type TTamsTabs = {
  label: string
  value: string
  icon?: Icon
  disabled?: boolean
  color?: MantineColor
  value2?: number
  color2?: MantineColor
}

export type TLabelValue = {
  label: string
  value: string | null
}

export type TLabelValueWithoutNull = {
  label: string
  value: string
}