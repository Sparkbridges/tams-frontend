import { Alert, Button, Stack, Text } from '@mantine/core'
import { getErrorMessage } from '#/lib/utils'

export function AttendanceAccessDenied() {
  return (
    <Alert color="red" title="Access denied" role="alert">
      You do not have permission to access this attendance feature.
    </Alert>
  )
}

export function AttendanceQueryError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  return (
    <Alert color="red" title="Unable to load attendance data" role="alert">
      <Stack gap="sm">
        <Text size="sm">{getErrorMessage(error)}</Text>
        <Button variant="light" color="red" onClick={retry}>
          Try again
        </Button>
      </Stack>
    </Alert>
  )
}
