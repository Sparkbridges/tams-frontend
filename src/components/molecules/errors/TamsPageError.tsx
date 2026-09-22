import { Button, Container, Group, Text, Title } from '@mantine/core'
import classes from '#/styles/css/modules/Errors.module.css'
import { useRouter } from '@tanstack/react-router'

const errors = {
  '404': {
    title: 'Nothing to see here',
    description:
      'Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support.',
    code: 404,
  },
  '500': {
    title: 'Something went wrong',
    description:
      'An unexpected error occurred. Please try again later or contact support if the problem persists.',
    code: 500,
  },
}
type TamsPageErrorProps = {
  type: '404' | '500'
}
export default function TamsPageError({ type }: TamsPageErrorProps) {
    const { title, description, code } = errors[type]
    const router = useRouter()
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Text className='absolute text-[362px] font-extrabold top-1/6 -translate-y-1/6 left-1/2 text-gray-400 -translate-x-1/2'>{code}</Text>
        <div className={classes.content}>
          <Title className={classes.title}>{title}</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            {description}
          </Text>
          <Group justify="center">
            <Button size='lg' radius={'xl'} onClick={() => router.history.back()}>Take me back</Button>
          </Group>
        </div>
      </div>
    </Container>
  )
}
