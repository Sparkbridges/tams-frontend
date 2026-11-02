import { describe, expect, it } from 'vitest'
import {
  attendanceBulkTransferSchema,
  attendanceDeviceSchema,
  attendanceTransferSchema,
  createAttendanceDeviceSchema,
} from './attendance.schema'
import { attendanceTimezones } from '#/lib/constants/attendance'

const device = {
  branch_id: '4',
  device_type_id: '2',
  alias: 'Reception',
  serial_no: 'SN-100',
  timezone: '90',
}

describe('attendance device validation', () => {
  it('requires a license on create, but not on edit', () => {
    expect(createAttendanceDeviceSchema.safeParse(device).success).toBe(false)
    expect(
      createAttendanceDeviceSchema.safeParse({ ...device, license: 'license' })
        .success,
    ).toBe(true)
    expect(attendanceDeviceSchema.safeParse(device).success).toBe(true)
  })

  it.each(['branch_id', 'device_type_id', 'alias', 'serial_no', 'timezone'])(
    'rejects an empty %s',
    (field) => {
      expect(
        attendanceDeviceSchema.safeParse({ ...device, [field]: '' }).success,
      ).toBe(false)
    },
  )

  it.each(['0', '-1', '1.5', 'abc'])(
    'rejects invalid option IDs: %s',
    (branch_id) => {
      expect(
        attendanceDeviceSchema.safeParse({ ...device, branch_id }).success,
      ).toBe(false)
    },
  )

  it('retains legacy integer-hour and half-hour API encodings', () => {
    expect(attendanceTimezones).toContainEqual({
      value: '1',
      label: 'Etc/GMT+1',
    })
    expect(attendanceTimezones).toContainEqual({
      value: '90',
      label: 'Etc/GMT+1:30',
    })
    expect(attendanceTimezones).toContainEqual({
      value: '-750',
      label: 'Etc/GMT-12:30',
    })
    expect(new Set(attendanceTimezones.map((zone) => zone.value)).size).toBe(
      attendanceTimezones.length,
    )
  })
})

describe('attendance user commands', () => {
  const transfer = {
    employees: [42],
    devices: 'SN-200',
    command_type: 'USER_FP_TRANSFER',
  }

  it('requires a single device serial in the form rather than an API array', () => {
    const devices = ['SN-200', 'SN-300']
    expect(
      attendanceTransferSchema.safeParse({
        ...transfer,
        devices,
        command_type: 'MOVE_USER',
      }).success,
    ).toBe(false)
    expect(
      attendanceTransferSchema.safeParse({ ...transfer, devices }).success,
    ).toBe(false)
  })

  it.each(['USER_FP_TRANSFER', 'MOVE_USER'])(
    'rejects empty and whitespace-only destinations for %s',
    (command_type) => {
      for (const devices of [undefined, '', '   ']) {
        const result = attendanceTransferSchema.safeParse({
          ...transfer,
          command_type,
          access: 'admin',
          devices,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toContainEqual(
            expect.objectContaining({
              path: ['devices'],
              message: 'Select a destination device',
            }),
          )
        }
      }
    },
  )

  it.each(['USER_FP_TRANSFER', 'MOVE_USER'])(
    'accepts %s without changing access',
    (command_type) => {
      expect(
        attendanceTransferSchema.safeParse({ ...transfer, command_type })
          .success,
      ).toBe(true)
    },
  )

  it('requires access for access changes', () => {
    const change = { ...transfer, command_type: 'USER_TRANSFER' }
    expect(attendanceTransferSchema.safeParse(change).success).toBe(false)
    expect(
      attendanceTransferSchema.safeParse({ ...change, access: 'supervisor' })
        .success,
    ).toBe(true)
    expect(
      attendanceTransferSchema.safeParse({ ...change, access: 'admin' })
        .success,
    ).toBe(true)
  })

  it.each([undefined, '', '   '])(
    'allows access changes without a destination: %j',
    (devices) => {
      expect(
        attendanceTransferSchema.safeParse({
          ...transfer,
          command_type: 'USER_TRANSFER',
          access: 'admin',
          devices,
        }).success,
      ).toBe(true)
    },
  )

  it.each([
    { employees: [] },
    { employees: [0] },
    { employees: [-1] },
    { employees: [1.5] },
  ])('rejects invalid employee selections %j', ({ employees }) => {
    expect(
      attendanceTransferSchema.safeParse({ ...transfer, employees }).success,
    ).toBe(false)
  })

  it('requires distinct source and destination devices for whole-device transfer', () => {
    expect(
      attendanceBulkTransferSchema.safeParse({
        device_from: '',
        devices_to: [],
      }).success,
    ).toBe(false)
    expect(
      attendanceBulkTransferSchema.safeParse({
        device_from: 'SN-100',
        devices_to: ['SN-100'],
      }).success,
    ).toBe(false)
    expect(
      attendanceBulkTransferSchema.safeParse({
        device_from: 'SN-100',
        devices_to: ['SN-200'],
      }).success,
    ).toBe(true)
  })
})
