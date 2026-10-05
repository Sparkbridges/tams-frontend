import { Drawer } from '@mantine/core'

type DrawerProps = React.ComponentProps<typeof Drawer> & {
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
  headerProps?: React.ReactNode
  bodyclassname?: string
}

const TamsDrawer = ({ children, ...props }: DrawerProps) => {
  const bodyClassName = `bg-gray-100 ${props.bodyclassname ?? ''}`
  return (
    <Drawer.Root position={props.position ?? 'right'} {...props}>
      <Drawer.Overlay />
      <Drawer.Content className="rounded-l-2xl">
        <Drawer.Header className="bg-white text-xl flex">
          <Drawer.Title className="text-xl font-extrabold">
            {props.title}
          </Drawer.Title>
          <div className="flex items-center space-x-2">
            {props.headerProps}
            <Drawer.CloseButton />
          </div>
        </Drawer.Header>
        <Drawer.Body className={bodyClassName}>{children}</Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}

export default TamsDrawer
