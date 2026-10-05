import { Client } from '#/lib/config'
import type {
  TFetchOrganizationBranchesParams,
  TFetchOrganizationBranchesResponse,
  TSearchOrganizationEmployeesResponse,
  TGetApiResponse,
  TFetchOrganizationBranchTypesResponse,
  TFetchCountriesResponse,
  TFetchStatesResponse,
  TCreateBranchPayload,
  TGetBranchDetailsResponse,
  TUpdateBranchPayload,
  TFetchOrganizationDepartmentsResponse,
  TFetchOrganizationDepartmentsParams,
  TDeleteOrganizationDepartmentPayload,
  TDeleteOrganizationDepartmentResponse,
  TPostApiResponse,
  TDeleteBulkOrganizationBranchPayload,
  TCreateDepartmentPayload,
  TGetDepartmentDetailsResponse,
  TUpdateDepartmentPayload,
  TDeleteOrganizationTeamPayload,
  TDeleteOrganizationTeamResponse,
  TTeamResponse,
  TFetchOrganizationTeamsParams,
  TCreateTeamPayload,
  TUpdateTeamPayload,
  TTeamDetailsResponse,
  TEmployeeResponse,
  TFetchOrganizationAllEmployeesParams,
  TEmployeeCountResponse,
  TFetchArchivedOrganizationEmployeesParams,
  TArchivedEmployeeResponse,
  TRestoreArchivedEmployeesPayload,
  TEmployeeDetailResponse,
  TGetFieldsFromCsvPayload,
  TGetFieldsFromCsvResponse,
  TValidateEmployeeDataPayload,
  TValidateEmployeeDataResponse,
  TGetNextFreePinPayload,
  TGetUploadEmployeeDataStatusResponse,
  TGetBanksResponse,
  TGetEmployeeTypesResponse,
  TGetEmployeeDesignationsResponse,
  TGetEmployeeGradesResponse,
  TGetEmployeeCategoriesResponse,
  TUploadEmployeeImagePayload,
  TUploadEmployeeImageResponse,
  TGetEmployeeRolesResponse,
  TCreateEmployeeReportsPayload,
  TFetchEmployeeReportsResponse,
  TFetchDepartmentsAssignedToBranchResponse,
  TFetchEmployeeTypesParams,
  TFetchEmployeeDesignationsParams,
  TFetchEmployeeGradesParams,
  TFetchEmployeeCategoriesParams,
  TUpdateEmployeeCategoryPayload,
  TUpdateEmployeeTypePayload,
  TUpdateEmployeeGradePayload,
  TUpdateEmployeeDesignationPayload,
  TCreateEmployeeCategoryPayload,
  TCreateEmployeeTypePayload,
  TCreateEmployeeGradePayload,
  TCreateEmployeeDesignationPayload,
  TGetGroupPermissionsByModulesResponse,
  TGetPermissionDetailsForRoleResponse,
  TCreatePermissionSettingsPayload,
  TCreatePermissionSettingsResponse,
  TUpdatePermissionSettingsPayload,
  TUpdatePermissionSettingsResponse,
  TReassignRoleMembersResponse,
  TReassignRoleMembersPayload,
  TGetAccountSettingsResponse,
  TUpdatePublicHolidaySettingsPayload,
  TCreatePublicHolidaySettingsPayload,
  TGetPublicHolidaySettingsResponse,
  TGetPublicHolidaysSettingsParams,
  TGetPublicHolidaySettingsDetailsResponse,
  TGetPublicHolidayResponse,
  TCancelPublicHolidaySettingsPayload,
} from '#/lib/types'
import { paramsSerializer } from '#/lib/utils'
import type {
  TCreateEmployeePayload,
  TEditCompanyPayload,
  TUpdateEmployeePayload,
} from '#/lib/utils'
import { ENDPOINTS } from './endpoints'

