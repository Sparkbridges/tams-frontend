import { getStatusColor, useTamsTable } from '#/lib'
import type {
  TamsTableBulkSelection,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib'
import {
  Badge,
  Center,
  Checkbox,
  Divider,
  EmptyState,
  Group,
  Paper,
  Skeleton,
  Table,
  Text,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { TamsTextInput } from '../forms'
import { TamsButton } from '../buttons'
import {
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
} from '@phosphor-icons/react'
import { TamsPagination } from '#/components/molecules'
import classes from '#/styles/css/modules/Table.module.css'

type TamsTableProps = {
  columns: TamsTableColumn[]
  data: TamsTableData[] | undefined
  placeholder?: string
  empty?: TamsTableEmptyState
  loading?: boolean
  page: number
  setPage?: (page: number) => void
  limit?: number
  search?: string
  setSearch?: (search: string) => void
  total?: number
  bulkSelectionOptions?: TamsTableBulkSelection[]
  filters?: React.ReactNode
  handleRowClick?: (row: TamsTableData) => void
  selectedIds?: string[] | number[]
  tableHeight?: number
  tdClassName?: string
  disablePagination?: boolean
  disableSearch?: boolean
  withHeaders?:boolean
}

type ThProps = {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort: () => void
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? CaretUpIcon
      : CaretDownIcon
    : CaretUpDownIcon
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <div className={'flex items-center gap-3 nowrap'}>
          <Text fw={700} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={'1.5'} />
          </Center>
        </div>
      </UnstyledButton>
    </Table.Th>
  )
}
const TamsTable = ({
  columns,
  data,
  placeholder,
  empty,
  loading,
  page,
  setPage,
  limit = 10,
  search,
  setSearch,
  total,
  bulkSelectionOptions,
  filters,
  handleRowClick,
  selectedIds,
  disablePagination,
  disableSearch,
  withHeaders=true
}: TamsTableProps) => {
  const {
    newData,
    selection,
    toggleRow,
    toggleAll,
    clearSelection,
    sortBy,
    reverseSortDirection,
    setSorting,
  } = useTamsTable({ data, selectedIds })

  const headers = () => (
    <Table.Tr>
      {columns.map((column, i) => {
        if (column.type === 'checkbox') {
          return (
            <Table.Th className="pl-5" key={i}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.size === (data?.length ?? 0)}
                indeterminate={
                  selection.size > 0 && selection.size !== (data?.length ?? 0)
                }
                aria-label="Select all rows"
              />
            </Table.Th>
          )
        }
        if (column.enableSorting) {
          return (
            <Th
              sorted={sortBy === column.accessor}
              reversed={reverseSortDirection}
              onSort={() => setSorting(column.accessor)}
              key={i}
            >
              {column.label}
            </Th>
          )
        }
        return (
          <Table.Th className="min-w-30" key={i}>
            {column.label}
          </Table.Th>
        )
      })}
    </Table.Tr>
  )
  const rows = () =>
    newData?.map((row, rowIndex) => (
      <Table.Tr
        onClick={(e) => {
          e.stopPropagation()
          handleRowClick?.(row)
        }}
        key={rowIndex}
      >
        {columns.map((column, i) => {
          if (column.type === 'checkbox') {
            return (
              <Table.Td className="pl-5" key={i}>
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation()
                    toggleRow(row.id as string)
                  }}
                  checked={selection.has(row.id as string)}
                  aria-label="Select row"
                />
              </Table.Td>
            )
          }
          if (column.accessor === 'status') {
            const statusObject = getStatusColor(row[column.accessor] as string)
            return (
              <Table.Td key={i}>
                <Badge
                  variant={statusObject.variant}
                  color={statusObject.color}
                  size="sm"
                >
                  {row[column.accessor]}
                </Badge>
              </Table.Td>
            )
          }
          if (column.render) {
            return <Table.Td key={i}>{column.render(row)}</Table.Td>
          }
          return (
            <Table.Td miw={column.width} key={i}>
              {row[column.accessor as string]}
            </Table.Td>
          )
        })}
      </Table.Tr>
    ))

  const isLoadingContent = () => {
    return new Array(limit).fill(0).map((_, index) => (
      <Table.Tr key={index}>
        {columns.map((column) => (
          <Table.Td key={column.accessor}>
            <Skeleton height={14} width="100%" />
          </Table.Td>
        ))}
      </Table.Tr>
    ))
  }

  const renderContent = () => {
    if (rows()?.length === 0 && !loading) {
      return (
        <Table.Tr>
          <Table.Td colSpan={columns.length}>{emptyState}</Table.Td>
        </Table.Tr>
      )
    }
    if (loading) {
      return isLoadingContent()
    }
    return rows()
  }

  const emptyState = (
    <EmptyState className="flex items-center justify-center" h={300}>
      <EmptyState.Indicator>
        {typeof empty?.icon === 'string' ? (
          <img
            className="object-cover"
            src={empty.icon}
            alt="empty state icon"
            height={150}
            width={150}
          />
        ) : (
          empty?.icon && <empty.icon />
        )}
      </EmptyState.Indicator>
      <EmptyState.Title>{empty?.title ?? 'No results found'}</EmptyState.Title>
      <EmptyState.Description>
        {empty?.description ??
          "We couldn't find anything matching your search. Try adjusting your filters or searching with different keywords to see more results."}
      </EmptyState.Description>
      <EmptyState.Actions>
        {empty?.actions?.map((action, i) => (
          <TamsButton key={i} variant="default" onClick={action.onClick}>
            {action.label}
          </TamsButton>
        ))}
      </EmptyState.Actions>
    </EmptyState>
  )

  return (
    <>
      <Paper withBorder className={`${!withHeaders ? 'py-0' : 'py-4 space-y-4 rounded-lg'}`}>
        <div className="px-5 flex items-center gap-3 justify-between">
          {!disableSearch && (
            <TamsTextInput
            value={search}
            className="w-4/12"
            onChange={(e) => setSearch?.(e.target.value)}
            radius="xl"
            size="md"
            placeholder={placeholder ?? 'Search...'}
          />)}
          {filters}
        </div>
        <Table.ScrollContainer minWidth={650}>
          <Table
            highlightOnHover={(data?.length as number) > 0}
            verticalSpacing="sm"
          >
            <Table.Thead className="bg-gray-50">{headers()}</Table.Thead>
            <Table.Tbody>{renderContent()}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
       {!disablePagination && (
        <div className="py-4">
          <TamsPagination
            limit={limit}
            page={page}
            total={total}
            onPageChange={setPage ?? (() => {})}
          />
        </div>
       )}
      </Paper>
      <Transition
        mounted={selection.size > 0}
        transition="fade-up"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Paper
            shadow="lg"
            withBorder
            className="flex py-2 px-4 gap-5 items-center rounded-lg fixed left-1/2 z-30 bottom-5 -translate-x-1/2"
            style={styles}
          >
            <p>{selection.size} items selected</p>
            <Divider orientation="vertical" />
            <Group gap={20}>
              <TamsButton
                key="cancel"
                variant="default"
                onClick={clearSelection}
              >
                Cancel
              </TamsButton>
              <Divider orientation="vertical" />
              {bulkSelectionOptions?.map((option, i) => (
                <TamsButton
                  key={i}
                  variant={option.variant ?? 'outline'}
                  color={option.color}
                  onClick={() =>
                    option.action(Array.from(selection) as number[])
                  }
                >
                  {option.label}
                </TamsButton>
              ))}
            </Group>
          </Paper>
        )}
      </Transition>
    </>
  )
}

export default TamsTable
