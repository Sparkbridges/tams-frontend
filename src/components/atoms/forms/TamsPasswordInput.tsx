import { PasswordInput } from '@mantine/core'

type TamsPasswordInputProps = React.ComponentProps<typeof PasswordInput>

export default function TamsPasswordInput(props: TamsPasswordInputProps) {
  return <PasswordInput {...props} />
}
