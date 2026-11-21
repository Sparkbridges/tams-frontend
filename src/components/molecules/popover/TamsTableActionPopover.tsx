import { TamsPopover } from '#/components/atoms'
import type { TamsActionPopoverOption } from '#/lib'
import { ActionIcon } from '@mantine/core'
import { DotsThreeIcon } from '@phosphor-icons/react'

type TamsTableActionPopoverProps = {
  data: TamsActionPopoverOption[]
  variant?: 'light' | 'transparent' | 'subtle' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const TamsTableActionPopover = ({
  data,
  variant,
  size,
}: TamsTableActionPopoverProps) => {
  return (
    <TamsPopover
      width={200}
      position="bottom-end"
      shadow="md"
      trigger={
        <ActionIcon
          onClick={(e) => e.stopPropagation()}
          variant={variant ?? 'transparent'}
          size={size ?? 'md'}
        >
          <DotsThreeIcon size={32} />
        </ActionIcon>
      }
    >
      {data.map(
        (item: TamsActionPopoverOption, index: number) =>
          !item.hidden && (
            <div
              style={{ color: item.color }}
              className="hover:bg-gray-100 cursor-pointer flex items-center p-2 text-sm font-medium gap-1"
              onClick={(e) => {
                e.stopPropagation()
                item.action()
              }}
              key={index}
            >
              {item.icon && <item.icon className="mr-2" />}
              {item.label}
            </div>
          ),
      )}
    </TamsPopover>
  )
}

export default TamsTableActionPopover