const organizationClient = {
  /**
   * Description - search organization employees.
   * @param {string} payload.company_id - company ID (company url without the domain).
   * @returns Data fetched from `/organization/employees/search`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  searchOrganizationEmployees: async (queryParams: { query: string }) => {
    return await Client.get<TSearchOrganizationEmployeesResponse>(
      ENDPOINTS.searchOrganizationEmployees,
      { params: queryParams },
    )
  },

  /**
   * Description - fetch organization branches.
   * @returns Data fetched from `/organization/branches`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationBranches: async (
    params: TFetchOrganizationBranchesParams,
  ) => {
    return await Client.get<TFetchOrganizationBranchesResponse>(
      ENDPOINTS.branches,
      { params },
    )
  },

  /**
   * Description - delete organization branch.
   * @returns Data fetched from `/organization/branches/{branch_id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteOrganizationBranch: async (params: { company_id: number }) => {
    return await Client.delete<TGetApiResponse<[]>>(
      `${ENDPOINTS.branches}/${params.company_id}`,
    )
  },
  /**
   * Description - delete bulk organization branches.
   * @param {TDeleteBulkOrganizationBranchPayload} payload - payload containing branch IDs to delete.
   * @returns Data fetched from `/organization/branches/delete`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteBulkOrganizationBranches: async (
    payload: TDeleteBulkOrganizationBranchPayload,
  ) => {
    return await Client.post<TPostApiResponse<[]>>(
      `${ENDPOINTS.deleteBulkBranches}`,
      payload,
    )
  },
  /**
   * Description - create organization branch.
   * @returns Data fetched from `/organization/branches`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createOrganizationBranch: async (payload: TCreateBranchPayload) => {
    return await Client.post<TGetApiResponse<[]>>(
      `${ENDPOINTS.branches}`,
      payload,
    )
  },

  /**
   * Description - update organization branch.
   * @returns Data fetched from `/organization/branches`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateOrganizationBranch: async (payload: TUpdateBranchPayload) => {
    return await Client.put<TGetApiResponse<[]>>(
      `${ENDPOINTS.branches}/${payload.id}`,
      payload,
    )
  },

  /**
   * Description - fetch organization branch details.
   * @returns Data fetched from `/organization/branches`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationBranchDetails: async (params: { branch_id: number }) => {
    return await Client.get<TGetBranchDetailsResponse>(
      `${ENDPOINTS.branches}/${params.branch_id}`,
    )
  },

  /**
   * Description - fetch organization branch types.
   * @returns Data fetched from `/branch-types`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationBranchTypes: async () => {
    return await Client.get<TFetchOrganizationBranchTypesResponse>(
      ENDPOINTS.branchTypes,
    )
  },

  /**
   * Description - fetches countries
   * @returns Data fetched from `/countries`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchCountries: async () => {
    return await Client.get<TFetchCountriesResponse>(ENDPOINTS.countries)
  },

  /**
   * Description - fetches states
   * @returns Data fetched from `/states`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchStates: async (params: { country_id: number }) => {
    return await Client.get<TFetchStatesResponse>(ENDPOINTS.states, { params })
  },

  /**
   * Description - fetches cities
   * @returns Data fetched from `/cities`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchCities: async (params: { state_id: number }) => {
    return await Client.get<
      TGetApiResponse<
        {
          id: number
          name: string
          state_id: number
        }[]
      >
    >(ENDPOINTS.cities, { params })
  },

  /**
   * Description - fetches organization departments.
   * @returns Data fetched from `/organization/departments`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationDepartments: async (
    params: TFetchOrganizationDepartmentsParams,
  ) => {
    return await Client.get<TFetchOrganizationDepartmentsResponse>(
      ENDPOINTS.department,
      { params },
    )
  },

  /**
   * Description - delete organization department
   * @returns Data fetched from `/organization/departments/delete`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteOrganizationDepartment: async (
    payload: TDeleteOrganizationDepartmentPayload,
  ) => {
    return await Client.post<TDeleteOrganizationDepartmentResponse>(
      `${ENDPOINTS.deleteDepartment}`,
      payload,
    )
  },

  /**
   * Description - create organization department.
   * @param payload The payload containing the details of the department to create.
   * @returns Data fetched from `/organization/departments`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createOrganizationDepartment: async (payload: TCreateDepartmentPayload) => {
    return await Client.post<TPostApiResponse<[]>>(
      `${ENDPOINTS.department}`,
      payload,
    )
  },

  /**
   * Description - fetch organization department details.
   * @param params - The parameters containing the department ID.
   * @returns Data fetched from `/organization/departments`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationDepartmentDetails: async (params: {
    department_id: number
  }) => {
    return await Client.get<TGetDepartmentDetailsResponse>(
      `${ENDPOINTS.department}/${params.department_id}`,
    )
  },

  /**
   * Description - update organization department.
   * @param payload - The payload containing the details of the department to update.
   * @returns Data fetched from `/organization/departments`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateOrganizationDepartment: async (payload: TUpdateDepartmentPayload) => {
    return await Client.put<TPostApiResponse<[]>>(
      `${ENDPOINTS.department}/${payload.id}`,
      payload,
    )
  },

  /**
   * Description - delete organization team
   * @returns Data fetched from `/organization/teams`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteOrganizationTeam: async (payload: TDeleteOrganizationTeamPayload) => {
    return await Client.post<TDeleteOrganizationTeamResponse>(
      `${ENDPOINTS.deleteTeam}`,
      payload,
    )
  },

  /**
   * Description - fetches organization teams.
   * @param params - The parameters containing pagination and search query.
   * @returns Data fetched from `/organization/teams`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationTeams: async (params: TFetchOrganizationTeamsParams) => {
    return await Client.get<TTeamResponse>(ENDPOINTS.teams, { params })
  },

  /**
   * Description - create organization team.
   * @param payload The payload containing the details of the team to create.
   * @returns Data fetched from `/organization/teams`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createOrganizationTeam: async (payload: TCreateTeamPayload) => {
    return await Client.post<TPostApiResponse<[]>>(
      `${ENDPOINTS.teams}`,
      payload,
    )
  },

  /**
   * Description - update organization team.
   * @param payload - The payload containing the details of the team to update.
   * @returns Data fetched from `/organization/teams`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateOrganizationTeam: async (payload: TUpdateTeamPayload) => {
    return await Client.put<TPostApiResponse<[]>>(
      `${ENDPOINTS.teams}/${payload.id}`,
      payload,
    )
  },

  /**
   * Description - fetch organization team details.
   * @param params - The parameters containing the team ID.
   * @returns Data fetched from `/organization/teams`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationTeamDetails: async (params: { team_id: number }) => {
    return await Client.get<TTeamDetailsResponse>(
      `${ENDPOINTS.teams}/${params.team_id}`,
    )
  },

  /**
   * Description - fetch organization employees.
   * @param params - The parameters containing pagination and search query.
   * @returns Data fetched from `/organization/employees`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationAllEmployees: async (
    params?: TFetchOrganizationAllEmployeesParams,
  ) => {
    return await Client.get<TEmployeeResponse>(`${ENDPOINTS.employees}`, {
      params,
    })
  },

  /**
   * Description - create organization employee.
   * @param payload - The payload containing the details of the employee to create.
   * @returns Data fetched from `/organization/employees`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createOrganizationEmployee: async (payload: TCreateEmployeePayload) => {
    return await Client.post<TPostApiResponse<[]>>(
      `${ENDPOINTS.employees}`,
      payload,
    )
  },

  /**
   * Description - update organization employee.
   * @param payload - The payload containing the details of the employee to update.
   * @returns Data fetched from `/organization/employees/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateOrganizationEmployee: async (payload: TUpdateEmployeePayload) => {
    return await Client.put<TPostApiResponse<[]>>(
      `${ENDPOINTS.employees}/${payload.id}`,
      payload,
    )
  },

  /**
   * Description - image upload for organization employee.
   * @param {FormData} payload -  The payload containing the image file and employee ID.
   * @returns Data fetched from `/organization/employees/image-upload`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  uploadOrganizationEmployeeImage: async (
    payload: TUploadEmployeeImagePayload,
  ) => {
    return await Client.post<TUploadEmployeeImageResponse>(
      `${ENDPOINTS.employeeImageUpload}`,
      payload.image,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  },

  /**
   * Description - fetch organization employee details.
   * @param params - The parameters containing the employee ID.
   * @returns Data fetched from `/organization/employees/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationAllEmployeeDetails: async (params: { id: number }) => {
    return await Client.get<TEmployeeDetailResponse>(
      `${ENDPOINTS.employees}/${params.id}`,
    )
  },

  /**
   * Description - fetch organization employees count (all employees and archived employees).
   * @returns Data fetched from `/organization/employees/count`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchOrganizationEmployeesCount: async () => {
    return await Client.get<TEmployeeCountResponse>(
      `${ENDPOINTS.employeesArchiveCount}`,
    )
  },

  /**
   * Description - fetched archived organization employees.
   * @param params - The parameters containing pagination and search query.
   * @returns Data fetched from `/organization/employees/archives`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchArchivedOrganizationEmployees: async (
    params: TFetchArchivedOrganizationEmployeesParams,
  ) => {
    return await Client.get<TArchivedEmployeeResponse>(
      `${ENDPOINTS.archivedEmployees}`,
      {
        params,
      },
    )
  },

  /**
   * Description - restore archived organization employees.
   * @param payload - The payload containing the IDs of the employees to restore.
   * @returns Data fetched from `/organization/employees/restore`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  restoreArchivedOrganizationEmployees: async (
    payload: TRestoreArchivedEmployeesPayload,
  ) => {
    return await Client.put<TPostApiResponse<[]>>(
      `${ENDPOINTS.restoreArchivedEmployees}`,
      payload,
    )
  },

  /**
   * Description - deactivate organization employees.
   * @param payload - The payload containing the IDs of the employees to deactivate.
   * @returns Data fetched from `/organization/employees/deactivate`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deactivateOrganizationEmployees: async (
    payload: TRestoreArchivedEmployeesPayload,
  ) => {
    return await Client.put<TPostApiResponse<[]>>(
      `${ENDPOINTS.deactivateEmployees}`,
      payload,
    )
  },

  /**
   * Description - activate organization employees.
   * @param payload - The payload containing the IDs of the employees to activate.
   * @returns Data fetched from `/organization/employees/activate`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  activateOrganizationEmployees: async (
    payload: TRestoreArchivedEmployeesPayload,
  ) => {
    return await Client.put<TPostApiResponse<[]>>(
      `${ENDPOINTS.activateEmployees}`,
      payload,
    )
  },

  /**
   * Description - Archive organization employees.
   * @param payload - The payload containing the IDs of the employees to archive.
   * @returns Data fetched from `/organization/employees?id={id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  archiveOrganizationEmployees: async (
    payload: TRestoreArchivedEmployeesPayload,
  ) => {
    return await Client.delete<TPostApiResponse<[]>>(`${ENDPOINTS.employees}`, {
      params: { id: payload.id },
      paramsSerializer: (params) => paramsSerializer(params),
    })
  },

  /**
   * Description - Delete archived employees
   * @param payload - The payload containing the IDs of the archived employees to delete.
   * @returns Data fetched from `/organization/employees?id={id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteArchivedOrganizationEmployees: async (
    payload: TRestoreArchivedEmployeesPayload,
  ) => {
    return await Client.delete<TPostApiResponse<[]>>(
      `${ENDPOINTS.archivedEmployees}`,
      {
        params: { id: payload.id },
        paramsSerializer: (params) => paramsSerializer(params),
      },
    )
  },

  /**
   * Description - Get fields from CSV for organization employees.
   * @param payload - The payload containing the CSV file or relevant data.
   * @returns Data fetched from `/organization/employees/get-fields-from-csv`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getFieldsFromCsv: async (payload: TGetFieldsFromCsvPayload) => {
    return await Client.post<TGetFieldsFromCsvResponse>(
      `${ENDPOINTS.getFieldsFromCsv}`,
      payload.employeesFile,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  },

  /**
   * Description - Validate employee data from CSV upload.
   * @param payload - The payload containing the CSV file or relevant data.
   * @returns Data fetched from `/organization/employees/validate-upload`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  validateEmployeeData: async (payload: TValidateEmployeeDataPayload) => {
    return await Client.post<TValidateEmployeeDataResponse>(
      `${ENDPOINTS.validateEmployeeData}`,
      payload.employeesFile,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  },

  /**
   * Description - Get the next free employee access pin.
   * @param params - The parameters containing any necessary data for the request.
   * @returns Data fetched from `/organization/employees/next-free-pin`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getNextFreePin: async (payload: TGetNextFreePinPayload) => {
    return await Client.post<TGetApiResponse<{ pin: number }>>(
      `${ENDPOINTS.getNextFreePin}`,
      payload,
    )
  },

  /**
   * Description - Revalidate employee data from CSV upload.
   * @param payload - The payload containing the CSV file or relevant data.
   * @returns Data fetched from `/organization/employees/revalidate-upload`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  reValidateEmployeeData: async (payload: TValidateEmployeeDataPayload) => {
    return await Client.post<TValidateEmployeeDataResponse>(
      `${ENDPOINTS.reValidateEmployeeData}`,
      payload.employeesFile,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  },

  /**
   * Description - Upload employee data from CSV.
   * @param payload - The payload containing the CSV file or relevant data.
   * @returns Data fetched from `/organization/employees/upload/commit`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  uploadEmployeeData: async (payload: TValidateEmployeeDataPayload) => {
    return await Client.post<TPostApiResponse<{ jobId: string }>>(
      `${ENDPOINTS.uploadEmployeeData}`,
      payload.employeesFile,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  },

  /**
   * Description - Get the status of the employee data upload job.
   * @param jobId - The ID of the upload job.
   * @returns Data fetched from `/organization/employees/commit-upload/status/:jobId`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getUploadEmployeeDataStatus: async (jobId: string) => {
    return await Client.get<TGetUploadEmployeeDataStatusResponse>(
      `${ENDPOINTS.uploadEmployeeDataStatus}/${jobId}`,
    )
  },

  /**
   * Description - Get the list of banks.
   * @returns Data fetched from `/banks`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getBanks: async () => {
    return await Client.get<TGetBanksResponse>(`${ENDPOINTS.getBanks}`)
  },

  /**
   * Description - Get the list of employee types
   * @param queryParams - Optional query parameters for fetching employee types.
   * @returns Data fetched from `/organization/employees/settings/types`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getEmployeeTypes: async (queryParams?: TFetchEmployeeTypesParams) => {
    return await Client.get<TGetEmployeeTypesResponse>(
      `${ENDPOINTS.employeeTypes}`,
      {
        params: queryParams,
      },
    )
  },

  /**
   * Description - Get the list of employee designations.
   * @param queryParams - Optional query parameters for fetching employee designations.
   * @returns Data fetched from `/organization/employees/settings/designations`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getEmployeeDesignations: async (
    queryParams?: TFetchEmployeeDesignationsParams,
  ) => {
    return await Client.get<TGetEmployeeDesignationsResponse>(
      `${ENDPOINTS.employeeDesignations}`,
      {
        params: queryParams,
      },
    )
  },

  /**
   * Description - Get the list of employee grades.
   * @param queryParams - Optional query parameters for fetching employee grades.
   * @returns Data fetched from `/organization/employees/settings/grades`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getEmployeeGrades: async (queryParams?: TFetchEmployeeGradesParams) => {
    return await Client.get<TGetEmployeeGradesResponse>(
      `${ENDPOINTS.employeeGrades}`,
      {
        params: queryParams,
      },
    )
  },

  /**
   * Description - Get the list of employee categories.
   * @param queryParams - Optional query parameters for fetching employee categories.
   * @returns Data fetched from `/organization/employees/settings/categories`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getEmployeeCategories: async (
    queryParams?: TFetchEmployeeCategoriesParams,
  ) => {
    return await Client.get<TGetEmployeeCategoriesResponse>(
      `${ENDPOINTS.employeeCategories}`,
      {
        params: queryParams,
      },
    )
  },

  /**
   * Description - Delete an employee category.
   * @param categoryId The ID of the employee category to delete.
   * @returns Data fetched from `/organization/employees/settings/categories?id=:category_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.  
   */
  deleteEmployeeCategory: async (categoryId: number) => {
    return await Client.delete(`${ENDPOINTS.employeeCategories}`, {
      params: {
        id: categoryId,
      },
    })
  },

  /**
   * Description - Delete an employee type.
   * @param typeId The ID of the employee type to delete.
   * @returns Data fetched from `/organization/employees/settings/types?id=:type_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteEmployeeType: async (typeId: number) => {
    return await Client.delete(`${ENDPOINTS.employeeTypes}`, {
      params: {
        id: typeId,
      },
    })
  },

  /**
   * Description - Delete an employee grade.
   * @param gradeId The ID of the employee grade to delete.
   * @returns Data fetched from `/organization/employees/settings/grades?id=:grade_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteEmployeeGrade: async (gradeId: number) => {
    return await Client.delete(`${ENDPOINTS.employeeGrades}`, {
      params: {
        id: gradeId,
      },
    })
  },

  /**
   * Description - Delete an employee designation.
   * @param designationId The ID of the employee designation to delete.
   * @returns Data fetched from `/organization/employees/settings/designations?id=:designation_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteEmployeeDesignation: async (designationId: number) => {
    return await Client.delete(`${ENDPOINTS.employeeDesignations}`, {
      params: {
        id: designationId,
      },
    })
  },

  /**
   * Description - update an employee category.
   * @param payload The data to update the employee category with.
   * @returns Data fetched from `/organization/employees/settings/categories?id=:category_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateEmployeeCategory: async (payload: TUpdateEmployeeCategoryPayload) => {
    return await Client.put(`${ENDPOINTS.employeeCategories}`, payload)
  },

  /**
   * Description - update an employee type.
   * @param payload The data to update the employee type with.
   * @returns Data fetched from `/organization/employees/settings/types?id=:type_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateEmployeeType: async (payload: TUpdateEmployeeTypePayload) => {
    return await Client.put(`${ENDPOINTS.employeeTypes}`, payload)
  },

  /**
   * Description - update an employee grade.
   * @param payload The data to update the employee grade with.
   * @returns Data fetched from `/organization/employees/settings/grades?id=:grade_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateEmployeeGrade: async (payload: TUpdateEmployeeGradePayload) => {
    return await Client.put(`${ENDPOINTS.employeeGrades}`, payload)
  },

  /**
   * Description - update an employee designation.
   * @param payload The data to update the employee designation with.
   * @returns Data fetched from `/organization/employees/settings/designations?id=:designation_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateEmployeeDesignation: async (
    payload: TUpdateEmployeeDesignationPayload,
  ) => {
    return await Client.put(`${ENDPOINTS.employeeDesignations}`, payload)
  },

  /**
   * Description - create an employee category.
   * @param payload The data to create the employee category with.
   * @returns Data fetched from `/organization/employees/settings/categories`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createEmployeeCategory: async (payload: TCreateEmployeeCategoryPayload) => {
    return await Client.post(`${ENDPOINTS.employeeCategories}`, payload)
  },
  /**
   * Description - create an employee type.
   * @param payload The data to create the employee type with.
   * @returns Data fetched from `/organization/employees/settings/types`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createEmployeeType: async (payload: TCreateEmployeeTypePayload) => {
    return await Client.post(`${ENDPOINTS.employeeTypes}`, payload)
  },
  /**
   * Description - create an employee grade.
   * @param payload The data to create the employee grade with.
   * @returns Data fetched from `/organization/employees/settings/grades`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createEmployeeGrade: async (payload: TCreateEmployeeGradePayload) => {
    return await Client.post(`${ENDPOINTS.employeeGrades}`, payload)
  },
  /**
   * Description - create an employee designation.
   * @param payload The data to create the employee designation with.
   * @returns Data fetched from `/organization/employees/settings/designations`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createEmployeeDesignation: async (
    payload: TCreateEmployeeDesignationPayload,
  ) => {
    return await Client.post(`${ENDPOINTS.employeeDesignations}`, payload)
  },

  /**
   * Description - fetch the list of employee roles.
   * @returns Data fetched from `/organization/system-settings/roles`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getEmployeeRoles: async () => {
    return await Client.get<TGetEmployeeRolesResponse>(
      `${ENDPOINTS.organizationSystemSettingsRoles}`,
    )
  },

  /**
   * Description - Fetch employee reports.
   * @returns Data fetched from `/organization/reports/employees/fetch`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createEmployeeReports: async (payload: TCreateEmployeeReportsPayload) => {
    return await Client.post<TFetchEmployeeReportsResponse>(
      `${ENDPOINTS.fetchEmployeeReports}`,
      payload,
    )
  },

  /**
   * Description - Fetch departments assigned to a specific branch.
   * @param branchId The ID of the branch.
   * @returns Data fetched from `/organization/branches/:branch_id/departments`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchDepartmentsAssignedToBranch: async (branchId: number) => {
    return await Client.get<TFetchDepartmentsAssignedToBranchResponse>(
      `${ENDPOINTS.fetchDepartmentsAssignedToBranch.replace(':branch_id', String(branchId))}`,
    )
  },

  /**
   * Description - Fetch group permissions by modules.
   * @returns Data fetched from `/organization/system-settings/group-permissions-by-modules`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getGroupPermissionsByModules: async () => {
    return await Client.get<TGetGroupPermissionsByModulesResponse>(
      `${ENDPOINTS.organizationSystemSettingsGroupPermissionsByModules}`,
    )
  },

  /**
   * Description - fetch permission details for the current role by its ID.
   * @param roleId The ID of the role.
   * @returns Data fetched from `/organization/system-settings/roles/:role_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getPermissionDetailsForRole: async (roleId: number) => {
    return await Client.get<TGetPermissionDetailsForRoleResponse>(
      `${ENDPOINTS.organizationSystemSettingsRoles}/${roleId}`,
    )
  },

  /**
   * Description - Create new permission settings.
   * @param payload The payload containing the new permission settings.
   * @returns Data fetched from `/organization/system-settings/roles`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createPermissionSettings: async (
    payload: TCreatePermissionSettingsPayload,
  ) => {
    return await Client.post<TCreatePermissionSettingsResponse>(
      `${ENDPOINTS.organizationSystemSettingsRoles}`,
      payload,
    )
  },

  /**
   * Description - update permission settings.
   * @param payload The payload containing the updated permission settings.
   * @returns Data fetched from `/organization/system-settings/roles`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updatePermissionSettings: async (
    payload: TUpdatePermissionSettingsPayload,
  ) => {
    return await Client.put<TUpdatePermissionSettingsResponse>(
      `${ENDPOINTS.organizationSystemSettingsRoles}`,
      payload,
    )
  },

  /**
   * Description - delete permission settings
   * @param roleId The ID of the role to be deleted.
   * @returns Data fetched from `/organization/system-settings/roles/:role_id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deletePermissionSettings: async (roleId: number) => {
    return await Client.delete(`${ENDPOINTS.organizationSystemSettingsRoles}`, {
      params: {
        id: roleId,
      },
    })
  },

  /**
   * Description - Reassign role members from one role to another.
   * @param payload The payload containing the role reassignment details.
   * @returns Data fetched from `/roles/reassign-members`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  reassignRoleMembers: async (payload: TReassignRoleMembersPayload) => {
    return await Client.put<TReassignRoleMembersResponse>(
      `${ENDPOINTS.reassignRoleMembers}`,
      payload,
    )
  },

  /**
   * Description - Fetch organization system settings account settings.
   * @returns Data fetched from `/organization/system-settings/account-settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getAccountSettings: async () => {
    return await Client.get<TGetAccountSettingsResponse>(
      `${ENDPOINTS.organizationSystemSettingsAccountSettings}`,
    )
  },

  /**
   * Description - Update organization system settings account settings.
   * @param payload The payload containing the updated account settings.
   * @returns Data fetched from `/organization/system-settings/account-settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateAccountSettings: async (payload: TEditCompanyPayload) => {
    return await Client.put(
      `${ENDPOINTS.organizationSystemSettingsAccountSettings}`,
      payload,
    )
  },

  /**
   * Description - Fetch public holiday settings.
   * @returns Data fetched from `/organization/system-settings/public-holiday-settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getPublicHolidaySettings: async (
    params?: TGetPublicHolidaysSettingsParams,
  ) => {
    return await Client.get<TGetPublicHolidaySettingsResponse>(
      `${ENDPOINTS.publicHolidaySettings}`,
      { params },
    )
  },

  /**
   * Description - Get public holiday settings details.
   * @param id The ID of the public holiday to fetch.
   * @returns Data fetched from `/organization/system-settings/public-holiday-settings/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getPublicHolidaySettingsDetails: async (id: number) => {
    return await Client.get<TGetPublicHolidaySettingsDetailsResponse>(
      `${ENDPOINTS.publicHolidaySettings}/${id}`,
    )
  },

  /**
   * Description - Update public holiday settings.
   * @param payload The payload containing the updated public holiday settings.
   * @returns Data fetched from `/organization/system-settings/public-holiday-settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updatePublicHolidaySettings: async (
    payload: TUpdatePublicHolidaySettingsPayload,
  ) => {
    const { id, ...restPayload } = payload
    return await Client.put(
      `${ENDPOINTS.publicHolidaySettings}/${id}`,
      restPayload,
    )
  },

  /**
   * Description - Create a new public holiday.
   * @param payload The payload containing the public holiday details.
   * @returns Data fetched from `/organization/system-settings/public-holiday-settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createPublicHolidaySettings: async (
    payload: TCreatePublicHolidaySettingsPayload,
  ) => {
    return await Client.post(`${ENDPOINTS.publicHolidaySettings}`, payload)
  },

  /**
   * Description - Delete a public holiday.
   * @param payload The payload containing the ID of the public holiday to delete.
   * @returns Data fetched from `/organization/system-settings/public-holiday-settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deletePublicHolidaySettings: async (id: number) => {
    return await Client.delete(`${ENDPOINTS.publicHolidaySettings}/${id}`)
  },

  /**
   * Description - Fetch all public holidays.
   * @returns Data fetched from `/organization/system-settings/public-holiday-settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getAllPublicHolidays: async () => {
    return await Client.get<TGetPublicHolidayResponse>(
      `${ENDPOINTS.publicHolidays}`,
    )
  },

  /**
   * Description - Create custom public holiday settings.
   * @returns Data fetched from `/organization/system-settings/public-holiday-settings/custom`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createCustomPublicHolidaySettings: async (
    payload: TCreatePublicHolidaySettingsPayload,
  ) => {
    return await Client.post<TPostApiResponse<[]>>(
      `${ENDPOINTS.customPublicHolidaySettings}`,
      payload,
    )
  },

  /**
   * Description - Cancel a public holiday.
   * @param id The ID of the public holiday to cancel.
   * @returns Data fetched from `/organization/system-settings/public-holiday-settings/:id/cancel`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  cancelPublicHolidaySettings: async (
    payload: TCancelPublicHolidaySettingsPayload,
  ) => {
    return await Client.put(
      `${ENDPOINTS.cancelPublicHolidaySettings}`.replace(
        ':id',
        payload.id.toString(),
      ),
      payload,
    )
  },
}
export default organizationClient
