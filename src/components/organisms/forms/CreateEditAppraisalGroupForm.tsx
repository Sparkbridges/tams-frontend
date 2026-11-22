import {
  TamsNumberInput,
  TamsSpinner,
  TamsTextArea,
  TamsTextInput,
  TamsButton,
} from '#/components/atoms'
import {
  Tams2ColsForm,
  TamsActionWidget,
  TamsPageError,
} from '#/components/molecules'
import { useCreateEditAppraisalGroupForm } from '#/lib'
import type {
  TAppraisalKpiCategory,
  TAppraisalPerformanceArea,
} from '#/lib/types/api/performance'
import {
  ActionIcon,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'

type Props = {
  type: 'create' | 'edit'
  id?: number
}

const CreateEditAppraisalGroupForm = ({ type, id }: Props) => {
  const {
    form,
    fields,
    openedActionWidget,
    handleSubmit,
    handleCancel,
    loading,
    isLoading,
    isError,
    performanceAreas,
    setPerformanceAreas,
  } = useCreateEditAppraisalGroupForm({ type, id })

  if (isError) return <TamsPageError type="404" />

  const updateArea = (
    areaIndex: number,
    patch: Partial<TAppraisalPerformanceArea>,
  ) => {
    setPerformanceAreas(
      performanceAreas.map((area, index) =>
        index === areaIndex ? { ...area, ...patch } : area,
      ),
    )
  }

  const updateCategory = (
    areaIndex: number,
    categoryIndex: number,
    patch: Partial<TAppraisalKpiCategory>,
  ) => {
    setPerformanceAreas(
      performanceAreas.map((area, index) =>
        index === areaIndex
          ? {
              ...area,
              kpi_categories: area.kpi_categories.map((category, j) =>
                j === categoryIndex ? { ...category, ...patch } : category,
              ),
            }
          : area,
      ),
    )
  }

  return (
    <div className="relative">
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <Tams2ColsForm fields={fields} form={form} />

      <div className="grid grid-cols-2 lg:grid-cols-12 space-y-3 mt-4">
        <div className="col-span-2 lg:col-span-5">
          <Text fw={600}>Performance Areas</Text>
        </div>
        <div className="col-span-2 lg:col-span-7 space-y-4">
          {performanceAreas.map((area, areaIndex) => (
            <Paper key={area.id ?? areaIndex} withBorder p="lg" radius="lg">
              <Group justify="space-between">
                <Title order={4}>Performance Area {areaIndex + 1}</Title>
                <ActionIcon
                  variant="light"
                  color="red"
                  aria-label="Remove performance area"
                  disabled={performanceAreas.length === 1}
                  onClick={() =>
                    setPerformanceAreas(
                      performanceAreas.filter(
                        (_, index) => index !== areaIndex,
                      ),
                    )
                  }
                >
                  <TrashIcon />
                </ActionIcon>
              </Group>
              <Stack mt="md">
                <TamsTextInput
                  label="Performance Area"
                  value={area.name}
                  required
                  onChange={(event) =>
                    updateArea(areaIndex, {
                      name: event.currentTarget.value,
                    })
                  }
                />
                <TamsNumberInput
                  label="Weight"
                  value={area.weight}
                  min={0}
                  max={100}
                  required
                  onChange={(value) =>
                    updateArea(areaIndex, { weight: Number(value) })
                  }
                />
                <TamsTextArea
                  label="Description"
                  value={area.description}
                  required
                  onChange={(event) =>
                    updateArea(areaIndex, {
                      description: event.currentTarget.value,
                    })
                  }
                />

                {area.kpi_categories.map((category, categoryIndex) => (
                  <Paper key={category.id ?? categoryIndex} withBorder p="md">
                    <Group justify="space-between">
                      <Text fw={600}>
                        Key Performance Indicator {categoryIndex + 1}
                      </Text>
                      <ActionIcon
                        variant="light"
                        color="red"
                        aria-label="Remove KPI"
                        disabled={area.kpi_categories.length === 1}
                        onClick={() =>
                          updateArea(areaIndex, {
                            kpi_categories: area.kpi_categories.filter(
                              (_, index) => index !== categoryIndex,
                            ),
                          })
                        }
                      >
                        <TrashIcon />
                      </ActionIcon>
                    </Group>
                    <Stack mt="md">
                      <TamsTextInput
                        label="KPI Name"
                        value={category.name}
                        required
                        onChange={(event) =>
                          updateCategory(areaIndex, categoryIndex, {
                            name: event.currentTarget.value,
                          })
                        }
                      />
                      <TamsNumberInput
                        label="Weight"
                        value={category.weight}
                        min={0}
                        max={100}
                        required
                        onChange={(value) =>
                          updateCategory(areaIndex, categoryIndex, {
                            weight: Number(value),
                          })
                        }
                      />
                      <TamsTextArea
                        label="Description"
                        value={category.description}
                        required
                        onChange={(event) =>
                          updateCategory(areaIndex, categoryIndex, {
                            description: event.currentTarget.value,
                          })
                        }
                      />

                      {(category.kpi_sub_categories ?? []).map(
                        (subcategory, subcategoryIndex) => (
                          <Paper
                            key={subcategory.id ?? subcategoryIndex}
                            withBorder
                            p="md"
                          >
                            <Group justify="space-between">
                              <Text fw={600}>
                                Subcategory {subcategoryIndex + 1}
                              </Text>
                              <ActionIcon
                                variant="light"
                                color="red"
                                aria-label="Remove subcategory"
                                onClick={() =>
                                  updateCategory(areaIndex, categoryIndex, {
                                    kpi_sub_categories:
                                      category.kpi_sub_categories.filter(
                                        (_, index) =>
                                          index !== subcategoryIndex,
                                      ),
                                  })
                                }
                              >
                                <TrashIcon />
                              </ActionIcon>
                            </Group>
                            <Stack mt="md">
                              <TamsTextInput
                                label="Subcategory Name"
                                value={subcategory.name}
                                required
                                onChange={(event) =>
                                  updateCategory(areaIndex, categoryIndex, {
                                    kpi_sub_categories:
                                      category.kpi_sub_categories.map(
                                        (item, index) =>
                                          index === subcategoryIndex
                                            ? {
                                                ...item,
                                                name: event.currentTarget.value,
                                              }
                                            : item,
                                      ),
                                  })
                                }
                              />
                              <TamsNumberInput
                                label="Weight"
                                value={subcategory.weight}
                                min={0}
                                max={100}
                                required
                                onChange={(value) =>
                                  updateCategory(areaIndex, categoryIndex, {
                                    kpi_sub_categories:
                                      category.kpi_sub_categories.map(
                                        (item, index) =>
                                          index === subcategoryIndex
                                            ? {
                                                ...item,
                                                weight: Number(value),
                                              }
                                            : item,
                                      ),
                                  })
                                }
                              />
                              <TamsTextArea
                                label="Description"
                                value={subcategory.description}
                                required
                                onChange={(event) =>
                                  updateCategory(areaIndex, categoryIndex, {
                                    kpi_sub_categories:
                                      category.kpi_sub_categories.map(
                                        (item, index) =>
                                          index === subcategoryIndex
                                            ? {
                                                ...item,
                                                description:
                                                  event.currentTarget.value,
                                              }
                                            : item,
                                      ),
                                  })
                                }
                              />
                            </Stack>
                          </Paper>
                        ),
                      )}

                      <TamsButton
                        variant="light"
                        size="sm"
                        leftSection={<PlusIcon />}
                        onClick={() =>
                          updateCategory(areaIndex, categoryIndex, {
                            kpi_sub_categories: [
                              ...(category.kpi_sub_categories ?? []),
                              { name: '', weight: 0, description: '' },
                            ],
                          })
                        }
                      >
                        Add KPI Subcategory
                      </TamsButton>
                    </Stack>
                  </Paper>
                ))}

                <TamsButton
                  variant="light"
                  leftSection={<PlusIcon />}
                  onClick={() =>
                    updateArea(areaIndex, {
                      kpi_categories: [
                        ...area.kpi_categories,
                        {
                          name: '',
                          weight: 0,
                          description: '',
                          kpi_sub_categories: [],
                        },
                      ],
                    })
                  }
                >
                  Add KPI
                </TamsButton>
              </Stack>
            </Paper>
          ))}

          <TamsButton
            variant="outline"
            leftSection={<PlusIcon />}
            onClick={() =>
              setPerformanceAreas([
                ...performanceAreas,
                {
                  name: '',
                  weight: 0,
                  description: '',
                  kpi_categories: [
                    {
                      name: '',
                      weight: 0,
                      description: '',
                      kpi_sub_categories: [],
                    },
                  ],
                },
              ])
            }
          >
            Add Performance Area
          </TamsButton>
        </div>
      </div>

      <TamsActionWidget
        loading={loading}
        title={
          type === 'create'
            ? 'Unsaved new Appraisal Group'
            : 'Unsaved changes to Appraisal Group'
        }
        opened={openedActionWidget}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateEditAppraisalGroupForm
