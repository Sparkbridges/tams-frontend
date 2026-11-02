import { z } from 'zod/v4'
import { numberSchema, stringSchema, zodObjectSchema } from './zod.schema'

const requiredId = stringSchema().regex(/^[1-9]\d*$/, 'Select an option')

export const attendanceDeviceSchema = zodObjectSchema({
  branch_id: requiredId,
  device_type_id: requiredId,
  alias: stringSchema().trim().min(1, 'Enter a device alias'),
  serial_no: stringSchema().trim().nonempty('Enter a serial number'),
  timezone: stringSchema().min(1, 'Select a time zone'),
})
export const createAttendanceDeviceSchema = attendanceDeviceSchema.extend({
  license: stringSchema().trim().min(1, 'Enter a device license'),
})

export const editAttendanceDeviceSchema = attendanceDeviceSchema.extend({
  license: stringSchema().trim().optional(),
})

export const attendanceTransferSchema = zodObjectSchema({
  command_type: z.enum(['USER_FP_TRANSFER', 'MOVE_USER', 'USER_TRANSFER']),
  devices: stringSchema().trim().optional(),
  employees: z
    .array(numberSchema().int().positive())
    .min(1, 'Select at least one employee'),
  access: z.enum(['supervisor', 'admin']).optional(),
})
  .refine(
    (values) => values.command_type === 'USER_TRANSFER' || !!values.devices,
    {
      path: ['devices'],
      message: 'Select a destination device',
    },
  )
  .refine(
    (values) => values.command_type !== 'USER_TRANSFER' || !!values.access,
    {
      path: ['access'],
      message: 'Select an access level',
    },
  )

export const attendanceBulkTransferSchema = zodObjectSchema({
  device_from: stringSchema().min(1, 'Select a source device'),
  devices_to: z
    .array(stringSchema().min(1))
    .min(1, 'Select a destination device'),
}).refine((values) => !values.devices_to.includes(values.device_from), {
  path: ['devices_to'],
  message: 'Source and destination devices must be different',
})
