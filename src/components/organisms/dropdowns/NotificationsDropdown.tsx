import { ActionIcon, Indicator, Menu } from '@mantine/core'
import { BellIcon } from '@phosphor-icons/react'

const NotificationsDropdown = () => {
  return (
    <Menu shadow="md" width={320} position='bottom-end'>
      <Menu.Target>
        <ActionIcon
          size={42}
          variant="transparent"
          aria-label="ActionIcon with size as a number"
        >
          <Indicator color="red" size={14} label={0} maxValue={10}>
            <BellIcon color='gray' size={24} />
          </Indicator>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Divider />

        {/* {options.map((option, index) => {
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
        })} */}
      </Menu.Dropdown>
    </Menu>
  )
}

export default NotificationsDropdown
