import { TamsNumberInput } from '#/components/atoms'
import { CurrencyNgnIcon, MinusIcon } from '@phosphor-icons/react'

type Props = {
  label: string
  values: number[]
  onChange: (name: string, value: number | string) => void
  names: string[]
  withAsterisk?: boolean
  placeholders?: string[]
  errors?: string[]
}

const TamsCurrencyRange = ({
  label,
  values,
  onChange,
  names,
  withAsterisk,
  placeholders,
  errors,
}: Props) => {
  const icon = <CurrencyNgnIcon size={20} />
  return (
    <section className="flex flex-col gap-1">
      <div className="text-sm flex gap-1 font-semibold">
        {label}
        {withAsterisk && <span className="text-red-500">*</span>}
      </div>
      <div className="flex items-center gap-2">
        <TamsNumberInput
          value={values[0]}
          onChange={(value) => onChange(names[0], value)}
          placeholder={placeholders?.[0]}
          thousandSeparator=","
          rightSection={icon}
          allowDecimal={false}
          allowLeadingZeros={false}
          allowNegative={false}
          error={errors?.[0]}
        />
        <MinusIcon />
        <TamsNumberInput
          value={values[1]}
          name={names[1]}
          onChange={(value) => onChange(names[1], value)}
          placeholder={placeholders?.[1]}
          thousandSeparator=","
          rightSection={icon}
          allowDecimal={false}
          allowLeadingZeros={false}
          allowNegative={false}
          error={errors?.[1]}
        />
      </div>
    </section>
  )
}

export default TamsCurrencyRange
