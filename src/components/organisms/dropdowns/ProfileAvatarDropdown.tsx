import { TamsAvatar } from '#/components/atoms'
import { useAuth, useTamsStore } from '#/lib'
import type { TamsMenuItem } from '#/lib'
import { Menu, Text, UnstyledButton, Group } from '@mantine/core'
import { GearSixIcon, CaretDownIcon, SignOutIcon, PasswordIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'

const ProfileAvatarDropdown = () => {
  const user = useTamsStore((state) => state.user)
  const { handleLogout, loading } = useAuth()

  const navigate = useNavigate()

  const handleNavigateTo = (path: string) => navigate({ to: path })

  const options: TamsMenuItem[] = [
    {
      type: 'item',
      label: 'Profile',
      icon: GearSixIcon,
      onClick: () => handleNavigateTo('/profile'),
    },
    {
      type: 'item',
      label: 'Change Password',
      icon: PasswordIcon,
      onClick: () => handleNavigateTo('/change-password'),
    },
    { type: 'divider' },
    {
      type: 'item',
      color: 'red',
      label: 'Logout',
      icon: SignOutIcon,
      onClick: handleLogout,
    },
  ]
  return (
    <Menu shadow="md" width={320}>
      <Menu.Target>
        <UnstyledButton className=" hover:bg-gray-300 px-2 py-1.5 rounded-sm">
          <Group>
            <TamsAvatar
              size={'sm'}
              radius="xl"
              color="initials"
              alt={user?.first_name + ' ' + user?.last_name}
              name={user?.first_name + ' ' + user?.last_name}
            />
            <div className="flex-1 hidden sm:flex">
              <Text size="sm">{user?.first_name + ' ' + user?.last_name}</Text>
            </div>
            <CaretDownIcon />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Group className="px-3 py-2">
          <TamsAvatar
            size={'md'}
            radius="xl"
            color="initials"
            alt={user?.first_name + ' ' + user?.last_name}
            name={user?.first_name + ' ' + user?.last_name}
          />
          <div className="flex-1">
            <Text size="sm">{user?.first_name + ' ' + user?.last_name}</Text>
            <Text c="dimmed" size="xs">
              {user?.email}
            </Text>
          </div>
        </Group>
        <Menu.Divider />

        {options.map((option, index) => {
          if (option.type === 'divider') {
            return <Menu.Divider key={index} />
          }
          if (option.type === 'item') {
            return (
              <Menu.Item
                className="py-2"
                key={index}
                color={option.color}
                leftSection={
                  option.icon ? <option.icon size={14} /> : undefined
                }
                disabled={option.label === 'Logout' && loading}
                onClick={option.onClick}
              >
                {option.label}
              </Menu.Item>
            )
          }
          return null
        })}
      </Menu.Dropdown>
    </Menu>
  )
}

export default ProfileAvatarDropdown
