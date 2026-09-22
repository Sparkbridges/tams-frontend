import {
  BLOOD_GROUP_TYPES,
  GENDER_TYPES,
  GENOTYPE_TYPES,
  IDENTITY_TYPES,
  MARITAL_STATUS_TYPES,
  RELIGION_TYPES,
  SALUTATION_TYPES,
} from '#/lib/constants'
import type z from 'zod'
import {
  booleanSchema,
  createFileOrStringSchema,
  dateSchema,
  dateSchema2,
  emailSchema,
  enumSchema,
  intlPhoneSchema,
  numberSchema,
  stringSchema,
  zodObjectSchema,
} from './zod.schema'

export const createBranchSchema = zodObjectSchema({
  branch_name: stringSchema().nonempty('Branch name is required'),
  branch_type_id: numberSchema().min(1, 'Branch type is required'),
  parent_branch_id: numberSchema(),
  address: stringSchema().nonempty('Address is required'),
  branch_alt_phone_no: intlPhoneSchema(true),
  branch_head_id: numberSchema().positive('Branch head is required'),
  branch_phone_no: intlPhoneSchema(),
  city: stringSchema().nonempty('City is required'),
  country: stringSchema().nonempty('Country is required'),
  description: stringSchema(),
  state: stringSchema().nonempty('State is required'),
  search_branch_head: stringSchema(),
})

export type TCreateBranchSchema = typeof createBranchSchema

export const createDepartmentSchema = zodObjectSchema({
  branch_id: numberSchema('Branch is required').nonoptional(),
  department_head_id: numberSchema().min(1, 'Department head is required'),
  department_name: stringSchema().nonempty('Department name is required'),
  parent_department_id: numberSchema(),
  is_generic: numberSchema().min(0),
  notes: stringSchema(),
  search_branch_head: stringSchema(),
})

export type TCreateDepartmentSchema = typeof createDepartmentSchema

export const createTeamSchema = zodObjectSchema({
  branch_id: numberSchema('Branch is required').nonoptional(),
  description: stringSchema(),
  team_head_id: numberSchema().min(1, 'Team head is required'),
  team_members: stringSchema().array(),
  team_name: stringSchema().nonempty('Team name is required'),
  search_branch_head: stringSchema(),
})

export const createEmployeeSchema = zodObjectSchema({
  first_name: stringSchema().nonempty('First name is required'),
  last_name: stringSchema().nonempty('Last name is required'),
  email: emailSchema(),
  gender: enumSchema(GENDER_TYPES.map((gender) => gender.value) as string[]),
  date_of_birth: dateSchema2('Date of birth is required'),
  login_access: booleanSchema().optional().default(true),
  blood_group: enumSchema(
    BLOOD_GROUP_TYPES.map((bloodGroup) => bloodGroup.value) as string[],
  ),
  nationality: stringSchema(),
  religion: enumSchema(
    RELIGION_TYPES.map((religion) => religion.value) as string[],
  ),
  marital_status: enumSchema(
    MARITAL_STATUS_TYPES.map((status) => status.value) as string[],
  ),
  employee_type_id: numberSchema().nullable(),
  pin: numberSchema().nullable(),
  employee_category_id: numberSchema().nullable(),
  employee_designation_id: numberSchema().nullable(),
  employee_grade_id: numberSchema().nullable(),
  branch_id: numberSchema().min(1, 'Branch is required'),
  department_id: numberSchema().min(1, 'Department is required'),
  custom_employee_id: stringSchema().optional(),
  state: stringSchema().nonempty('State is required'),
  local_government: stringSchema().nonempty('Local government is required'),
  genotype: enumSchema(
    GENOTYPE_TYPES.map((genotype) => genotype.value) as string[],
  ),
  mobile_number: intlPhoneSchema(),
  next_of_kin: stringSchema(),
  last_employment_date: dateSchema(),
  last_employer: stringSchema(),
  guarantor_name: stringSchema(),
  guarantor_phone_number: intlPhoneSchema(true),
  last_qualification: stringSchema(),
  appointment_date: dateSchema2('Appointment date is required'),
  qualification_date: dateSchema2(),
  account_name: stringSchema(),
  account_number: stringSchema()
    .nonempty('Account number is required')
    .max(10, 'Account number cannot exceed 20 characters'),
  bank_code: stringSchema().nonempty('Bank code is required'),
  country: stringSchema().nonempty('Country is required'),
  city: stringSchema().nonempty('City is required'),
  salutation: enumSchema(
    SALUTATION_TYPES.map((salutation) => salutation.value) as string[],
  ),
  address: stringSchema().nonempty('Address is required'),
  picture: createFileOrStringSchema({
    acceptedTypes: ['image/jpeg', 'image/png'],
    maxSizeMB: 2,
    required: false,
  }),
  bank_id: numberSchema().min(1, 'Bank is required'),
  roles: numberSchema().array().nonempty('At least one role is required'),
  pension_fund_administrator: stringSchema(),
  rsa_pin: stringSchema(),
  tax_id: stringSchema(),
  tax_location: stringSchema(),
  staff_id: stringSchema(),
  alt_mobile_number: intlPhoneSchema(true),
  means_of_identity: enumSchema(
    IDENTITY_TYPES.map((identity) => identity.value) as string[],
  ),
  id_no: stringSchema().nonempty('ID Number is required'),
  id_expiration: dateSchema2('ID expiration date is required'),
  emergency_contact_name: stringSchema(),
  emergency_contact_rel: stringSchema(),
  emergency_contact_no: intlPhoneSchema(true),
  emergency_contact_address: stringSchema(),
})

export const updateEmployeeSchema = zodObjectSchema({
  ...createEmployeeSchema.shape,
  id: numberSchema().min(1, 'Employee ID is required'),
  picture: createFileOrStringSchema({
    acceptedTypes: ['image/jpeg', 'image/png'],
    maxSizeMB: 2,
    required: false,
  }),
})

export type TCreateEmployeePayload = z.infer<typeof createEmployeeSchema>

export type TUpdateEmployeePayload = z.infer<typeof updateEmployeeSchema>
