import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, organizationClient } from '../client'
import type {
  TArchivedEmployeeResponse,
  TCreateBranchPayload,
  TCreateDepartmentPayload,
  TCreateEmployeeReportsPayload,
  TCreateTeamPayload,
  TDeleteBulkOrganizationBranchPayload,
  TDeleteOrganizationDepartmentPayload,
  TDeleteOrganizationTeamPayload,
  TEmployeeCountResponse,
  TEmployeeDetailResponse,
  TEmployeeResponse,
  TFetchArchivedOrganizationEmployeesParams,
  TFetchCountriesResponse,
  TFetchDepartmentsAssignedToBranchResponse,
  TFetchOrganizationAllEmployeesParams,
  TFetchOrganizationBranchesParams,
  TFetchOrganizationBranchesResponse,
  TFetchOrganizationBranchTypesResponse,
  TFetchOrganizationDepartmentsParams,
  TFetchOrganizationDepartmentsResponse,
  TFetchOrganizationTeamsParams,
  TFetchStatesResponse,
  TGetBanksResponse,
  TGetBranchDetailsResponse,
  TGetDepartmentDetailsResponse,
  TGetEmployeeCategoriesResponse,
  TGetEmployeeDesignationsResponse,
  TGetEmployeeGradesResponse,
  TGetEmployeeRolesResponse,
  TGetEmployeeTypesResponse,
  TGetFieldsFromCsvPayload,
  TGetNextFreePinPayload,
  TRestoreArchivedEmployeesPayload,
  TSearchOrganizationEmployeesResponse,
  TTeamDetailsResponse,
  TTeamResponse,
  TUpdateBranchPayload,
  TUpdateDepartmentPayload,
  TUpdateTeamPayload,
  TUploadEmployeeImagePayload,
  TValidateEmployeeDataPayload,
} from '#/lib/types'
import { notifications } from '@mantine/notifications'
import type {
  TCreateEmployeePayload,
  TUpdateEmployeePayload,
} from '#/lib/utils'

export const useSearchOrganizationEmployees = <TSelected>(
  queryParams: {
    query: string
  },
  select?: (data: TSearchOrganizationEmployeesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.searchOrganizationEmployees, queryParams],
    queryFn: () => organizationClient.searchOrganizationEmployees(queryParams),
    enabled: !!queryParams.query,
    select,
  })
}

export const useFetchOrganizationBranches = <TSelected>(
  queryParams?: TFetchOrganizationBranchesParams,
  select?: (data: TFetchOrganizationBranchesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.branches, queryParams],
    queryFn: () =>
      organizationClient.fetchOrganizationBranches(
        queryParams as TFetchOrganizationBranchesParams,
      ),
    select,
  })
}

export const useFetchOrganizationBranchDetails = <TSelected>(
  params: { branch_id: number },
  select?: (data: TGetBranchDetailsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.branches, params],
    queryFn: () => organizationClient.fetchOrganizationBranchDetails(params),
    select,
    enabled: !!params.branch_id,
  })
}

export const useCreateOrganizationBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateBranchPayload) =>
      organizationClient.createOrganizationBranch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.branches] })
      notifications.show({
        title: 'Success',
        message: 'Organization branch created successfully',
        color: 'green',
        position: 'bottom-right',
      })
    },
  })
}

export const useUpdateOrganizationBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUpdateBranchPayload) =>
      organizationClient.updateOrganizationBranch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.branches] })
      notifications.show({
        title: 'Success',
        message: 'Organization branch updated successfully',
        color: 'green',
        position: 'bottom-right',
      })
    },
  })
}

export const useDeleteOrganizationBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { company_id: number }) =>
      organizationClient.deleteOrganizationBranch(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.branches] })
      notifications.show({
        title: 'Success',
        message: 'Organization branch deleted successfully',
        color: 'green',
      })
    },
  })
}
export const useDeleteBulkOrganizationBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TDeleteBulkOrganizationBranchPayload) =>
      organizationClient.deleteBulkOrganizationBranches(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.branches] })
      notifications.show({
        title: 'Success',
        message: 'Organization branches deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useGetBranchTypes = <TSelected>(
  select?: (data: TFetchOrganizationBranchTypesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.branchTypes],
    queryFn: organizationClient.fetchOrganizationBranchTypes,
    select,
  })
}

export const useGetCountries = <TSelected>(
  select?: (data: TFetchCountriesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.countries],
    queryFn: organizationClient.fetchCountries,
    select,
  })
}

export const useGetStates = <TSelected>(
  params: { country_id: number },
  select?: (data: TFetchStatesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.states, params],
    queryFn: () => organizationClient.fetchStates(params),
    select,
    enabled: !!params.country_id,
  })
}

