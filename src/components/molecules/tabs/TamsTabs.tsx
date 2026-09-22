import type { TTamsTabs } from '#/lib'
import { Badge, Tabs } from '@mantine/core'

type TamsTabsProps = {
  tabValue: string | null
  onTabChange: (value: string | null) => void
  data: TTamsTabs[]
  variant?: 'default' | 'outline' | 'pills'
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  textClassName?: string
}

const TamsTabs = ({
  tabValue,
  onTabChange,
  data,
  variant = 'default',
  radius = 'md',
  textClassName,

}: TamsTabsProps) => {
  return (
    <Tabs
      value={tabValue}
      onChange={onTabChange}
      variant={variant}
      radius={radius}
    >
      <Tabs.List>
        {data.map((tab) => (
          <Tabs.Tab
            key={tab.value}
            value={tab.value}
            leftSection={tab.icon ? <tab.icon size={16} /> : undefined}
            disabled={tab.disabled}
            color={tab.color}
            styles={{
              tabLabel: { display: 'flex', alignItems: 'center', gap: 5 },
            }}
            className={`${tab.value === tabValue ? variant === 'pills' ? 'text-white font-medium': 'text-primary font-medium' : '' } ${textClassName ?? ''}`}
          >
            {tab.label}
            {tab.value2 && Number(tab.value2) > 0 ? (
              <Badge color={tab.color2} size="sm">
                {tab.value2}
              </Badge>
            ) : null}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  )
}

export default TamsTabs
