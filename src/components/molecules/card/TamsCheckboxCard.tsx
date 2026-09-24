import { Checkbox, Group, Text } from '@mantine/core'
import classes from '#/styles/css/modules/Checkbox.module.css'

type TamsCheckboxCardProps = {
  value: string
  description?: string
  label: string
}

const TamsCheckboxCard = ({
  value,
  description,
  label,
}: TamsCheckboxCardProps) => {
  return (
    <Checkbox.Card className={classes.root} value={value}>
      <Group wrap="nowrap" align="flex-start">
        <Checkbox.Indicator />
        <div>
          <Text className={classes.label}>{label}</Text>
          <Text className={classes.description}>{description}</Text>
        </div>
      </Group>
    </Checkbox.Card>
  )
}

export default TamsCheckboxCard