export const useFetchOrganizationDepartments = <TSelected>(
  queryParams?: TFetchOrganizationDepartmentsParams,
  select?: (data: TFetchOrganizationDepartmentsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.department, queryParams],
    queryFn: () =>
      organizationClient.fetchOrganizationDepartments(
        queryParams as TFetchOrganizationDepartmentsParams,
      ),
    select,
  })
}

export const useDeleteOrganizationDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: TDeleteOrganizationDepartmentPayload) =>
      organizationClient.deleteOrganizationDepartment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.department] })
      notifications.show({
        title: 'Success',
        message: 'Organization department deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useCreateOrganizationDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateDepartmentPayload) =>
      organizationClient.createOrganizationDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.department] })
      notifications.show({
        title: 'Success',
        message: 'Organization department created successfully',
        color: 'green',
      })
    },
  })
}

export const useFetchOrganizationDepartmentDetails = <TSelected>(
  params: { department_id: number },
  select?: (data: TGetDepartmentDetailsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.department, params],
    queryFn: () =>
      organizationClient.fetchOrganizationDepartmentDetails(params),
    select,
    enabled: !!params.department_id,
  })
}

export const useUpdateOrganizationDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUpdateDepartmentPayload) =>
      organizationClient.updateOrganizationDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.department] })
      notifications.show({
        title: 'Success',
        message: 'Organization department updated successfully',
        color: 'green',
        position: 'bottom-right',
      })
    },
  })
}

export const useDeleteOrganizationTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: TDeleteOrganizationTeamPayload) =>
      organizationClient.deleteOrganizationTeam(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.teams] })
      notifications.show({
        title: 'Success',
        message: 'Organization team deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useFetchOrganizationTeams = <TSelected>(
  params: TFetchOrganizationTeamsParams,
  select?: (data: TTeamResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.teams, params],
    queryFn: () => organizationClient.fetchOrganizationTeams(params),
    select,
  })
}

export const useCreateOrganizationTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateTeamPayload) =>
      organizationClient.createOrganizationTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.teams] })
      notifications.show({
        title: 'Success',
        message: 'Organization team created successfully',
        color: 'green',
        position: 'bottom-right',
      })
    },
  })
}

export const useUpdateOrganizationTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUpdateTeamPayload) =>
      organizationClient.updateOrganizationTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.teams] })
      notifications.show({
        title: 'Success',
        message: 'Organization team updated successfully',
        color: 'green',
        position: 'bottom-right',
      })
    },
  })
}

export const useFetchOrganizationTeamDetails = <TSelected>(
  params: { team_id: number },
  select?: (data: TTeamDetailsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.teams, params],
    queryFn: () => organizationClient.fetchOrganizationTeamDetails(params),
    select,
    enabled: !!params.team_id,
  })
}

export const useFetchOrganizationAllEmployees = <TSelected>(
  params?: TFetchOrganizationAllEmployeesParams,
  select?: (data: TEmployeeResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.employees, params],
    queryFn: () => organizationClient.fetchOrganizationAllEmployees(params),
    select,
  })
}

export const useFetchOrganizationAllEmployeeDetails = <TSelected>(
  params: { id: number },
  select?: (data: TEmployeeDetailResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.employees, params],
    queryFn: () =>
      organizationClient.fetchOrganizationAllEmployeeDetails(params),
    select,
    enabled: !!params.id,
  })
}

export const useFetchOrganizationEmployeesCount = <TSelected>(
  select?: (data: TEmployeeCountResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.employeesArchiveCount],
    queryFn: () => organizationClient.fetchOrganizationEmployeesCount(),
    select,
  })
}

export const useFetchArchivedOrganizationEmployees = <TSelected>(
  params: TFetchArchivedOrganizationEmployeesParams,
  select?: (data: TArchivedEmployeeResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.archivedEmployees, params],
    queryFn: () =>
      organizationClient.fetchArchivedOrganizationEmployees(params),
    select,
  })
}

export const useRestoreArchivedOrganizationEmployees = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TRestoreArchivedEmployeesPayload) =>
      organizationClient.restoreArchivedOrganizationEmployees(payload),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.archivedEmployees],
        }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.employeesArchiveCount],
        }),
      ])
      notifications.show({
        title: 'Success',
        message: 'Archived organization employees restored successfully',
        color: 'green',
      })
    },
  })
}

export const useDeleteArchivedOrganizationEmployees = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TRestoreArchivedEmployeesPayload) =>
      organizationClient.deleteArchivedOrganizationEmployees(payload),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.archivedEmployees],
        }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.employeesArchiveCount],
        }),
      ])
      notifications.show({
        title: 'Success',
        message:
          'Archived organization employees removed permanently successfully',
        color: 'green',
      })
    },
  })
}

