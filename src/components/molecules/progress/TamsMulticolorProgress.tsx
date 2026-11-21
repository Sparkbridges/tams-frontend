import { Progress } from '@mantine/core'

type TamsMulticolorProgressProps = Progress.Props & {
  total: number
}

const TamsMulticolorProgress = ({
  total,
  ...props
}: TamsMulticolorProgressProps) => {
  const percentage = Math.round((props.value / total) * 100)

  const getColor = () => {
    if (percentage >= 75) return 'green'
    if (percentage >= 50) return 'yellow'
    if (percentage >= 25) return 'orange'
    return 'red'
  }
  return (
    <div>
      <div className="flex justify-between mb-1 text-xs">
        <span>{percentage ? percentage : 0}%</span>
        <span>
          {props.value} of {total} completed
        </span>
      </div>
      <Progress {...props} color={getColor()} />
    </div>
  )
}

export default TamsMulticolorProgress
