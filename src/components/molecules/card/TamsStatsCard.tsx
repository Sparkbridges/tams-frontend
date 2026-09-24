import { Paper, Skeleton, Text, ThemeIcon } from '@mantine/core'
import type { Icon } from '@phosphor-icons/react'

type TDashboardAnalytics = {
  title: string
  value: string | number
  icon: Icon
  color: string
  description?: string
  loading?: boolean
}
const TamsStatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
  loading,
}: TDashboardAnalytics) => {
  return (
    <Paper
      radius={'md'}
      className="px-3 py-2 flex items-center justify-between"
    >
      <div className="space-y-0.5">
        <Text fw={600} size="sm" c={color}>
          {title}
        </Text>
        {!loading && value && (
          <Text fz={28} fw={700} c={color}>
            {value}
          </Text>
        )}
        {loading && <Skeleton height={20} width={100} />}
        <Text size="xs" c={color}>
          {description}
        </Text>
      </div>
      <ThemeIcon size={'lg'} color={color} variant="light">
        {<Icon />}
      </ThemeIcon>
    </Paper>
  )
}

export default TamsStatsCard