export const useArchiveOrganizationEmployees = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TRestoreArchivedEmployeesPayload) =>
      organizationClient.archiveOrganizationEmployees(payload),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.archivedEmployees],
        }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.employeesArchiveCount],
        }),
      ])
      notifications.show({
        title: 'Success',
        message: 'Archived organization employees archived successfully',
        color: 'green',
      })
    },
  })
}

export const useDeactivateOrganizationEmployees = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TRestoreArchivedEmployeesPayload) =>
      organizationClient.deactivateOrganizationEmployees(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Organization employees deactivated successfully',
        color: 'green',
      })
    },
  })
}

export const useActivateOrganizationEmployees = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TRestoreArchivedEmployeesPayload) =>
      organizationClient.activateOrganizationEmployees(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Organization employees activated successfully',
        color: 'green',
      })
    },
  })
}

export const useGetFieldsFromCsv = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TGetFieldsFromCsvPayload) =>
      organizationClient.getFieldsFromCsv(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Fields from CSV fetched successfully',
        color: 'green',
      })
    },
  })
}

export const useValidateEmployeeData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TValidateEmployeeDataPayload) =>
      organizationClient.validateEmployeeData(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Employee data validated successfully',
        color: 'green',
      })
    },
  })
}

export const useGetNextFreePin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TGetNextFreePinPayload) =>
      organizationClient.getNextFreePin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Next free PIN fetched successfully',
        color: 'green',
      })
    },
  })
}

export const useReValidateEmployeeData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TValidateEmployeeDataPayload) =>
      organizationClient.reValidateEmployeeData(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Employee data revalidated successfully',
        color: 'green',
      })
    },
  })
}

export const useUploadEmployeeData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TValidateEmployeeDataPayload) =>
      organizationClient.uploadEmployeeData(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Employee data uploaded successfully',
        color: 'green',
      })
    },
  })
}

export const useGetUploadEmployeeDataStatus = (jobId: string) => {
  return useQuery({
    queryKey: [ENDPOINTS.uploadEmployeeDataStatus, jobId],
    queryFn: () => organizationClient.getUploadEmployeeDataStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      return query.state.data?.data.state === 'completed' ? false : 3000
    },
  })
}

export const useGetBanks = <TSelected>(
  select?: (data: TGetBanksResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.getBanks],
    queryFn: () => organizationClient.getBanks(),
    select,
  })
}

export const useGetEmployeeTypes = <TSelected>(
  select?: (data: TGetEmployeeTypesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.employeeTypes],
    queryFn: () => organizationClient.getEmployeeTypes(),
    select,
  })
}

export const useGetEmployeeDesignations = <TSelected>(
  select?: (data: TGetEmployeeDesignationsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.employeeDesignations],
    queryFn: () => organizationClient.getEmployeeDesignations(),
    select,
  })
}

export const useGetEmployeeGrades = <TSelected>(
  select?: (data: TGetEmployeeGradesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.employeeGrades],
    queryFn: () => organizationClient.getEmployeeGrades(),
    select,
  })
}

export const useGetEmployeeCategories = <TSelected>(
  select?: (data: TGetEmployeeCategoriesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.employeeCategories],
    queryFn: () => organizationClient.getEmployeeCategories(),
    select,
  })
}

export const useCreateOrganizationEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateEmployeePayload) =>
      organizationClient.createOrganizationEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Employee created successfully',
        color: 'green',
      })
    },
  })
}

export const useUpdateOrganizationEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUpdateEmployeePayload) =>
      organizationClient.updateOrganizationEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Employee updated successfully',
        color: 'green',
      })
    },
  })
}

export const useUploadOrganizationEmployeeImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUploadEmployeeImagePayload) =>
      organizationClient.uploadOrganizationEmployeeImage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
    },
  })
}

export const useGetEmployeeRoles = <TSelected>(
  select?: (data: TGetEmployeeRolesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.organizationSystemSettingsRoles],
    queryFn: () => organizationClient.getEmployeeRoles(),
    select,
  })
}

export const useCreateEmployeeReports = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateEmployeeReportsPayload) =>
      organizationClient.createEmployeeReports(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.employees] })
      notifications.show({
        title: 'Success',
        message: 'Employee report created successfully',
        color: 'green',
      })
    },
  })
}

export const useFetchDepartmentsAssignedToBranch = <TSelected>(
  branch_id?: number,
  select?: (data: TFetchDepartmentsAssignedToBranchResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.fetchDepartmentsAssignedToBranch, branch_id],
    queryFn: () =>
      organizationClient.fetchDepartmentsAssignedToBranch(branch_id as number),
    enabled: !!branch_id,
    select,
  })
}
