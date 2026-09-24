import { Group, Radio, Text } from '@mantine/core'
import classes from '#/styles/css/modules/RadioCard.module.css'

const TamsRadioCard = ({
  item,
}: {
  item: { label: string; description?: string; value: string }
}) => {
  return (
    <Radio.Card className={classes.root} value={item.value}>
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator />
        <div>
          <Text className={classes.label}>{item.label}</Text>
          <Text className={classes.description}>{item.description}</Text>
        </div>
      </Group>
    </Radio.Card>
  )
}

export default TamsRadioCard
