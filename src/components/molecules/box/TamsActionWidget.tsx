import { TTextBrand } from '../brand'
import { TamsButton } from '#/components/atoms'
import { Group, Text, Transition } from '@mantine/core'
import { WarningCircleIcon } from '@phosphor-icons/react'

type Props = {
  onConfirm: () => void
  onCancel: () => void
  opened: boolean
  title: string
  loading: boolean
}

const TamsActionWidget = ({
  onConfirm,
  onCancel,
  opened,
  title,
  loading,
}: Props) => {
  return (
    <Transition
      mounted={opened}
      transition="fade-down"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <div
          style={styles}
          className="bg-neutrals px-5 py-2 gap-x-16 fixed top-0 left-0 z-999 w-full flex items-center"
        >
          <TTextBrand className="block w-36" />
          <div className="flex items-center space-x-1 text-white">
            <WarningCircleIcon />
            <Text className=" italic">{title}</Text>
          </div>

          <Group className="ml-auto">
            <TamsButton
              color="gray.5"
              size="md"
              radius={'xl'}
              onClick={onCancel}
            >
              Cancel
            </TamsButton>
            <TamsButton
              loading={loading}
              disabled={loading}
              size="md"
              radius={'xl'}
              onClick={onConfirm}
            >
              Save
            </TamsButton>
          </Group>
        </div>
      )}
    </Transition>
  )
}

export default TamsActionWidget
