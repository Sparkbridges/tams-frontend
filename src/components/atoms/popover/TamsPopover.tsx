import { Popover } from '@mantine/core'
import type { FloatingPosition, MantineShadow } from '@mantine/core'

type TamsPopoverProps = {
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
}: TamsPopoverProps) => {
  return (
    <Popover width={width} position={position} shadow={shadow}>
      <Popover.Target>{trigger}</Popover.Target>
      <Popover.Dropdown className="p-1">{children}</Popover.Dropdown>
    </Popover>
  )
}

export default TamsPopover
