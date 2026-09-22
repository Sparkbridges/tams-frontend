import z from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const stringSchema = () => z.string()

export const emailSchema = () => z.email('Please enter a valid email address')

export const zodObjectSchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape, { message: 'Invalid input' })

export const dateSchema = (error?: string) =>
  z.coerce.date({
    error: error ?? 'field is required',
  })

export const dateSchema2 = (error = 'Field is required') =>
  z
    .string()
    .nullable()
    .refine((value) => value !== null && value !== '', {
      message: error,
    })
    .pipe(z.coerce.date())

export const passwordSchema = () =>
  z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character',
    )

export const enumSchema = <T extends string[]>(list: T) => z.enum(list)

export const phoneSchema = () =>
  z
    .string()
    .trim()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      'Enter a valid phone number (e.g. +2348012345678)',
    )

export const intlPhoneSchema = (isOptional = false) =>
  stringSchema()
    .optional()
    .refine(
      (val) => {
        if (isOptional && (!val || val.trim() === '')) return true
        return val ? isValidPhoneNumber(val) : false
      },
      {
        message: 'Enter a valid phone number',
      },
    )

export const accountNumberSchema = () =>
  stringSchema()
    .trim()
    .regex(/^\d{10}$/, 'Account number must be exactly 10 digits')

export const cloudinaryUrlSchema = z
  .url('Must be a valid URL')
  .refine((url) => url.includes('cloudinary.com'), {
    message: 'Image must be uploaded via Cloudinary',
  })

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const MB = 1024 * 1024

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const

// ─────────────────────────────────────────
// BASE FACTORY
// ─────────────────────────────────────────
export function createFileSchema({
  maxSizeMB = 5,
  acceptedTypes,
  required = true,
}: {
  maxSizeMB?: number
  acceptedTypes: readonly string[]
  required?: boolean
}) {
  const base = z
    .instanceof(File, { message: 'Please select a file' })
    .refine((f) => f.size > 0, {
      message: 'File cannot be empty',
    })
    .refine((f) => f.size <= maxSizeMB * MB, {
      message: `File must not exceed ${maxSizeMB}MB`,
    })
    .refine((f) => acceptedTypes.includes(f.type), {
      message: `Accepted formats: ${acceptedTypes
        .map((t) => t.split('/')[1].toUpperCase())
        .join(', ')}`,
    })

  return required ? base : base.optional()
}
// ── Reusable helper ───────────────────────────────────────────────────────────
export const createFileOrStringSchema = ({
  maxSizeMB,
  acceptedTypes,
  required = false,
}: {
  maxSizeMB: number
  acceptedTypes: readonly string[]
  required?: boolean
}) => {
  const fileSchema = z
    .instanceof(File)
    .refine((f) => !required || f.size > 0, { message: 'File is required' })
    .refine((f) => f.size <= maxSizeMB * 1024 * 1024, {
      message: `Max file size is ${maxSizeMB}MB`,
    })
    .refine((f) => acceptedTypes.includes(f.type), {
      message: `Accepted types: ${acceptedTypes.join(', ')}`,
    })

  const urlSchema = z.url('Invalid image URL')

  return z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) {
        return undefined
      }
      return value
    },
    required
      ? z.union([urlSchema, fileSchema])
      : z.union([urlSchema, fileSchema]).optional(),
  )
}

export const numberSchema = (error?: string) => z.coerce.number({ error })

export const booleanSchema = () => z.boolean()
