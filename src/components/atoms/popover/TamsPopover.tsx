import { Popover } from '@mantine/core'
import type {
  FloatingPosition,
  MantineShadow,
  PopoverProps,
} from '@mantine/core'

type TamsPopoverProps = PopoverProps & {
  width: number
  position: FloatingPosition
  children: React.ReactNode
  trigger: React.ReactNode
  shadow: MantineShadow
}
const TamsPopover = ({
  width = 230,
  position = 'bottom-end',
  children,
  trigger,
  shadow = 'md',
  closeOnClickOutside = true,
  ...others
}: TamsPopoverProps) => {
  return (
    <Popover
      closeOnClickOutside={closeOnClickOutside}
      width={width}
      position={position}
      shadow={shadow}
      {...others}
    >
      <Popover.Target>{trigger}</Popover.Target>
      <Popover.Dropdown className="p-1">{children}</Popover.Dropdown>
    </Popover>
  )
}

export default TamsPopover
