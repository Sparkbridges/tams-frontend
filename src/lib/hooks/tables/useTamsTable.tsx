import type { TamsTableData } from '#/lib/types'
import { useEffect, useMemo, useState } from 'react'

interface UseTamsTableProps {
  data?: TamsTableData[]
  selectedIds?: string[] | number[]
}
const useTamsTable = ({ data, selectedIds }: UseTamsTableProps) => {
  const [selection, setSelection] = useState(
    new Set<string | number | boolean | null>(),
  )
  const [sortBy, setSortBy] = useState<keyof TamsTableData | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  const newData = useMemo(() => {
    if (!sortBy) return data

    return data?.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      const compare = (x: typeof aValue, y: typeof bValue) => {
        if (typeof x === 'string' && typeof y === 'string') {
          return x.localeCompare(y)
        }
        if (x === y) return 0
        if (x === null) return -1
        if (y === null) return 1
        const xVal = typeof x === 'boolean' ? Number(x) : x
        const yVal = typeof y === 'boolean' ? Number(y) : y
        return xVal > yVal ? 1 : -1
      }

      return reverseSortDirection
        ? compare(bValue, aValue)
        : compare(aValue, bValue)
    })
  }, [data, sortBy, reverseSortDirection])
  const toggleRow = (id: string | number | boolean | null) =>
    setSelection((current) =>
      current.has(id)
        ? new Set([...current].filter((item) => item !== id))
        : new Set([...current, id]),
    )
  const toggleAll = () =>
    setSelection((current) =>
      current.size === (data?.length ?? 0)
        ? new Set()
        : new Set(data?.map((item) => item.id as string | number | boolean | null) ?? []),
    )

  const clearSelection = () => setSelection(new Set())

  const setSorting = (field: keyof TamsTableData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed)
    setSortBy(field)
  }
  useEffect(() => {
    if (selectedIds?.length === 0) {
      setSelection(new Set())
    }
  }, [selectedIds])
  return {
    selection,
    toggleRow,
    toggleAll,
    clearSelection,
    newData,
    sortBy,
    reverseSortDirection,
    setSorting,
    setReverseSortDirection,
  }
}

export default useTamsTable
