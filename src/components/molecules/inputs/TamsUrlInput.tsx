import { TamsTextInput } from '#/components/atoms'
import type { TextInput } from '@mantine/core'

type TamsTextInputProps = TextInput.Props & {
  companySuffix: string
}

const TamsUrlInput = (props: TamsTextInputProps) => {
  return (
    <TamsTextInput
      {...props}
      className={'overflow-hidden'}
      rightSection={
        <div className="mr-25 h-full flex rounded-r-md items-center bg-gray-100 px-3">
          {props.companySuffix}
        </div>
      }
    />
  )
}

export default TamsUrlInput
