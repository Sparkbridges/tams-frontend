import type { z } from 'zod/v4'
import type { UseFormInput } from '@mantine/form'
import { useForm, schemaResolver } from '@mantine/form'

type TamsFormProps<
  T extends Record<string, unknown>,
  TTransformValues extends (values: T) => any = (values: T) => T,
> = {
  schema: z.ZodType<T>
  defaultValues?: UseFormInput<T>['initialValues']
  validateInputOnChange?: boolean
  onValuesChange?: (values: T, previous: T) => void
  transformValues?: TTransformValues
}

const useTamsForm = <
  T extends Record<string, unknown>,
  TTransformValues extends (values: T) => any = (values: T) => T,
>({
  schema,
  defaultValues,
  validateInputOnChange = false,
  onValuesChange,
  transformValues,
}: TamsFormProps<T, TTransformValues>) => {
  return useForm<T, TTransformValues>({
    mode: 'uncontrolled',
    initialValues: defaultValues,
    validate: schemaResolver(schema),
    validateInputOnChange,
    onValuesChange: onValuesChange,
    transformValues,
  })
}

export default useTamsForm
