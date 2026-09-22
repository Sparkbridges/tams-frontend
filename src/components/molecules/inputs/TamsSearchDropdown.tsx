import { TamsAvatar, TamsTextInput } from '#/components/atoms'
import type { MantineSize, TextInputProps } from '@mantine/core'
import { Loader } from '@mantine/core'
import { useClickOutside, useDisclosure } from '@mantine/hooks'
import type { Icon } from '@phosphor-icons/react'

type TamsSearchDropdownProps = TextInputProps & {
  loading?: boolean
  data?: {
    label: string
    value: string | number
    icon?: Icon
    action?: () => void
  }[]
  dataLeft?: 'avatar' | 'icon'
  avatarSize?: MantineSize
  dropdownclassname?: string
  dropdownitemclassname?: string
  onOptionSelect: (value: Record<string, any>) => void
  selectedValue?: string
  onEmptyChange?: () => void
  withAsterisk?: boolean
}

const TamsSearchDropdown = ({
  loading,
  data,
  dataLeft = 'icon',
  avatarSize = 'sm',
  onOptionSelect,
  selectedValue,
  onEmptyChange,
  withAsterisk,
  ...props
}: TamsSearchDropdownProps) => {
  const dropdownclassName = `shadow py-5 absolute left-0 w-full z-2 mt-1 rounded-sm overflow-y-auto max-h-80 ${props.dropdownclassname ?? ''}`
  const dropdownitemclassName = `py-3 px-5 cursor-pointer flex gap-2 items-center ${props.dropdownitemclassname ?? ''}`

  const [opened, { open, close }] = useDisclosure(false)

  const ref = useClickOutside(() => close())

 const handleSelect = (item: {
   label: string
   value: string | number
   icon?: Icon
   action?: () => void
 }) => {
   onOptionSelect(item)
   item.action?.()
   close()
 }

 const showDropdown = opened && (loading || Boolean(data))
  return (
    <div className="relative">
      <TamsTextInput withAsterisk={withAsterisk}
        {...props}
        onFocus={() => {
          open()
        }}
      />
      {showDropdown && (
        <div ref={ref} className={dropdownclassName}>
          {loading && (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          )}
          {data && data.length == 0 ? (
            <div className="p-2 text-center text-gray-500">
              No results found
            </div>
          ) : (
            data?.map((item) => (
              <div
                className={dropdownitemclassName}
                key={item.value}
                onClick={() => {
                  handleSelect(item)
                }}
              >
                {dataLeft === 'icon' && item.icon && <item.icon />}
                {dataLeft === 'avatar' && !item.icon && (
                  <TamsAvatar name={item.label} size={avatarSize} />
                )}
                {item.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default TamsSearchDropdown
