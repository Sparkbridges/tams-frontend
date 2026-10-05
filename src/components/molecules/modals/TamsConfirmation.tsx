import { TamsButton, TamsModal } from '#/components/atoms'
import { Divider, Group, Text } from '@mantine/core'

type TamsConfirmationProps = {
  title?: string
  message?: string
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  isCritical?: boolean
  confirmText?: string
  content?: React.ReactNode
}

const TamsConfirmation = ({
  title,
  message,
  opened,
  onClose,
  onConfirm,
  loading,
  isCritical,
  confirmText,
  content,
}: TamsConfirmationProps) => {
  return (
    <TamsModal
      closeOnClickOutside={!isCritical}
      centered
      size={'lg'}
      opened={opened}
      onClose={onClose}
    >
      <section className="pl-8">
        <Text mb={10} fw={700} fz={24}>
          {title}
        </Text>
        <Text color="dimmed">{message}</Text>
        {content && <div>{content}</div>}
      </section>
      <Divider my="lg" />
      <Group justify="flex-end">
        <TamsButton color="gray" radius="xl" size="md" onClick={onClose}>
          Cancel
        </TamsButton>
        <TamsButton
          loading={loading}
          radius="xl"
          size="md"
          variant={!isCritical ? 'filled' : 'light'}
          color={isCritical ? 'red' : undefined}
          onClick={onConfirm}
        >
          {confirmText ?? 'Confirm'}
        </TamsButton>
      </Group>
    </TamsModal>
  )
}

export default TamsConfirmation
