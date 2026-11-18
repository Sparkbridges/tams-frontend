export const performanceSystemSettingsOptions = [
  {
    label: 'Appraisals',
    value: 'appraisal-settings',
    description: 'Appraisals related settings',
    image: '/images/svg/apraisal.svg',
  },
  /* {
    label: 'Leaves',
    value: 'leaves-settings',
    description: 'Leaves related settings',
    image: '/images/svg/leaves.svg',
  }, */
]

export type AppraisalSettingsTab =
  'general' | 'grading' | 'appraiser' | 'approver'

export const performanceTrainingTypes = [
  { label: 'General', value: 'general' },
  { label: 'Performance Improvement', value: 'performance_improvement' },
]

export const performanceAssignmentCategories = [
  { label: 'Branch', value: 'branch' },
  { label: 'Department', value: 'department' },
  { label: 'Team', value: 'team' },
  { label: 'Employee', value: 'employees' },
  { label: 'Grade', value: 'grade' },
]
