import { Button } from '@mantine/core'
import type { ButtonProps } from '@mantine/core'

type TamsButtonProps = ButtonProps & {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}

const TamsButton = ({ children, ...props }: TamsButtonProps) => {
  return <Button {...props}>{children}</Button>
}

export default TamsButton
