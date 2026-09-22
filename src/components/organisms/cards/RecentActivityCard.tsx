import type { TRecentActivityHistories } from '#/lib'
import { Divider, Paper, ActionIcon, Badge } from '@mantine/core'
import { EyeIcon } from '@phosphor-icons/react'

type RecentActivityCardProps = {
  data?: TRecentActivityHistories[]
}

const RecentActivityCard = ({ data }: RecentActivityCardProps) => {
  return (
    <Paper py={'md'} className="rounded-lg" withBorder>
      <h3 className="font-semibold px-5 text-lg text-gray-800">
        Recent Activity History
      </h3>
      <Divider my="sm" />
      <div className="px-5 space-y-2">
        {data?.map((item, index) => {
          return (
            <div
              className="border bg-primary/5 text-sm gap-2 rounded-sm border-primary/10 px-3 py-2 flex items-center"
              key={index}
            >
              <ActionIcon variant="light">
                <EyeIcon />
              </ActionIcon>
              <p>
                <span className="font-semibold">
                  {item.causer_details.name}
                </span>{' '}
                {item.description}
              </p>
              <Badge variant='outline' className="ml-auto">Viewed</Badge>
            </div>
          )
        })}
      </div>
    </Paper>
  )
}

export default RecentActivityCard
