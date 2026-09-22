import { TamsButton } from '#/components/atoms'
import { Combobox, Divider, Radio, useCombobox } from '@mantine/core'
import { SlidersHorizontalIcon } from '@phosphor-icons/react'

type Props = {
  label: string
  selectedOption: string | undefined
  setSelectedItem: (val: string) => void
  data: { label: string; value: string }[]
  width?: string | number
}

const TamsTableFilter = ({
  label,
  selectedOption,
  setSelectedItem,
  data,
  width = 200,
}: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const options = data.map((item) => (
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
          leftSection={<SlidersHorizontalIcon />}
        >
          <span className="font-normal text-gray-700">{label}:</span>
          <span className="font-medium ml-2">{selectedOption}</span>
        </TamsButton>
      </Combobox.Target>
      <Combobox.Dropdown className='pb-3'>
        <Combobox.Option
          className="flex items-center gap-2"
          value="all"
          key="all"
        >
          <Radio checked={selectedOption === 'all'} />
          All
        </Combobox.Option>
        <Divider my={'sm'} />
        {options}
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default TamsTableFilter
