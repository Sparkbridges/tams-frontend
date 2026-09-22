import { Divider, Paper } from '@mantine/core'
import { Code } from '@mantine/core'

type Props = {
    title: string
    loading?: boolean
  timeline: {
    row?: number
    message: string
    type: 'success' | 'failure'
    time: Date
  }[]
}

const TamsTerminal = ({ title, loading, timeline }: Props) => {
  return (
    <Paper radius="md" p="md" className=" bg-gray-950">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-semibold uppercase text-sm ">{title}</h2>
        <p className="text-green-600 text-xs">TLS v1.3 Verified</p>
      </div>

      <Divider className="my-2" />
      <div className=" space-y-2">
       {loading && (
        <Code
          className={`my-1 animate-pulse text-gray-100 bg-transparent timeline-item flex items-center gap-2`}
        >
          [{new Date().toLocaleString()}]{' '}
          Loading...
        </Code>
       )}
        {timeline.map((item) => (
          <Code
            key={item.row}
            className={`my-1 ${item.type === 'success' ? 'text-green-500' : 'text-red-500'} bg-transparent timeline-item flex items-center gap-2`}
          >
            [{item.time.toLocaleString()}]{' '}
            {item.row !== undefined ? `Row ${item.row}: ` : ''}
            {item.message}
          </Code>
        ))}
      </div>
    </Paper>
  )
}

export default TamsTerminal
