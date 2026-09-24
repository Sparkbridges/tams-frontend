import { newDayjs, useTamsStore } from '#/lib'
import type { TamsTableColumn, TamsTableData } from '#/lib'
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  pdf,
  Image,
} from '@react-pdf/renderer'

type PersonnelPdfDocumentProps = {
  records: TamsTableData[]
  generatedBy: { name: string; role: string; id: string }
  auditor: { name: string; title: string }
  referenceNumber: string
  generatedAt: Date
  columns: TamsTableColumn[]
  dateFilter?: string
  dateRange?: [Date | null, Date | null]
}

const colors = {
  brand600: '#016AEA',
  brand50: '#EFF6FF',
  brand100: '#DBEAFE',
  slate900: '#0F172A',
  slate700: '#334155',
  slate500: '#64748B',
  slate600: '#475569',
  slate400: '#94A3B8',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  blue50: '#EFF6FF',
  blue700: '#1D4ED8',
  blue200: '#BFDBFE',
  purple50: '#FAF5FF',
  purple700: '#7E22CE',
  purple200: '#E9D5FF',
  emerald50: '#ECFDF5',
  emerald700: '#047857',
  white: '#FFFFFF',
}

const s = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.slate900,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.slate200,
    paddingBottom: 16,
    marginBottom: 16,
  },
  brandRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  brandBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.brand600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBoxText: { color: colors.white, fontWeight: 700, fontSize: 14 },
  brandName: { fontWeight: 700, fontSize: 13, color: colors.slate900 },
  brandSub: { fontSize: 8, color: colors.slate500, marginTop: 2 },
  badge: {
    fontSize: 7,
    fontWeight: 700,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgeDark: { backgroundColor: colors.slate900, color: colors.white },
  badgeVerified: {
    backgroundColor: colors.emerald50,
    color: colors.emerald700,
    borderWidth: 1,
    borderColor: colors.emerald50,
  },
  refText: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.slate700,
    marginTop: 4,
  },
  metaText: { fontSize: 7, color: colors.slate500, marginTop: 2 },
  titleBlock: { marginBottom: 12 },
  titleText: { fontSize: 16, fontWeight: 700, textTransform: 'uppercase' },
  titleSub: { fontSize: 8, color: colors.slate500, marginTop: 4 },
  metaGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metaCard: {
    flex: 1,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 6,
    padding: 8,
  },
  metaLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: colors.slate500,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: { fontSize: 8, fontWeight: 700, color: colors.slate900 },
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: colors.brand50,
    borderWidth: 1,
    borderColor: colors.brand100,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  summaryCell: { flex: 1 },
  summaryLabel: { fontSize: 7, color: colors.slate500 },
  summaryValue: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.brand600,
    marginTop: 2,
  },

  table: { borderWidth: 1, borderColor: colors.slate200, borderRadius: 4 },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: colors.slate100,
    borderBottomWidth: 1,
    borderColor: colors.slate200,
    paddingVertical: 6,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: colors.slate700,
    textTransform: 'uppercase',
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.slate100,
    paddingVertical: 6,
  },
  tableRowAlt: { backgroundColor: colors.slate50 },
  cell: { fontSize: 8, paddingHorizontal: 6, color: colors.slate600 },
  cellBold: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.slate900,
    paddingHorizontal: 6,
  },
  cellMono: { fontSize: 7, color: colors.slate500, paddingHorizontal: 6 },

  colPin: { width: '8%', textAlign: 'center' },
  colEmployee: { width: '20%' },
  colEmail: { width: '20%' },
  colType: { width: '10%', alignItems: 'center' },
  colGrade: { width: '14%' },
  colGender: { width: '8%', textAlign: 'center' },
  colDept: { width: '10%' },
  colBranch: { width: '10%' },

  pageFooter: {
    position: 'absolute',
    bottom: 24,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: colors.slate400,
    borderTopWidth: 1,
    borderColor: colors.slate100,
    paddingTop: 6,
  },
})

