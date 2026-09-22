import { millify } from 'millify'
import type { z } from 'zod'
import type { UseFormReturnType } from '@mantine/form'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import type { MillifyOptions } from 'millify/dist/options'
import type { TLabelValue } from '#/lib/types'

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
      return { variant: 'light', color: 'green' }
    case 'inactive':
      return { variant: 'light', color: 'red' }
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
      href: '/favicon.ico',
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

export function normalize(s: string) {
  return s.replace(/[_\-]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
}

export function autoMatch(
  headers: string[],
  targetFields: TLabelValue[],
): TLabelValue[] {
  return headers.map((header) => {
    const norm = normalize(header)
    const match = targetFields.find((f) => {
      const normLabel = normalize(f.label)
      const normValue = normalize(f.value as string)
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
