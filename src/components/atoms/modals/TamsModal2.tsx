import { Modal } from '@mantine/core'

type TamsModalProps = Modal.Props & {
  children?: React.ReactNode
  allowBlur?: boolean
  allowBackgroundOpacity?: number
  titleFontSize?: string | number
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
            <Modal.Title>{props.title}</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body className="px-0 pb-0">{children}</Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  )
}

export default TamsModal2
