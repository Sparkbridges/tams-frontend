import {
  TamsButton,
  TamsDrawer,
  TamsTextArea,
  TamsTextInput,
} from '#/components/atoms'
import { useCreatePermissionSettings, useUpdatePermissionSettings } from '#/lib'
import type {
  TAllPermissions,
  TMappedGetGroupPermissionsByModules,
} from '#/lib'
import { Checkbox, Divider, Paper } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  opened: boolean
  close: () => void
  data: TMappedGetGroupPermissionsByModules[] | undefined
  actionType?: 'create' | 'edit'
  checkedArray?: number[]
  roleName?: string
  description?: string
  selectedId?: number
  allPermissions?: TAllPermissions[]
}

const CreateEditPermissionSettings = ({
  opened,
  close,
  data,
  actionType,
  checkedArray,
  roleName,
  description,
  selectedId,
  allPermissions,
}: Props) => {
  const [roleNameState, setRoleName] = useState(roleName || '')
  const [error, setError] = useState('')
  const [descriptionState, setDescription] = useState(description || '')
  const [checkedObject, setCheckedObject] = useState<{
    [key: string]: Set<number>
  }>({})

  const createPermissionSettingsMutation = useCreatePermissionSettings()
  const updatePermissionSettingsMutation = useUpdatePermissionSettings()

  const isLoading =
    createPermissionSettingsMutation.isPending ||
    updatePermissionSettingsMutation.isPending

  const convertEditedCheckedPermissions = useCallback(() => {
    const newCheckedObject: { [key: string]: Set<number> } = {}
    const filteredPermissions =
      allPermissions?.filter((permission) =>
        checkedArray?.includes(permission.id),
      ) || []

    filteredPermissions.forEach((permission) => {
      if (permission.group === 'application.system_permissions') {
        newCheckedObject['system'] = new Set([
          ...(newCheckedObject['system'] ?? []),
          permission.id,
        ])
      } else {
        const key = permission.group.split('.')[0]
        newCheckedObject[key] = new Set([
          ...(newCheckedObject[key] ?? []),
          permission.id,
        ])
      }
    })
    return newCheckedObject
  }, [allPermissions, checkedArray])

  useEffect(() => {
    if (!opened) return
    const isEdit = actionType === 'edit'
    setRoleName(isEdit ? (roleName ?? '') : '')
    setDescription(isEdit ? (description ?? '') : '')
    setCheckedObject(isEdit ? convertEditedCheckedPermissions() : {})
    setError('')
  }, [opened, actionType, selectedId, convertEditedCheckedPermissions])

  const handleSubmit = async () => {
    try {
      if (!roleNameState) {
        setError('Role name is required.')
        return
      }
      const checkedPermissions = new Set<number>()
      Object.values(checkedObject).forEach((set) => {
        set.forEach((id) => checkedPermissions.add(id))
      })
      const verifiedPermissions = Array.from(checkedPermissions).filter(
        (item) => typeof item === 'number',
      )
      if (actionType === 'create') {
        await createPermissionSettingsMutation.mutateAsync({
          name: roleNameState,
          description: descriptionState,
          permissions: verifiedPermissions,
        })
      }
      if (actionType === 'edit') {
        await updatePermissionSettingsMutation.mutateAsync({
          name: roleNameState,
          description: descriptionState,
          permissions: verifiedPermissions,
          id: selectedId as number,
        })
      }
      close()
    } catch (err) {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'An error occurred while saving the permission settings.',
        color: 'red',
      })
    }
  }

  const handleCheckBoxChange = (
    parentKey: string,
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
    items: any,
  ) => {
    const newCheckedPermissions = new Set(checkedObject[parentKey] ?? [])
    if (e.currentTarget.checked) {
      items?.forEach((child: any) => {
        newCheckedPermissions.add(child.id)
        if (child.children?.length) {
          child.children?.forEach((grandchild: any) => {
            newCheckedPermissions.add(grandchild.id)
          })
        }
      })
    } else {
      items?.forEach((child: any) => {
        newCheckedPermissions.delete(child.id)
        if (child.children?.length) {
          child.children?.forEach((grandchild: any) => {
            newCheckedPermissions.delete(grandchild.id)
          })
        }
      })
    }
    setCheckedObject((prev) => ({
      ...prev,
      [parentKey]: newCheckedPermissions,
    }))
  }
  const handleChildCheckBoxChange = (
    parentKey: string,
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
    child: any,
  ) => {
    const newCheckedPermissions = new Set(checkedObject[parentKey] ?? [])
    if (e.currentTarget.checked) {
      if (child.id) {
        newCheckedPermissions.add(child.id)
      }

      if (child.children?.length) {
        child.children?.forEach((grandchild: any) => {
          newCheckedPermissions.add(grandchild.id)
        })
      }
    } else {
      if (child.id) {
        newCheckedPermissions.delete(child.id)
      }

      if (child.children?.length) {
        child.children?.forEach((grandchild: any) => {
          newCheckedPermissions.delete(grandchild.id)
        })
      }
    }
    setCheckedObject((prev) => ({
      ...prev,
      [parentKey]: newCheckedPermissions,
    }))
  }

  return (
    <TamsDrawer
      title={actionType === 'create' ? 'Create Permission' : 'Edit Permission'}
      size={'xl'}
      position="bottom"
      onClose={close}
      opened={opened}
      headerProps={
        <div className="flex gap-4">
          <TamsButton
            onClick={handleSubmit}
            loading={isLoading}
            size="md"
            radius={'xl'}
          >
            {actionType === 'create' ? 'Save' : 'Update'}
          </TamsButton>
          <Divider orientation="vertical" />
        </div>
      }
    >
      <div className="mx-auto max-w-3xl space-y-3 py-3 ">
        <TamsTextInput
          label="Role Name"
          value={roleNameState}
          onChange={(e) => setRoleName(e.target.value)}
          withAsterisk
          error={error}
        />
        <TamsTextArea
          description="Role description"
          value={descriptionState}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Paper className="space-y-3" p={'md'}>
          {data?.map((item, index) => {
            const checkedObj = checkedObject[item.key] || new Set()
            const isDisabled = !item.children?.length
            const hasGrandChildren = item.children?.some(
              (child) => child.children?.length,
            )
            const isAllSelected = isDisabled
              ? false
              : hasGrandChildren
                ? item.children?.every((child) =>
                    child.children?.every((grandchild) =>
                      checkedObj.has(grandchild.id),
                    ),
                  )
                : item.children?.every((child) => checkedObj.has(child.id))
            const indeterminate = hasGrandChildren
              ? item.children?.some((child) =>
                  child.children?.some((grandchild) =>
                    checkedObj.has(grandchild.id),
                  ),
                ) && !isAllSelected
              : item.children?.some((value) => checkedObj.has(value.id)) &&
                !isAllSelected
            return (
              <section key={index + item.key} className="space-y-3">
                <Checkbox
                  size="md"
                  checked={isAllSelected}
                  disabled={isDisabled}
                  indeterminate={indeterminate}
                  className="font-extrabold"
                  label={item.label}
                  onChange={(e) => {
                    handleCheckBoxChange(item.key, e, item.children)
                  }}
                />
                <div className="ml-4 space-y-1.5">
                  {item?.children?.map((child, index2) => {
                    const childCheckedObj = checkedObject[item.key] || new Set()
                    const isChildAllSelected = child.children?.every(
                      (grandChild) =>
                        checkedObject[item.key]?.has(grandChild.id),
                    )
                    const isChildIndeterminate =
                      child.children?.some((grandChild) =>
                        checkedObject[item.key]?.has(grandChild.id),
                      ) && !isChildAllSelected
                    return (
                      <div className=" space-y-3" key={index2}>
                        <Checkbox
                          label={child.label}
                          className="text-gray-800 font-medium"
                          checked={
                            child.id
                              ? childCheckedObj.has(child.id)
                              : isChildAllSelected
                          }
                          indeterminate={isChildIndeterminate}
                          onChange={(e) => {
                            handleChildCheckBoxChange(item.key, e, child)
                          }}
                        />
                        <div className="ml-4 space-y-1.5">
                          {child.children?.map((i, j) => {
                            const grandChildCheckedObj =
                              checkedObject[item.key] || new Set()
                            return (
                              <Checkbox
                                key={i.id + j}
                                label={i.label}
                                size="xs"
                                checked={grandChildCheckedObj.has(i.id)}
                                onChange={(e) => {
                                  const newCheckedPermissions =
                                    checkedObject[item.key] || new Set()
                                  if (e.currentTarget.checked) {
                                    newCheckedPermissions.add(i.id)
                                  } else {
                                    newCheckedPermissions.delete(i.id)
                                  }
                                  setCheckedObject((prev) => ({
                                    ...prev,
                                    [item.key]: newCheckedPermissions,
                                  }))
                                }}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </Paper>
      </div>
    </TamsDrawer>
  )
}

export default CreateEditPermissionSettings
