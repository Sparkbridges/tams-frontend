import { describe, expect, it } from 'vitest'
import { generateAttendancePdf } from './AttendanceReport'

describe('attendance report PDF', () => {
  it('creates a PDF with attendance-specific metadata and scalar report records', async () => {
    const blob = await generateAttendancePdf({
      title: 'Attendance Summary',
      period: '2026-11-01 to 2026-11-30',
      generatedBy: 'Test Administrator',
      warnings: [
        {
          code: 'active_employees_only',
          message: 'Historical scope uses current employee records.',
        },
        {
          code: 'source_values_passthrough',
          message: 'Source calculation limitation.',
        },
      ],
      columns: [
        { value: 'name', label: 'Employee' },
        { value: 'hours_worked', label: 'Hours worked' },
      ],
      rows: [{ name: 'Ada', hours_worked: '126:30:00' }],
    })
    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(100)
  })
})
