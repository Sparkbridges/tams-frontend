export const ENDPOINTS = {
  // auth
  verifyCompanyUrl: '/auth/company/verify',
  login: '/auth/login',
  logout: '/auth/logout',
  getUser: '/user',

  // dashboard routes
  fetchEmployeeHomeDetails: '/home/admin',

  // attendance
  fetchAttendanceDashboardPunctuality: '/attendance/dashboard/punctuality',

  // organization routes
  searchOrganizationEmployees: '/organization/employees/search',
  branches: '/organization/branches',
  deleteBulkBranches: '/organization/branches/delete',
  branchTypes: '/branch-types',
  countries: '/countries',
  states: '/states',
  cities: '/cities',
  department: '/organization/departments',
  deleteDepartment: '/organization/departments/delete',
  teams: '/organization/teams',
  deleteTeam: '/organization/teams/delete',
  employees: '/organization/employees',
  employeesArchiveCount: '/organization/employees/archives/count',
  archivedEmployees: '/organization/employees/archives',
  restoreArchivedEmployees: '/organization/employees/restore',
  deactivateEmployees: '/organization/employees/deactivate',
  activateEmployees: '/organization/employees/activate',
  getFieldsFromCsv: '/organization/employees/get-fields-from-csv',
  validateEmployeeData: '/organization/employees/validate-upload',
  getNextFreePin: '/organization/employees/next-free-pin',
  reValidateEmployeeData: '/organization/employees/revalidate-upload',
  uploadEmployeeData: '/organization/employees/commit-upload',
  uploadEmployeeDataStatus: '/organization/employees/commit-upload/status',
  getBanks: '/banks',
  employeeTypes: '/organization/employees/settings/types',
  employeeDesignations: '/organization/employees/settings/designations',
  employeeGrades: '/organization/employees/settings/grades',
  employeeCategories: '/organization/employees/settings/categories',
  employeeImageUpload: '/organization/employees/image-upload',
  organizationSystemSettingsRoles: '/organization/system-settings/roles',
  fetchEmployeeReports: '/organization/reports/employees/fetch',
  fetchDepartmentsAssignedToBranch:
    '/organization/branches/:branch_id/departments',
  organizationSystemSettingsGroupPermissionsByModules:
    '/organization/system-settings/group-permissions-by-modules',
  reassignRoleMembers: '/organization/system-settings/roles/reassign-members',
  organizationSystemSettingsAccountSettings:
    '/organization/system-settings/account-settings',
  publicHolidaySettings:
    '/organization/system-settings/public-holiday-settings',
  publicHolidays: '/public-holidays',
  customPublicHolidaySettings:
    '/organization/system-settings/public-holiday-settings/custom',
  cancelPublicHolidaySettings:
    '/organization/system-settings/public-holiday-settings/:id/cancel',

  // hrm routes
  getHrmExemptions: '/hrm/exemptions/view-all',
  hrmExemptions: '/hrm/exemptions',
  canApproveHrmExemption: '/hrm/exemptions/can/approve',
  approveHrmExemption: '/hrm/exemptions/approve',

  // payroll
  verifyAccountNumber:
    '/payroll/payment-management/payments/verify-account-number',
}
