import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from '@react-pdf/renderer'
import type {
  AttendanceReportColumn,
  AttendanceReportRecord,
  AttendanceReportWarning,
} from '#/lib/types/api/attendanceReports'
import { reportCell } from '#/lib/utils/helpers/attendanceReports'

const styles = StyleSheet.create({
  page: {
    padding: 32,
    paddingBottom: 52,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0F172A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  brandRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  logo: { width: 70, height: 70, objectFit: 'contain' },
  brandName: { fontSize: 13, fontWeight: 700 },
  brandSub: { fontSize: 8, color: '#64748B', marginTop: 2 },
  badge: {
    fontSize: 7,
    fontWeight: 700,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
  },
  metaText: { fontSize: 7, color: '#64748B', marginTop: 4 },
  titleBlock: { marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 700, textTransform: 'uppercase' },
  subtitle: { fontSize: 8, color: '#64748B', marginTop: 4 },
  metaGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metaCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 8,
  },
  metaLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: { fontSize: 8, fontWeight: 700 },
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  summaryCell: { flex: 1 },
  summaryLabel: { fontSize: 7, color: '#64748B' },
  summaryValue: {
    fontSize: 11,
    fontWeight: 700,
    color: '#016AEA',
    marginTop: 2,
  },
  warnings: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  warning: { fontSize: 8, color: '#92400E', marginTop: 4 },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 4 },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 6,
  },
  rowAlt: { backgroundColor: '#F8FAFC' },
  cell: { fontSize: 8, paddingHorizontal: 6, color: '#475569' },
  cellBold: { fontWeight: 700, color: '#0F172A' },
  header: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  headerCell: {
    fontSize: 7,
    fontWeight: 700,
    color: '#334155',
    textTransform: 'uppercase',
    paddingHorizontal: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 6,
  },
})

type AttendancePdfProps = {
  title: string
  period: string
  generatedBy: string
  rows: AttendanceReportRecord[]
  columns: AttendanceReportColumn[]
  warnings?: AttendanceReportWarning[]
  company?: { legal_name?: string | null; company_logo?: string }
  scope?: string
  grouping?: 'date' | 'employee'
  generatedAt?: Date
  reportCategory?: 'Attendance' | 'Performance'
}

export function AttendancePdfDocument({
  title,
  period,
  generatedBy,
  rows,
  columns,
  warnings = [],
  company,
  scope,
  grouping,
  generatedAt = new Date(),
  reportCategory = 'Attendance',
}: AttendancePdfProps) {
  const appName = import.meta.env.VITE_APP_NAME || 'TAMS'
  const dateStr = generatedAt.toLocaleDateString('en-GB')
  const timeStr = generatedAt.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const columnWidth = { width: `${100 / columns.length}%` }

  return (
    <Document title={title} author={generatedBy}>
      <Page size="A3" orientation="landscape" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            {company?.company_logo && (
              <Image src={company.company_logo} style={styles.logo} />
            )}
            <View>
              <Text style={styles.brandName}>
                {company?.legal_name || appName}
              </Text>
              <Text style={styles.brandSub}>{appName}</Text>
              {import.meta.env.VITE_APP_LOCATION && (
                <Text style={styles.brandSub}>
                  {import.meta.env.VITE_APP_LOCATION}
                </Text>
              )}
            </View>
          </View>
          <View>
            <Text style={styles.badge}>
              OFFICIAL / {reportCategory.toUpperCase()}
            </Text>
            <Text style={styles.metaText}>
              Generated: {dateStr} / {timeStr}
            </Text>
          </View>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {reportCategory} records for the selected workforce criteria.
          </Text>
        </View>
        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Scope of Data</Text>
            <Text style={styles.metaValue}>
              {scope || 'Selected workforce criteria'}
            </Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Generated By</Text>
            <Text style={styles.metaValue}>{generatedBy}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>
              {reportCategory === 'Attendance'
                ? 'Attendance Period'
                : 'Appraisal Year'}
            </Text>
            <Text style={styles.metaValue}>{period}</Text>
          </View>
        </View>
        <View style={styles.summaryStrip}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryLabel}>Exported Records</Text>
            <Text style={styles.summaryValue}>{rows.length}</Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryLabel}>Report Columns</Text>
            <Text style={styles.summaryValue}>{columns.length}</Text>
          </View>
          {grouping && (
            <View style={styles.summaryCell}>
              <Text style={styles.summaryLabel}>Grouping</Text>
              <Text style={styles.summaryValue}>
                {grouping === 'date' ? 'Date' : 'Employee'}
              </Text>
            </View>
          )}
        </View>
        {warnings.length > 0 && (
          <View style={styles.warnings}>
            <Text style={styles.metaLabel}>
              Report Warnings and Limitations
            </Text>
            {warnings.map((warning, index) => (
              <Text style={styles.warning} key={`${warning.code}-${index}`}>
                {warning.message}
              </Text>
            ))}
          </View>
        )}
        <View style={styles.table}>
          <View style={[styles.row, styles.header]} fixed>
            {columns.map((column) => (
              <Text style={[styles.headerCell, columnWidth]} key={column.value}>
                {column.label}
              </Text>
            ))}
          </View>
          {rows.map((row, index) => (
            <View
              style={[styles.row, index % 2 ? styles.rowAlt : {}]}
              key={index}
              wrap={false}
            >
              {columns.map((column) => (
                <Text
                  style={[
                    styles.cell,
                    columnWidth,
                    column.value === 'name' ? styles.cellBold : {},
                  ]}
                  key={column.value}
                >
                  {String(reportCell(row[column.value]))}
                </Text>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.footer} fixed>
          <Text>{appName} / Confidential</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}

export async function generateAttendancePdf(props: AttendancePdfProps) {
  return pdf(<AttendancePdfDocument {...props} />).toBlob()
}
