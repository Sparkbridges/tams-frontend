import { millify } from 'millify'
import type { z } from 'zod'
import type { UseFormReturnType } from '@mantine/form'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import type { MillifyOptions } from 'millify/dist/options'
import type { TGetPublicHolidaySettingsData, TLabelValue } from '#/lib/types'
import type { Dayjs } from 'dayjs'
import type { DatePickerPreset } from '@mantine/dates'
import type { AxiosError } from 'axios'

dayjs.extend(utc)
dayjs.extend(timezone)
const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone

export const newDayjs = (date?: string | Date) => dayjs(date).tz(userTz)

export const validateStepForms = <TSchema extends z.ZodObject<z.ZodRawShape>>(
  stepSchema: TSchema,
  form: UseFormReturnType<z.infer<TSchema>>,
): boolean => {
  type TFormValues = z.infer<TSchema>
  const fieldNames = Object.keys(stepSchema.shape) as (keyof TFormValues)[]

  const values = form.getValues()
  const stepValues = Object.fromEntries(
    fieldNames.map((key) => [key, values[key]]),
  )

  const result = stepSchema.safeParse(stepValues)

  if (result.success) {
    // Clear any stale errors for these fields
    fieldNames.forEach((key) => form.clearFieldError(key as string))
    return true
  }

  // Push Zod's field errors into Mantine's form.errors
  const fieldErrors: Partial<Record<keyof TFormValues, string>> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof TFormValues | undefined
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
  }
  form.setErrors(fieldErrors)
  return false
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'approved':
      return { variant: 'light', color: 'green' }
    case 'inactive':
      return { variant: 'light', color: 'red' }
    case 'cancelled':
      return { variant: 'light', color: 'orange' }
    case 'pending':
      return { variant: 'light', color: 'blue' }
    case 'archived':
      return { variant: 'light', color: 'gray' }
    case 'completed':
      return { variant: 'light', color: 'green' }
    case 'scheduled':
      return { variant: 'light', color: 'purple' }
    default:
      return { variant: 'subtle', color: 'gray' }
  }
}

export const documentHelper = ({
  title,
  content,
  name,
}: {
  title: string
  content: string
  name: string
}) => ({
  meta: [
    {
      name,
      content,
    },
    {
      title,
    },
  ],
  links: [
    {
      rel: 'icon',
      href: '/images/tams-logo.ico',
    },
  ],
  styles: [
    {
      media: 'all and (max-width: 500px)',
      children: `p {
                  color: blue;
                  background-color: yellow;
                }`,
    },
  ],
  scripts: [
    {
      src: 'https://www.google-analytics.com/analytics.js',
    },
  ],
})

export const paramsSerializer = (params: Record<string, any>) =>
  Object.entries(params)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => `${key}[]=${encodeURIComponent(v)}`)
        : `${key}=${encodeURIComponent(value)}`,
    )
    .join('&')

export const millifyValue = (
  value: number,
  type: 'bytes' | 'precision',
  precisionValue?: number,
): string => {
  const DEFAULT_OPTIONS: Partial<MillifyOptions> = {}
  if (type === 'bytes') {
    DEFAULT_OPTIONS.units = ['B', 'KB', 'MB', 'GB', 'TB']
    DEFAULT_OPTIONS.space = true
  }
  if (type === 'precision') {
    DEFAULT_OPTIONS.precision = precisionValue ?? 3
    DEFAULT_OPTIONS.lowercase = true
  }
  return millify(value, DEFAULT_OPTIONS)
}

export function normalizeStrings(s: string, type?: 'capitalize' | 'uppercase') {
  const normalized = s
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
  if (type === 'capitalize') {
    return capitalize(normalized)
  }
  if (type === 'uppercase') {
    return normalized.toUpperCase()
  }
  return normalized
}

export function autoMatch(
  headers: string[],
  targetFields: TLabelValue[],
): TLabelValue[] {
  return headers.map((header) => {
    const norm = normalizeStrings(header)
    const match = targetFields.find((f) => {
      const normLabel = normalizeStrings(f.label)
      const normValue = normalizeStrings(f.value as string)
      return (
        normLabel === norm ||
        normValue === norm ||
        norm.includes(normValue) ||
        normValue.includes(norm)
      )
    })

    return { label: header, value: match?.value ?? null }
  })
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const resolvePhoneNumber = (phone: string) => {
  if (!phone) return ''
  return phone.at(0) != '+'
    ? `+${phone}`
    : phone.startsWith('+')
      ? phone.replace(/^\+/, '')
      : (phone.split('-')[1] ?? '')
}

export function getUpcomingHoliday(
  holidays: TGetPublicHolidaySettingsData[],
  fromDate: Dayjs = newDayjs(),
): TGetPublicHolidaySettingsData {
  const today = fromDate.startOf('day')

  return (
    holidays
      ?.filter(
        (h) =>
          h.status !== 'cancelled' && !dayjs(h.date).isBefore(today, 'day'),
      )
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())[0] ??
    null
  )
}

export const getDatePresets = (
  format?: string,
): DatePickerPreset<'default' | 'range'>[] => {
  const today = newDayjs()
  const fmt = format ?? 'YYYY-MM-DD'

  return [
    {
      label: 'Yesterday',
      value: [
        today.subtract(1, 'day').format(fmt),
        today.subtract(1, 'day').format(fmt),
      ],
    },
    { label: 'Today', value: [today.format(fmt), today.format(fmt)] },
    {
      label: 'Tomorrow',
      value: [today.add(1, 'day').format(fmt), today.add(1, 'day').format(fmt)],
    },
    {
      label: 'Next month',
      value: [today.format(fmt), today.add(1, 'month').format(fmt)],
    },
    {
      label: 'Next year',
      value: [today.format(fmt), today.add(1, 'year').format(fmt)],
    },
    {
      label: 'Last month',
      value: [today.subtract(1, 'month').format(fmt), today.format(fmt)],
    },
    {
      label: 'Last year',
      value: [today.subtract(1, 'year').format(fmt), today.format(fmt)],
    },
  ]
}

const normalizeDate = (d: string | null | undefined, fmt: string) =>
  d ? newDayjs(d).format(fmt) : null

export function getPresetLabel(
  dates: (string | null)[] | null | undefined,
  fmt = 'YYYY-MM-DD',
): string | null {
  if (!dates || dates.length === 0) return null
  const presets = getDatePresets()

  const start = normalizeDate(dates[0], fmt)
  // A single date is treated as a one-day range
  const end = normalizeDate(dates[1] ?? dates[0], fmt)

  if (!start || !end) return null // incomplete range

  const match = presets.find((preset) => {
    const [pStart, pEnd] = Array.isArray(preset.value)
      ? preset.value
      : [preset.value, preset.value]

    return (
      normalizeDate(pStart, fmt) === start && normalizeDate(pEnd, fmt) === end
    )
  })

  return (match?.label as string) ?? 'custom range'
}

export const getErrorMessage = (error: any): string => {
  const errorMessage =
    (error as AxiosError<{ message: string }>)?.response?.data?.message ??
    (error as Error).message
  return errorMessage
}
