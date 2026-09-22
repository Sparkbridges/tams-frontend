import type z from 'zod'
import {
  emailSchema,
  passwordSchema,
  stringSchema,
  zodObjectSchema,
} from './zod.schema'

const exemptedDomains = ['app', 'signup']
export const companyUrlSchema = zodObjectSchema({
  company_id: stringSchema()
    .trim()
    .min(1, 'Company Url is required')
    .regex(
      /^[a-zA-Z0-9-]+$/,
      'Company Url can only contain letters, numbers, and hyphens',
    )
    .refine((value) => !exemptedDomains.includes(value), {
      message: 'This company URL is not allowed',
    }),
})

export const loginSchema = zodObjectSchema({
  email: emailSchema(),
  password: passwordSchema(),
})

export const AllLoginSchema = zodObjectSchema({
  ...companyUrlSchema.shape,
  ...loginSchema.shape,
})

export const loginSteps = [companyUrlSchema, loginSchema]

export type AllLoginSchemaType = z.infer<typeof AllLoginSchema>