export default function PersonnelPdfDocument({
  records,
  generatedBy,
  referenceNumber,
  generatedAt,
  columns,
  dateFilter,
  dateRange,
}: PersonnelPdfDocumentProps) {
  const { companyDetails } = useTamsStore()
  const dateStr = generatedAt.toLocaleDateString('en-GB')
  const timeStr = generatedAt.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Document>
      <Page size="A4" style={s.page} wrap>
        {/* Document header — flows once, at the top of page 1 only */}
        <View style={s.headerRow}>
          <View style={s.brandRow}>
            <View>
              <Image
                src={companyDetails?.company_logo}
                style={{ width: 70, height: 70 }}
              />
            </View>
            <View>
              <Text style={s.brandName}>{companyDetails?.legal_name}</Text>
              <Text style={s.brandSub}>{import.meta.env.VITE_APP_NAME}</Text>
              <Text style={s.brandSub}>
                {import.meta.env.VITE_APP_LOCATION}
              </Text>
            </View>
          </View>
          <View>
            <Text style={[s.badge, s.badgeDark]}>
              OFFICIAL / INTERNAL AUDIT
            </Text>
            <Text style={[s.badge, s.badgeVerified, { marginTop: 3 }]}>
              VERIFIED SYNC
            </Text>
            <Text style={s.refText}>REF: {referenceNumber}</Text>
            <Text style={s.metaText}>
              Generated: {dateStr} • {timeStr} WAT
            </Text>
          </View>
        </View>

        <View style={s.titleBlock}>
          <Text style={s.titleText}>Workforce & Employee Report</Text>
          <Text style={s.titleSub}>
            Consolidated personnel directory, branch allocations, cadre grades,
          </Text>
        </View>

        <View style={s.metaGrid}>
          <View style={s.metaCard}>
            <Text style={s.metaLabel}>Scope of Data</Text>
            <Text style={s.metaValue}>
              All Branches ({records.length} Active Records)
            </Text>
          </View>
          <View style={s.metaCard}>
            <Text style={s.metaLabel}>Generated By</Text>
            <Text style={s.metaValue}>{generatedBy.name}</Text>
            <Text style={s.metaText}>
              {generatedBy.role} • {generatedBy.id}
            </Text>
          </View>
          <View style={s.metaCard}>
            <Text style={s.metaLabel}>Biometrics Engine</Text>
            <Text style={[s.metaValue, { color: colors.emerald700 }]}>
              100% ADMS Synchronized
            </Text>
          </View>
        </View>

        <View style={s.summaryStrip}>
          <View style={s.summaryCell}>
            <Text style={s.summaryLabel}>Headcount in Scope</Text>
            <Text style={s.summaryValue}>{records.length} Employees</Text>
          </View>
          <View style={s.summaryCell}>
            <Text style={s.summaryLabel}>Date filter</Text>
            <Text
              style={[s.summaryValue, { fontSize: 8, color: colors.slate900 }]}
            >
              {dateFilter === 'custom_range' && dateRange
                ? `${newDayjs(dateRange[0] as Date).format('YYYY-MM-DD')} to ${newDayjs(dateRange[1] as Date).format('YYYY-MM-DD')}`
                : ''}

              {dateFilter === 'last_30_days' ? 'Last 30 Days' : ''}
              {dateFilter === 'all' && 'All Time'}
            </Text>
          </View>
        </View>

        {/* Table — repeats header row on every new page via `fixed` */}
        <View style={s.table}>
          <View style={s.tableHeaderRow} fixed>
            {columns.map((c, index) => (
              <Text
                style={[
                  s.tableHeaderCell,
                  { width: 100 / columns.length + '%' },
                ]}
                key={c.accessor + index}
              >
                {c.label}
              </Text>
            ))}
          </View>

          {records.map((r, i) => (
            <View
              key={i}
              style={[s.tableRow, i % 2 ? s.tableRowAlt : {}]}
              wrap={false} // keeps a single row from splitting across a page break
            >
              {columns.map((c, index) => {
                if (!r[c.accessor]) {
                  return null
                }
                if (c.accessor === 'name') {
                  return (
                    <Text
                      style={[
                        s.cellBold,
                        { width: 100 / columns.length + '%' },
                      ]}
                      key={c.accessor + index}
                    >
                      {r[c.accessor]}
                    </Text>
                  )
                }
                return (
                  <Text
                    style={[s.cellMono, { width: 100 / columns.length + '%' }]}
                    key={c.accessor + index}
                  >
                    {r[c.accessor]}
                  </Text>
                )
              })}
            </View>
          ))}
        </View>

        {/* Footer with live page numbers — fixed, renders on every page */}
        <View style={s.pageFooter} fixed>
          <Text>{import.meta.env.VITE_APP_NAME} • Confidential</Text>
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

export const generatePersonnelPdfBlob = (props: PersonnelPdfDocumentProps) =>
  pdf(<PersonnelPdfDocument {...props} />).toBlob()
