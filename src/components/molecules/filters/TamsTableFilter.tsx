import { TamsButton } from '#/components/atoms'
import {
  CloseButton,
  Combobox,
  Divider,
  Radio,
  ScrollArea,
  useCombobox,
} from '@mantine/core'
import { SlidersHorizontalIcon } from '@phosphor-icons/react'

type Props = {
  label: string
  selectedOption: string | undefined
  setSelectedItem: (val: string | undefined) => void
  data?: { label: string; value: string }[]
  width?: string | number
  showLabelAsSelectedOption?: boolean
  disableAllOption?: boolean
  overrideIcon?: React.ReactNode
}

const TamsTableFilter = ({
  label,
  selectedOption,
  setSelectedItem,
  data,
  width = 200,
  showLabelAsSelectedOption = false,
  disableAllOption = false,
  overrideIcon,
}: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const options = data?.map((item) => (
    <Combobox.Option
      className="flex items-center gap-2"
      value={item.value}
      key={item.value}
    >
      <Radio checked={selectedOption === item.value} />
      {item.label}
    </Combobox.Option>
  ))
  return (
    <Combobox
      width={width}
      position="bottom-end"
      store={combobox}
      onOptionSubmit={(val) => {
        setSelectedItem(val)
        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <TamsButton
          className="border-gray-400 text-gray-800"
          variant="outline"
          onClick={() => combobox.toggleDropdown()}
          leftSection={overrideIcon ?? <SlidersHorizontalIcon />}
        >
          <span className="font-normal text-gray-700">{label}:</span>
          <span className="font-medium ml-2">
            {showLabelAsSelectedOption
              ? data?.find((item) => item.value === selectedOption)?.label
              : selectedOption}
          </span>
          {disableAllOption && selectedOption !== undefined && (
            <CloseButton
              size={'xs'}
              className="ml-auto text-red-400"
              onClick={() => setSelectedItem(undefined)}
            />
          )}
        </TamsButton>
      </Combobox.Target>
      <Combobox.Dropdown className="pb-3">
        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={300}>
            {!disableAllOption && (
              <>
                <Combobox.Option
                  className="flex items-center gap-2"
                  value="all"
                  key="all"
                >
                  <Radio checked={selectedOption === 'all'} />
                  All
                </Combobox.Option>
                <Divider my={'sm'} />
              </>
            )}
            {options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default TamsTableFilter
