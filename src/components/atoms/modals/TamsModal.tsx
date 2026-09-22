import { Modal } from '@mantine/core'

type TamsModalProps = Modal.Props & {
  children?: React.ReactNode
  allowBlur?: boolean
  allowBackgroundOpacity?: number
  titleFontSize?: string | number
}

const TamsModal = ({ children, ...props }: TamsModalProps) => {
  return (
    <>
      <Modal
        {...props}
        overlayProps={{
          backgroundOpacity: props.allowBackgroundOpacity ?? 0.55,
          blur: props.allowBlur ? 3 : 0,
        }}
        styles={{
          title: {
            fontWeight: 'bold',
            color: 'gray',
            fontSize: props.titleFontSize ?? '18px',
          },
        }}
      >
        {children}
      </Modal>
    </>
  )
}

export default TamsModal
