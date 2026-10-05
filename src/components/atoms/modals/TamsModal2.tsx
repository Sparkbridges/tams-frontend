import { Modal } from '@mantine/core'

type TamsModalProps = Modal.Props & {
  children?: React.ReactNode
  allowBlur?: boolean
  allowBackgroundOpacity?: number
  titleFontSize?: string | number
  bodyClassName?: string
}

const TamsModal2 = ({ children, ...props }: TamsModalProps) => {
  return (
    <>
      <Modal.Root
        {...props}
        styles={{
          title: {
            fontWeight: 'bold',
            color: 'gray',
            fontSize: props.titleFontSize ?? '18px',
          },
        }}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <div></div>
            <Modal.Title>{props.title}</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body className={props.bodyClassName ?? 'px-0 pb-0'}>
            {children}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  )
}

export default TamsModal2
