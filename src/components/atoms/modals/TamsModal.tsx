import { Modal } from '@mantine/core'

type TamsModalProps = Modal.Props & {
  children?: React.ReactNode
  allowblur?: boolean
  allowbackgroundopacity?: number
  titlefontsize?: string | number
}

const TamsModal = ({ children, ...props }: TamsModalProps) => {
  return (
    <>
      <Modal
        {...props}
        overlayProps={{
          backgroundOpacity: props.allowbackgroundopacity ?? 0.55,
          blur: props.allowblur ? 3 : 0,
        }}
        styles={{
          title: {
            fontWeight: 'bold',
            color: 'gray',
            fontSize: props.titlefontsize ?? '18px',
          },
        }}
      >
        {children}
      </Modal>
    </>
  )
}

export default TamsModal
