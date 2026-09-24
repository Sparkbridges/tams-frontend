import * as XLSX from 'xlsx'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import type { TamsTableColumn, TamsTableData } from '../types'
import { usePDF, Margin } from 'react-to-pdf'

type ExportToPDFResult = {
  filename?: string
}
const useDownloadAs = ({ filename }: ExportToPDFResult) => {
  const { targetRef } = usePDF({
    filename,
    page: { format: 'a4', orientation: 'portrait', margin: Margin.SMALL },
  })
  const exportableColumns = (columns: TamsTableColumn[]) =>
    columns.filter((c) => c.type !== 'checkbox' && c.accessor !== 'actions')

  const rowsForExport = (columns: TamsTableColumn[], data: TamsTableData[]) => {
    const cols = exportableColumns(columns)
    return data.map((row) =>
      Object.fromEntries(cols.map((c) => [c.label, row[c.accessor] ?? ''])),
    )
  }
  const exportTableCSV = (
    columns: TamsTableColumn[],
    data: TamsTableData[],
    name = 'export',
  ) => {
    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: name })
    download(csvConfig)(
      generateCsv(csvConfig)(rowsForExport(columns, data) as any),
    )
  }

  const exportTableXLSX = (
    columns: TamsTableColumn[],
    data: TamsTableData[],
    name = 'export.xlsx',
  ) => {
    const ws = XLSX.utils.json_to_sheet(rowsForExport(columns, data))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, name)
  }

  async function downloadPdf(blob: Blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'personnel-biometrics-report.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }
  return { exportTableCSV, exportTableXLSX, downloadPdf, targetRef }
}

export default useDownloadAs
