import {
  TamsBanner,
  TamsGoBackNavigation,
  TamsPageError,
  TamsSpinner,
} from '#/components'
import { useFetchAppraisalGroup, usePerformanceAccess } from '#/lib'
import { LoadingOverlay, Paper, Stack, Text, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/performance/appraisal/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { canViewAppraisals } = usePerformanceAccess()
  const { data, isLoading, isError } = useFetchAppraisalGroup(Number(id))

  if (!canViewAppraisals) return <TamsPageError type="403" />
  if (isError) return <TamsPageError type="404" />

  const group = data?.data

  return (
    <div className="relative space-y-4 px-7 pb-8">
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <TamsGoBackNavigation label="Back to Appraisal Groups" />
      <TamsBanner />

      {group && (
        <Stack>
          <Paper withBorder p="lg" radius="lg">
            <Title order={4}>{group.name}</Title>
            <Text c="dimmed" mt="xs">
              {group.description || 'No description'}
            </Text>
            <Text mt="md">
              Period: {group.appraisalPeriod?.name || 'Not provided'}
            </Text>
            <Text>Year: {group.appraisal_year}</Text>
            <Text>
              Status:{' '}
              {group.has_ended
                ? 'Ended'
                : group.is_active
                  ? 'Started'
                  : 'Pending'}
            </Text>
          </Paper>

          {group.performanceAreas?.map((area, areaIndex) => (
            <Paper key={area.id ?? areaIndex} withBorder p="lg" radius="lg">
              <Title order={5}>
                {area.name} ({area.weight}%)
              </Title>
              <Text c="dimmed" mt="xs">
                {area.description}
              </Text>
              <Stack mt="md">
                {area.kpi_categories.map((category, categoryIndex) => (
                  <Paper key={category.id ?? categoryIndex} withBorder p="md">
                    <Title order={6}>
                      {category.name} ({category.weight}%)
                    </Title>
                    <Text c="dimmed" mt="xs">
                      {category.description}
                    </Text>
                    {category.kpi_sub_categories?.length > 0 && (
                      <Stack mt="md" gap="xs">
                        {category.kpi_sub_categories.map(
                          (subcategory, subIndex) => (
                            <Text key={subcategory.id ?? subIndex}>
                              {subcategory.name} ({subcategory.weight}%)
                            </Text>
                          ),
                        )}
                      </Stack>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </div>
  )
}
