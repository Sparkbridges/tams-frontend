import { TamsButton, TamsSideNavTable } from '#/components/atoms'
import {
  useDeletePermissionSettings,
  useFetchGroupPermissionsByModules,
  useGetEmployeeRoles,
  useGetPermissionDetailsForRole,
} from '#/lib'
import type { TMappedGetGroupPermissionsByModules } from '#/lib'
import { Accordion, CheckIcon, Divider, Skeleton } from '@mantine/core'
import {
  CheckCircleIcon,
  PenIcon,
  TrashIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import {
  CreateEditPermissionSettings,
  ReassignRolesToUsersDrawer,
} from '../drawers'
import { useDisclosure } from '@mantine/hooks'
import { TamsConfirmation } from '#/components/molecules'
import { notifications } from '@mantine/notifications'

const OrganizationPermissions = () => {
  const [accordionValue, setAccordionValue] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<number>()
  const [
    openedCreateEditPermissionSettings,
    {
      open: openCreateEditPermissionSettings,
      close: closeCreateEditPermissionSettings,
    },
  ] = useDisclosure(false)
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)
  const [
    openedReAssignModal,
    { open: openReAssignModal, close: closeReAssignModal },
  ] = useDisclosure(false)
  const [
    openedReAssignDrawer,
    { open: openReAssignDrawer, close: closeReAssignDrawer },
  ] = useDisclosure(false)
  const [action, setAction] = useState<'create' | 'edit'>()
  const { data: employeeRoles } = useGetEmployeeRoles((data) =>
    data.data.results.map((role) => ({
      label: role.name,
      value: role.id.toString(),
    })),
  )
  const { data: groupPermissionsByModules } = useFetchGroupPermissionsByModules(
    (data) => data.data,
  )

  const {
    data: permissionDetailsForRole,
    isLoading: isPermissionDetailsLoading,
  } = useGetPermissionDetailsForRole(
    selectedId ?? Number(employeeRoles?.[0]?.value),
  )

  useEffect(() => {
    if (selectedId === undefined && employeeRoles?.[0]?.value) {
      setSelectedId(Number(employeeRoles[0].value))
    }
  }, [selectedId, employeeRoles])

  const deletePermission = useDeletePermissionSettings()

  const mappedData = useMemo((): TMappedGetGroupPermissionsByModules[] => {
    const detailPermissionsArray = new Set(
      permissionDetailsForRole?.data.permission_ids,
    )
    return (
      groupPermissionsByModules?.permissionsTree?.map((module) => {
        const hasGrandChild = module.children.some(
          (item) => Array.isArray(item.children) && item.children.length > 0,
        )
        const activeCount = hasGrandChild
          ? module.children.reduce((count, item) => {
              if (Array.isArray(item.children) && item.children.length > 0) {
                return (
                  count +
                  item.children.filter((grandchild) =>
                    detailPermissionsArray.has(grandchild.id),
                  ).length
                )
              }
              return count + (detailPermissionsArray.has(item.id) ? 1 : 0)
            }, 0)
          : module.children.filter((item) =>
              detailPermissionsArray.has(item.id),
            ).length

        const totalCount = hasGrandChild
          ? module.children.reduce((count, item) => {
              if (Array.isArray(item.children) && item.children.length > 0) {
                return count + item.children.length
              }
              return count + 1
            }, 0)
          : module.children.length
        return {
          label: module.label,
          key: module.key.toString(),
          activeCount,
          total: totalCount,
          children: module.children.map((child) => {
            return {
              ...child,
              isActive: detailPermissionsArray.has(Number(child.id)),
              children: Array.isArray(child.children)
                ? child.children.map((grandchild) => {
                    return {
                      ...grandchild,
                      isActive: detailPermissionsArray.has(
                        Number(grandchild.id),
                      ),
                    }
                  })
                : [],
            }
          }),
        }
      }) || []
    )
  }, [groupPermissionsByModules, permissionDetailsForRole])

  const handleCreateEdit = (type: 'create' | 'edit') => {
    setAction(type)
    openCreateEditPermissionSettings()
  }

  const handleDelete = () => openConfirmation()

  const handleConfirmDelete = async () => {
    if (
      Array.isArray(permissionDetailsForRole?.data?.members) &&
      permissionDetailsForRole?.data?.members.length > 0
    ) {
      openReAssignModal()
      return
    }
    try {
      await deletePermission.mutateAsync(
        Number(permissionDetailsForRole?.data?.id),
      )
      closeConfirmation()
    } catch (e) {
      console.error(e)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete permission.',
        color: 'red',
      })
    }
  }
  return (
    <div>
      <TamsSideNavTable
        title="Organization Permissions"
        actions={
          <div className="flex gap-2">
            <TamsButton
              leftSection={<PenIcon />}
              disabled={Number(permissionDetailsForRole?.data?.is_system) > 0}
              radius="xl"
              size="md"
              variant="subtle"
              onClick={() => handleCreateEdit('edit')}
            >
              Edit Role
            </TamsButton>
            <Divider orientation="vertical" />
            <TamsButton
              leftSection={<TrashIcon />}
              disabled={Number(permissionDetailsForRole?.data?.is_system) > 0}
              radius="xl"
              color="red"
              onClick={handleDelete}
              size="md"
              variant="subtle"
            >
              Delete Role
            </TamsButton>
          </div>
        }
        setSelectedId={setSelectedId}
        columnData={employeeRoles}
        columnButton={
          <TamsButton
            leftSection={<UserCircleIcon />}
            radius="xl"
            size="md"
            fullWidth
            onClick={() => handleCreateEdit('create')}
          >
            Add Role
          </TamsButton>
        }
        content={
          <div>
            <Accordion
              multiple
              value={accordionValue}
              onChange={setAccordionValue}
            >
              {mappedData.map((module) => (
                <Accordion.Item key={module.key} value={module.key}>
                  <Accordion.Control
                    icon={
                      <CheckCircleIcon
                        weight="fill"
                        size={28}
                        color={
                          module.activeCount === module.total &&
                          Number(module.total) > 0
                            ? 'green'
                            : module.activeCount !== module.total &&
                                Number(module.total) > 0
                              ? 'gold'
                              : 'gray'
                        }
                      />
                    }
                  >
                    <div className="flex items-center">
                      {module.label}
                      <span className="ml-auto text-gray-600 pr-3 text-xs">
                        ({module.activeCount}/{module.total})
                      </span>
                    </div>
                  </Accordion.Control>
                  <Accordion.Panel className="bg-gray-50">
                    <ul className="grid grid-cols-2 gap-2.5">
                      {isPermissionDetailsLoading &&
                        Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton
                            key={index}
                            height={10}
                            width={24}
                            className="col-span-1"
                          />
                        ))}
                      {module.children.map((child, index) => (
                        <li className="col-span-1" key={child.id + '-' + index}>
                          <li className="text-gray-800 flex items-center gap-2 text-sm">
                            {child?.isActive && <CheckIcon size={12} />}
                            {child.label}
                          </li>
                          <div>
                            {child.children?.map((grandchild) => (
                              <div
                                key={grandchild.id}
                                className="ml-3 text-gray-800 flex items-center gap-2 text-sm"
                              >
                                {grandchild?.isActive && (
                                  <CheckIcon size={12} />
                                )}
                                {grandchild.label}
                              </div>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        }
      />
      <CreateEditPermissionSettings
        opened={openedCreateEditPermissionSettings}
        close={closeCreateEditPermissionSettings}
        data={groupPermissionsByModules?.permissionsTree}
        checkedArray={
          action === 'edit' ? permissionDetailsForRole?.data.permission_ids : []
        }
        actionType={action}
        roleName={permissionDetailsForRole?.data.name}
        description={permissionDetailsForRole?.data.description as string}
        selectedId={selectedId}
        allPermissions={groupPermissionsByModules?.allPermissions}
      />
      <TamsConfirmation
        title="Delete Role?"
        message={`Are you sure you want to delete ${permissionDetailsForRole?.data.name} Role?`}
        opened={openedConfirmation}
        onClose={closeConfirmation}
        onConfirm={handleConfirmDelete}
        loading={deletePermission.isPending}
        isCritical
      />
      <TamsConfirmation
        title="Reassign Role?"
        message={`${permissionDetailsForRole?.data.name} Role is assigned to (${permissionDetailsForRole?.data.members.length}) users. Reassign them to another role before deleting?`}
        opened={openedReAssignModal}
        onClose={closeReAssignModal}
        onConfirm={openReAssignDrawer}
        confirmText="Yes, Reassign"
      />
      <ReassignRolesToUsersDrawer
        selectedRoleId={selectedId}
        opened={openedReAssignDrawer}
        onClose={() => {
          closeReAssignDrawer()
          closeReAssignModal()
        }}
        roleOptions={employeeRoles?.filter(
          (j) => Number(j.value) !== selectedId,
        )}
        members={permissionDetailsForRole?.data.members.map((member) => ({
          label: member.name,
          value: member.user_id?.toString() as string,
        }))}
      />
    </div>
  )
}

export default OrganizationPermissions
