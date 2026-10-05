import { Box, Divider, Paper, Text, ThemeIcon } from '@mantine/core'
import { CaretRightIcon } from '@phosphor-icons/react'
import { useState } from 'react'

type Props = {
  setSelectedId: (id: number) => void
  columnData?: {
    label: string
    value: string
  }[]
  columnButton?: React.ReactNode
  title?: string
  actions?: React.ReactNode
  content: React.ReactNode
}
const TamsSideNavTable = ({
  setSelectedId,
  columnData,
  columnButton,
  title,
  actions,
  content,
}: Props) => {
  const [active, setActive] = useState(0)

  const handleItemClick = (index: number, id: number) => {
    setActive(index)
    setSelectedId(id)
  }
  return (
    <Paper withBorder radius="md">
      <section className="flex">
        <div className="w-4/12 py-4 px-3 space-y-5">
          <ul className="space-y-1.5">
            {columnData?.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => handleItemClick(index, Number(item.value))}
                  className={`${index === active ? 'bg-gray-100 font-semibold' : 'font-thin'} text-sm pr-3 hover:bg-gray-200 flex gap-3 py-2 items-center rounded-sm`}
                >
                  <span
                    className={`${index === active ? 'bg-primary' : ''} w-1.5 h-7 rounded-r-xl`}
                  />
                  {item.label}
                  <ThemeIcon variant="transparent" className="ml-auto">
                    <CaretRightIcon />
                  </ThemeIcon>
                </li>
              )
            })}
          </ul>
          <div>{columnButton}</div>
        </div>
        <Divider orientation="vertical" />
        <div className="flex-1">
          <Box className="flex justify-between items-center py-2 px-3">
            <Text c="gray.7" fw={500}>
              {title}
            </Text>
            {actions}
          </Box>
          <Divider />
          <Box>{content}</Box>
        </div>
      </section>
    </Paper>
  )
}

export default TamsSideNavTable
