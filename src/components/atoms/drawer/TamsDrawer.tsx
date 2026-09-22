import { Drawer } from '@mantine/core'

type DrawerProps = React.ComponentProps<typeof Drawer> & {
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
}

const TamsDrawer = ({ children, ...props }: DrawerProps) => {
  return (
    <Drawer.Root position={props.position ?? 'right'} {...props}>
      <Drawer.Overlay />
      <Drawer.Content className="rounded-l-2xl">
        <Drawer.Header className="bg-white text-xl">
          <Drawer.Title className="text-xl font-extrabold">
            {props.title}
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body className="bg-gray-100">{children}</Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}

export default TamsDrawer
