import { Switch } from '@mantine/core'

type Props = Switch.Props & { withAsterisk?: boolean; title?: string }
const TamsSwitchInput = (props: Props) => {
  return (
    <div>
      <label className="flex text-sm font-semibold mb-1 items-center gap-2">
        {props.title ?? 'Select an option'}
        {props.withAsterisk && <span className="text-red-500">*</span>}
      </label>
      <Switch {...props} />
    </div>
  )
}

export default TamsSwitchInput
