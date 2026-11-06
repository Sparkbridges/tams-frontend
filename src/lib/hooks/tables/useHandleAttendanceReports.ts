import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import * as XLSX from 'xlsx'
import {
  useAttendanceReport,
  useAttendanceReportAccess,
} from '#/lib/api/services/attendanceReports'
import attendanceReportsClient from '#/lib/api/client/attendanceReports'
import {
  attendanceEmployeeColumns,
  attendanceOvertimeTotalColumns,
  attendanceReportTypes,
} from '#/lib/constants/attendanceReports'
import type {
  AttendanceReportParams,
  AttendanceReportRecord,
} from '#/lib/types/api/attendanceReports'
import {
  attendanceExportRows,
  flattenAttendanceReports,
  reportCell,
} from '#/lib/utils/helpers/attendanceReports'
import { getErrorMessage } from '#/lib/utils'
import { useTamsStore } from '#/lib/store'
import { generateAttendancePdf } from '#/components/organisms/printable/AttendanceReport'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export default function useHandleAttendanceReports(
  params?: AttendanceReportParams,
) {
  const allowed = useAttendanceReportAccess()
  const user = useTamsStore((state) => state.user)
  const query = useAttendanceReport(params ?? null)
  const [selectedRow, setSelectedRow] = useState<AttendanceReportRecord | null>(
    null,
  )
  const definition = attendanceReportTypes.find(
    (report) => report.value === params?.type,
  )
  const columns = useMemo(
    () => [
      ...attendanceEmployeeColumns.filter(
        (column) =>
          column.value === 'name' ||
          column.value === 'pin' ||
          params?.columns.includes(column.value),
      ),
      ...(params?.type === 'overtime' && params.hourly_view
        ? attendanceOvertimeTotalColumns
        : (definition?.columns ?? [])),
    ],
    [definition, params?.columns, params?.type, params?.hourly_view],
  )
  const rows = useMemo(
    () =>
      query.data && params
        ? flattenAttendanceReports(query.data.data.results, params.type)
        : [],
    [query.data, params],
  )
  const tableData = useMemo(
    () =>
      rows.map((row, index) => ({
        id: String(index),
        ...Object.fromEntries(
          columns.map((column) => [
            column.value,
            reportCell(row[column.value]),
          ]),
        ),
      })),
    [rows, columns],
  )
  const exportReport = useMutation({
    mutationFn: async (format: 'csv' | 'xlsx' | 'pdf') => {
      if (
        !params ||
        !definition ||
        !allowed.some((report) => report.value === params.type)
      )
        throw new Error('Generate an accessible report before exporting')
      const filename = `${params.type}-attendance-${params.date_from}-${params.date_to}.${format}`
      if (format === 'csv') {
        const response = await attendanceReportsClient.download(params)
        const blob = await attendanceReportsClient.file(response.data)
        downloadBlob(blob, filename)
        return
      }
      const response = await attendanceReportsClient.generate({
        ...params,
        page: 'all',
      })
      const records = flattenAttendanceReports(
        response.data.results,
        params.type,
      )
      if (!records.length)
        throw new Error('No matching report records to export')
      if (format === 'xlsx') {
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(
          workbook,
          XLSX.utils.json_to_sheet(attendanceExportRows(records, columns)),
          'Attendance',
        )
        XLSX.utils.book_append_sheet(
          workbook,
          XLSX.utils.json_to_sheet([
            { Field: 'Report', Value: definition.label },
            {
              Field: 'Period',
              Value: `${params.date_from} to ${params.date_to}`,
            },
            { Field: 'Grouping', Value: params.group_by },
            ...(response.data.warnings ?? []).map((warning) => ({
              Field: 'Warning',
              Value: warning.message,
            })),
          ]),
          'Report information',
        )
        XLSX.writeFile(workbook, filename)
      } else {
        const blob = await generateAttendancePdf({
          title: `${definition.label} Attendance Report`,
          period: `${params.date_from} to ${params.date_to}`,
          generatedBy: user
            ? `${user.employee.first_name} ${user.employee.last_name}`
            : 'TAMS user',
          rows: records,
          columns,
          warnings: response.data.warnings,
        })
        downloadBlob(blob, filename)
      }
    },
    onError: (error) =>
      notifications.show({
        title: 'Report export failed',
        message: getErrorMessage(error),
        color: 'red',
      }),
    onSuccess: () =>
      notifications.show({
        title: 'Report exported',
        message: 'All matching report records were exported.',
        color: 'green',
      }),
  })
  return {
    allowed,
    query,
    definition,
    columns,
    rows,
    tableData,
    selectedRow,
    setSelectedRow,
    exportReport,
  }
}
