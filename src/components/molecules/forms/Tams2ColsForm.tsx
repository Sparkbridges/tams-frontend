import {
  TamsDateInput,
  TamsDropzone,
  TamsMultiSelect,
  TamsSelectInput,
  TamsSwitchInput,
  TamsTextArea,
  TamsTextInput,
} from '#/components/atoms'
import type { TamsBy2ColsFormFields } from '#/lib'
import { Grid, Paper, Text } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import { TamsPhoneInput, TamsSearchDropdown } from '../inputs'
import type { FileWithPath } from '@mantine/dropzone'

type Props<T, TTransform = (values: T) => T> = {
  fields: TamsBy2ColsFormFields[]
  form: UseFormReturnType<T, TTransform>
}

const Tams2ColsForm = <T, TTransform = (values: T) => T>({
  fields,
  form,
}: Props<T, TTransform>) => {
  return (
    <section className="space-y-4">
      {fields.map((field) => (
        <div
          className="grid grid-cols-2 lg:grid-cols-12 space-y-3"
          key={field.title}
        >
          <div className="col-span-2 lg:col-span-5">
            <Text fw={600}>{field.title}</Text>
          </div>

          <Paper p={'lg'} withBorder className="col-span-2 lg:col-span-7">
            <Grid>
              {field.fields.map((subField) => {
                if (subField.type == 'text') {
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsTextInput
                        label={subField.label}
                        key={form.key(subField.name)}
                        {...form.getInputProps(subField.name)}
                        withAsterisk={subField.required}
                        readOnly={subField.readonly}
                        hidden={subField.hidden}
                        disabled={subField.disabled}
                      />
                    </Grid.Col>
                  )
                }
                if (subField.type == 'select') {
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsSelectInput
                        label={subField.label}
                        key={form.key(subField.name)}
                        {...form.getInputProps(subField.name)}
                        withAsterisk={subField.required}
                        data={subField.options}
                        searchable
                      />
                    </Grid.Col>
                  )
                }
                if (subField.type == 'multi-select') {
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsMultiSelect
                        label={subField.label}
                        key={form.key(subField.name)}
                        {...form.getInputProps(subField.name)}
                        withAsterisk={subField.required}
                        data={subField.options}
                        searchable
                      />
                    </Grid.Col>
                  )
                }
                if (subField.type == 'phone') {
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsPhoneInput
                        label={subField.label}
                        withAsterisk={subField.required}
                        value={
                          (
                            form.getValues() as unknown as Record<
                              string,
                              string | undefined
                            >
                          )[subField.name]
                        }
                        onChange={(value) =>
                          form.setValues({
                            [subField.name]: value,
                          } as unknown as Partial<T>)
                        }
                        error={form.getInputProps(subField.name).error}
                      />
                    </Grid.Col>
                  )
                }
                if (subField.type == 'textarea') {
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsTextArea
                        label={subField.label}
                        key={form.key(subField.name)}
                        {...form.getInputProps(subField.name)}
                      />
                    </Grid.Col>
                  )
                }
                if (subField.type == 'date') {
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsDateInput
                        label={subField.label}
                        key={form.key(subField.name)}
                        {...form.getInputProps(subField.name)}
                        withAsterisk={subField.required}
                      />
                    </Grid.Col>
                  )
                }
                if (subField.type == 'switch') {
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsSwitchInput
                        size="md"
                        label={subField.label}
                        key={form.key(subField.name)}
                        {...form.getInputProps(subField.name, {
                          type: 'checkbox',
                        })}
                        withAsterisk={subField.required}
                      />
                    </Grid.Col>
                  )
                }
                if (subField.type === 'file') {
                  const newValue = (
                    form.getValues() as unknown as Record<
                      string,
                      FileWithPath | undefined
                    >
                  )[subField.name]
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsDropzone
                        title={subField.label}
                        onDrop={(files) =>
                          form.setValues({
                            [subField.name]: files[0],
                          } as unknown as Partial<T>)
                        }
                        value={newValue ? [newValue] : []}
                        onremove={()=> form.setValues({
                          [subField.name]: undefined,
                        } as unknown as Partial<T>)}
                        error={form.errors[subField.name] as string}
                      />
                    </Grid.Col>
                  )
                }
                if (subField.type == 'search-dropdown') {
                  return (
                    <Grid.Col
                      span={{ base: 12, md: 6, lg: subField.cols }}
                      key={subField.name}
                    >
                      <TamsSearchDropdown
                        withAsterisk={subField.required}
                        dropdownclassname="bg-gray-50"
                        dropdownitemclassname="hover:bg-gray-200"
                        label={subField.label}
                        key={form.key(subField.name)}
                        {...form.getInputProps(subField.name)}
                        value={
                          (
                            form.getValues() as unknown as Record<
                              string,
                              string | undefined
                            >
                          )[subField.name]
                        }
                        selectedValue={
                          (
                            form.getValues() as unknown as Record<
                              string,
                              string | undefined
                            >
                          )[subField.alias as string]
                        }
                        onOptionSelect={(item) =>
                          form.setValues({
                            [`${subField.alias}`]: item.value,
                            [`${subField.name}`]: item.label,
                          } as unknown as Partial<T>)
                        }
                        data={subField.options}
                      />
                    </Grid.Col>
                  )
                }
                return (
                  <Grid.Col
                    span={{ base: 12, md: 6, lg: subField.cols }}
                    key={subField.name}
                  >
                    {subField.label}
                  </Grid.Col>
                )
              })}
            </Grid>
          </Paper>
        </div>
      ))}
    </section>
  )
}

export default Tams2ColsForm
