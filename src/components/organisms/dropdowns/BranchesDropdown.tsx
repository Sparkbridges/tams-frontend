import { useTamsStore } from '#/lib'
import { CheckIcon, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { useState } from 'react'
import {
  BuildingOfficeIcon,
  CaretDownIcon,
  DotIcon,
} from '@phosphor-icons/react'

const BranchesDropdown = () => {
  const { user, activeBranch, setActiveBranch } = useTamsStore((state) => state)
  const [query, setQuery] = useState('')
  const items = user?.managingBranches.filter((item) =>
    item.station_name.toLowerCase().includes(query.toLowerCase().trim()),
  )

  const displayName =
    activeBranch === 'all'
      ? 'All Branches'
      : user?.managingBranches.find(
          (branch) => branch.id.toString() === activeBranch,
        )?.station_name || 'Select Branch'
  return (
    <Menu shadow="md" width={290} position="bottom-end">
      <Menu.Target>
        <UnstyledButton className="hover:bg-gray-300 px-2 py-1.5 rounded-sm w-full sm:w-auto">
          <Group>
            <BuildingOfficeIcon />
            <div className="flex-1">
              <Text size="sm">{displayName}</Text>
            </div>
            <CaretDownIcon />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown className="pb-4">
        <Menu.Search
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search items"
          styles={{
            input: {
              border: '1px solid #ced4da',
              borderRadius: '99px 99px 99px 99px',
            },
            wrapper: {
              padding: '12px',
            },
          }}
        />
        <section className="h-50 overflow-y-auto">
          <Menu.Item
            className={`${activeBranch === 'all' ? 'bg-gray-100' : ''}`}
            leftSection={
              activeBranch === 'all' ? (
                <CheckIcon size={16} />
              ) : (
                <DotIcon
                  className="bg-transparent text-transparent"
                  size={16}
                />
              )
            }
            onClick={() => setActiveBranch('all')}
          >
            {'All Branches'}
          </Menu.Item>
          {Array.isArray(items) &&
            items.length > 0 &&
            items.map((branch) => (
              <Menu.Item
                className={`${activeBranch === branch.id.toString() ? 'bg-gray-100' : ''}`}
                leftSection={
                  activeBranch === branch.id.toString() ? (
                    <CheckIcon size={16} />
                  ) : (
                    <DotIcon
                      className="bg-transparent text-transparent"
                      size={16}
                    />
                  )
                }
                key={branch.id}
                onClick={() => setActiveBranch(branch.id.toString())}
              >
                {branch.station_name}
              </Menu.Item>
            ))}
          {items?.length === 0 && (
            <Text c="dimmed" size="sm" ta="center" py="xs">
              Nothing found
            </Text>
          )}
        </section>
      </Menu.Dropdown>
    </Menu>
  )
}

export default BranchesDropdown
