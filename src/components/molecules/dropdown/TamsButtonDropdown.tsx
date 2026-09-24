import { TamsButton } from '#/components/atoms'
import type { TamsMenuItem } from '#/lib'
import { Menu } from '@mantine/core'
import type { ButtonProps } from '@mantine/core'
import { CaretDownIcon } from '@phosphor-icons/react'

type TamsButtonDropdownProps = ButtonProps & {
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  btnText: string
  options: TamsMenuItem[]
  width?: number
}
const TamsButtonDropdown = ({
  width,
  btnText,
  options,
  ...props
}: TamsButtonDropdownProps) => {
  return (
    <Menu shadow="md" width={width ?? 320}>
      <Menu.Target>
        <TamsButton rightSection={<CaretDownIcon />} {...props}>
          {btnText}
        </TamsButton>
      </Menu.Target>

      <Menu.Dropdown>
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
                disabled={option.disabled}
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

export default TamsButtonDropdown
