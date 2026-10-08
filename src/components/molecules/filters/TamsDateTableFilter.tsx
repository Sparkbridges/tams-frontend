import {
  TamsButton,
  TamsDatePickerCal,
  TamsPopover,
  TamsTextInput,
} from '#/components/atoms'
import { getDatePresets, getPresetLabel } from '#/lib'
import { Divider, Group } from '@mantine/core'
import type { DatesRangeValue, DateValue } from '@mantine/dates'
import { ArrowRightIcon, CalendarDotsIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

type Props = {
  label?: string
  setDateValue: (value: DatesRangeValue) => void
  dateValue: DatesRangeValue
}

const TamsDateTableFilter = ({ label, setDateValue, dateValue }: Props) => {
  const [value, setValue] = useState<DatesRangeValue>([null, null])
  const [opened, setOpened] = useState(false)

  const isRangeComplete = useMemo(
    () => value[0] !== null && value[1] !== null,
    [value],
  )
  const handleReset = () => {
    setValue([null, null])
    setDateValue([null, null])
  }

  const handleApply = () => {
    setDateValue(value)
    setOpened(false)
  }

  const presetLabel = getPresetLabel(dateValue as (string | null)[]) ?? label

  return (
    <>
      <TamsPopover
        opened={opened}
        onChange={setOpened}
        shadow="sm"
        position="bottom-end"
        width={420}
        trigger={
          <TamsButton
            onClick={() => setOpened((o) => !o)}
            className="border-gray-400 text-gray-800"
            variant="outline"
            leftSection={<CalendarDotsIcon />}
          >
            {presetLabel ?? 'Select dates'}
          </TamsButton>
        }
      >
        <div className="p-2 space-y-2">
          <section className="flex items-center gap-3">
            <TamsTextInput
              value={value[0] as string}
              leftSection={<CalendarDotsIcon />}
              onChange={(e) => setValue((prev) => [e.target.value, prev[1]])}
            />
            <ArrowRightIcon />
            <TamsTextInput
              value={value[1] as string}
              leftSection={<CalendarDotsIcon />}
              onChange={(e) => setValue((prev) => [prev[0], e.target.value])}
            />
          </section>
          <TamsDatePickerCal
            type="range"
            presets={getDatePresets()}
            fullWidth
            value={value as unknown as DateValue | undefined}
            onChange={
              setValue as unknown as (value: DateValue | undefined) => void
            }
          />
          <Divider />
          <Group gap="sm" justify="end">
            <TamsButton
              color="gray.5"
              disabled={!isRangeComplete}
              size="md"
              radius={'xl'}
              onClick={handleReset}
            >
              Reset
            </TamsButton>
            <TamsButton
              disabled={!isRangeComplete}
              size="md"
              radius={'xl'}
              onClick={handleApply}
            >
              Apply
            </TamsButton>
          </Group>
        </div>
      </TamsPopover>
    </>
  )
}

export default TamsDateTableFilter
