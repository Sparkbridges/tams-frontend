import type { TStatsCard } from '#/lib'
import { Paper, Skeleton, Text, ThemeIcon } from '@mantine/core'

const TamsStatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
  loading,
  isFullWidth,
}: TStatsCard & { isFullWidth?: boolean }) => {
  return (
    <Paper
      radius={'md'}
      className={`px-4 py-3 flex items-center justify-between ${isFullWidth ? 'flex-1' : ''}`}
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
