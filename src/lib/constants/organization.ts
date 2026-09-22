import type { TLabelValueWithoutNull } from '../types'

export const RELIGION_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Christianity', value: 'christianity' },
  { label: 'Islam', value: 'islam' },
  { label: 'Other', value: 'other' },
]

export const GENDER_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export const BLOOD_GROUP_TYPES: TLabelValueWithoutNull[] = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
]

export const MARITAL_STATUS_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' },
]

export const GENOTYPE_TYPES: TLabelValueWithoutNull[] = [
  { label: 'AA', value: 'AA' },
  { label: 'AS', value: 'AS' },
  { label: 'SS', value: 'SS' },
  { label: 'AC', value: 'AC' },
  { label: 'SC', value: 'SC' },
  { label: 'CC', value: 'CC' },
  { label: 'Other', value: 'other' },
]

export const IDENTITY_TYPES: TLabelValueWithoutNull[] = [
  { label: 'National ID', value: 'national_id' },
  { label: 'Passport', value: 'passport' },
  { label: 'Driver License', value: 'driver_license' },
  { label: 'Voter Card', value: 'voter_card' },
  { label: 'Other', value: 'other' },
]

export const SALUTATION_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Mr.', value: 'mr' },
  { label: 'Mrs.', value: 'mrs' },
  { label: 'Miss', value: 'miss' },
  { label: 'Dr.', value: 'dr' },
  { label: 'Prof.', value: 'prof' },
  { label: 'Other', value: 'other' },
]

export const EMERGENCY_CONTACT_RELATIONSHIP_TYPES: TLabelValueWithoutNull[] = [
  { label: 'Parent', value: 'parent' },
  { label: 'Sibling', value: 'sibling' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Friend', value: 'friend' },
  { label: 'Other', value: 'other' },
]