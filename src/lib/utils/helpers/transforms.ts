import type {
  TFetchHrmLeaveApproversData,
  TFetchHrmLeaveReportsGroupByEmployeeData,
  TFetchHrmLeavesTypesData,
} from '#/lib/types'

export const transformHrmLeaveReportsGroupByEmployeeData = (
  data: TFetchHrmLeaveReportsGroupByEmployeeData,
) => {
  return data.reports.map(({ entitled_leaves, ...rest }) => {
    const remainingObject =
      entitled_leaves?.reduce(
        (acc, leave) => {
          acc[leave.leave_type] = leave
          return acc
        },
        {} as Record<string, (typeof entitled_leaves)[0]>,
      ) || {}
    return {
      ...rest,
      ...remainingObject,
    }
  })
}

export const transformHrmSettingsLeaveTypes = (
  data: TFetchHrmLeavesTypesData[],
) => {
  const forbiddenStatus = ['active', 'scheduled', 'taken']
  return data.map((i) => ({
    name: i.leave_name,
    id: i.id,
    noOfDays: i.applicable_days,
    isPaid: i.is_paid ? 'Yes' : 'No',
    status: i.is_active ? 'Active' : 'Deactivated',
    canDeactivate: i.leaves.some((leave) =>
      forbiddenStatus.includes(leave.status),
    ),
    canReassign: i.leaves.every((leave) => leave.status === 'pending'),
    leaves: i.leaves,
  }))
}

export const transformHrmSettingsLeaveApprovers = (
  data: TFetchHrmLeaveApproversData[],
) => {
  return data.map((i) => ({
    id: i.id,
    description: i.description,
    approvalTypes: i.approval_types,
    noOfApprovals: i.no_approvals,
    stationCategoryId: i.station_category_id,
    stationId: i.station_id,
    categoryType: i.category_type,
    departments: i.departments,
    employees: i.employees,
    employeeGrades: i.employeeGrades,
    approvalLevels: i.approvalLevels,
  }))
}
