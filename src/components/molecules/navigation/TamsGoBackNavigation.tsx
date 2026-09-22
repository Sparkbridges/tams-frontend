import { ActionIcon, Text } from '@mantine/core'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'

type TamsGoBackNavigationProps = {
  label: string
}

const TamsGoBackNavigation = ({ label }: TamsGoBackNavigationProps) => {
    const navigate = useRouter()
  return (
    <div className="flex items-center gap-2">
      <ActionIcon onClick={() => navigate.history.back()} variant="default">
        <ArrowLeftIcon />
      </ActionIcon>
      <Text fz={20} fw={500}>{label}</Text>
    </div>
  )
}

export default TamsGoBackNavigation
