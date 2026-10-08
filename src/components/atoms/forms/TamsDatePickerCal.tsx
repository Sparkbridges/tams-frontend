import { DatePicker } from '@mantine/dates'
import type { DatePickerProps } from '@mantine/dates'

type TamsDatePickerCalProps = DatePickerProps

const TamsDatePickerCal = (props: TamsDatePickerCalProps) => {
  return <DatePicker {...props} />
}

export default TamsDatePickerCal
